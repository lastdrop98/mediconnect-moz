import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type RTMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  appointment_id: string | null;
};

/**
 * Real-time chat between the current user and a peer.
 * Fetches the conversation and subscribes to inserts on the messages table.
 */
export function useRealtimeChat(myId: string | undefined, peerId: string | undefined) {
  const [messages, setMessages] = useState<RTMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const refresh = useCallback(async () => {
    if (!myId || !peerId) return;
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${myId},receiver_id.eq.${peerId}),and(sender_id.eq.${peerId},receiver_id.eq.${myId})`)
      .order("created_at", { ascending: true });
    setMessages((data as RTMessage[]) ?? []);
    setLoading(false);

    // mark messages from peer as read
    await supabase.from("messages").update({ is_read: true })
      .eq("receiver_id", myId).eq("sender_id", peerId).eq("is_read", false);
  }, [myId, peerId]);

  useEffect(() => {
    if (!myId || !peerId) return;
    refresh();

    const channel = supabase
      .channel(`chat-${myId}-${peerId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const m = payload.new as RTMessage;
        const isThisThread =
          (m.sender_id === myId && m.receiver_id === peerId) ||
          (m.sender_id === peerId && m.receiver_id === myId);
        if (!isThisThread) return;
        setMessages((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m]);
        if (m.receiver_id === myId) {
          supabase.from("messages").update({ is_read: true }).eq("id", m.id).then(() => {});
        }
      })
      .subscribe();
    channelRef.current = channel;

    return () => { supabase.removeChannel(channel); channelRef.current = null; };
  }, [myId, peerId, refresh]);

  const send = useCallback(async (content: string, appointmentId?: string | null) => {
    if (!myId || !peerId || !content.trim()) return;
    setSending(true);
    const { data, error } = await supabase.from("messages").insert({
      sender_id: myId, receiver_id: peerId, content: content.trim(),
      appointment_id: appointmentId ?? null,
    }).select().single();
    setSending(false);
    if (error) { console.error(error); return; }
    // optimistic add (in case realtime echo is delayed)
    if (data) setMessages((prev) => prev.some((x) => x.id === (data as any).id) ? prev : [...prev, data as RTMessage]);
  }, [myId, peerId]);

  return { messages, loading, sending, send, refresh };
}

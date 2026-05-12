import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { cn } from "@/lib/utils";

type Props = {
  myId: string;
  peerId: string;
  peerName: string;
  peerAvatar?: string | null;
  appointmentId?: string | null;
  emptyHint?: string;
};

export default function RealtimeChatPanel({ myId, peerId, peerName, appointmentId, emptyHint }: Props) {
  const { messages, send, sending, loading } = useRealtimeChat(myId, peerId);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const t = input.trim();
    if (!t || sending) return;
    setInput("");
    await send(t, appointmentId);
  };

  const fmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl shadow-card overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin bg-gradient-to-b from-muted/20 to-transparent">
        {loading && <div className="text-xs text-muted-foreground text-center">A carregar conversa…</div>}
        {!loading && messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            {emptyHint ?? `Inicie uma conversa com ${peerName}.`}
          </div>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === myId;
          return (
            <div key={m.id} className={cn("flex animate-fade-in", mine ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[75%] rounded-2xl px-3 py-2 shadow-soft",
                mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"
              )}>
                <div className="text-sm whitespace-pre-wrap break-words">{m.content}</div>
                <div className={cn("text-[10px] mt-1 text-right", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {fmt(m.created_at)} {mine && (m.is_read ? "✓✓" : "✓")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border p-3 flex gap-2 bg-card">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={`Mensagem para ${peerName}…`}
          disabled={sending}
          className="flex-1 bg-muted rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button onClick={handleSend} disabled={sending || !input.trim()}
          className="rounded-xl px-4 py-2 bg-primary text-primary-foreground flex items-center gap-2 disabled:opacity-50 press">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

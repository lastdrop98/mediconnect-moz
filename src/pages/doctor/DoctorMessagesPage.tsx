import { useEffect, useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import RealtimeChatPanel from "@/components/RealtimeChatPanel";
import { cn } from "@/lib/utils";

type Conv = {
  peerId: string;
  peerName: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
};

export default function DoctorMessagesPage() {
  const { user, clearUnreadFrom } = useApp();
  const [convs, setConvs] = useState<Conv[]>([]);
  const [selected, setSelected] = useState<Conv | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    const map = new Map<string, Conv>();
    for (const m of (data as any[]) ?? []) {
      const peerId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      if (!map.has(peerId)) {
        map.set(peerId, { peerId, peerName: peerId.slice(0, 8), lastMessage: m.content, lastAt: m.created_at, unread: 0 });
      }
      if (m.receiver_id === user.id && !m.is_read) {
        const c = map.get(peerId)!; c.unread += 1;
      }
    }
    // try to enrich with profile names
    const peers = Array.from(map.keys());
    if (peers.length) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", peers);
      for (const p of (profs as any[]) ?? []) {
        const c = map.get(p.id); if (c && p.full_name) c.peerName = p.full_name;
      }
    }
    setConvs(Array.from(map.values()));
  };

  useEffect(() => {
    load();
    if (!user) return;
    const ch = supabase.channel(`doc-msgs-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (selected) clearUnreadFrom(selected.peerId);
  }, [selected, clearUnreadFrom]);

  const filtered = convs.filter((c) => c.peerName.toLowerCase().includes(search.toLowerCase()));

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-9rem)] animate-fade-in">
      <div className="bg-card rounded-2xl shadow-card flex flex-col overflow-hidden">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar paciente…"
              className="w-full bg-muted rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
              Sem conversas. Quando um paciente lhe enviar uma mensagem, aparecerá aqui.
            </div>
          )}
          {filtered.map((c) => (
            <button key={c.peerId} onClick={() => setSelected(c)}
              className={cn("w-full text-left p-3 border-b border-border hover:bg-muted transition-colors",
                selected?.peerId === c.peerId && "bg-primary/10")}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm truncate">{c.peerName}</span>
                {c.unread > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground">{c.unread}</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMessage}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(c.lastAt).toLocaleString("pt-PT")}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0">
        {selected ? (
          <RealtimeChatPanel myId={user.id} peerId={selected.peerId} peerName={selected.peerName} />
        ) : (
          <div className="h-full bg-card rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-card">
            <MessageSquare className="w-12 h-12 text-primary mb-3" />
            <h3 className="font-display font-bold text-xl">Mensagens em tempo real</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">Selecione uma conversa para responder. Novas mensagens chegam instantaneamente.</p>
          </div>
        )}
      </div>
    </div>
  );
}

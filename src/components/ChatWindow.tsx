import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send } from "lucide-react";
import { useStreamingChat, ChatMsg } from "@/hooks/useStreamingChat";
import { cn } from "@/lib/utils";

type Props = {
  context: string;
  contextData?: any;
  initialMessage?: string;
  placeholder?: string;
  accent?: "primary" | "purple" | "pink" | "green";
  showTriage?: boolean;
  inputPrefix?: React.ReactNode;
};

const triageBadge = (text: string) => {
  if (text.startsWith("[URGENTE]")) return { label: "🔴 URGENTE", className: "bg-destructive text-destructive-foreground" };
  if (text.startsWith("[CONSULTA NECESSÁRIA]")) return { label: "🟡 CONSULTA NECESSÁRIA", className: "bg-warning text-warning-foreground" };
  if (text.startsWith("[PODE TRATAR EM CASA]")) return { label: "🟢 PODE TRATAR EM CASA", className: "bg-success text-success-foreground" };
  return null;
};

const stripBadge = (t: string) => t.replace(/^\[(URGENTE|CONSULTA NECESSÁRIA|PODE TRATAR EM CASA)\]\s*/, "");

export default function ChatWindow({ context, contextData, initialMessage, placeholder = "Escreva uma mensagem...", accent = "primary", showTriage, inputPrefix }: Props) {
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessage ? [{ role: "assistant", content: initialMessage }] : []);
  const [input, setInput] = useState("");
  const { send, isLoading, error } = useStreamingChat(context, contextData);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, isLoading]);

  const accentBubble = {
    primary: "bg-primary text-primary-foreground",
    purple: "bg-accent text-accent-foreground",
    pink: "bg-pink text-pink-foreground",
    green: "bg-success text-success-foreground",
  }[accent];

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    const baseHistory = messages;
    setMessages((p) => [...p, { role: "user", content: text }, { role: "assistant", content: "" }]);
    await send(baseHistory, text, (acc) => {
      setMessages((p) => p.map((m, i) => i === p.length - 1 ? { ...m, content: acc } : m));
    }, () => {});
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl shadow-card overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((m, i) => {
          const badge = showTriage && m.role === "assistant" ? triageBadge(m.content) : null;
          const display = badge ? stripBadge(m.content) : m.content;
          return (
            <div key={i} className={cn("flex gap-2 animate-fade-in", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-muted">
                  {context === "psychology" ? "💙" : context === "telemedicine" ? (contextData?.emoji ?? "👨‍⚕️") : context === "maternal" ? "👶" : "🧠"}
                </div>
              )}
              <div className={cn("max-w-[80%] rounded-2xl px-4 py-2", m.role === "user" ? accentBubble : "bg-muted text-foreground")}>
                {badge && <div className={cn("inline-block px-2 py-1 rounded-md text-xs font-semibold mb-2", badge.className)}>{badge.label}</div>}
                <div className="prose prose-sm dark:prose-invert max-w-none [&>*]:my-1">
                  <ReactMarkdown>{display || (m.role === "assistant" && isLoading && i === messages.length - 1 ? "" : "")}</ReactMarkdown>
                </div>
                {m.role === "assistant" && isLoading && i === messages.length - 1 && !display && (
                  <div className="flex gap-1"><span className="typing-dot">●</span><span className="typing-dot">●</span><span className="typing-dot">●</span></div>
                )}
              </div>
            </div>
          );
        })}
        {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</div>}
      </div>
      {inputPrefix}
      <div className="border-t border-border p-3 flex gap-2 bg-card">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 bg-muted rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()} className={cn("rounded-xl px-4 py-2 flex items-center gap-2 transition-opacity disabled:opacity-50", accentBubble)}>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

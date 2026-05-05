import { useCallback, useState } from "react";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export type ChatMsg = { role: "user" | "assistant"; content: string };

export function useStreamingChat(context: string, contextData?: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (
    history: ChatMsg[],
    userText: string,
    onDelta: (next: string) => void,
    onDone: () => void
  ) => {
    setError(null);
    setIsLoading(true);
    const newHistory = [...history, { role: "user" as const, content: userText }];
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newHistory, context, contextData }),
      });
      if (resp.status === 429) { setError("Demasiados pedidos. Aguarde alguns instantes."); setIsLoading(false); return; }
      if (resp.status === 402) { setError("Créditos de IA esgotados."); setIsLoading(false); return; }
      if (!resp.ok || !resp.body) { setError("Erro a contactar o assistente."); setIsLoading(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let acc = "";
      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, nl);
          textBuffer = textBuffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) { acc += c; onDelta(acc); }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
    } catch (e) {
      console.error(e);
      setError("Erro de ligação.");
    } finally {
      setIsLoading(false);
      onDone();
    }
  }, [context, contextData]);

  return { send, isLoading, error };
}

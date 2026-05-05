import { useEffect, useRef, useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MOODS = [
  { emoji: "😄", label: "Muito Bem" },
  { emoji: "🙂", label: "Bem" },
  { emoji: "😐", label: "Normal" },
  { emoji: "😔", label: "Triste" },
  { emoji: "😢", label: "Muito Mal" },
];

function BreathingModal({ onClose }: { onClose: () => void }) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"Inspire" | "Segure" | "Expire" | "Pausa">("Inspire");
  const [cycle, setCycle] = useState(0);
  const phasesRef = useRef<("Inspire" | "Segure" | "Expire" | "Pausa")[]>(["Inspire", "Segure", "Expire", "Pausa"]);
  const idxRef = useRef(0);
  const cycleRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const durations = { Inspire: 4000, Segure: 4000, Expire: 4000, Pausa: 2000 };
    const tick = () => {
      const p = phasesRef.current[idxRef.current];
      setPhase(p);
      const t = setTimeout(() => {
        idxRef.current = (idxRef.current + 1) % 4;
        if (idxRef.current === 0) {
          cycleRef.current += 1;
          setCycle(cycleRef.current);
          if (cycleRef.current >= 5) { setRunning(false); return; }
        }
        tick();
      }, durations[p]);
      return () => clearTimeout(t);
    };
    const cleanup = tick();
    return cleanup;
  }, [running]);

  const scale = phase === "Inspire" ? 1.4 : phase === "Expire" ? 0.8 : 1.2;
  const dur = phase === "Pausa" ? 2 : 4;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display font-bold text-xl mb-2">🌬️ Exercício de Respiração</h3>
        <p className="text-sm text-muted-foreground mb-6">Ciclo {cycle} de 5</p>
        <div className="h-64 flex items-center justify-center">
          <div className="rounded-full gradient-pink flex items-center justify-center text-white font-bold text-lg"
               style={{ width: 160, height: 160, transform: `scale(${running ? scale : 1})`, transition: `transform ${dur}s ease-in-out` }}>
            {running ? phase : "Pronto?"}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => { setRunning(true); cycleRef.current = 0; setCycle(0); idxRef.current = 0; }} className="flex-1 gradient-pink text-white rounded-xl py-2 font-semibold">▶ Iniciar</button>
          <button onClick={onClose} className="flex-1 border border-border rounded-xl py-2 font-semibold">Fechar</button>
        </div>
      </div>
    </div>
  );
}

function SimpleModal({ title, content, onClose }: { title: string; content: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display font-bold text-xl mb-4">{title}</h3>
        <div className="text-sm space-y-3">{content}</div>
        <button onClick={onClose} className="mt-5 w-full border border-border rounded-xl py-2 font-semibold">Fechar</button>
      </div>
    </div>
  );
}

function DiaryModal({ onClose }: { onClose: () => void }) {
  const [mood, setMood] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [g1, setG1] = useState(""); const [g2, setG2] = useState(""); const [g3, setG3] = useState("");
  return (
    <SimpleModal title="📔 Diário Emocional" onClose={onClose} content={
      <>
        <label className="block text-sm font-semibold mb-2">Como se sente?</label>
        <div className="flex gap-2 mb-3">{MOODS.map((m) => (
          <button key={m.label} onClick={() => setMood(m.label)} className={cn("p-2 rounded-xl border text-2xl", mood === m.label ? "border-pink bg-pink/10" : "border-border")}>{m.emoji}</button>
        ))}</div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Escreva sobre como se sente..." className="w-full bg-muted rounded-xl p-3 text-sm focus:outline-none mb-3" />
        <label className="block text-sm font-semibold mb-2">3 coisas pelas quais sou grato hoje:</label>
        <input value={g1} onChange={(e) => setG1(e.target.value)} placeholder="1." className="w-full bg-muted rounded-xl p-2 text-sm mb-2 focus:outline-none" />
        <input value={g2} onChange={(e) => setG2(e.target.value)} placeholder="2." className="w-full bg-muted rounded-xl p-2 text-sm mb-2 focus:outline-none" />
        <input value={g3} onChange={(e) => setG3(e.target.value)} placeholder="3." className="w-full bg-muted rounded-xl p-2 text-sm mb-3 focus:outline-none" />
        <button onClick={() => { toast.success("Diário guardado 💙"); onClose(); }} className="w-full gradient-pink text-white rounded-xl py-2 font-semibold">Salvar</button>
      </>
    } />
  );
}

export default function PsychologyPage() {
  const [tab, setTab] = useState<"chat" | "recursos">("chat");
  const [mood, setMood] = useState<string | null>(null);
  const [modal, setModal] = useState<null | "breath" | "med" | "mind" | "diary">(null);

  return (
    <div className="max-w-5xl mx-auto space-y-4 h-[calc(100vh-9rem)] flex flex-col">
      <section className="gradient-pink text-white rounded-2xl p-5 shadow-elevated">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-white/25 backdrop-blur px-3 py-1 rounded-full text-sm font-bold">💚 GRATUITO</span>
          <h2 className="font-display text-xl font-bold">Porque a sua saúde mental importa</h2>
        </div>
        <p className="text-sm opacity-95 mt-2">Este serviço é 100% gratuito. Sabemos que a saúde mental é tão importante quanto a física, e que o acesso a psicólogos é difícil para muitos moçambicanos.</p>
      </section>

      <div className="flex gap-2 bg-card rounded-2xl p-1.5 shadow-card w-fit">
        {(["chat", "recursos"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold capitalize",
            tab === t ? "bg-pink text-pink-foreground" : "text-muted-foreground hover:bg-muted")}>
            {t === "chat" ? "Conversar" : "Recursos de Bem-Estar"}
          </button>
        ))}
      </div>

      {tab === "chat" ? (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <div className="text-sm font-semibold mb-2">Como se sente hoje?</div>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map((m) => (
                <button key={m.label} onClick={() => setMood(m.label)}
                  className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border text-sm",
                    mood === m.label ? "border-pink bg-pink/10" : "border-border hover:bg-muted")}>
                  <span className="text-lg">{m.emoji}</span> {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ChatWindow context="psychology" accent="pink"
              initialMessage="Olá. Estou aqui para escutar — sem pressa, sem julgamentos. O que gostaria de partilhar hoje? 💙"
              placeholder="Conte-me como se sente..." />
          </div>
          <div className="bg-primary/10 rounded-xl p-3 text-xs text-center">
            Em crise? Liga <strong>116</strong> — Linha de Apoio Psicossocial (gratuito)
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { id: "breath", emoji: "🌬️", title: "Exercício de Respiração", desc: "Técnica 4-4-4 para aliviar ansiedade." },
            { id: "med", emoji: "🧘", title: "Meditação Guiada", desc: "Sessões guiadas de 5 e 10 minutos." },
            { id: "mind", emoji: "🌿", title: "Mindfulness", desc: "Exercícios de presença e consciência." },
            { id: "diary", emoji: "📔", title: "Diário Emocional", desc: "Registe o seu humor e gratidão." },
          ].map((c) => (
            <button key={c.id} onClick={() => setModal(c.id as any)} className="bg-card rounded-2xl p-5 shadow-card text-left hover:shadow-elevated transition-shadow">
              <div className="text-4xl mb-2">{c.emoji}</div>
              <div className="font-semibold mb-1">{c.title}</div>
              <div className="text-sm text-muted-foreground">{c.desc}</div>
            </button>
          ))}
        </div>
      )}

      {modal === "breath" && <BreathingModal onClose={() => setModal(null)} />}
      {modal === "med" && <SimpleModal title="🧘 Meditação Guiada" onClose={() => setModal(null)} content={
        <>
          <div className="bg-muted rounded-xl p-3"><strong>Meditação da Gratidão (5 min)</strong>
            <ol className="list-decimal pl-4 mt-2 space-y-1"><li>Sente-se confortavelmente.</li><li>Respire fundo 3 vezes.</li><li>Pense em algo bom de hoje.</li><li>Sinta a gratidão no peito.</li><li>Sorria suavemente.</li></ol>
          </div>
          <div className="bg-muted rounded-xl p-3"><strong>Escaneamento Corporal (10 min)</strong>
            <ol className="list-decimal pl-4 mt-2 space-y-1"><li>Deite-se ou sente-se.</li><li>Comece pelos pés — note as sensações.</li><li>Suba lentamente: pernas, abdómen, peito.</li><li>Continue até à cabeça.</li><li>Termine com 3 respirações profundas.</li></ol>
          </div>
        </>
      } />}
      {modal === "mind" && <SimpleModal title="🌿 Mindfulness" onClose={() => setModal(null)} content={
        <>
          <div className="bg-muted rounded-xl p-3"><strong>Técnica dos 5 Sentidos:</strong> Identifique 5 coisas que vê, 4 que ouve, 3 que toca, 2 que cheira, 1 que prova.</div>
          <div className="bg-muted rounded-xl p-3"><strong>Alimentação Consciente:</strong> Coma uma refeição em silêncio, sentindo cada sabor e textura.</div>
          <div className="bg-muted rounded-xl p-3"><strong>Caminhada Consciente:</strong> Caminhe 10 minutos focando-se na sensação dos pés no chão.</div>
        </>
      } />}
      {modal === "diary" && <DiaryModal onClose={() => setModal(null)} />}
    </div>
  );
}

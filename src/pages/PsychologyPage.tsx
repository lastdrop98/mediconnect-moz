import { useEffect, useRef, useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Wind, Sparkles, Leaf, BookHeart, Phone, X, HeartHandshake } from "lucide-react";
import { IconBadge } from "@/components/IconBadge";

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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display font-bold text-xl mb-2 flex items-center justify-center gap-2"><Wind className="w-5 h-5 text-pink" /> Exercício de Respiração</h3>
        <p className="text-sm text-muted-foreground mb-6">Ciclo {cycle} de 5</p>
        <div className="h-64 flex items-center justify-center">
          <div className="rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-elevated"
               style={{ width: 160, height: 160, transform: `scale(${running ? scale : 1})`, transition: `transform ${dur}s ease-in-out` }}>
            {running ? phase : "Pronto?"}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => { setRunning(true); cycleRef.current = 0; setCycle(0); idxRef.current = 0; }} className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl py-2 font-semibold press">▶ Iniciar</button>
          <button onClick={onClose} className="flex-1 border border-border rounded-xl py-2 font-semibold press">Fechar</button>
        </div>
      </div>
    </div>
  );
}

function SimpleModal({ title, content, onClose }: { title: string; content: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto scrollbar-thin animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-bold text-xl">{title}</h3>
          <button onClick={onClose} className="press"><X className="w-5 h-5" /></button>
        </div>
        <div className="text-sm space-y-3">{content}</div>
        <button onClick={onClose} className="mt-5 w-full border border-border rounded-xl py-2 font-semibold press">Fechar</button>
      </div>
    </div>
  );
}

function DiaryModal({ onClose }: { onClose: () => void }) {
  const [mood, setMood] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [g1, setG1] = useState(""); const [g2, setG2] = useState(""); const [g3, setG3] = useState("");
  return (
    <SimpleModal title="Diário Emocional" onClose={onClose} content={
      <>
        <label className="block text-sm font-semibold mb-2">Como se sente?</label>
        <div className="flex gap-2 mb-3">{MOODS.map((m) => (
          <button key={m.label} onClick={() => setMood(m.label)} className={cn("p-2 rounded-xl border text-2xl press", mood === m.label ? "border-pink bg-pink/10" : "border-border")}>{m.emoji}</button>
        ))}</div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Escreva sobre como se sente..." className="w-full bg-muted rounded-xl p-3 text-sm focus:outline-none mb-3" />
        <label className="block text-sm font-semibold mb-2">3 coisas pelas quais sou grato hoje:</label>
        <input value={g1} onChange={(e) => setG1(e.target.value)} placeholder="1." className="w-full bg-muted rounded-xl p-2 text-sm mb-2 focus:outline-none" />
        <input value={g2} onChange={(e) => setG2(e.target.value)} placeholder="2." className="w-full bg-muted rounded-xl p-2 text-sm mb-2 focus:outline-none" />
        <input value={g3} onChange={(e) => setG3(e.target.value)} placeholder="3." className="w-full bg-muted rounded-xl p-2 text-sm mb-3 focus:outline-none" />
        <button onClick={() => { toast.success("Diário guardado 💙"); onClose(); }} className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl py-2 font-semibold press">Salvar</button>
      </>
    } />
  );
}

const RESOURCES = [
  { id: "breath", icon: Wind, gradient: "from-cyan-500 to-blue-500", title: "Exercício de Respiração", desc: "Técnica 4-4-4 para aliviar ansiedade." },
  { id: "med", icon: Sparkles, gradient: "from-violet-500 to-purple-500", title: "Meditação Guiada", desc: "Sessões guiadas de 5 e 10 minutos." },
  { id: "mind", icon: Leaf, gradient: "from-green-500 to-emerald-500", title: "Mindfulness", desc: "Exercícios de presença e consciência." },
  { id: "diary", icon: BookHeart, gradient: "from-pink-500 to-rose-500", title: "Diário Emocional", desc: "Registe o seu humor e gratidão." },
];

export default function PsychologyPage() {
  const [tab, setTab] = useState<"chat" | "recursos">("chat");
  const [mood, setMood] = useState<string | null>(null);
  const [modal, setModal] = useState<null | "breath" | "med" | "mind" | "diary">(null);

  return (
    <div className="max-w-5xl mx-auto space-y-4 h-[calc(100vh-9rem)] flex flex-col animate-fade-in">
      <section className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl p-5 shadow-elevated">
        <div className="absolute -top-8 -right-8 opacity-20"><HeartHandshake className="w-32 h-32" /></div>
        <div className="relative flex flex-wrap items-center gap-3">
          <span className="bg-white/25 backdrop-blur px-3 py-1 rounded-full text-sm font-bold">💚 GRATUITO</span>
          <h2 className="font-display text-xl font-bold">Porque a sua saúde mental importa</h2>
        </div>
        <p className="relative text-sm opacity-95 mt-2 max-w-2xl">Este serviço é 100% gratuito. Sabemos que a saúde mental é tão importante quanto a física, e que o acesso a psicólogos é difícil para muitos moçambicanos.</p>
      </section>

      <div className="flex gap-2 bg-card rounded-2xl p-1.5 shadow-card w-fit">
        {(["chat", "recursos"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold capitalize press transition-all",
            tab === t ? "bg-pink text-pink-foreground shadow-soft" : "text-muted-foreground hover:bg-muted")}>
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
                  className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border text-sm press transition-all",
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
          <a href="tel:116" className="bg-primary/10 hover:bg-primary/20 transition rounded-xl p-3 text-xs text-center flex items-center justify-center gap-2 press">
            <Phone className="w-4 h-4" /> Em crise? Liga <strong>116</strong> — Linha de Apoio Psicossocial (gratuito)
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {RESOURCES.map((c) => (
            <button key={c.id} onClick={() => setModal(c.id as any)} className="bg-card rounded-2xl p-5 shadow-card text-left hover-lift press">
              <IconBadge icon={c.icon} gradient={c.gradient} size="lg" className="mb-3" />
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

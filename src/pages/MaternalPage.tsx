import { useState } from "react";
import { getWeekInfo, PRENATAL_CHECKLIST, MATERNAL_ALERTS } from "@/data/maternal";
import ChatWindow from "@/components/ChatWindow";
import { cn } from "@/lib/utils";
import { Baby, HeartPulse, ShieldCheck, AlertTriangle, CheckSquare } from "lucide-react";

export default function MaternalPage() {
  const [week, setWeek] = useState(20);
  const [checked, setChecked] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("mc_prenatal") ?? "[]")); } catch { return new Set(); }
  });
  const info = getWeekInfo(week);
  const progress = (checked.size / PRENATAL_CHECKLIST.length) * 100;

  const toggle = (i: number) => {
    setChecked((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      localStorage.setItem("mc_prenatal", JSON.stringify(Array.from(n)));
      return n;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">
      <section className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl p-6 shadow-elevated">
        <div className="absolute -right-6 -top-6 opacity-20"><Baby className="w-32 h-32" /></div>
        <div className="relative">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2"><Baby className="w-6 h-6" /> Saúde Materna</h2>
          <p className="opacity-90 mt-1">Cuidados para mãe e bebé, semana a semana.</p>
        </div>
      </section>

      <div className="bg-card rounded-2xl p-5 shadow-card">
        <label className="font-semibold block mb-3">Em que semana de gravidez está? <span className="text-pink font-bold text-lg">{week} semanas</span></label>
        <input type="range" min={1} max={40} value={week} onChange={(e) => setWeek(+e.target.value)} className="w-full accent-pink" />
        <div className="grid md:grid-cols-2 gap-3 mt-5">
          <InfoCard icon={Baby} gradient="from-pink-400 to-rose-400" title="O bebé" text={info.baby} />
          <InfoCard icon={HeartPulse} gradient="from-rose-500 to-pink-500" title="A mãe" text={info.mother} />
          <InfoCard icon={ShieldCheck} gradient="from-green-500 to-emerald-500" title="Cuidados desta semana" text={info.care} bg="bg-success/10" />
          <InfoCard icon={AlertTriangle} gradient="from-red-500 to-orange-500" title="Quando ir ao médico" text={info.alert} bg="bg-destructive/10" />
        </div>
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="font-display font-bold mb-2 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-pink" /> Checklist Pré-natal</h3>
        <div className="h-2 bg-muted rounded-full mb-1 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-muted-foreground mb-4">{checked.size}/{PRENATAL_CHECKLIST.length} concluído</div>
        <div className="space-y-2">
          {PRENATAL_CHECKLIST.map((item, i) => (
            <button key={i} onClick={() => toggle(i)}
              className={cn("w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all press",
                checked.has(i) ? "bg-success/10 line-through text-muted-foreground" : "bg-muted hover:bg-muted/70")}>
              <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center text-xs transition-all",
                checked.has(i) ? "bg-success border-success text-white scale-110" : "border-muted-foreground")}>
                {checked.has(i) ? "✓" : ""}
              </div>
              <span className="text-sm">{item}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Sinais de Alerta</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {MATERNAL_ALERTS.map((a, i) => (
            <div key={i} className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 hover-lift">
              <div className="flex items-start gap-2">
                <div className="w-9 h-9 rounded-lg bg-destructive/15 flex items-center justify-center text-destructive shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-destructive">{a.title}</div>
                  <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="font-display font-bold mb-1 flex items-center gap-2"><HeartPulse className="w-5 h-5 text-pink" /> Pós-Parto</h3>
        <p className="text-sm text-muted-foreground">Cuidados nas primeiras 6 semanas: descanso, amamentação exclusiva até 6 meses, consulta pós-parto às 6 semanas, vacinação do bebé. A amamentação protege o bebé de infeções e fortalece o vínculo.</p>
      </div>

      <div className="h-[500px]">
        <ChatWindow context="maternal" accent="pink"
          initialMessage="Olá, mamã! Estou aqui para esclarecer dúvidas sobre a sua gravidez. Como se sente hoje? 💕"
          placeholder="Faça uma pergunta sobre a gravidez..." />
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, gradient, title, text, bg = "bg-muted" }: any) {
  return (
    <div className={cn("rounded-xl p-4", bg)}>
      <div className="flex items-center gap-2 mb-1">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br", gradient)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="font-semibold">{title}</div>
      </div>
      <p className="text-sm">{text}</p>
    </div>
  );
}

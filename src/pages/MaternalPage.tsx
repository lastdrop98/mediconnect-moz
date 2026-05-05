import { useState } from "react";
import { getWeekInfo, PRENATAL_CHECKLIST, MATERNAL_ALERTS } from "@/data/maternal";
import ChatWindow from "@/components/ChatWindow";
import { cn } from "@/lib/utils";

export default function MaternalPage() {
  const [week, setWeek] = useState(20);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const info = getWeekInfo(week);
  const progress = (checked.size / PRENATAL_CHECKLIST.length) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <section className="gradient-pink text-white rounded-2xl p-6 shadow-elevated">
        <h2 className="font-display text-2xl font-bold">👶 Saúde Materna</h2>
        <p className="opacity-90 mt-1">Cuidados para mãe e bebé, semana a semana.</p>
      </section>

      <div className="bg-card rounded-2xl p-5 shadow-card">
        <label className="font-semibold block mb-3">Em que semana de gravidez está? <span className="text-pink font-bold">{week} semanas</span></label>
        <input type="range" min={1} max={40} value={week} onChange={(e) => setWeek(+e.target.value)} className="w-full accent-pink" />
        <div className="grid md:grid-cols-2 gap-3 mt-5">
          <div className="bg-muted rounded-xl p-4">
            <div className="font-semibold mb-1">👶 O bebé</div>
            <p className="text-sm">{info.baby}</p>
          </div>
          <div className="bg-muted rounded-xl p-4">
            <div className="font-semibold mb-1">🤱 A mãe</div>
            <p className="text-sm">{info.mother}</p>
          </div>
          <div className="bg-success/10 rounded-xl p-4">
            <div className="font-semibold mb-1">💚 Cuidados desta semana</div>
            <p className="text-sm">{info.care}</p>
          </div>
          <div className="bg-destructive/10 rounded-xl p-4">
            <div className="font-semibold mb-1 text-destructive">⚠️ Quando ir ao médico</div>
            <p className="text-sm">{info.alert}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="font-display font-bold mb-2">✅ Checklist Pré-natal</h3>
        <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
          <div className="h-full gradient-pink transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="space-y-2">
          {PRENATAL_CHECKLIST.map((item, i) => (
            <button key={i} onClick={() => setChecked((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })}
              className={cn("w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors",
                checked.has(i) ? "bg-success/10 line-through text-muted-foreground" : "bg-muted hover:bg-muted/70")}>
              <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center text-xs",
                checked.has(i) ? "bg-success border-success text-white" : "border-muted-foreground")}>
                {checked.has(i) ? "✓" : ""}
              </div>
              <span className="text-sm">{item}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold mb-3">🚨 Sinais de Alerta</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {MATERNAL_ALERTS.map((a, i) => (
            <div key={i} className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-2xl">{a.emoji}</span>
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
        <h3 className="font-display font-bold mb-1">🤱 Pós-Parto</h3>
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

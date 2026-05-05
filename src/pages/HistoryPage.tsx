import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const STATS = [
  { emoji: "🩺", label: "Consultas", value: 0 },
  { emoji: "🔬", label: "Exames", value: 0 },
  { emoji: "📋", label: "Diagnósticos", value: 0 },
  { emoji: "💊", label: "Receitas", value: 0 },
  { emoji: "💉", label: "Vacinas", value: 0 },
];

export default function HistoryPage() {
  const [tab, setTab] = useState("tudo");
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-display text-2xl font-bold">📋 Histórico Médico</h2>
        <button className="bg-primary text-primary-foreground rounded-xl px-4 py-2 font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Adicionar</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-4 shadow-card text-center">
            <div className="text-3xl">{s.emoji}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            <div className="font-display font-bold text-2xl">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl p-3 shadow-card flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input placeholder="Pesquisar registo..." className="flex-1 bg-transparent text-sm focus:outline-none" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {["tudo", "consultas", "exames", "diagnósticos", "receitas"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap",
            tab === t ? "bg-primary text-primary-foreground" : "bg-card")}>{t}</button>
        ))}
      </div>
      <div className="bg-card rounded-2xl p-10 text-center shadow-card">
        <div className="text-5xl mb-3">📂</div>
        <p className="text-muted-foreground mb-4">Sem registos médicos ainda</p>
        <button className="bg-primary text-primary-foreground rounded-xl px-5 py-2 font-semibold">+ Adicionar Registo</button>
      </div>
    </div>
  );
}

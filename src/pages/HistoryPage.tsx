import { useState } from "react";
import { Search, Plus, Stethoscope, FlaskConical, FileText, Pill, Syringe, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IconBadge } from "@/components/IconBadge";

const STATS = [
  { icon: Stethoscope, label: "Consultas", value: 0, gradient: "from-blue-500 to-cyan-500" },
  { icon: FlaskConical, label: "Exames", value: 0, gradient: "from-violet-500 to-purple-500" },
  { icon: FileText, label: "Diagnósticos", value: 0, gradient: "from-amber-500 to-orange-500" },
  { icon: Pill, label: "Receitas", value: 0, gradient: "from-green-500 to-emerald-500" },
  { icon: Syringe, label: "Vacinas", value: 0, gradient: "from-pink-500 to-rose-500" },
];

export default function HistoryPage() {
  const [tab, setTab] = useState("tudo");
  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-display text-2xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-primary" /> Histórico Médico</h2>
        <button onClick={() => toast.success("Funcionalidade em breve")} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 font-semibold flex items-center gap-2 press"><Plus className="w-4 h-4" /> Adicionar</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-4 shadow-card text-center hover-lift">
            <IconBadge icon={s.icon} gradient={s.gradient} size="md" className="mx-auto" />
            <div className="text-xs text-muted-foreground mt-2">{s.label}</div>
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
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap press",
            tab === t ? "bg-primary text-primary-foreground shadow-soft" : "bg-card hover:bg-muted")}>{t}</button>
        ))}
      </div>
      <div className="bg-card rounded-2xl p-10 text-center shadow-card">
        <FolderOpen className="w-14 h-14 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground mb-4">Sem registos médicos ainda</p>
        <button onClick={() => toast("Adicione o seu primeiro registo")} className="bg-primary text-primary-foreground rounded-xl px-5 py-2 font-semibold press">+ Adicionar Registo</button>
      </div>
    </div>
  );
}

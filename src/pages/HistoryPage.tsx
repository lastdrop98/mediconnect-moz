import { useEffect, useState } from "react";
import { Search, Plus, Stethoscope, FlaskConical, FileText, Pill, Syringe, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IconBadge } from "@/components/IconBadge";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";

type Record = { id: string; type: string; title: string; description: string | null; doctor_name: string | null; date: string | null; created_at: string };

const STAT_DEF = [
  { key: "consulta", icon: Stethoscope, label: "Consultas", gradient: "from-blue-500 to-cyan-500" },
  { key: "exame", icon: FlaskConical, label: "Exames", gradient: "from-violet-500 to-purple-500" },
  { key: "diagnostico", icon: FileText, label: "Diagnósticos", gradient: "from-amber-500 to-orange-500" },
  { key: "receita", icon: Pill, label: "Receitas", gradient: "from-green-500 to-emerald-500" },
  { key: "vacina", icon: Syringe, label: "Vacinas", gradient: "from-pink-500 to-rose-500" },
];

export default function HistoryPage() {
  const { user } = useApp();
  const [tab, setTab] = useState("tudo");
  const [q, setQ] = useState("");
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("medical_records").select("*").eq("patient_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setRecords((data as Record[]) ?? []));
  }, [user]);

  const filtered = records.filter((r) =>
    (tab === "tudo" || r.type === tab.replace(/s$/, "")) &&
    (!q || r.title.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-display text-2xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-primary" /> Histórico Médico</h2>
        <button onClick={() => toast("Adicionar registo em breve")} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 font-semibold flex items-center gap-2 press"><Plus className="w-4 h-4" /> Adicionar</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STAT_DEF.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-4 shadow-card text-center hover-lift">
            <IconBadge icon={s.icon} gradient={s.gradient} size="md" className="mx-auto" />
            <div className="text-xs text-muted-foreground mt-2">{s.label}</div>
            <div className="font-display font-bold text-2xl">{records.filter((r) => r.type === s.key).length}</div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl p-3 shadow-card flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar registo..." className="flex-1 bg-transparent text-sm focus:outline-none" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {["tudo", "consultas", "exames", "diagnosticos", "receitas", "vacinas"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap press",
            tab === t ? "bg-primary text-primary-foreground shadow-soft" : "bg-card hover:bg-muted")}>{t}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl p-10 text-center shadow-card">
          <FolderOpen className="w-14 h-14 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Sem registos médicos ainda</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.id} className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 hover-lift">
              <FileText className="w-5 h-5 text-primary" />
              <div className="flex-1"><div className="font-semibold">{r.title}</div><div className="text-xs text-muted-foreground">{r.type} • {r.doctor_name} • {r.date}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

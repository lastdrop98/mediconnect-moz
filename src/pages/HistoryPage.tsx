import { useEffect, useState } from "react";
import { Search, Plus, Stethoscope, FlaskConical, FileText, Pill, Syringe, FolderOpen, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IconBadge } from "@/components/IconBadge";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";

type MedRecord = { id: string; type: string; title: string; description: string | null; doctor_name: string | null; date: string | null; created_at: string };

const STAT_DEF = [
  { key: "consulta", icon: Stethoscope, label: "Consultas", gradient: "from-blue-500 to-cyan-500" },
  { key: "exame", icon: FlaskConical, label: "Exames", gradient: "from-violet-500 to-purple-500" },
  { key: "diagnostico", icon: FileText, label: "Diagnósticos", gradient: "from-amber-500 to-orange-500" },
  { key: "receita", icon: Pill, label: "Receitas", gradient: "from-green-500 to-emerald-500" },
  { key: "vacina", icon: Syringe, label: "Vacinas", gradient: "from-pink-500 to-rose-500" },
];

const TAB_TO_TYPE: Record<string, string> = {
  consultas: "consulta", exames: "exame", diagnosticos: "diagnostico", receitas: "receita", vacinas: "vacina",
};

export default function HistoryPage() {
  const { user } = useApp();
  const [tab, setTab] = useState("tudo");
  const [q, setQ] = useState("");
  const [records, setRecords] = useState<MedRecord[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const refresh = async () => {
    if (!user) return;
    const { data } = await supabase.from("medical_records").select("*").eq("patient_id", user.id).order("date", { ascending: false });
    setRecords((data as MedRecord[]) ?? []);
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [user]);

  const filtered = records.filter((r) =>
    (tab === "tudo" || r.type === TAB_TO_TYPE[tab]) &&
    (!q || r.title.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-display text-2xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-primary" /> Histórico Médico</h2>
        <button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 font-semibold flex items-center gap-2 press"><Plus className="w-4 h-4" /> Adicionar Registo</button>
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
              <div className="flex-1">
                <div className="font-semibold">{r.title}</div>
                <div className="text-xs text-muted-foreground capitalize">{r.type} • {r.doctor_name ?? "—"} • {r.date ?? ""}</div>
                {r.description && <div className="text-sm text-muted-foreground mt-1">{r.description}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddRecordModal onClose={() => setShowAdd(false)} onSaved={async () => { setShowAdd(false); await refresh(); }} />}
    </div>
  );
}

function AddRecordModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { user } = useApp();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "consulta", title: "", description: "", doctor_name: "", date: new Date().toISOString().slice(0, 10),
  });

  const save = async () => {
    if (!user) return;
    if (!form.title.trim()) return toast.error("Título obrigatório");
    setSaving(true);
    const { error } = await supabase.from("medical_records").insert({
      patient_id: user.id,
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim() || null,
      doctor_name: form.doctor_name.trim() || null,
      date: form.date || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Registo adicionado");
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto scrollbar-thin animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-bold text-lg">Novo Registo Médico</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted press"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">Tipo</span>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full mt-1 bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="consulta">Consulta</option>
              <option value="exame">Exame</option>
              <option value="diagnostico">Diagnóstico</option>
              <option value="receita">Receita</option>
              <option value="vacina">Vacina</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">Título</span>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} className="w-full mt-1 bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">Descrição</span>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} rows={3} className="w-full mt-1 bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground">Médico</span>
              <input value={form.doctor_name} onChange={(e) => setForm({ ...form, doctor_name: e.target.value })} maxLength={120} className="w-full mt-1 bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground">Data</span>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full mt-1 bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </label>
          </div>
          <button disabled={saving} onClick={save} className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold disabled:opacity-50 press flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Guardar Registo
          </button>
        </div>
      </div>
    </div>
  );
}

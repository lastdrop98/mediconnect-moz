import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, X, Megaphone } from "lucide-react";
import { toast } from "sonner";

type Alert = { id: string; title: string; description: string | null; alert_type: string; expires_at: string | null; is_active: boolean };

const TYPES = [
  { id: "vacina", label: "Vacinação" },
  { id: "surto", label: "Surto" },
  { id: "informacao", label: "Informação" },
  { id: "lembrete", label: "Lembrete" },
];

export default function AdminAlertsPage() {
  const [list, setList] = useState<Alert[]>([]);
  const [open, setOpen] = useState(false);

  const refresh = async () => {
    const { data } = await supabase.from("health_alerts").select("*").order("created_at", { ascending: false });
    setList((data as Alert[]) ?? []);
  };
  useEffect(() => { refresh(); }, []);

  const toggle = async (id: string, val: boolean) => {
    await supabase.from("health_alerts").update({ is_active: val }).eq("id", id);
    refresh();
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl">Alertas de Saúde</h2>
          <p className="text-sm text-muted-foreground">Os alertas activos aparecem no dashboard dos pacientes.</p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold flex items-center gap-2 press shadow-soft">
          <Plus className="w-4 h-4" /> Novo alerta
        </button>
      </div>

      {list.length === 0 ? (
        <div className="bg-card rounded-2xl p-10 text-center shadow-card">
          <Megaphone className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum alerta criado.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {list.map((a) => (
            <div key={a.id} className="bg-card rounded-2xl p-4 shadow-card flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{a.alert_type}</div>
                </div>
                <button onClick={() => toggle(a.id, !a.is_active)}
                  className={`text-xs px-2 py-1 rounded-full font-bold ${a.is_active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                  {a.is_active ? "Activo" : "Inactivo"}
                </button>
              </div>
              {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}
              {a.expires_at && <div className="text-[10px] text-muted-foreground">Expira a {a.expires_at}</div>}
            </div>
          ))}
        </div>
      )}

      {open && <NewAlert onClose={() => setOpen(false)} onSaved={() => { setOpen(false); refresh(); }} />}
    </div>
  );
}

function NewAlert({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("informacao");
  const [exp, setExp] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Título obrigatório");
    setSaving(true);
    const { error } = await supabase.from("health_alerts").insert({
      title, description: desc || null, alert_type: type, expires_at: exp || null, is_active: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Alerta criado");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 animate-fade-in" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-card rounded-2xl shadow-elevated p-6 space-y-3 animate-scale-in">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg">Novo Alerta</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <label className="block text-xs font-semibold">Título
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm" />
        </label>
        <label className="block text-xs font-semibold">Descrição
          <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm" />
        </label>
        <label className="block text-xs font-semibold">Tipo
          <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm">
            {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold">Expira em
          <input type="date" value={exp} onChange={(e) => setExp(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm" />
        </label>
        <button disabled={saving} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold press disabled:opacity-50">
          {saving ? "A guardar..." : "Publicar alerta"}
        </button>
      </form>
    </div>
  );
}

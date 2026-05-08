import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { useDoctorAppointments } from "./DoctorHomePage";
import { Plus, X, ClipboardList } from "lucide-react";
import { toast } from "sonner";

type Prescription = {
  id: string; doctor_id: string; patient_id: string;
  medications: string; dosage: string | null;
  validity_date: string | null; notes: string | null; created_at: string;
};

export default function DoctorPrescriptionsPage() {
  const { user } = useApp();
  const { items } = useDoctorAppointments();
  const [list, setList] = useState<Prescription[]>([]);
  const [open, setOpen] = useState(false);

  const patients = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((a) => { if (a.patient_id) map.set(a.patient_id, a.patientName || "Paciente"); });
    return Array.from(map.entries());
  }, [items]);

  const refresh = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("doctor_id", user.id)
      .order("created_at", { ascending: false });
    setList((data as any[]) ?? []);
  };
  useEffect(() => { refresh(); }, [user?.id]);

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl">Receitas Digitais</h2>
          <p className="text-sm text-muted-foreground">Crie e gira as receitas dos seus pacientes.</p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold flex items-center gap-2 press shadow-soft">
          <Plus className="w-4 h-4" /> Nova receita
        </button>
      </div>

      {list.length === 0 ? (
        <div className="bg-card rounded-2xl p-10 text-center shadow-card">
          <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">Ainda não emitiu nenhuma receita.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {list.map((r) => {
            const patientName = patients.find(([id]) => id === r.patient_id)?.[1] || "Paciente";
            return (
              <div key={r.id} className="bg-card rounded-2xl p-4 shadow-card hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{patientName}</div>
                  <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("pt-PT")}</div>
                </div>
                <div className="text-sm whitespace-pre-line">{r.medications}</div>
                {r.dosage && <div className="text-xs text-muted-foreground mt-1"><b>Posologia:</b> {r.dosage}</div>}
                {r.validity_date && <div className="text-xs text-muted-foreground"><b>Válida até:</b> {r.validity_date}</div>}
                {r.notes && <div className="text-xs text-muted-foreground mt-1 italic">{r.notes}</div>}
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <NewPrescriptionModal
          patients={patients}
          onClose={() => setOpen(false)}
          onSaved={() => { setOpen(false); refresh(); }}
        />
      )}
    </div>
  );
}

function NewPrescriptionModal({ patients, onClose, onSaved }: { patients: [string, string][]; onClose: () => void; onSaved: () => void }) {
  const { user } = useApp();
  const [patientId, setPatientId] = useState(patients[0]?.[0] || "");
  const [medications, setMedications] = useState("");
  const [dosage, setDosage] = useState("");
  const [validity, setValidity] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !patientId || !medications.trim()) return toast.error("Preencha paciente e medicamentos.");
    setSaving(true);
    const { error } = await supabase.from("prescriptions").insert({
      doctor_id: user.id, patient_id: patientId,
      medications, dosage: dosage || null,
      validity_date: validity || null, notes: notes || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Receita criada");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 animate-fade-in" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-card rounded-2xl shadow-elevated p-6 space-y-3 animate-scale-in">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg">Nova Receita</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <label className="block text-xs font-semibold">Paciente
          <select required value={patientId} onChange={(e) => setPatientId(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm">
            <option value="">— Seleccionar —</option>
            {patients.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold">Medicamentos
          <textarea required rows={3} value={medications} onChange={(e) => setMedications(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm" placeholder="Ex: Paracetamol 500mg"/>
        </label>
        <label className="block text-xs font-semibold">Posologia
          <input value={dosage} onChange={(e) => setDosage(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm" placeholder="Ex: 1 comprimido 8/8h"/>
        </label>
        <label className="block text-xs font-semibold">Validade
          <input type="date" value={validity} onChange={(e) => setValidity(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm"/>
        </label>
        <label className="block text-xs font-semibold">Observações
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm"/>
        </label>
        <button disabled={saving} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold press disabled:opacity-50">
          {saving ? "A guardar..." : "Guardar receita"}
        </button>
      </form>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useDoctorAppointments } from "./DoctorHomePage";
import { Search, ArrowLeft } from "lucide-react";

export default function DoctorPatientsPage() {
  const { items } = useDoctorAppointments();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const patients = useMemo(() => {
    const map = new Map<string, { id: string; name: string; total: number; last: string | null }>();
    for (const a of items) {
      if (!a.patient_id) continue;
      const cur = map.get(a.patient_id) || { id: a.patient_id, name: a.patientName || "Paciente", total: 0, last: null };
      cur.total++;
      if (a.appointment_date && (!cur.last || a.appointment_date > cur.last)) cur.last = a.appointment_date;
      map.set(a.patient_id, cur);
    }
    return Array.from(map.values()).filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()));
  }, [items, q]);

  if (selected) {
    const history = items.filter((a) => a.patient_id === selected);
    const name = history[0]?.patientName || "Paciente";
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h3 className="font-display font-bold text-xl">{name}</h3>
          <p className="text-xs text-muted-foreground">{history.length} consulta(s)</p>
        </div>
        <div className="space-y-2">
          {history.map((h) => (
            <div key={h.id} className="bg-card rounded-xl p-3 shadow-card flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold">{h.specialty}</div>
                <div className="text-xs text-muted-foreground">{h.appointment_date} · {h.appointment_time}</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{h.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar paciente..." className="bg-transparent outline-none flex-1 text-sm" />
      </div>
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Paciente</th>
              <th className="px-4 py-3 text-left">Última consulta</th>
              <th className="px-4 py-3 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 && (
              <tr><td colSpan={3} className="text-center py-10 text-muted-foreground">Sem pacientes.</td></tr>
            )}
            {patients.map((p) => (
              <tr key={p.id} onClick={() => setSelected(p.id)} className="border-t border-border hover:bg-muted/40 cursor-pointer">
                <td className="px-4 py-3 font-semibold">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.last || "—"}</td>
                <td className="px-4 py-3">{p.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

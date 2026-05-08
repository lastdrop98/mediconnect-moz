import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Row = {
  id: string; appointment_date: string | null; appointment_time: string | null;
  status: string; specialty: string | null; patient_id: string; doctor_id: string | null;
  doctorName?: string; patientName?: string;
};

const STATUS = [
  { id: "all", label: "Todas", color: "" },
  { id: "pending", label: "Pendente", color: "bg-warning/15 text-warning" },
  { id: "confirmed", label: "Confirmada", color: "bg-primary/15 text-primary" },
  { id: "completed", label: "Concluída", color: "bg-success/15 text-success" },
  { id: "cancelled", label: "Cancelada", color: "bg-destructive/15 text-destructive" },
];

const PERIODS = [
  { id: "all", label: "Todas" },
  { id: "today", label: "Hoje" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mês" },
];

export default function AdminAppointmentsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("all");
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("appointments")
        .select("*, doctors(name)")
        .order("appointment_date", { ascending: false });
      const list = (data as any[]) ?? [];
      const ids = Array.from(new Set(list.map((a) => a.patient_id).filter(Boolean)));
      let map: Record<string, string> = {};
      if (ids.length) {
        const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", ids);
        (profs ?? []).forEach((p: any) => { map[p.id] = p.full_name || "Paciente"; });
      }
      setRows(list.map((r) => ({ ...r, doctorName: r.doctors?.name, patientName: map[r.patient_id] || "Paciente" })));
    })();
  }, []);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const filtered = rows.filter((r) => {
    if (status !== "all" && r.status !== status) return false;
    if (period !== "all" && r.appointment_date) {
      const d = new Date(r.appointment_date);
      const diff = (d.getTime() - today.getTime()) / 86400000;
      if (period === "today" && d.toDateString() !== today.toDateString()) return false;
      if (period === "week" && (diff < -7 && diff > 7)) return false;
      if (period === "month" && d.getMonth() !== today.getMonth()) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="bg-card rounded-2xl p-4 shadow-card flex flex-wrap gap-3">
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {STATUS.map((s) => (
            <button key={s.id} onClick={() => setStatus(s.id)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold press",
                status === s.id ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-foreground")}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {PERIODS.map((p) => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold press",
                period === p.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Paciente</th>
              <th className="px-4 py-3 text-left">Médico</th>
              <th className="px-4 py-3 text-left">Especialidade</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const c = STATUS.find((s) => s.id === r.status)?.color || "bg-muted";
              return (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">{r.patientName}</td>
                  <td className="px-4 py-3">{r.doctorName || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.specialty}</td>
                  <td className="px-4 py-3">{r.appointment_date} {r.appointment_time}</td>
                  <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", c)}>{r.status}</span></td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">Sem consultas.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useDoctorAppointments, ApptActions, STATUS_BADGE, STATUS_LABEL } from "./DoctorHomePage";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const FILTERS = [
  { id: "today", label: "Hoje" },
  { id: "week", label: "Esta Semana" },
  { id: "pending", label: "Pendentes" },
  { id: "all", label: "Todas" },
] as const;

export default function DoctorAgendaPage() {
  const { items, refresh } = useDoctorAppointments();
  const [filter, setFilter] = useState<typeof FILTERS[number]["id"]>("all");
  const [q, setQ] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const weekEnd = new Date(); weekEnd.setDate(weekEnd.getDate() + 7);

  const filtered = items.filter((a) => {
    if (filter === "today" && a.appointment_date !== today) return false;
    if (filter === "week") {
      if (!a.appointment_date) return false;
      const d = new Date(a.appointment_date);
      if (d < new Date() || d > weekEnd) return false;
    }
    if (filter === "pending" && a.status !== "pending") return false;
    if (q && !(a.patientName?.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="bg-card rounded-2xl p-4 shadow-card flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar paciente..." className="bg-transparent outline-none flex-1 text-sm" />
        </div>
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold press",
                filter === f.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-card rounded-2xl p-10 text-center text-muted-foreground shadow-card">Sem consultas nesta vista.</div>
        )}
        {filtered.map((a) => (
          <div key={a.id} className="bg-card rounded-2xl p-4 shadow-card flex flex-wrap items-center gap-4 hover-lift">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 grid place-items-center text-white font-bold">
              {(a.patientName || "P").slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-[180px]">
              <div className="font-semibold">{a.patientName}</div>
              <div className="text-xs text-muted-foreground">{a.specialty}</div>
            </div>
            <div className="text-sm">
              <div className="font-semibold">{a.appointment_date}</div>
              <div className="text-xs text-muted-foreground">{a.appointment_time} · {a.modality}</div>
            </div>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", STATUS_BADGE[a.status])}>{STATUS_LABEL[a.status]}</span>
            <ApptActions appt={a} onChanged={refresh} />
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { SPECIALTIES } from "@/data/doctors";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CalendarDays, Stethoscope, FileText, ChevronLeft, ChevronRight, Check, X } from "lucide-react";

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Pendente",   cls: "bg-warning/15 text-warning-dark" },
  confirmed: { label: "Confirmada", cls: "bg-success/15 text-success-dark" },
  cancelled: { label: "Cancelada",  cls: "bg-destructive/15 text-destructive" },
  completed: { label: "Concluída",  cls: "bg-muted text-muted-foreground" },
};

const DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i);
  return { iso: d.toISOString().slice(0, 10), label: d.toLocaleDateString("pt-PT", { weekday: "short", day: "numeric", month: "short" }) };
});
const TIMES = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

export default function SchedulePage() {
  const { user, doctors, appointments, refreshAppointments } = useApp();
  const [tab, setTab] = useState<"agendadas" | "nova" | "historico">("agendadas");
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = () => { setStep(1); setSpecialty(null); setDay(null); setTime(null); };

  const confirm = async () => {
    if (!user || !specialty || !day || !time) return;
    const doc = doctors.find((d) => d.specialty.toLowerCase() === specialty.toLowerCase()) ?? doctors[0];
    setSaving(true);
    const { error } = await supabase.from("appointments").insert({
      patient_id: user.id, doctor_id: doc?.id ?? null, specialty,
      appointment_date: day, appointment_time: time,
      status: "pending", modality: "online",
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    await refreshAppointments();
    toast.success("✓ Consulta agendada com sucesso!");
    reset();
    setTab("agendadas");
  };

  const cancelAppt = async (id: string) => {
    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    await refreshAppointments();
    toast.success("Consulta cancelada");
  };

  const sortByDate = (a: typeof appointments[number], b: typeof appointments[number]) => {
    const da = `${a.appointment_date ?? ""} ${a.appointment_time ?? ""}`;
    const db = `${b.appointment_date ?? ""} ${b.appointment_time ?? ""}`;
    return da.localeCompare(db);
  };
  const upcoming = appointments.filter((a) => a.status === "pending" || a.status === "confirmed").sort(sortByDate);
  const history = appointments.filter((a) => a.status === "completed" || a.status === "cancelled").sort(sortByDate);

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      <div className="flex gap-2 bg-card rounded-2xl p-1.5 shadow-card w-fit">
        {(["agendadas", "nova", "historico"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all press",
              tab === t ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-muted")}>
            {t === "nova" ? "Agendar Nova" : t}
          </button>
        ))}
      </div>

      {tab === "agendadas" && (
        <div className="space-y-3">
          {upcoming.length === 0 ? (
            <div className="bg-card rounded-2xl p-10 text-center shadow-card animate-fade-in">
              <CalendarDays className="w-14 h-14 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">Nenhuma consulta agendada</p>
              <button onClick={() => setTab("nova")} className="bg-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold press">+ Agendar Consulta</button>
            </div>
          ) : upcoming.map((a) => (
            <div key={a.id} className="bg-card rounded-2xl p-4 shadow-card flex flex-wrap items-center gap-3 hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{a.doctorName}</div>
                <div className="text-sm text-muted-foreground">{a.specialty} • {a.appointment_date} às {a.appointment_time}</div>
              </div>
              <span className={cn("text-xs font-bold px-3 py-1 rounded-full", (STATUS_STYLES[a.status] ?? STATUS_STYLES.pending).cls)}>
                {(STATUS_STYLES[a.status] ?? STATUS_STYLES.pending).label}
              </span>
              {a.status === "pending" && (
                <button onClick={() => cancelAppt(a.id)} className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 press flex items-center gap-1">
                  <X className="w-3 h-3" /> Cancelar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "nova" && (
        <div className="bg-card rounded-2xl p-5 md:p-7 shadow-card animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold">Passo {step} de 3</h3>
            <div className="flex gap-1">{[1, 2, 3].map((s) => (
              <div key={s} className={cn("w-8 h-1.5 rounded-full transition-all", s <= step ? "bg-primary" : "bg-muted")} />
            ))}</div>
          </div>

          {step === 1 && (
            <div className="animate-fade-in">
              <h4 className="font-semibold mb-3">Escolha a especialidade</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SPECIALTIES.map((s) => (
                  <button key={s.name} onClick={() => setSpecialty(s.name)}
                    className={cn("p-4 rounded-xl border-2 text-center transition-all press hover-lift",
                      specialty === s.name ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                    <div className={cn("w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center bg-gradient-to-br text-white", s.color)}>
                      <s.icon className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold">{s.name}</div>
                  </button>
                ))}
              </div>
              <div className="mt-5 flex justify-end">
                <button disabled={!specialty} onClick={() => setStep(2)} className="bg-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold disabled:opacity-50 press flex items-center gap-1">
                  Próximo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h4 className="font-semibold mb-3">Escolha dia e hora</h4>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-5">
                {DAYS.map((d) => (
                  <button key={d.iso} onClick={() => setDay(d.iso)}
                    className={cn("p-3 rounded-xl border-2 text-xs font-semibold capitalize text-center press",
                      day === d.iso ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {TIMES.map((t) => (
                  <button key={t} onClick={() => setTime(t)}
                    className={cn("py-2 rounded-xl border-2 text-sm font-semibold press",
                      time === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>{t}</button>
                ))}
              </div>
              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(1)} className="px-5 py-2 rounded-xl font-semibold border border-border press flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </button>
                <button disabled={!day || !time} onClick={() => setStep(3)} className="bg-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold disabled:opacity-50 press flex items-center gap-1">
                  Próximo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h4 className="font-semibold mb-3">Confirmar</h4>
              <div className="bg-success/10 border-2 border-success/30 rounded-xl p-5 space-y-2">
                <div><span className="text-muted-foreground">Especialidade:</span> <strong>{specialty}</strong></div>
                <div><span className="text-muted-foreground">Dia:</span> <strong>{day}</strong></div>
                <div><span className="text-muted-foreground">Hora:</span> <strong>{time}</strong></div>
              </div>
              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(2)} className="px-5 py-2 rounded-xl font-semibold border border-border press flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </button>
                <button disabled={saving} onClick={confirm} className="bg-success text-success-foreground px-5 py-2 rounded-xl font-semibold press flex items-center gap-2 disabled:opacity-60">
                  <Check className="w-4 h-4" /> {saving ? "A guardar..." : "Confirmar Agendamento"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "historico" && (
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="bg-card rounded-2xl p-10 text-center shadow-card animate-fade-in">
              <FileText className="w-14 h-14 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Sem histórico de consultas anteriores.</p>
            </div>
          ) : history.map((a) => (
            <div key={a.id} className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-primary" />
              <div className="flex-1"><div className="font-semibold">{a.doctorName}</div><div className="text-sm text-muted-foreground">{a.specialty} • {a.appointment_date}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

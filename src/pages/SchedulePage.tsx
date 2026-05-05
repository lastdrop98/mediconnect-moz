import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DOCTORS, SPECIALTIES } from "@/data/doctors";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i);
  return { date: d, label: d.toLocaleDateString("pt-PT", { weekday: "short", day: "numeric", month: "short" }) };
});
const TIMES = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

export default function SchedulePage() {
  const { appointments, addAppointment } = useApp();
  const [tab, setTab] = useState<"agendadas" | "nova" | "historico">("agendadas");
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const reset = () => { setStep(1); setSpecialty(null); setDay(null); setTime(null); };

  const confirm = () => {
    const doc = DOCTORS.find((d) => d.specialty.toLowerCase().includes(specialty!.toLowerCase().replace("clínico geral", "clínica geral"))) ?? DOCTORS[0];
    addAppointment({
      id: `apt-${Date.now()}`,
      doctorId: doc.id, doctorName: doc.name, specialty: specialty!,
      date: day!, time: time!, status: "Confirmada",
    });
    toast.success("Consulta agendada com sucesso!");
    reset();
    setTab("agendadas");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex gap-2 bg-card rounded-2xl p-1.5 shadow-card w-fit">
        {(["agendadas", "nova", "historico"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors",
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
            {t === "nova" ? "Agendar Nova" : t}
          </button>
        ))}
      </div>

      {tab === "agendadas" && (
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="bg-card rounded-2xl p-10 text-center shadow-card">
              <div className="text-5xl mb-3">📅</div>
              <p className="text-muted-foreground mb-4">Nenhuma consulta agendada</p>
              <button onClick={() => setTab("nova")} className="bg-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold">+ Agendar Consulta</button>
            </div>
          ) : appointments.map((a) => (
            <div key={a.id} className="bg-card rounded-2xl p-4 shadow-card flex flex-wrap items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center text-xl">🩺</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{a.doctorName}</div>
                <div className="text-sm text-muted-foreground">{a.specialty} • {a.date} às {a.time}</div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-success text-success-foreground">{a.status}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "nova" && (
        <div className="bg-card rounded-2xl p-5 md:p-7 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold">Passo {step} de 3</h3>
            <div className="flex gap-1">{[1, 2, 3].map((s) => (
              <div key={s} className={cn("w-8 h-1.5 rounded-full", s <= step ? "bg-primary" : "bg-muted")} />
            ))}</div>
          </div>

          {step === 1 && (
            <>
              <h4 className="font-semibold mb-3">Escolha a especialidade</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SPECIALTIES.map((s) => (
                  <button key={s.name} onClick={() => setSpecialty(s.name)}
                    className={cn("p-4 rounded-xl border-2 text-center transition-colors",
                      specialty === s.name ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                    <div className="text-3xl mb-1">{s.emoji}</div>
                    <div className="text-sm font-semibold">{s.name}</div>
                  </button>
                ))}
              </div>
              <div className="mt-5 flex justify-end">
                <button disabled={!specialty} onClick={() => setStep(2)} className="bg-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold disabled:opacity-50">Próximo →</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h4 className="font-semibold mb-3">Escolha dia e hora</h4>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-5">
                {DAYS.map((d) => (
                  <button key={d.label} onClick={() => setDay(d.label)}
                    className={cn("p-3 rounded-xl border-2 text-xs font-semibold capitalize text-center",
                      day === d.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {TIMES.map((t) => (
                  <button key={t} onClick={() => setTime(t)}
                    className={cn("py-2 rounded-xl border-2 text-sm font-semibold",
                      time === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>{t}</button>
                ))}
              </div>
              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(1)} className="px-5 py-2 rounded-xl font-semibold border border-border">← Voltar</button>
                <button disabled={!day || !time} onClick={() => setStep(3)} className="bg-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold disabled:opacity-50">Próximo →</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h4 className="font-semibold mb-3">Confirmar</h4>
              <div className="bg-success/10 border-2 border-success/30 rounded-xl p-5 space-y-2">
                <div><span className="text-muted-foreground">Especialidade:</span> <strong>{specialty}</strong></div>
                <div><span className="text-muted-foreground">Dia:</span> <strong className="capitalize">{day}</strong></div>
                <div><span className="text-muted-foreground">Hora:</span> <strong>{time}</strong></div>
              </div>
              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(2)} className="px-5 py-2 rounded-xl font-semibold border border-border">← Voltar</button>
                <button onClick={confirm} className="bg-success text-success-foreground px-5 py-2 rounded-xl font-semibold">✓ Confirmar Agendamento</button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "historico" && (
        <div className="bg-card rounded-2xl p-10 text-center shadow-card">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-muted-foreground">Sem histórico de consultas anteriores.</p>
        </div>
      )}
    </div>
  );
}

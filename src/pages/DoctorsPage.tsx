import { useMemo, useState } from "react";
import { DOCTORS, SPECIALTIES, Doctor } from "@/data/doctors";
import { DoctorAvatar } from "@/components/DoctorAvatar";
import { Search, Star, MessageCircle, CalendarDays, Building2, Award, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function DoctorsPage() {
  const { setPage, addAppointment } = useApp();
  const [q, setQ] = useState("");
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState<Doctor | null>(null);

  const filtered = useMemo(() => DOCTORS.filter((d) =>
    (!q || d.name.toLowerCase().includes(q.toLowerCase()) || d.specialty.toLowerCase().includes(q.toLowerCase())) &&
    (!onlyOnline || d.online) &&
    (!specialty || d.specialty === specialty)
  ), [q, onlyOnline, specialty]);

  const handleConsult = (d: Doctor) => {
    if (!d.online) {
      toast.error(`${d.name} não está online agora`);
      return;
    }
    toast.success(`A iniciar conversa com ${d.name}...`);
    setPage("telemedicina");
  };

  const confirmSchedule = (d: Doctor, date: string, time: string) => {
    addAppointment({
      id: `apt-${Date.now()}`,
      doctorId: d.id, doctorName: d.name, specialty: d.specialty,
      date, time, status: "Confirmada",
    });
    toast.success(`Consulta com ${d.name} agendada para ${date} às ${time}`);
    setScheduling(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="bg-card rounded-2xl p-4 shadow-card flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar médico ou especialidade..." className="bg-transparent flex-1 text-sm focus:outline-none" />
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer select-none">
          <input type="checkbox" checked={onlyOnline} onChange={(e) => setOnlyOnline(e.target.checked)} className="w-4 h-4 accent-primary" />
          Apenas Online
        </label>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button onClick={() => setSpecialty(null)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap press transition-all",
          !specialty ? "bg-primary text-primary-foreground shadow-soft" : "bg-card hover:bg-muted")}>
          Todas
        </button>
        {SPECIALTIES.map((s) => {
          const active = specialty === s.name;
          return (
            <button key={s.name} onClick={() => setSpecialty(active ? null : s.name)}
              className={cn("px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-2 press transition-all",
                active ? "bg-primary text-primary-foreground shadow-soft" : "bg-card hover:bg-muted")}>
              <s.icon className="w-4 h-4" /> {s.name}
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d, i) => (
          <div key={d.id} className="bg-card rounded-2xl p-5 shadow-card hover-lift animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
            <div className="flex items-start gap-3 mb-3">
              <DoctorAvatar src={d.avatar} name={d.name} online={d.online} size={64} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{d.name}</div>
                <div className="text-sm text-primary">{d.specialty}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 fill-warning text-warning" /> {d.rating}
                </div>
              </div>
              {d.online && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success-dark">● Online</span>}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><Building2 className="w-3 h-3" /> {d.hospital}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3"><Award className="w-3 h-3" /> {d.experience} anos de experiência</div>
            <div className="font-bold text-primary mb-3">{d.priceMzn.toLocaleString()} MZN</div>
            <div className="flex gap-2">
              <button onClick={() => handleConsult(d)} className="flex-1 border border-border rounded-xl py-2 text-sm font-semibold press hover:bg-muted flex items-center justify-center gap-1.5">
                <MessageCircle className="w-4 h-4" /> Online
              </button>
              <button onClick={() => setScheduling(d)} className="flex-1 bg-primary text-primary-foreground rounded-xl py-2 text-sm font-semibold press hover:bg-primary/90 flex items-center justify-center gap-1.5">
                <CalendarDays className="w-4 h-4" /> Agendar
              </button>
            </div>
          </div>
        ))}
      </div>

      {scheduling && (
        <ScheduleModal doctor={scheduling} onClose={() => setScheduling(null)} onConfirm={confirmSchedule} />
      )}
    </div>
  );
}

function ScheduleModal({ doctor, onClose, onConfirm }: {
  doctor: Doctor;
  onClose: () => void;
  onConfirm: (d: Doctor, date: string, time: string) => void;
}) {
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return d.toLocaleDateString("pt-PT", { weekday: "short", day: "numeric", month: "short" });
  });
  const times = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto scrollbar-thin animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <DoctorAvatar src={doctor.avatar} name={doctor.name} size={48} />
            <div>
              <div className="font-display font-bold">{doctor.name}</div>
              <div className="text-sm text-primary">{doctor.specialty}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted press"><X className="w-5 h-5" /></button>
        </div>
        <h4 className="text-sm font-semibold mb-2">Escolha o dia</h4>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {days.map((d) => (
            <button key={d} onClick={() => setDate(d)} className={cn("p-2 rounded-xl border-2 text-xs font-semibold capitalize press",
              date === d ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>{d}</button>
          ))}
        </div>
        <h4 className="text-sm font-semibold mb-2">Escolha a hora</h4>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {times.map((t) => (
            <button key={t} onClick={() => setTime(t)} className={cn("py-2 rounded-xl border-2 text-sm font-semibold press",
              time === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>{t}</button>
          ))}
        </div>
        <button disabled={!date || !time} onClick={() => onConfirm(doctor, date!, time!)}
          className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold disabled:opacity-50 press">
          ✓ Confirmar Agendamento — {doctor.priceMzn} MZN
        </button>
      </div>
    </div>
  );
}

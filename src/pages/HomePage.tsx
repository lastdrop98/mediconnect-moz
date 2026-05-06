import { useApp } from "@/context/AppContext";
import { DOCTORS } from "@/data/doctors";
import { DoctorAvatar } from "@/components/DoctorAvatar";
import { IconBadge } from "@/components/IconBadge";
import {
  Calendar, Stethoscope, FileText, Activity, CalendarDays, Brain,
  HeartHandshake, Siren, Pill, Megaphone, Star, ArrowRight,
} from "lucide-react";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 19) return "Boa tarde";
  return "Boa noite";
};
const fmtDate = () =>
  new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default function HomePage() {
  const { user, setPage, appointments } = useApp();
  const onlineDoctors = DOCTORS.filter((d) => d.online).slice(0, 4);

  const stats = [
    { icon: Calendar, label: "Consultas", value: appointments.length },
    { icon: Stethoscope, label: "Médicos Online", value: DOCTORS.filter((d) => d.online).length },
    { icon: FileText, label: "Exames Pendentes", value: 0 },
    { icon: Activity, label: "Estado de Saúde", value: "Bom" },
  ];

  const actions = [
    { label: "Agendar Consulta", icon: CalendarDays, page: "agendar" as const, gradient: "from-blue-500 to-cyan-500" },
    { label: "Assistente IA", icon: Brain, page: "ia" as const, gradient: "from-violet-500 to-purple-600" },
    { label: "Apoio Psicológico", icon: HeartHandshake, page: "psicologia" as const, gradient: "from-pink-500 to-rose-500" },
    { label: "Emergência", icon: Siren, page: "emergencia" as const, gradient: "from-red-500 to-orange-500" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <section className="relative overflow-hidden gradient-hero rounded-3xl p-6 md:p-8 text-primary-foreground shadow-elevated animate-slide-up">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <p className="text-sm opacity-90 capitalize">{fmtDate()}</p>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold mt-1">
            {greeting()}, {user.name.split(" ")[0]} 👋
          </h2>
          <p className="opacity-90 mt-1">Como podemos cuidar da sua saúde hoje?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/15 backdrop-blur rounded-2xl p-3 hover:bg-white/20 transition-colors">
                <s.icon className="w-5 h-5 mb-1 opacity-90" />
                <div className="text-xs opacity-90">{s.label}</div>
                <div className="text-xl font-bold">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((a) => (
          <button
            key={a.page}
            onClick={() => setPage(a.page)}
            className={`group relative bg-gradient-to-br ${a.gradient} text-white rounded-2xl p-4 text-left shadow-card hover-lift press overflow-hidden`}
          >
            <a.icon className="w-7 h-7 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold">{a.label}</div>
            <ArrowRight className="absolute top-3 right-3 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => setPage("edu")} className="bg-card rounded-2xl p-5 shadow-card border-l-4 border-warning text-left hover-lift">
          <div className="flex items-start gap-3">
            <IconBadge icon={Megaphone} gradient="from-amber-500 to-orange-500" size="md" />
            <div>
              <div className="font-semibold">Campanha de Vacinação</div>
              <p className="text-sm text-muted-foreground mt-1">Vacina contra Malária disponível em centros de saúde de Maputo.</p>
            </div>
          </div>
        </button>
        <button onClick={() => setPage("farmacia")} className="bg-card rounded-2xl p-5 shadow-card border-l-4 border-success text-left hover-lift">
          <div className="flex items-start gap-3">
            <IconBadge icon={Pill} gradient="from-green-500 to-emerald-500" size="md" />
            <div>
              <div className="font-semibold">Lembrete de Medicação</div>
              <p className="text-sm text-muted-foreground mt-1">Não se esqueça de tomar a sua medicação às 20h.</p>
            </div>
          </div>
        </button>
      </div>

      <button onClick={() => setPage("ia")} className="w-full group relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl p-5 flex items-center justify-between shadow-card hover-lift press">
        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center group-hover:rotate-6 transition-transform">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold">Assistente IA de Saúde</div>
            <div className="text-sm opacity-90">Tire dúvidas sobre sintomas, medicamentos e mais</div>
          </div>
        </div>
        <span className="bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
          Consultar IA <ArrowRight className="w-4 h-4" />
        </span>
      </button>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-lg">Médicos Disponíveis</h3>
          <button onClick={() => setPage("medicos")} className="text-sm text-primary font-semibold hover:underline">Ver todos →</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {onlineDoctors.map((d) => (
            <button
              key={d.id}
              onClick={() => setPage("telemedicina")}
              className="bg-card rounded-2xl p-4 shadow-card flex gap-3 text-left hover-lift press"
            >
              <DoctorAvatar src={d.avatar} name={d.name} online size={56} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{d.name}</div>
                <div className="text-xs text-primary">{d.specialty}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 fill-warning text-warning" /> {d.rating} • {d.priceMzn} MZN
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

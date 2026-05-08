import { useApp } from "@/context/AppContext";
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

const ALERT_ICONS: Record<string, { icon: any; gradient: string; border: string }> = {
  vacina: { icon: Megaphone, gradient: "from-amber-500 to-orange-500", border: "border-warning" },
  surto: { icon: Siren, gradient: "from-red-500 to-orange-500", border: "border-destructive" },
  lembrete: { icon: Pill, gradient: "from-green-500 to-emerald-500", border: "border-success" },
  informacao: { icon: Activity, gradient: "from-blue-500 to-cyan-500", border: "border-primary" },
};

export default function HomePage() {
  const { profile, user, setPage, appointments, doctors, alerts } = useApp();
  const onlineDoctors = doctors.filter((d) => d.is_online).slice(0, 4);
  const firstName = (profile?.full_name || user?.email?.split("@")[0] || "Utilizador").split(" ")[0];

  const stats = [
    { icon: Calendar, label: "Consultas Agendadas", value: appointments.filter((a) => a.status === "pending" || a.status === "confirmed").length },
    { icon: Stethoscope, label: "Médicos Online", value: doctors.filter((d) => d.is_online).length },
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
            {greeting()}, {firstName} 👋
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
          <button key={a.page} onClick={() => setPage(a.page)}
            className={`group relative bg-gradient-to-br ${a.gradient} text-white rounded-2xl p-4 text-left shadow-card hover-lift press overflow-hidden`}>
            <a.icon className="w-7 h-7 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold">{a.label}</div>
            <ArrowRight className="absolute top-3 right-3 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </button>
        ))}
      </div>

      {alerts.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {alerts.slice(0, 4).map((a) => {
            const cfg = ALERT_ICONS[a.alert_type] ?? ALERT_ICONS.informacao;
            return (
              <div key={a.id} className={`bg-card rounded-2xl p-5 shadow-card border-l-4 ${cfg.border} hover-lift`}>
                <div className="flex items-start gap-3">
                  <IconBadge icon={cfg.icon} gradient={cfg.gradient} size="md" />
                  <div>
                    <div className="font-semibold">{a.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
            <button key={d.id} onClick={() => setPage("telemedicina")}
              className="bg-card rounded-2xl p-4 shadow-card flex gap-3 text-left hover-lift press">
              <div className="relative">
                <img src={d.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(d.name)}`} alt={d.name} className="w-14 h-14 rounded-2xl object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success ring-2 ring-card" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{d.name}</div>
                <div className="text-xs text-primary">{d.specialty}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 fill-warning text-warning" /> {d.rating} • {d.price_mzn} MZN
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

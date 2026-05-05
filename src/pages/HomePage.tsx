import { useApp } from "@/context/AppContext";
import { DOCTORS } from "@/data/doctors";
import { Calendar, Stethoscope, FileText, Activity } from "lucide-react";

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
    { label: "Agendar Consulta", emoji: "📅", page: "agendar" as const, gradient: "gradient-blue" },
    { label: "Assistente IA", emoji: "🧠", page: "ia" as const, gradient: "gradient-purple" },
    { label: "Apoio Psicológico", emoji: "💙", page: "psicologia" as const, gradient: "gradient-pink" },
    { label: "Emergência", emoji: "🚨", page: "emergencia" as const, gradient: "gradient-warm" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <section className="gradient-hero rounded-2xl p-6 md:p-8 text-primary-foreground shadow-elevated">
        <p className="text-sm opacity-90 capitalize">{fmtDate()}</p>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold mt-1">{greeting()}, {user.name.split(" ")[0]}! 👋</h2>
        <p className="opacity-90 mt-1">Como podemos cuidar da sua saúde hoje?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white/15 backdrop-blur rounded-xl p-3">
              <s.icon className="w-5 h-5 mb-1 opacity-90" />
              <div className="text-xs opacity-90">{s.label}</div>
              <div className="text-xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((a) => (
          <button key={a.page} onClick={() => setPage(a.page)} className={`${a.gradient} text-white rounded-2xl p-4 text-left shadow-card hover:shadow-elevated transition-shadow`}>
            <div className="text-3xl mb-2">{a.emoji}</div>
            <div className="font-semibold">{a.label}</div>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-5 shadow-card border-l-4 border-warning">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📢</span>
            <div>
              <div className="font-semibold">Campanha de Vacinação</div>
              <p className="text-sm text-muted-foreground mt-1">Vacina contra Malária disponível em centros de saúde de Maputo.</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-card border-l-4 border-success">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💊</span>
            <div>
              <div className="font-semibold">Lembrete de Medicação</div>
              <p className="text-sm text-muted-foreground mt-1">Não se esqueça de tomar a sua medicação às 20h.</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setPage("ia")} className="w-full gradient-purple text-white rounded-2xl p-5 flex items-center justify-between shadow-card hover:shadow-elevated transition-shadow">
        <div className="flex items-center gap-3 text-left">
          <span className="text-3xl">🧠</span>
          <div>
            <div className="font-bold">Assistente IA de Saúde</div>
            <div className="text-sm opacity-90">Tire dúvidas sobre sintomas, medicamentos e mais</div>
          </div>
        </div>
        <span className="bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold">Consultar IA</span>
      </button>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-lg">Médicos Disponíveis</h3>
          <button onClick={() => setPage("medicos")} className="text-sm text-primary font-semibold">Ver todos →</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {onlineDoctors.map((d) => (
            <div key={d.id} className="bg-card rounded-2xl p-4 shadow-card flex gap-3">
              <div className="w-14 h-14 rounded-2xl gradient-blue flex items-center justify-center text-2xl flex-shrink-0">{d.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{d.name}</div>
                <div className="text-xs text-primary">{d.specialty}</div>
                <div className="text-xs text-muted-foreground">⭐ {d.rating} • {d.priceMzn} MZN</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

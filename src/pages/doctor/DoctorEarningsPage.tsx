import { useDoctorAppointments } from "./DoctorHomePage";
import { Wallet, TrendingUp, CheckCircle2 } from "lucide-react";

const PRICE = 800;

export default function DoctorEarningsPage() {
  const { items } = useDoctorAppointments();
  const completed = items.filter((a) => a.status === "completed");
  const month = completed.filter((a) => a.appointment_date && new Date(a.appointment_date).getMonth() === new Date().getMonth());
  const total = month.length * PRICE;
  const avg = completed.length ? Math.round(total / Math.max(month.length, 1)) : 0;

  const stats = [
    { icon: Wallet, label: "Total este mês (MZN)", value: total.toLocaleString("pt-PT"), gradient: "from-emerald-500 to-teal-600" },
    { icon: CheckCircle2, label: "Consultas concluídas", value: month.length, gradient: "from-blue-500 to-cyan-500" },
    { icon: TrendingUp, label: "Média por consulta (MZN)", value: avg.toLocaleString("pt-PT"), gradient: "from-violet-500 to-purple-600" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 shadow-card hover-lift">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} text-white grid place-items-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-display font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-border font-display font-bold">Histórico de pagamentos</div>
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Paciente</th>
              <th className="px-4 py-3 text-left">Valor (MZN)</th>
              <th className="px-4 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {month.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">Sem ganhos este mês.</td></tr>
            )}
            {month.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-4 py-3">{a.appointment_date}</td>
                <td className="px-4 py-3 font-semibold">{a.patientName}</td>
                <td className="px-4 py-3">{PRICE}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-success/15 text-success font-semibold">Pago</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

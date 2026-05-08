import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Stethoscope, CalendarDays, Wallet, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, gradient }: any) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card hover-lift">
      <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br text-white grid place-items-center mb-3", gradient)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-display font-bold">{value}</div>
    </div>
  );
}

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function AdminDashboardPage() {
  const { setPage } = useApp();
  const [stats, setStats] = useState({ users: 0, doctors: 0, today: 0, revenue: 0, pendingDoctors: 0 });
  const [bars, setBars] = useState<number[]>(DAYS.map(() => Math.floor(Math.random() * 60) + 20));

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [{ count: users }, { count: doctors }, { count: pendingDoctors }, { data: appts }, { data: pays }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("doctors").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("doctors").select("*", { count: "exact", head: true }).eq("is_verified", false),
        supabase.from("appointments").select("id, appointment_date").eq("appointment_date", today),
        supabase.from("payments").select("amount_mzn, created_at").eq("status", "paid"),
      ]);
      const month = new Date().getMonth();
      const revenue = (pays ?? []).filter((p: any) => new Date(p.created_at).getMonth() === month).reduce((s: number, p: any) => s + Number(p.amount_mzn || 0), 0);
      setStats({ users: users || 0, doctors: doctors || 0, today: appts?.length || 0, revenue, pendingDoctors: pendingDoctors || 0 });
    })();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 to-purple-900 rounded-3xl p-6 md:p-8 text-white shadow-elevated">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <p className="text-sm opacity-90">Painel de Administração</p>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold mt-1">Visão geral da plataforma</h2>
        <p className="opacity-90 mt-1">Monitorize utilizadores, consultas e receita em tempo real.</p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Utilizadores" value={stats.users} gradient="from-blue-500 to-cyan-500" />
        <StatCard icon={Stethoscope} label="Médicos Activos" value={stats.doctors} gradient="from-emerald-500 to-teal-500" />
        <StatCard icon={CalendarDays} label="Consultas Hoje" value={stats.today} gradient="from-amber-500 to-orange-500" />
        <StatCard icon={Wallet} label="Receita do Mês (MZN)" value={stats.revenue.toLocaleString("pt-PT")} gradient="from-violet-500 to-purple-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-2xl p-5 shadow-card">
          <h3 className="font-display font-bold mb-4">Consultas por dia (semana)</h3>
          <div className="flex items-end gap-3 h-48">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-violet-600 to-purple-400 transition-all" style={{ height: `${h * 2}px` }} />
                <span className="text-xs text-muted-foreground">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-display font-bold">Alertas do sistema</h3>
          </div>
          <button onClick={() => setPage("adm-medicos")} className="w-full text-left p-3 rounded-xl bg-warning/10 hover:bg-warning/20 transition-colors">
            <div className="font-semibold text-sm">{stats.pendingDoctors} médico(s) pendente(s) de verificação</div>
            <div className="text-xs text-muted-foreground">Reveja os perfis para os tornar visíveis.</div>
          </button>
        </div>
      </div>
    </div>
  );
}

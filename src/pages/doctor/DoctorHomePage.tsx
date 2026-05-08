import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, CheckCircle2, XCircle, Activity, Users as UsersIcon, Wallet, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Appt = {
  id: string; patient_id: string; specialty: string | null;
  appointment_date: string | null; appointment_time: string | null;
  status: string; modality: string | null;
  patientName?: string;
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  confirmed: "bg-primary/15 text-primary",
  completed: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente", confirmed: "Confirmada", completed: "Concluída", cancelled: "Cancelada",
};

export function useDoctorAppointments() {
  const { user } = useApp();
  const [items, setItems] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    // Demo: as user is not in doctors table, show ALL appointments (any role can view in demo).
    // In production, filter by doctor_id = user.id.
    const { data: appts } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true });
    const list = (appts as any[]) ?? [];
    const ids = Array.from(new Set(list.map((a) => a.patient_id).filter(Boolean)));
    let map: Record<string, string> = {};
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", ids);
      (profs ?? []).forEach((p: any) => { map[p.id] = p.full_name || "Paciente"; });
    }
    setItems(list.map((r) => ({ ...r, patientName: map[r.patient_id] || "Paciente" })));
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [user?.id]);
  return { items, loading, refresh };
}

function StatCard({ icon: Icon, label, value, gradient }: any) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card hover-lift">
      <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-2", gradient)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-display font-bold">{value}</div>
    </div>
  );
}

export function ApptActions({ appt, onChanged }: { appt: Appt; onChanged: () => void }) {
  const update = async (status: string) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", appt.id);
    if (error) return toast.error(error.message);
    toast.success(`Consulta ${STATUS_LABEL[status].toLowerCase()}`);
    onChanged();
  };
  if (appt.status === "completed" || appt.status === "cancelled") return null;
  return (
    <div className="flex flex-wrap gap-2">
      {appt.status !== "confirmed" && (
        <button onClick={() => update("confirmed")} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground press">
          Confirmar
        </button>
      )}
      <button onClick={() => update("completed")} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-success text-success-foreground press">
        Concluída
      </button>
      <button onClick={() => update("cancelled")} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive text-destructive-foreground press">
        Cancelar
      </button>
    </div>
  );
}

export default function DoctorHomePage() {
  const { profile, user, setPage } = useApp();
  const { items, refresh } = useDoctorAppointments();
  const baseName = profile?.full_name || user?.email?.split("@")[0] || "Doutor";

  const today = new Date().toISOString().slice(0, 10);
  const todayAppts = items.filter((a) => a.appointment_date === today);
  const pending = items.filter((a) => a.status === "pending").length;
  const monthCompleted = items.filter((a) => {
    if (a.status !== "completed" || !a.appointment_date) return false;
    return new Date(a.appointment_date).getMonth() === new Date().getMonth();
  });
  const earnings = monthCompleted.length * 800;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 md:p-8 text-white shadow-elevated">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <p className="text-sm opacity-90">Painel Profissional</p>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold mt-1">Bem-vindo, Dr. {baseName.split(" ")[0]} 🩺</h2>
        <p className="opacity-90 mt-1">Aqui está um resumo da sua actividade hoje.</p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={CalendarDays} label="Consultas Hoje" value={todayAppts.length} gradient="from-blue-500 to-cyan-500" />
        <StatCard icon={Clock} label="Pendentes de Confirmar" value={pending} gradient="from-amber-500 to-orange-500" />
        <StatCard icon={UsersIcon} label="Pacientes este mês" value={new Set(monthCompleted.map((a) => a.patient_id)).size} gradient="from-violet-500 to-purple-600" />
        <StatCard icon={Wallet} label="Ganhos do Mês (MZN)" value={earnings.toLocaleString("pt-PT")} gradient="from-emerald-500 to-teal-500" />
      </div>

      <section className="bg-card rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Próximas consultas</h3>
          <button onClick={() => setPage("doc-agenda")} className="text-sm text-primary font-semibold hover:underline">Ver agenda →</button>
        </div>
        {items.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">Sem consultas marcadas.</div>
        ) : (
          <div className="space-y-3">
            {items.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-success grid place-items-center text-white font-bold">
                  {(a.patientName || "P").slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{a.patientName}</div>
                  <div className="text-xs text-muted-foreground">{a.specialty} · {a.appointment_date} {a.appointment_time}</div>
                </div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", STATUS_BADGE[a.status])}>{STATUS_LABEL[a.status]}</span>
                <ApptActions appt={a} onChanged={refresh} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-card rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-lg">Mensagens recentes</h3>
        </div>
        <div className="text-sm text-muted-foreground">Nenhuma mensagem nova de pacientes.</div>
      </section>
    </div>
  );
}

export { STATUS_BADGE, STATUS_LABEL };

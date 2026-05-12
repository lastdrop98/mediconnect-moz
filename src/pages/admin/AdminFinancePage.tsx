import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Wallet, TrendingUp, Building2, Clock } from "lucide-react";

type Row = { id: string; created_at: string; description: string | null; amount_mzn: number; method: string; status: string };

function StatCard({ icon: Icon, label, value, gradient }: any) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card hover-lift">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} text-white grid place-items-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-display font-bold">{value}</div>
    </div>
  );
}

export default function AdminFinancePage() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    supabase.from("transactions").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  const paid = rows.filter((r) => r.status === "completed");
  const total = paid.reduce((s, r) => s + Number(r.amount_mzn || 0), 0);
  const doctors = Math.round(total * 0.7);
  const platform = total - doctors;
  const pending = rows.filter((r) => r.status === "pending").reduce((s, r) => s + Number(r.amount_mzn || 0), 0);
  const fmt = (n: number) => `${n.toLocaleString("pt-PT")} MZN`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Wallet} label="Receita Total" value={fmt(total)} gradient="from-emerald-500 to-teal-600" />
        <StatCard icon={TrendingUp} label="Pago a médicos (70%)" value={fmt(doctors)} gradient="from-blue-500 to-cyan-500" />
        <StatCard icon={Building2} label="Comissão plataforma (30%)" value={fmt(platform)} gradient="from-violet-500 to-purple-600" />
        <StatCard icon={Clock} label="Pendente" value={fmt(pending)} gradient="from-amber-500 to-orange-500" />
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-border font-display font-bold">Transacções recentes</div>
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Descrição</th>
              <th className="px-4 py-3 text-left">Método</th>
              <th className="px-4 py-3 text-left">Valor</th>
              <th className="px-4 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 25).map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3">{new Date(r.created_at).toLocaleDateString("pt-PT")}</td>
                <td className="px-4 py-3">{r.description || "—"}</td>
                <td className="px-4 py-3">{r.payment_method}</td>
                <td className="px-4 py-3 font-semibold">{fmt(Number(r.amount_mzn))}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted">{r.status}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">Sem transacções.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

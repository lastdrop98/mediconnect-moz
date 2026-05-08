import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

type Patient = { id: string; full_name: string | null; plan: string; created_at: string; phone: string | null };

export default function AdminPatientsPage() {
  const [list, setList] = useState<Patient[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setList((data as Patient[]) ?? []);
    });
  }, []);

  const filtered = list.filter((p) => !q || (p.full_name || "").toLowerCase().includes(q.toLowerCase()));
  const planLabel: Record<string, string> = { free: "Gratuito", essential: "Essencial", family: "Família" };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar utilizador..." className="bg-transparent outline-none flex-1 text-sm" />
      </div>
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Telefone</th>
              <th className="px-4 py-3 text-left">Plano</th>
              <th className="px-4 py-3 text-left">Registo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-semibold">{p.full_name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.phone || "—"}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">{planLabel[p.plan] || p.plan}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-PT")}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-muted-foreground">Sem utilizadores.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

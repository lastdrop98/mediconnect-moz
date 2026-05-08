import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, ShieldOff, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { DoctorRow } from "@/context/AppContext";

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "verified", label: "Verificados" },
  { id: "pending", label: "Pendentes" },
] as const;

export default function AdminDoctorsPage() {
  const [docs, setDocs] = useState<DoctorRow[]>([]);
  const [filter, setFilter] = useState<typeof FILTERS[number]["id"]>("all");
  const [q, setQ] = useState("");

  const refresh = async () => {
    const { data } = await supabase.from("doctors").select("*").order("name");
    setDocs((data as DoctorRow[]) ?? []);
  };
  useEffect(() => { refresh(); }, []);

  const update = async (id: string, patch: Partial<DoctorRow>) => {
    const { error } = await supabase.from("doctors").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Atualizado");
    refresh();
  };

  const filtered = docs.filter((d) => {
    if (filter === "verified" && !d.is_verified) return false;
    if (filter === "pending" && d.is_verified) return false;
    if (q && !d.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="bg-card rounded-2xl p-4 shadow-card flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar médico..." className="bg-transparent outline-none flex-1 text-sm" />
        </div>
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold press",
                filter === f.id ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-foreground")}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Médico</th>
              <th className="px-4 py-3 text-left">Especialidade</th>
              <th className="px-4 py-3 text-left">Hospital</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acções</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-semibold flex items-center gap-2">
                  <img src={d.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${d.name}`} className="w-8 h-8 rounded-full object-cover" alt="" />
                  {d.name}
                </td>
                <td className="px-4 py-3">{d.specialty}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.hospital}</td>
                <td className="px-4 py-3">
                  {d.is_active === false ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/15 text-destructive font-bold">Desactivado</span>
                  ) : d.is_verified ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/15 text-success font-bold">Verificado</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warning/15 text-warning font-bold">Pendente</span>
                  )}
                </td>
                <td className="px-4 py-3 flex flex-wrap gap-1">
                  {!d.is_verified && (
                    <button onClick={() => update(d.id, { is_verified: true })} className="px-2 py-1 text-xs rounded-lg bg-success text-success-foreground press flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verificar
                    </button>
                  )}
                  <button onClick={() => update(d.id, { is_active: !d.is_active })} className="px-2 py-1 text-xs rounded-lg bg-muted hover:bg-destructive/15 hover:text-destructive press flex items-center gap-1">
                    <ShieldOff className="w-3 h-3" /> {d.is_active === false ? "Activar" : "Desactivar"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">Sem médicos.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

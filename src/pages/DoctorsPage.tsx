import { useMemo, useState } from "react";
import { DOCTORS, SPECIALTIES } from "@/data/doctors";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DoctorsPage() {
  const [q, setQ] = useState("");
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [specialty, setSpecialty] = useState<string | null>(null);

  const filtered = useMemo(() => DOCTORS.filter((d) =>
    (!q || d.name.toLowerCase().includes(q.toLowerCase()) || d.specialty.toLowerCase().includes(q.toLowerCase())) &&
    (!onlyOnline || d.online) &&
    (!specialty || d.specialty === specialty)
  ), [q, onlyOnline, specialty]);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="bg-card rounded-2xl p-4 shadow-card flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar médico..." className="bg-transparent flex-1 text-sm focus:outline-none" />
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
          <input type="checkbox" checked={onlyOnline} onChange={(e) => setOnlyOnline(e.target.checked)} className="w-4 h-4 accent-primary" />
          Apenas Online
        </label>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button onClick={() => setSpecialty(null)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap", !specialty ? "bg-primary text-primary-foreground" : "bg-card")}>Todas</button>
        {SPECIALTIES.map((s) => (
          <button key={s.name} onClick={() => setSpecialty(s.name === "Clínico Geral" ? "Clínica Geral" : s.name)}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-1",
              specialty === (s.name === "Clínico Geral" ? "Clínica Geral" : s.name) ? "bg-primary text-primary-foreground" : "bg-card")}>
            <span>{s.emoji}</span> {s.name}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div key={d.id} className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl gradient-blue flex items-center justify-center text-2xl">{d.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{d.name}</div>
                <div className="text-sm text-primary">{d.specialty}</div>
                <div className="text-xs text-muted-foreground">⭐ {d.rating}</div>
              </div>
              {d.online && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success text-success-foreground">● Online</span>}
            </div>
            <div className="text-xs text-muted-foreground mb-1">🏥 {d.hospital}</div>
            <div className="text-xs text-muted-foreground mb-3">📅 {d.experience} anos de experiência</div>
            <div className="font-bold text-primary mb-3">{d.priceMzn.toLocaleString()} MZN</div>
            <div className="flex gap-2">
              <button className="flex-1 border border-border rounded-xl py-2 text-sm font-semibold hover:bg-muted">💬 Online</button>
              <button className="flex-1 bg-primary text-primary-foreground rounded-xl py-2 text-sm font-semibold">📅 Agendar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

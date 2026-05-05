import { useState } from "react";
import { FACILITIES } from "@/data/facilities";
import { Search, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MapPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = FACILITIES.filter((f) =>
    (filter === "all" || f.type === filter) &&
    (!q || f.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar estabelecimento..." className="flex-1 bg-transparent text-sm focus:outline-none" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[["all", "Todos"], ["hospital", "Hospitais"], ["clinic", "Clínicas"], ["pharmacy", "Farmácias"], ["lab", "Laboratórios"]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap",
              filter === k ? "bg-primary text-primary-foreground" : "bg-card")}>{l}</button>
        ))}
      </div>

      <div className="gradient-warm rounded-2xl p-5 text-white shadow-elevated flex flex-wrap items-center gap-3">
        <span className="text-3xl">🚨</span>
        <div className="flex-1">
          <div className="font-bold">Em emergência?</div>
          <div className="text-sm opacity-90">Ligue para o número nacional de emergência</div>
        </div>
        <a href="tel:112" className="bg-white text-destructive px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Phone className="w-4 h-4" /> Ligar 112
        </a>
      </div>

      <div className="rounded-2xl h-64 bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center relative overflow-hidden">
        <div className="text-center">
          <div className="text-6xl mb-2">🗺️</div>
          <div className="text-sm text-muted-foreground">Mapa interativo de Maputo</div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl animate-bounce">📍</div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f) => (
          <div key={f.id} className="bg-card rounded-2xl p-4 shadow-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">{f.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{f.name}</div>
                <div className="text-xs text-muted-foreground">{f.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-primary/10 text-primary capitalize">{f.type}</span>
              <span className="text-xs">⭐ {f.rating}</span>
              {f.emergency && <span className="text-xs font-semibold px-2 py-1 rounded-md bg-destructive/10 text-destructive">Emergência</span>}
            </div>
            <button className="w-full bg-primary text-primary-foreground rounded-xl py-2 text-sm font-semibold">Ver</button>
          </div>
        ))}
      </div>
    </div>
  );
}

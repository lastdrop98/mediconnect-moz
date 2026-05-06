import { useState } from "react";
import { FACILITIES } from "@/data/facilities";
import { InteractiveMap } from "@/components/InteractiveMap";
import { IconBadge } from "@/components/IconBadge";
import { Search, Phone, Hospital, Pill, FlaskConical, Stethoscope, MapPin, Star, Siren } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TYPE_META = {
  hospital: { icon: Hospital, gradient: "from-red-500 to-pink-500", label: "Hospital" },
  clinic: { icon: Stethoscope, gradient: "from-blue-500 to-cyan-500", label: "Clínica" },
  pharmacy: { icon: Pill, gradient: "from-green-500 to-emerald-500", label: "Farmácia" },
  lab: { icon: FlaskConical, gradient: "from-violet-500 to-purple-500", label: "Laboratório" },
} as const;

const FILTERS = [
  { k: "all", label: "Todos" },
  { k: "hospital", label: "Hospitais" },
  { k: "clinic", label: "Clínicas" },
  { k: "pharmacy", label: "Farmácias" },
  { k: "lab", label: "Laboratórios" },
];

export default function MapPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(FACILITIES[0]?.id ?? null);

  const filtered = FACILITIES.filter((f) =>
    (filter === "all" || f.type === filter) &&
    (!q || f.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar estabelecimento..." className="flex-1 bg-transparent text-sm focus:outline-none" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {FILTERS.map((f) => (
          <button key={f.k} onClick={() => setFilter(f.k)}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap press transition-all",
              filter === f.k ? "bg-primary text-primary-foreground shadow-soft" : "bg-card hover:bg-muted")}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-5 text-white shadow-elevated flex flex-wrap items-center gap-3 animate-slide-up">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
          <Siren className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="font-bold">Em emergência?</div>
          <div className="text-sm opacity-90">Ligue para o número nacional de emergência</div>
        </div>
        <a href="tel:112" className="bg-white text-destructive px-4 py-2 rounded-xl font-bold flex items-center gap-2 press">
          <Phone className="w-4 h-4" /> Ligar 112
        </a>
      </div>

      <InteractiveMap facilities={filtered} selectedId={selectedId} onSelect={setSelectedId} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f, i) => {
          const meta = TYPE_META[f.type];
          const active = f.id === selectedId;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedId(f.id)}
              className={cn(
                "bg-card rounded-2xl p-4 shadow-card text-left hover-lift animate-fade-in",
                active && "ring-2 ring-primary"
              )}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <IconBadge icon={meta.icon} gradient={meta.gradient} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{f.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.address}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-semibold px-2 py-1 rounded-md bg-primary/10 text-primary">{meta.label}</span>
                <span className="text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-warning text-warning" /> {f.rating}</span>
                {f.emergency && <span className="text-xs font-semibold px-2 py-1 rounded-md bg-destructive/10 text-destructive">Emergência</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedId(f.id); toast.success(`Centrando mapa em ${f.name}`); }}
                  className="flex-1 bg-primary text-primary-foreground rounded-xl py-2 text-sm font-semibold press"
                >
                  Ver no Mapa
                </button>
                <a
                  href="tel:+258840000000"
                  onClick={(e) => e.stopPropagation()}
                  className="border border-border rounded-xl px-3 py-2 text-sm font-semibold press hover:bg-muted flex items-center gap-1"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { MapPin } from "lucide-react";
import type { Facility } from "@/data/facilities";
import { cn } from "@/lib/utils";

interface Props {
  facilities: Facility[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// Maputo center query
const MAP_QUERY = "Maputo,Mozambique";

export function InteractiveMap({ facilities, selectedId, onSelect }: Props) {
  const selected = facilities.find((f) => f.id === selectedId);
  const query = selected
    ? encodeURIComponent(`${selected.name}, ${selected.address}, Maputo`)
    : encodeURIComponent(MAP_QUERY);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-elevated bg-card animate-fade-in">
      <div className="relative h-[420px]">
        <iframe
          key={query}
          title="Mapa de Saúde — Maputo"
          src={`https://www.google.com/maps?q=${query}&z=14&output=embed`}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Floating pin overlay (visual decoration, not interactive over iframe) */}
        <div className="pointer-events-none absolute top-4 left-4 bg-card/90 backdrop-blur rounded-xl shadow-soft px-3 py-2 flex items-center gap-2 animate-fade-in">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold">{selected ? selected.name : "Maputo, Moçambique"}</span>
        </div>
      </div>
      {/* Facility chip rail */}
      <div className="flex gap-2 overflow-x-auto p-3 bg-card scrollbar-thin border-t border-border">
        {facilities.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95",
              selectedId === f.id
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-muted hover:bg-muted/70"
            )}
          >
            <MapPin className="w-3 h-3" />
            {f.name}
          </button>
        ))}
      </div>
    </div>
  );
}

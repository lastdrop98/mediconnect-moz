import { useState } from "react";
import { DOCTORS } from "@/data/doctors";
import ChatWindow from "@/components/ChatWindow";
import { Video } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TelemedicinePage() {
  const online = DOCTORS.filter((d) => d.online);
  const [selected, setSelected] = useState(online[0]);

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-9rem)]">
      <div className="bg-card rounded-2xl p-3 shadow-card overflow-y-auto scrollbar-thin">
        <h3 className="font-display font-bold px-2 py-2">Médicos Online ({online.length})</h3>
        {online.map((d) => (
          <button key={d.id} onClick={() => setSelected(d)}
            className={cn("w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors",
              selected.id === d.id ? "bg-primary/10" : "hover:bg-muted")}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full gradient-blue flex items-center justify-center text-lg">{d.emoji}</div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-card" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{d.name}</div>
              <div className="text-xs text-muted-foreground truncate">{d.specialty}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col">
        <div className="bg-card rounded-t-2xl p-4 shadow-card flex items-center gap-3 border-b border-border">
          <div className="w-10 h-10 rounded-full gradient-blue flex items-center justify-center text-lg">{selected.emoji}</div>
          <div className="flex-1">
            <div className="font-semibold">{selected.name}</div>
            <div className="text-xs text-muted-foreground">{selected.specialty} • Online</div>
          </div>
          <button className="bg-primary text-primary-foreground px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Video className="w-4 h-4" /> Vídeo
          </button>
        </div>
        <div className="flex-1 min-h-0 -mt-2">
          <ChatWindow
            key={selected.id}
            context="telemedicine"
            contextData={{ doctorName: selected.name, specialty: selected.specialty, emoji: selected.emoji }}
            initialMessage={`Olá! Sou ${selected.name}, ${selected.specialty}. Como posso ajudá-lo(a) hoje?`}
            placeholder="Descreva os seus sintomas..."
          />
        </div>
      </div>
    </div>
  );
}

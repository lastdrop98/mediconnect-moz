import { useState } from "react";
import { DOCTORS } from "@/data/doctors";
import ChatWindow from "@/components/ChatWindow";
import { DoctorAvatar } from "@/components/DoctorAvatar";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function TelemedicinePage() {
  const online = DOCTORS.filter((d) => d.online);
  const [selected, setSelected] = useState(online[0]);
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const startCall = () => {
    setInCall(true);
    toast.success(`A ligar para ${selected.name}...`);
  };
  const endCall = () => {
    setInCall(false);
    toast("Chamada terminada", { icon: "📞" });
  };

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-9rem)] animate-fade-in">
      <div className="bg-card rounded-2xl p-3 shadow-card overflow-y-auto scrollbar-thin">
        <h3 className="font-display font-bold px-2 py-2">Médicos Online ({online.length})</h3>
        {online.map((d) => (
          <button key={d.id} onClick={() => setSelected(d)}
            className={cn("w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all press",
              selected.id === d.id ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-muted")}>
            <DoctorAvatar src={d.avatar} name={d.name} online size={44} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{d.name}</div>
              <div className="text-xs text-muted-foreground truncate">{d.specialty}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col">
        <div className="bg-card rounded-t-2xl p-4 shadow-card flex items-center gap-3 border-b border-border">
          <DoctorAvatar src={selected.avatar} name={selected.name} online size={44} />
          <div className="flex-1">
            <div className="font-semibold">{selected.name}</div>
            <div className="text-xs text-muted-foreground">{selected.specialty} • Online</div>
          </div>
          {!inCall ? (
            <button onClick={startCall} className="bg-success text-success-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 press hover:bg-success/90">
              <Video className="w-4 h-4" /> Iniciar Vídeo
            </button>
          ) : (
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-success/15 text-success-dark animate-pulse">● EM CHAMADA</span>
          )}
        </div>

        {inCall && (
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 h-64 flex items-center justify-center animate-scale-in">
            <img src={selected.avatar} alt={selected.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
            <div className="absolute bottom-3 right-3 w-24 h-32 rounded-xl bg-card/80 backdrop-blur border-2 border-white/40 flex items-center justify-center text-xs text-white font-semibold">
              Você
            </div>
            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> AO VIVO
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              <button onClick={() => setMuted(!muted)} className={cn("w-11 h-11 rounded-full flex items-center justify-center text-white press", muted ? "bg-destructive" : "bg-white/20 backdrop-blur")}>
                {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button onClick={() => setVideoOff(!videoOff)} className={cn("w-11 h-11 rounded-full flex items-center justify-center text-white press", videoOff ? "bg-destructive" : "bg-white/20 backdrop-blur")}>
                {videoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
              <button onClick={endCall} className="w-11 h-11 rounded-full bg-destructive text-white flex items-center justify-center press">
                <PhoneOff className="w-5 h-5" />
              </button>
              <button className="w-11 h-11 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center press">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0">
          <ChatWindow
            key={selected.id}
            context="telemedicine"
            contextData={{ doctorName: selected.name, specialty: selected.specialty }}
            initialMessage={`Olá! Sou ${selected.name}, ${selected.specialty}. Como posso ajudá-lo(a) hoje?`}
            placeholder="Descreva os seus sintomas..."
          />
        </div>
      </div>
    </div>
  );
}

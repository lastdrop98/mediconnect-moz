import { useEffect, useMemo, useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import RealtimeChatPanel from "@/components/RealtimeChatPanel";
import { DoctorAvatar } from "@/components/DoctorAvatar";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Maximize2, MessageSquare, Bot, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export default function TelemedicinePage() {
  const { user, doctors, appointments, clearUnreadFrom } = useApp();
  // Doctors with whom the patient has a confirmed appointment can be chatted with in real time.
  const confirmedDoctorIds = useMemo(
    () => new Set(appointments.filter((a) => a.status === "confirmed" && a.doctor_id).map((a) => a.doctor_id as string)),
    [appointments]
  );
  const onlineDoctors = doctors.filter((d) => d.is_online);
  const list = onlineDoctors.length ? onlineDoctors : doctors;
  const [selectedId, setSelectedId] = useState<string | null>(list[0]?.id ?? null);
  useEffect(() => { if (!selectedId && list[0]) setSelectedId(list[0].id); }, [list, selectedId]);
  const selected = list.find((d) => d.id === selectedId) ?? list[0];

  const [tab, setTab] = useState<"chat" | "ai">("chat");
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const isConfirmedWithDoctor = !!selected && confirmedDoctorIds.has(selected.id);
  const activeAppointment = appointments.find(
    (a) => a.status === "confirmed" && a.doctor_id === selected?.id
  );

  useEffect(() => {
    if (selected && isConfirmedWithDoctor) clearUnreadFrom(selected.id);
  }, [selected, isConfirmedWithDoctor, clearUnreadFrom]);

  if (!selected) {
    return (
      <div className="max-w-3xl mx-auto bg-card rounded-2xl p-10 text-center shadow-card">
        <Video className="w-12 h-12 mx-auto text-primary mb-3" />
        <h3 className="font-display font-bold text-xl">Sem médicos disponíveis</h3>
        <p className="text-sm text-muted-foreground mt-2">Tente novamente mais tarde.</p>
      </div>
    );
  }

  const startCall = () => { setInCall(true); toast.success(`A ligar para ${selected.name}...`); };
  const endCall = () => { setInCall(false); toast("Chamada terminada", { icon: "📞" }); };

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-9rem)] animate-fade-in">
      <div className="bg-card rounded-2xl p-3 shadow-card overflow-y-auto scrollbar-thin">
        <h3 className="font-display font-bold px-2 py-2">Médicos {onlineDoctors.length ? `Online (${onlineDoctors.length})` : ""}</h3>
        {list.map((d) => {
          const hasAppt = confirmedDoctorIds.has(d.id);
          return (
            <button key={d.id} onClick={() => setSelectedId(d.id)}
              className={cn("w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all press",
                selected.id === d.id ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-muted")}>
              <DoctorAvatar src={d.avatar_url ?? undefined} name={d.name} online={d.is_online} size={44} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{d.name}</div>
                <div className="text-xs text-muted-foreground truncate">{d.specialty}</div>
              </div>
              {hasAppt && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-success text-success-foreground">CHAT</span>}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col">
        <div className="bg-card rounded-t-2xl p-4 shadow-card flex items-center gap-3 border-b border-border">
          <DoctorAvatar src={selected.avatar_url ?? undefined} name={selected.name} online={selected.is_online} size={44} />
          <div className="flex-1">
            <div className="font-semibold">{selected.name}</div>
            <div className="text-xs text-muted-foreground">{selected.specialty} {selected.is_online ? "• Online" : ""}</div>
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
            {selected.avatar_url && <img src={selected.avatar_url} alt={selected.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />}
            <div className="absolute bottom-3 right-3 w-24 h-32 rounded-xl bg-card/80 backdrop-blur border-2 border-white/40 flex items-center justify-center text-xs text-white font-semibold">Você</div>
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
              <button onClick={endCall} className="w-11 h-11 rounded-full bg-destructive text-white flex items-center justify-center press"><PhoneOff className="w-5 h-5" /></button>
              <button className="w-11 h-11 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center press"><Maximize2 className="w-5 h-5" /></button>
            </div>
          </div>
        )}

        <div className="bg-card border-b border-border px-2 flex gap-1">
          <button onClick={() => setTab("chat")}
            className={cn("flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors",
              tab === "chat" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
            <MessageSquare className="w-3.5 h-3.5" /> Chat com Médico
            {!isConfirmedWithDoctor && <Lock className="w-3 h-3 ml-1" />}
          </button>
          <button onClick={() => setTab("ai")}
            className={cn("flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors",
              tab === "ai" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
            <Bot className="w-3.5 h-3.5" /> Triagem IA
          </button>
        </div>

        <div className="flex-1 min-h-0">
          {tab === "chat" ? (
            isConfirmedWithDoctor && user ? (
              <RealtimeChatPanel
                myId={user.id}
                peerId={selected.id}
                peerName={selected.name}
                peerAvatar={selected.avatar_url}
                appointmentId={activeAppointment?.id}
              />
            ) : (
              <div className="h-full bg-card rounded-b-2xl flex flex-col items-center justify-center text-center p-8 shadow-card">
                <Lock className="w-10 h-10 text-muted-foreground mb-3" />
                <h4 className="font-display font-bold text-lg">Chat bloqueado</h4>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  O chat em tempo real fica disponível assim que tiver uma consulta <strong>confirmada</strong> com {selected.name}.
                </p>
              </div>
            )
          ) : (
            <ChatWindow
              key={selected.id}
              context="telemedicine"
              contextData={{ doctorName: selected.name, specialty: selected.specialty }}
              initialMessage={`Olá! Sou ${selected.name}, ${selected.specialty}. Use esta triagem rápida antes da consulta.`}
              placeholder="Descreva os seus sintomas..."
            />
          )}
        </div>
      </div>
    </div>
  );
}

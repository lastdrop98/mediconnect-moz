import { Phone, Siren, Ambulance, Flame, Shield, Car, HeartPulse, Droplet, Bandage, Brain, Wind, HeartHandshake } from "lucide-react";
import { IconBadge } from "@/components/IconBadge";

const NUMBERS = [
  { icon: Siren, label: "Emergência Geral", num: "112", gradient: "from-red-500 to-orange-500" },
  { icon: Ambulance, label: "Ambulância", num: "117", gradient: "from-pink-500 to-red-500" },
  { icon: Flame, label: "Bombeiros", num: "198", gradient: "from-orange-500 to-amber-500" },
  { icon: Shield, label: "Polícia", num: "119", gradient: "from-blue-500 to-indigo-500" },
  { icon: Car, label: "Trânsito", num: "800 198 198", gradient: "from-slate-500 to-slate-700" },
];

const FIRST_AID = [
  { icon: HeartPulse, gradient: "from-red-500 to-pink-500", title: "Paragem Cardíaca", text: "Inicie compressões torácicas a 100-120/min no centro do peito. Não pare até chegar ajuda. Ligue 112." },
  { icon: Droplet, gradient: "from-rose-500 to-red-500", title: "Hemorragias", text: "Faça pressão direta com pano limpo sobre a ferida. Eleve o membro. Não retire o pano se ficar embebido." },
  { icon: Flame, gradient: "from-orange-500 to-amber-500", title: "Queimaduras", text: "Lave com água corrente fria por 15-20 min. Não aplique gelo nem pasta de dentes. Cubra com pano limpo." },
  { icon: Brain, gradient: "from-indigo-500 to-purple-500", title: "Traumatismo Craniano", text: "Não mova a vítima. Mantenha-a quieta. Observe perda de consciência ou vómitos. Ligue 112." },
  { icon: Wind, gradient: "from-cyan-500 to-blue-500", title: "Engasgamento", text: "Manobra de Heimlich: 5 pancadas entre as omoplatas, depois 5 compressões abdominais." },
  { icon: Bandage, gradient: "from-green-500 to-emerald-500", title: "Fraturas", text: "Imobilize sem mover. Não tente reposicionar. Aplique gelo envolvido em pano. Procure socorro." },
];

export default function EmergencyPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 to-orange-500 text-white rounded-3xl p-8 shadow-elevated text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)] opacity-20" />
        <div className="relative">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-3 animate-float">
            <Siren className="w-10 h-10" />
          </div>
          <h2 className="font-display text-3xl font-extrabold">Emergência</h2>
          <p className="opacity-95 mt-1">Em caso de emergência médica, ligue imediatamente</p>
          <a href="tel:112" className="pulse-emergency inline-flex items-center gap-2 mt-5 bg-white text-destructive px-6 py-4 rounded-2xl font-extrabold text-lg shadow-elevated press">
            <Phone className="w-6 h-6" /> LIGAR 112 — EMERGÊNCIA
          </a>
        </div>
      </section>

      <div className="bg-card rounded-2xl p-5 shadow-card flex flex-wrap items-center gap-3">
        <IconBadge icon={Ambulance} gradient="from-red-500 to-pink-500" size="lg" />
        <div className="flex-1 min-w-[200px]">
          <div className="font-semibold">Solicitar Ambulância</div>
          <div className="text-sm text-muted-foreground">Equipa de emergência ao seu local</div>
        </div>
        <a href="tel:117" className="bg-destructive text-destructive-foreground px-5 py-2 rounded-xl font-semibold press flex items-center gap-2">
          <Phone className="w-4 h-4" /> Solicitar
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {NUMBERS.map((n) => (
          <a key={n.num} href={`tel:${n.num.replace(/\s/g, "")}`} className="bg-card rounded-2xl p-4 shadow-card text-center hover-lift press">
            <IconBadge icon={n.icon} gradient={n.gradient} size="md" className="mx-auto mb-2" />
            <div className="text-xs text-muted-foreground">{n.label}</div>
            <div className="font-display font-extrabold text-primary">{n.num}</div>
          </a>
        ))}
      </div>

      <h3 className="font-display font-bold text-lg flex items-center gap-2"><Bandage className="w-5 h-5 text-destructive" /> Primeiros Socorros</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIRST_AID.map((f, i) => (
          <div key={f.title} className="bg-card rounded-2xl p-5 shadow-card hover-lift animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
            <IconBadge icon={f.icon} gradient={f.gradient} size="md" className="mb-2" />
            <div className="font-semibold mb-2">{f.title}</div>
            <p className="text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-5 shadow-elevated flex flex-wrap items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><HeartHandshake className="w-6 h-6" /></div>
        <div className="flex-1">
          <div className="font-bold">Em crise emocional?</div>
          <div className="text-sm opacity-90">Linha de Apoio Psicossocial Gratuita</div>
        </div>
        <a href="tel:116" className="bg-white text-primary px-5 py-2 rounded-xl font-bold flex items-center gap-2 press">
          <Phone className="w-4 h-4" /> Ligar 116
        </a>
      </div>
    </div>
  );
}

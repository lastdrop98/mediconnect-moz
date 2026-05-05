import { Phone } from "lucide-react";

const NUMBERS = [
  { emoji: "🆘", label: "Emergência Geral", num: "112" },
  { emoji: "🚑", label: "Ambulância", num: "117" },
  { emoji: "🔥", label: "Bombeiros", num: "198" },
  { emoji: "🛡️", label: "Polícia", num: "119" },
  { emoji: "🚗", label: "Trânsito", num: "800 198 198" },
];

const FIRST_AID = [
  { emoji: "❤️", title: "Paragem Cardíaca", text: "Inicie compressões torácicas a 100-120/min no centro do peito. Não pare até chegar ajuda. Ligue 112." },
  { emoji: "🩸", title: "Hemorragias", text: "Faça pressão direta com pano limpo sobre a ferida. Eleve o membro. Não retire o pano se ficar embebido." },
  { emoji: "🔥", title: "Queimaduras", text: "Lave com água corrente fria por 15-20 min. Não aplique gelo nem pasta de dentes. Cubra com pano limpo." },
  { emoji: "🤕", title: "Traumatismo Craniano", text: "Não mova a vítima. Mantenha-a quieta. Observe perda de consciência ou vómitos. Ligue 112." },
  { emoji: "😮", title: "Engasgamento", text: "Manobra de Heimlich: 5 pancadas entre as omoplatas, depois 5 compressões abdominais." },
];

export default function EmergencyPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <section className="gradient-warm text-white rounded-2xl p-6 shadow-elevated text-center">
        <div className="text-5xl mb-2">🚨</div>
        <h2 className="font-display text-3xl font-extrabold">Emergência</h2>
        <p className="opacity-95 mt-1">Em caso de emergência médica, ligue imediatamente</p>
        <a href="tel:112" className="pulse-emergency inline-flex items-center gap-2 mt-4 bg-white text-destructive px-6 py-4 rounded-2xl font-extrabold text-lg shadow-elevated">
          <Phone className="w-6 h-6" /> LIGAR 112 — EMERGÊNCIA
        </a>
      </section>

      <div className="bg-card rounded-2xl p-5 shadow-card flex flex-wrap items-center gap-3">
        <div className="text-3xl">🚑</div>
        <div className="flex-1 min-w-[200px]">
          <div className="font-semibold">Solicitar Ambulância</div>
          <div className="text-sm text-muted-foreground">Equipa de emergência ao seu local</div>
        </div>
        <a href="tel:117" className="bg-destructive text-destructive-foreground px-5 py-2 rounded-xl font-semibold">Solicitar</a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {NUMBERS.map((n) => (
          <a key={n.num} href={`tel:${n.num.replace(/\s/g, "")}`} className="bg-card rounded-2xl p-4 shadow-card text-center hover:shadow-elevated transition-shadow">
            <div className="text-3xl mb-1">{n.emoji}</div>
            <div className="text-xs text-muted-foreground">{n.label}</div>
            <div className="font-display font-extrabold text-primary">{n.num}</div>
          </a>
        ))}
      </div>

      <h3 className="font-display font-bold text-lg">🚑 Primeiros Socorros</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIRST_AID.map((f) => (
          <div key={f.title} className="bg-card rounded-2xl p-5 shadow-card">
            <div className="text-3xl mb-2">{f.emoji}</div>
            <div className="font-semibold mb-2">{f.title}</div>
            <p className="text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>

      <div className="gradient-blue text-white rounded-2xl p-5 shadow-elevated flex flex-wrap items-center gap-3">
        <span className="text-3xl">💙</span>
        <div className="flex-1">
          <div className="font-bold">Em crise emocional?</div>
          <div className="text-sm opacity-90">Linha de Apoio Psicossocial Gratuita</div>
        </div>
        <a href="tel:116" className="bg-white text-primary px-5 py-2 rounded-xl font-bold">Ligar 116</a>
      </div>
    </div>
  );
}

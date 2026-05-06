import ChatWindow from "@/components/ChatWindow";
import { Brain, Stethoscope, Pill, Heart, Bandage } from "lucide-react";

const PILLS = [
  { icon: Stethoscope, label: "Verificar Sintomas" },
  { icon: Pill, label: "Medicamentos" },
  { icon: Heart, label: "Dicas de Saúde" },
  { icon: Bandage, label: "Primeiros Socorros" },
];

export default function AIPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-4 h-[calc(100vh-9rem)] flex flex-col animate-fade-in">
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl p-5 shadow-elevated">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 blur-3xl rounded-full" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center animate-float">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Assistente de Saúde IA</h2>
            <p className="text-sm opacity-90">Disponível 24/7 — em português</p>
          </div>
        </div>
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          {PILLS.map((p) => (
            <div key={p.label} className="bg-white/15 backdrop-blur rounded-xl px-3 py-2 text-sm font-semibold flex items-center gap-2">
              <p.icon className="w-4 h-4" /> {p.label}
            </div>
          ))}
        </div>
      </section>

      <div className="bg-warning/10 border border-warning/30 rounded-xl px-4 py-2 text-xs text-foreground">
        ⚠️ Este assistente fornece orientações educativas e de triagem. Não substitui consulta médica.
      </div>

      <div className="flex-1 min-h-0">
        <ChatWindow
          context="health_assistant"
          showTriage
          accent="purple"
          initialMessage="Olá! Sou o seu Assistente de Saúde IA. Posso ajudá-lo a entender sintomas, dar dicas de saúde e orientar sobre quando procurar um médico. Como posso ajudar hoje?"
          placeholder="Descreva o que está a sentir..."
        />
      </div>
    </div>
  );
}

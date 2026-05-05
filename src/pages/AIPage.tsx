import ChatWindow from "@/components/ChatWindow";

const PILLS = [
  { emoji: "🩺", label: "Verificar Sintomas", prompt: "Estou com alguns sintomas. Pode ajudar-me a perceber?" },
  { emoji: "💊", label: "Medicamentos", prompt: "Tenho dúvidas sobre um medicamento." },
  { emoji: "❤️", label: "Dicas de Saúde", prompt: "Dê-me dicas para melhorar a minha saúde." },
  { emoji: "🚑", label: "Primeiros Socorros", prompt: "Como prestar primeiros socorros básicos?" },
];

export default function AIPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-4 h-[calc(100vh-9rem)] flex flex-col">
      <section className="gradient-purple text-white rounded-2xl p-5 shadow-elevated">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          <div>
            <h2 className="font-display text-xl font-bold">Assistente de Saúde IA</h2>
            <p className="text-sm opacity-90">Disponível 24/7 — em português</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          {PILLS.map((p) => (
            <div key={p.label} className="bg-white/15 backdrop-blur rounded-xl px-3 py-2 text-sm font-semibold flex items-center gap-1.5">
              <span>{p.emoji}</span> {p.label}
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

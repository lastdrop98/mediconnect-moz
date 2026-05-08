import { MessageSquare } from "lucide-react";

export default function DoctorMessagesPage() {
  return (
    <div className="max-w-3xl mx-auto bg-card rounded-2xl p-10 shadow-card text-center">
      <MessageSquare className="w-12 h-12 mx-auto text-primary mb-3" />
      <h3 className="font-display font-bold text-xl">Mensagens com pacientes</h3>
      <p className="text-sm text-muted-foreground mt-2">Sem conversas activas. Quando um paciente lhe enviar uma mensagem, ela aparecerá aqui.</p>
    </div>
  );
}

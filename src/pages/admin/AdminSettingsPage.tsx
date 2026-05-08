import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl mx-auto bg-card rounded-2xl p-10 shadow-card text-center">
      <Settings className="w-12 h-12 mx-auto text-violet-600 mb-3" />
      <h3 className="font-display font-bold text-xl">Definições da Plataforma</h3>
      <p className="text-sm text-muted-foreground mt-2">Aqui poderá configurar comissões, métodos de pagamento, integrações e regras gerais.</p>
    </div>
  );
}

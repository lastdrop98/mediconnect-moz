import { Crown, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ReactNode } from "react";

type Props = { feature: string; children: ReactNode; allowFamilyOnly?: boolean };

export default function PremiumGate({ feature, children, allowFamilyOnly }: Props) {
  const { profile, setPage } = useApp();
  const plan = profile?.plan ?? "free";
  const ok = allowFamilyOnly ? plan === "family" : (plan === "essential" || plan === "family");
  if (ok) return <>{children}</>;
  return (
    <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 shadow-card text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mx-auto flex items-center justify-center text-white shadow-elevated">
        <Crown className="w-8 h-8" />
      </div>
      <h2 className="font-display font-bold text-2xl mt-4">Upgrade necessário</h2>
      <p className="text-muted-foreground mt-2">
        Para aceder a <strong>{feature}</strong>, precisa de um plano {allowFamilyOnly ? "Família" : "Essencial ou Família"}.
      </p>
      <button onClick={() => setPage("pagamentos")}
        className="mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-primary to-success text-white font-semibold px-5 py-2.5 rounded-xl shadow-soft press">
        <Sparkles className="w-4 h-4" /> Ver Planos
      </button>
    </div>
  );
}

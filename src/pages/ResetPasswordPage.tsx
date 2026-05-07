import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HeartPulse, Loader2, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts a session into URL hash on recovery; auth client picks it up automatically.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) return toast.error("As senhas não coincidem");
    if (password.length < 6) return toast.error("Senha deve ter pelo menos 6 caracteres");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Senha redefinida com sucesso!");
    nav("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-elevated p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div className="font-display font-extrabold">MediConnect</div>
        </div>
        <h1 className="font-display text-2xl font-extrabold mb-1">Nova senha</h1>
        <p className="text-sm text-muted-foreground mb-6">Defina uma nova senha para a sua conta.</p>
        {!ready ? (
          <p className="text-sm text-muted-foreground">A validar link...</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nova senha" className="w-full bg-muted rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" required value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Confirmar nova senha" className="w-full bg-muted rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold press flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Redefinir senha
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

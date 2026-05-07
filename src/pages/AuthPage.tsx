import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HeartPulse, Loader2, Mail, Lock, User, Phone } from "lucide-react";

type Mode = "login" | "register" | "forgot";

export default function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Bem-vindo de volta!");
    nav("/", { replace: true });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) return toast.error("As senhas não coincidem");
    if (password.length < 6) return toast.error("Senha deve ter pelo menos 6 caracteres");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName, phone },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada! Verifique o seu email para confirmar.");
    setMode("login");
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Link de recuperação enviado!");
    setMode("login");
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { setLoading(false); toast.error("Falha ao iniciar sessão com Google"); return; }
    if (result.redirected) return;
    nav("/", { replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <aside className="hidden lg:flex relative overflow-hidden gradient-hero text-white p-10 flex-col justify-between">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display font-extrabold text-xl">MediConnect</div>
            <div className="text-xs opacity-90">Saúde Digital para Todos</div>
          </div>
        </div>
        <div className="relative">
          <h2 className="font-display text-4xl font-extrabold leading-tight">Cuidados de saúde, sem fronteiras.</h2>
          <p className="opacity-90 mt-3 max-w-md">
            Telemedicina, agendamento, farmácia digital, apoio psicológico e muito mais — tudo num só lugar, em Moçambique.
          </p>
        </div>
        <div className="relative text-xs opacity-80">© MediConnect Moçambique • Saúde para todos</div>
      </aside>

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card rounded-3xl shadow-elevated p-8 animate-scale-in">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div className="font-display font-extrabold">MediConnect</div>
          </div>

          <h1 className="font-display text-2xl font-extrabold mb-1">
            {mode === "login" && "Iniciar sessão"}
            {mode === "register" && "Criar conta"}
            {mode === "forgot" && "Recuperar senha"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login" && "Bem-vindo de volta. Aceda à sua conta."}
            {mode === "register" && "Comece a cuidar da sua saúde hoje."}
            {mode === "forgot" && "Enviaremos um link para redefinir."}
          </p>

          {mode !== "forgot" && (
            <button onClick={handleGoogle} disabled={loading}
              className="w-full border border-border rounded-xl py-2.5 font-semibold flex items-center justify-center gap-2 hover:bg-muted press mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
              Continuar com Google
            </button>
          )}

          {mode !== "forgot" && (
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">ou com email</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}

          <form onSubmit={mode === "login" ? handleLogin : mode === "register" ? handleRegister : handleForgot} className="space-y-3">
            {mode === "register" && (
              <>
                <Field icon={User} placeholder="Nome completo" value={fullName} onChange={setFullName} required />
                <Field icon={Phone} placeholder="Telefone (+258...)" value={phone} onChange={setPhone} type="tel" />
              </>
            )}
            <Field icon={Mail} placeholder="Email" value={email} onChange={setEmail} type="email" required />
            {mode !== "forgot" && (
              <Field icon={Lock} placeholder="Senha" value={password} onChange={setPassword} type="password" required />
            )}
            {mode === "register" && (
              <Field icon={Lock} placeholder="Confirmar senha" value={password2} onChange={setPassword2} type="password" required />
            )}

            {mode === "login" && (
              <div className="text-right">
                <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline">
                  Esqueci a senha
                </button>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold press flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" && "Entrar"}
              {mode === "register" && "Criar conta"}
              {mode === "forgot" && "Enviar link"}
            </button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-5">
            {mode === "login" && (
              <>Não tem conta? <button onClick={() => setMode("register")} className="text-primary font-semibold hover:underline">Criar conta</button></>
            )}
            {mode === "register" && (
              <>Já tem conta? <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">Iniciar sessão</button></>
            )}
            {mode === "forgot" && (
              <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">Voltar ao login</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ icon: Icon, placeholder, value, onChange, type = "text", required }: any) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full bg-muted rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

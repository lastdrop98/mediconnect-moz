import { useMemo, useState } from "react";
import { useApp, Plan } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Smartphone, CreditCard, Wallet, Banknote, Check, HeartHandshake, Loader2,
  Receipt, X, ShieldCheck, Crown,
} from "lucide-react";

const PLANS: { id: Plan; name: string; price: number; popular?: boolean; features: string[]; missing: string[]; gradient: string }[] = [
  { id: "free", name: "Gratuito", price: 0, gradient: "from-slate-500 to-slate-700",
    features: ["Apoio Psicológico IA (ilimitado)", "Assistente IA (3/dia)", "Edu-Saúde", "Emergência e mapa básico", "Saúde Materna (básico)"],
    missing: ["Telemedicina com médico real", "Agendamento ilimitado", "Farmácia Digital completa", "Histórico médico completo"] },
  { id: "essential", name: "Essencial", price: 299, popular: true, gradient: "from-blue-500 to-cyan-500",
    features: ["Tudo do Gratuito", "2 telemedicinas/mês", "Agendamento ilimitado", "Farmácia Digital completa", "Histórico médico completo", "Lembretes de medicação", "Relatórios PDF"],
    missing: ["Consultas físicas com desconto", "Prioridade nas marcações"] },
  { id: "family", name: "Família", price: 599, gradient: "from-violet-600 to-purple-600",
    features: ["Tudo do Essencial", "Até 4 membros", "5 telemedicinas/mês", "Saúde Materna completa", "15% desconto em consultas físicas", "Prioridade nas marcações", "Suporte 24h"], missing: [] },
];

const METHODS = [
  { id: "mpesa", icon: Smartphone, label: "M-Pesa", color: "text-red-600", needsPhone: true, prefix: "84/85" },
  { id: "emola", icon: Smartphone, label: "eMola", color: "text-orange-600", needsPhone: true, prefix: "86/87" },
  { id: "mkesh", icon: Wallet, label: "Mkesh", color: "text-pink-600", needsPhone: true, prefix: "82/83" },
  { id: "card", icon: CreditCard, label: "Cartão", color: "text-blue-600", needsPhone: false },
  { id: "cash", icon: Banknote, label: "Dinheiro", color: "text-green-600", needsPhone: false },
] as const;
type MethodId = typeof METHODS[number]["id"];

const planLabel = (p: Plan) => PLANS.find((x) => x.id === p)?.name ?? p;
const genReference = () =>
  "MC" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();

type PaymentIntent = {
  type: "subscription" | "consultation" | "donation";
  amount: number;
  description: string;
  plan?: Plan;
};

type Stage = "idle" | "phone" | "sending" | "confirming" | "success" | "error";

export default function PaymentsPage() {
  const { user, profile, transactions, refreshTransactions, refreshProfile } = useApp();
  const plan: Plan = (profile?.plan as Plan) ?? "free";
  const [method, setMethod] = useState<MethodId>("mpesa");
  const [filter, setFilter] = useState<string>("all");

  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [reference, setReference] = useState("");
  const methodCfg = METHODS.find((m) => m.id === method)!;

  const stats = useMemo(() => {
    const completed = transactions.filter((t) => t.status === "completed");
    const pending = transactions.filter((t) => t.status === "pending");
    return [
      { label: "Total Pago", value: completed.reduce((a, b) => a + Number(b.amount_mzn), 0), color: "text-success", money: true },
      { label: "Pendente", value: pending.reduce((a, b) => a + Number(b.amount_mzn), 0), color: "text-warning", money: true },
      { label: "Transações", value: transactions.length, color: "text-primary" },
      { label: "Concluídas", value: completed.length, color: "text-accent" },
    ];
  }, [transactions]);

  const filteredTx = filter === "all" ? transactions : transactions.filter((t) => t.method === filter);

  const openCheckout = (i: PaymentIntent) => {
    if (!user) { toast.error("Inicie sessão"); return; }
    setIntent(i); setStage("phone"); setPhone("");
  };

  const cancelCheckout = () => { setIntent(null); setStage("idle"); };

  const runMpesaFlow = async () => {
    if (!intent || !user) return;
    if (methodCfg.needsPhone) {
      const clean = phone.replace(/\s/g, "");
      if (!/^(8[2-7])\d{7}$/.test(clean)) {
        toast.error(`Número inválido. Use formato ${methodCfg.prefix}XXXXXXX`);
        return;
      }
    }
    const ref = genReference();
    setReference(ref);

    // Insert pending transaction immediately
    const { error: insErr } = await supabase.from("transactions").insert({
      user_id: user.id, type: intent.type, amount_mzn: intent.amount,
      method, status: "pending", description: intent.description, reference: ref,
    });
    if (insErr) { toast.error("Erro ao iniciar pagamento"); console.error(insErr); return; }
    await refreshTransactions();

    setStage("sending");
    await new Promise((r) => setTimeout(r, 3000));
    setStage("confirming");
    await new Promise((r) => setTimeout(r, 2000));

    // Mark transaction completed
    const { error: upErr } = await supabase.from("transactions")
      .update({ status: "completed" }).eq("reference", ref);
    if (upErr) { setStage("error"); toast.error("Falha ao confirmar"); return; }

    // If subscription, update profile
    if (intent.type === "subscription" && intent.plan) {
      const expires = new Date(); expires.setMonth(expires.getMonth() + 1);
      await supabase.from("profiles").update({
        plan: intent.plan, subscription_expires_at: expires.toISOString(),
      }).eq("id", user.id);
      await refreshProfile();
    }
    await refreshTransactions();
    setStage("success");
  };

  const subscribe = async (p: Plan, price: number) => {
    if (!user) return;
    if (price === 0) {
      await supabase.from("profiles").update({ plan: "free", subscription_expires_at: null }).eq("id", user.id);
      await refreshProfile();
      toast.success("Plano Gratuito ativo");
      return;
    }
    openCheckout({ type: "subscription", amount: price, description: `Plano ${planLabel(p)}`, plan: p });
  };

  const contribute = (n: number) => {
    if (!user || !n || n <= 0) return;
    openCheckout({ type: "donation", amount: n, description: "Fundo MediConnect Solidário" });
  };

  const expiresLabel = profile?.subscription_expires_at
    ? new Date(profile.subscription_expires_at).toLocaleDateString("pt-PT")
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2"><CreditCard className="w-6 h-6 text-primary" /> Pagamentos & Planos</h2>
          <p className="text-muted-foreground">Escolha o plano que se adapta a si</p>
        </div>
        <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
          <Crown className="w-4 h-4 text-amber-500" />
          <span>Plano actual: <strong>{planLabel(plan)}</strong></span>
          {expiresLabel && <span className="text-muted-foreground">· renova {expiresLabel}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 shadow-card hover-lift">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className={cn("text-2xl font-display font-bold mt-1", s.color)}>
              {s.money ? `${(s.value as number).toLocaleString()} MZN` : s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((p) => (
          <div key={p.id} className={cn("relative bg-card rounded-2xl p-5 shadow-card hover-lift", p.popular && "border-2 border-primary", plan === p.id && "ring-2 ring-success")}>
            {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">MAIS POPULAR</span>}
            <div className={cn("w-12 h-12 rounded-xl mb-3 bg-gradient-to-br flex items-center justify-center text-white", p.gradient)}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="font-display font-bold text-lg">{p.name}</div>
            <div className="font-display text-3xl font-extrabold mt-1">{p.price === 0 ? "Grátis" : `${p.price} MZN`}<span className="text-sm font-normal text-muted-foreground">{p.price > 0 && "/mês"}</span></div>
            <ul className="mt-4 space-y-1 text-sm">
              {p.features.map((f, i) => <li key={i} className="flex items-start gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" />{f}</li>)}
              {p.missing.map((f, i) => <li key={i} className="text-muted-foreground flex items-start gap-2"><span className="w-4 inline-block">×</span>{f}</li>)}
            </ul>
            <button onClick={() => subscribe(p.id, p.price)} disabled={plan === p.id}
              className={cn("w-full mt-3 rounded-xl py-2.5 font-semibold press flex items-center justify-center gap-2",
                plan === p.id ? "bg-success/20 text-success cursor-default" :
                p.popular ? "bg-primary text-primary-foreground" : "bg-card border border-border")}>
              {plan === p.id ? "✓ Plano Atual" : `Assinar com ${methodCfg.label}`}
            </button>
          </div>
        ))}
      </div>

      <section className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="font-display font-bold mb-3">Métodos de Pagamento</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {METHODS.map((m) => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={cn("p-3 rounded-xl border-2 text-center text-sm font-semibold press transition-all",
                method === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
              <m.icon className={cn("w-6 h-6 mx-auto mb-1", m.color)} />{m.label}
            </button>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-elevated">
        <div className="absolute -right-6 -bottom-6 opacity-20"><HeartHandshake className="w-40 h-40" /></div>
        <div className="relative flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center"><HeartHandshake className="w-7 h-7" /></div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-xl">Fundo MediConnect Solidário</h3>
            <p className="opacity-95 text-sm mt-1">Em Moçambique, milhares não podem pagar uma consulta. Você pode ajudar.</p>
            <div className="bg-white/20 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-white h-full transition-all duration-1000" style={{ width: "63%" }} />
            </div>
            <div className="text-sm mt-1">127 consultas gratuitas financiadas este mês</div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <button onClick={() => contribute(50)} className="bg-white text-success-dark rounded-xl px-4 py-2 font-semibold text-sm press">Contribuir 50 MZN</button>
              <button onClick={() => contribute(100)} className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 font-semibold text-sm press">100 MZN</button>
              <button onClick={() => { const v = prompt("Valor a contribuir (MZN):"); contribute(Number(v)); }} className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 font-semibold text-sm press">Outro valor</button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-display font-bold flex items-center gap-2"><Receipt className="w-5 h-5 text-primary" /> Histórico de Transações</h3>
          <div className="flex gap-1 text-xs flex-wrap">
            {[["all", "Todos"], ["mpesa", "M-Pesa"], ["emola", "eMola"], ["mkesh", "Mkesh"], ["card", "Cartão"]].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} className={cn("px-3 py-1 rounded-lg font-semibold press", filter === k ? "bg-primary text-primary-foreground" : "bg-muted")}>{l}</button>
            ))}
          </div>
        </div>
        {filteredTx.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="w-10 h-10 mx-auto mb-2 opacity-50" />Nenhuma transação ainda
          </div>
        ) : (
          <div className="space-y-2">{filteredTx.map((t) => (
            <div key={t.id} className="flex items-center justify-between bg-muted rounded-xl p-3 hover-lift">
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{t.description}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {new Date(t.created_at).toLocaleDateString("pt-PT")} · {t.method.toUpperCase()} · ref {t.reference}
                </div>
              </div>
              <div className="text-right pl-3">
                <div className="font-bold">{Number(t.amount_mzn).toLocaleString()} MZN</div>
                <div className={cn("text-xs capitalize font-semibold",
                  t.status === "completed" && "text-success",
                  t.status === "pending" && "text-warning",
                  t.status === "failed" && "text-destructive")}>{t.status}</div>
              </div>
            </div>
          ))}</div>
        )}
      </section>

      {/* Checkout Modal */}
      {intent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-elevated max-w-md w-full overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-border flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", "from-primary to-success")}>
                <methodCfg.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-display font-bold">Pagar com {methodCfg.label}</div>
                <div className="text-xs text-muted-foreground">{intent.description}</div>
              </div>
              {stage !== "sending" && stage !== "confirming" && (
                <button onClick={cancelCheckout} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
              )}
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Valor a pagar</span>
                <span className="font-display font-extrabold text-3xl">{intent.amount.toLocaleString()} <span className="text-base text-muted-foreground">MZN</span></span>
              </div>

              {stage === "phone" && (
                <>
                  {methodCfg.needsPhone ? (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Número {methodCfg.label} ({methodCfg.prefix})</label>
                      <input
                        autoFocus value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder="84 000 0000"
                        className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-success" /> Receberá um pedido de confirmação no telemóvel.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Confirme para prosseguir.</p>
                  )}
                  <div className="flex gap-2">
                    <button onClick={cancelCheckout} className="flex-1 py-2.5 rounded-xl border border-border font-semibold press">Cancelar</button>
                    <button onClick={runMpesaFlow} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold press">
                      Pagar {intent.amount} MZN
                    </button>
                  </div>
                </>
              )}

              {stage === "sending" && (
                <div className="text-center py-4 space-y-3">
                  <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                  <div className="font-semibold">A enviar pedido de pagamento…</div>
                  <div className="text-xs text-muted-foreground">Ref: {reference}</div>
                </div>
              )}

              {stage === "confirming" && (
                <div className="text-center py-4 space-y-3 animate-fade-in">
                  <div className="w-12 h-12 mx-auto rounded-full bg-success/15 text-success flex items-center justify-center text-2xl">✅</div>
                  <div className="font-semibold">Confirmação enviada para {methodCfg.needsPhone ? phone : "o seu dispositivo"}</div>
                  <div className="text-xs text-muted-foreground">A aguardar autorização…</div>
                </div>
              )}

              {stage === "success" && (
                <div className="text-center py-4 space-y-3 animate-fade-in">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-success to-emerald-600 text-white flex items-center justify-center text-3xl shadow-elevated">✓</div>
                  <div className="font-display font-bold text-lg">Pagamento confirmado!</div>
                  <div className="text-sm text-muted-foreground">{intent.amount.toLocaleString()} MZN · Ref {reference}</div>
                  <button onClick={cancelCheckout} className="w-full mt-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold press">
                    Concluir
                  </button>
                </div>
              )}

              {stage === "error" && (
                <div className="text-center py-4 space-y-3">
                  <div className="text-destructive font-semibold">Falha no pagamento</div>
                  <button onClick={() => setStage("phone")} className="w-full py-2.5 rounded-xl border border-border font-semibold press">Tentar novamente</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

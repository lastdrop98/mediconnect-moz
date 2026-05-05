import { useState } from "react";
import { useApp, Plan } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PLANS: { id: Plan; name: string; price: number; popular?: boolean; features: string[]; missing: string[] }[] = [
  { id: "gratuito", name: "Gratuito", price: 0,
    features: ["Apoio Psicológico IA (ilimitado)", "Assistente IA (3/dia)", "Edu-Saúde", "Emergência e mapa básico", "Saúde Materna (básico)"],
    missing: ["Telemedicina com médico real", "Agendamento de consultas", "Farmácia Digital completa", "Histórico médico completo"] },
  { id: "essencial", name: "Essencial", price: 299, popular: true,
    features: ["Tudo do Gratuito", "2 telemedicinas/mês", "Agendamento ilimitado", "Farmácia Digital completa", "Histórico médico completo", "Lembretes de medicação", "Relatórios PDF"],
    missing: ["Consultas físicas com desconto", "Prioridade nas marcações"] },
  { id: "familia", name: "Família", price: 599,
    features: ["Tudo do Essencial", "Até 4 membros", "5 telemedicinas/mês", "Saúde Materna completa", "15% desconto em consultas físicas", "Prioridade nas marcações", "Suporte 24h"], missing: [] },
];

const METHODS = [
  { id: "mpesa", emoji: "📱", label: "M-Pesa" },
  { id: "emola", emoji: "📲", label: "eMola" },
  { id: "mkesh", emoji: "💳", label: "Mkesh" },
  { id: "card", emoji: "💳", label: "Cartão" },
  { id: "cash", emoji: "💵", label: "Dinheiro" },
];

export default function PaymentsPage() {
  const { plan, setPlan, transactions, addTransaction } = useApp();
  const [method, setMethod] = useState("mpesa");
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState("all");

  const subscribe = (p: Plan, price: number) => {
    if (price === 0) { setPlan(p); toast.success("Plano Gratuito ativo"); return; }
    if (!phone && method === "mpesa") { toast.error("Insira o número M-Pesa"); return; }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPlan(p);
      addTransaction({ id: `tx-${Date.now()}`, date: new Date().toLocaleDateString("pt-PT"), type: "assinatura", description: `Plano ${PLANS.find(x => x.id === p)?.name}`, amountMzn: price, status: "Concluída" });
      toast.success(`✅ Pagamento de ${price} MZN confirmado via ${METHODS.find(m => m.id === method)?.label}!`);
    }, 3000);
  };

  const stats = [
    { label: "Total Pago", value: transactions.filter(t => t.status === "Concluída").reduce((a, b) => a + b.amountMzn, 0), color: "text-success" },
    { label: "Pendente", value: transactions.filter(t => t.status === "Pendente").reduce((a, b) => a + b.amountMzn, 0), color: "text-warning" },
    { label: "Transações", value: transactions.length, color: "text-primary" },
    { label: "Concluídas", value: transactions.filter(t => t.status === "Concluída").length, color: "text-accent" },
  ];

  const filteredTx = filter === "all" ? transactions : transactions.filter(t => t.type === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">💳 Pagamentos & Planos</h2>
        <p className="text-muted-foreground">Escolha o plano que se adapta a si</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className={cn("text-2xl font-display font-bold mt-1", s.color)}>{typeof s.value === "number" && s.label !== "Transações" && s.label !== "Concluídas" ? `${s.value.toLocaleString()} MZN` : s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((p) => (
          <div key={p.id} className={cn("bg-card rounded-2xl p-5 shadow-card relative", p.popular && "border-2 border-primary", plan === p.id && "ring-2 ring-success")}>
            {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">MAIS POPULAR</span>}
            <div className="font-display font-bold text-lg">{p.name}</div>
            <div className="font-display text-3xl font-extrabold mt-1">{p.price === 0 ? "Grátis" : `${p.price} MZN`}<span className="text-sm font-normal text-muted-foreground">{p.price > 0 && "/mês"}</span></div>
            <ul className="mt-4 space-y-1 text-sm">
              {p.features.map((f, i) => <li key={i}>✅ {f}</li>)}
              {p.missing.map((f, i) => <li key={i} className="text-muted-foreground">❌ {f}</li>)}
            </ul>
            <div className="mt-4 bg-pink/10 text-pink rounded-xl p-2 text-xs">💙 Parte do seu pagamento financia consultas gratuitas para quem não pode pagar</div>
            <button onClick={() => subscribe(p.id, p.price)} disabled={plan === p.id || processing}
              className={cn("w-full mt-3 rounded-xl py-2.5 font-semibold",
                plan === p.id ? "bg-success/20 text-success cursor-default" :
                p.popular ? "bg-primary text-primary-foreground" : "bg-card border border-border")}>
              {plan === p.id ? "✓ Plano Atual" : `Assinar com ${METHODS.find(m => m.id === method)?.label}`}
            </button>
          </div>
        ))}
      </div>

      <section className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="font-display font-bold mb-3">Métodos de Pagamento</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          {METHODS.map((m) => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={cn("p-3 rounded-xl border-2 text-center text-sm font-semibold",
                method === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
              <div className="text-2xl">{m.emoji}</div>{m.label}
            </button>
          ))}
        </div>
        {method === "mpesa" && (
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <label className="text-sm font-semibold">Número M-Pesa</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="84 000 0000" className="w-full bg-card rounded-xl px-3 py-2 text-sm focus:outline-none" />
            <p className="text-xs text-muted-foreground">{processing ? "📲 A enviar SMS de confirmação..." : "Receberá um SMS para confirmar o pagamento."}</p>
          </div>
        )}
        {method === "card" && (
          <div className="bg-muted rounded-xl p-4 grid grid-cols-2 gap-2">
            <input placeholder="Número do cartão" className="col-span-2 bg-card rounded-xl px-3 py-2 text-sm focus:outline-none" />
            <input placeholder="MM/AA" className="bg-card rounded-xl px-3 py-2 text-sm focus:outline-none" />
            <input placeholder="CVV" className="bg-card rounded-xl px-3 py-2 text-sm focus:outline-none" />
            <input placeholder="Nome no cartão" className="col-span-2 bg-card rounded-xl px-3 py-2 text-sm focus:outline-none" />
          </div>
        )}
      </section>

      <section className="gradient-green text-white rounded-2xl p-6 shadow-elevated">
        <div className="flex items-start gap-3">
          <span className="text-4xl">🤝</span>
          <div className="flex-1">
            <h3 className="font-display font-bold text-xl">Fundo MediConnect Solidário</h3>
            <p className="opacity-95 text-sm mt-1">Em Moçambique, milhares de pessoas não podem pagar uma consulta médica. Você pode ajudar.</p>
            <div className="bg-white/20 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-white h-full" style={{ width: "63%" }} />
            </div>
            <div className="text-sm mt-1">127 consultas gratuitas financiadas este mês</div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <button onClick={() => { addTransaction({ id: `tx-${Date.now()}`, date: new Date().toLocaleDateString("pt-PT"), type: "contribuicao", description: "Fundo Solidário", amountMzn: 50, status: "Concluída" }); toast.success("Obrigado pela sua contribuição 💚"); }} className="bg-white text-success-dark rounded-xl px-4 py-2 font-semibold text-sm">Contribuir 50 MZN</button>
              <button className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 font-semibold text-sm">Outro valor</button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-display font-bold">Histórico de Transações</h3>
          <div className="flex gap-1 text-xs">
            {[["all", "Todos"], ["consulta", "Consultas"], ["assinatura", "Assinaturas"], ["contribuicao", "Contribuições"]].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} className={cn("px-3 py-1 rounded-lg font-semibold", filter === k ? "bg-primary text-primary-foreground" : "bg-muted")}>{l}</button>
            ))}
          </div>
        </div>
        {filteredTx.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground"><div className="text-4xl mb-2">💸</div>Nenhuma transação ainda</div>
        ) : (
          <div className="space-y-2">{filteredTx.map((t) => (
            <div key={t.id} className="flex items-center justify-between bg-muted rounded-xl p-3">
              <div><div className="font-semibold text-sm">{t.description}</div><div className="text-xs text-muted-foreground">{t.date} • {t.type}</div></div>
              <div className="text-right"><div className="font-bold">{t.amountMzn} MZN</div><div className="text-xs text-success">{t.status}</div></div>
            </div>
          ))}</div>
        )}
      </section>
    </div>
  );
}

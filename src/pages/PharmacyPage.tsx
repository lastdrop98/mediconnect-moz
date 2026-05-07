import { useState } from "react";
import { MEDICATIONS, MED_CATEGORIES } from "@/data/medications";

import { Search, MapPin, Phone, Camera, Pill, ShoppingCart, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_BADGE = {
  available: { label: "Disponível", className: "bg-success/15 text-success-dark", dot: "bg-success" },
  limited: { label: "Estoque limitado", className: "bg-warning/15 text-warning", dot: "bg-warning" },
  out: { label: "Em falta", className: "bg-destructive/15 text-destructive", dot: "bg-destructive" },
};

const CATEGORY_ICON: Record<string, string> = {
  Analgésicos: "💊", Antimaláricos: "🦟", Antibióticos: "💉", Hipertensão: "❤️",
  "HIV/SIDA": "🩸", Febre: "🌡️", Maternidade: "🤰", Diabetes: "🍬", Sono: "😴",
};

export default function PharmacyPage() {
  const [cart, setCart] = useState(0);
  const addToCart = () => setCart((c) => c + 1);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [recipeOpen, setRecipeOpen] = useState(false);

  const filtered = MEDICATIONS.filter((m) =>
    (!q || m.name.toLowerCase().includes(q.toLowerCase()) || m.generic.toLowerCase().includes(q.toLowerCase())) &&
    (!cat || m.category === cat)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-elevated">
        <div className="absolute -right-8 -top-8 opacity-20"><Pill className="w-40 h-40" /></div>
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2"><Pill className="w-6 h-6" /> Farmácia Digital</h2>
            <p className="opacity-90 mt-1 max-w-xl">Verifique antes de sair de casa — encontre seus medicamentos nas farmácias próximas.</p>
          </div>
          <button className="bg-white/20 backdrop-blur rounded-xl px-3 py-2 flex items-center gap-2 press">
            <ShoppingCart className="w-4 h-4" /> Carrinho ({cart})
          </button>
        </div>
      </section>

      <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar medicamento (ex: paracetamol)..." className="flex-1 bg-transparent focus:outline-none" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button onClick={() => setCat(null)} className={cn("px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap press", !cat ? "bg-primary text-primary-foreground shadow-soft" : "bg-card hover:bg-muted")}>Todos</button>
        {MED_CATEGORIES.map((c) => (
          <button key={c.label} onClick={() => setCat(c.label)} className={cn("px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 press", cat === c.label ? "bg-primary text-primary-foreground shadow-soft" : "bg-card hover:bg-muted")}>
            <span>{CATEGORY_ICON[c.label] ?? "💊"}</span>{c.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((m, i) => {
          const b = STATUS_BADGE[m.status];
          return (
            <div key={m.id} className="bg-card rounded-2xl p-4 shadow-card hover-lift animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold">{m.generic}</div>
                    <div className="text-xs text-muted-foreground">{m.name} • {m.indication}</div>
                  </div>
                </div>
                <span className={cn("text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap flex items-center gap-1.5", b.className)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", b.dot)} /> {b.label}
                </span>
              </div>
              <div className="text-primary font-bold mb-2">{m.priceMzn === 0 ? "Gratuito (SNS)" : `${m.priceMzn} MZN`}</div>
              {m.pharmacies.length > 0 ? (
                <div className="space-y-1 mb-3">
                  {m.pharmacies.map((p) => (
                    <div key={p.name} className="text-sm flex justify-between bg-muted rounded-lg px-3 py-1.5">
                      <span>{p.name}</span><span className="text-muted-foreground">{p.distanceKm} km</span>
                    </div>
                  ))}
                </div>
              ) : <div className="text-sm text-muted-foreground bg-destructive/10 rounded-lg px-3 py-2 mb-3">Sem stock nas farmácias próximas.</div>}
              <div className="flex gap-2">
                <button
                  onClick={() => { addToCart(); toast.success(`${m.generic} adicionado ao carrinho`); }}
                  disabled={m.status === "out"}
                  className="flex-1 bg-primary text-primary-foreground rounded-xl py-2 text-sm font-semibold flex items-center justify-center gap-1 disabled:opacity-50 press"
                >
                  <ShoppingCart className="w-4 h-4" /> Adicionar
                </button>
                <button onClick={() => toast.success("A abrir mapa...")} className="border border-border rounded-xl px-3 py-2 text-sm font-semibold press hover:bg-muted">
                  <MapPin className="w-4 h-4" />
                </button>
                <a href="tel:+258840000000" className="border border-border rounded-xl px-3 py-2 text-sm font-semibold press hover:bg-muted">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <section className="bg-destructive/10 border border-destructive/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center text-destructive shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-destructive">Atenção: medicamentos no mercado informal</h3>
            <p className="text-sm mt-1">Medicamentos vendidos na rua podem ser falsificados, expirados ou mal conservados. Compre apenas em farmácias licenciadas.</p>
          </div>
          <button onClick={() => toast("Saber mais sobre medicamentos seguros")} className="bg-destructive text-destructive-foreground px-4 py-2 rounded-xl text-sm font-semibold press">Saiba mais</button>
        </div>
      </section>

      <section className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="font-display font-bold mb-1 flex items-center gap-2"><Camera className="w-5 h-5 text-primary" /> Receita Digital</h3>
        <p className="text-sm text-muted-foreground mb-3">Fotografe a sua receita médica e a IA verifica disponibilidade dos medicamentos.</p>
        <button onClick={() => setRecipeOpen(true)} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 font-semibold flex items-center gap-2 press">
          <Camera className="w-4 h-4" /> Fotografar Receita
        </button>
      </section>

      {recipeOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setRecipeOpen(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-lg">📋 Receita Detectada</h3>
              <button onClick={() => setRecipeOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-muted rounded-xl p-4 space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span>Paracetamol 500mg</span><CheckCircle2 className="w-4 h-4 text-success" /></div>
              <div className="flex justify-between"><span>Amoxicilina 500mg</span><CheckCircle2 className="w-4 h-4 text-warning" /></div>
              <div className="flex justify-between"><span>Sulfato Ferroso</span><CheckCircle2 className="w-4 h-4 text-success" /></div>
            </div>
            <button onClick={() => { setRecipeOpen(false); toast.success("Medicamentos adicionados ao carrinho"); addToCart(); addToCart(); addToCart(); }} className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold press">
              Adicionar todos ao carrinho
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

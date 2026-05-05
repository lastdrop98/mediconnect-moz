import { useState } from "react";
import { MEDICATIONS, MED_CATEGORIES } from "@/data/medications";
import { Search, MapPin, Phone, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_BADGE = {
  available: { label: "🟢 Disponível", className: "bg-success/15 text-success-dark" },
  limited: { label: "🟡 Estoque limitado", className: "bg-warning/15 text-warning" },
  out: { label: "🔴 Em falta", className: "bg-destructive/15 text-destructive" },
};

export default function PharmacyPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const filtered = MEDICATIONS.filter((m) =>
    (!q || m.name.toLowerCase().includes(q.toLowerCase()) || m.generic.toLowerCase().includes(q.toLowerCase())) &&
    (!cat || m.category === cat)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <section className="gradient-blue text-white rounded-2xl p-6 shadow-elevated">
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">💊 Farmácia Digital</h2>
        <p className="opacity-90 mt-1">Verifique antes de sair de casa — encontre seus medicamentos nas farmácias próximas.</p>
      </section>

      <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar medicamento (ex: paracetamol)..." className="flex-1 bg-transparent focus:outline-none" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button onClick={() => setCat(null)} className={cn("px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap", !cat ? "bg-primary text-primary-foreground" : "bg-card")}>Todos</button>
        {MED_CATEGORIES.map((c) => (
          <button key={c.label} onClick={() => setCat(c.label)} className={cn("px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-1.5", cat === c.label ? "bg-primary text-primary-foreground" : "bg-card")}>
            <span>{c.emoji}</span>{c.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((m) => {
          const b = STATUS_BADGE[m.status];
          return (
            <div key={m.id} className="bg-card rounded-2xl p-4 shadow-card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="font-display font-bold">{m.generic}</div>
                  <div className="text-xs text-muted-foreground">{m.name} • {m.indication}</div>
                </div>
                <span className={cn("text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap", b.className)}>{b.label}</span>
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
                <button className="flex-1 bg-primary text-primary-foreground rounded-xl py-2 text-sm font-semibold flex items-center justify-center gap-1"><MapPin className="w-4 h-4" /> Como chegar</button>
                <button className="flex-1 border border-border rounded-xl py-2 text-sm font-semibold flex items-center justify-center gap-1"><Phone className="w-4 h-4" /> Contactar</button>
              </div>
            </div>
          );
        })}
      </div>

      <section className="bg-destructive/10 border border-destructive/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">⚠️</span>
          <div className="flex-1">
            <h3 className="font-display font-bold text-destructive">Atenção: medicamentos no mercado informal</h3>
            <p className="text-sm mt-1">Medicamentos vendidos na rua podem ser falsificados, expirados ou mal conservados. Compre apenas em farmácias licenciadas.</p>
          </div>
          <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-xl text-sm font-semibold">Saiba mais</button>
        </div>
      </section>

      <section className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="font-display font-bold mb-1">📋 Receita Digital</h3>
        <p className="text-sm text-muted-foreground mb-3">Fotografe a sua receita médica e a IA verifica disponibilidade dos medicamentos.</p>
        <button className="bg-primary text-primary-foreground rounded-xl px-4 py-2 font-semibold flex items-center gap-2"><Camera className="w-4 h-4" /> Fotografar Receita</button>
      </section>
    </div>
  );
}

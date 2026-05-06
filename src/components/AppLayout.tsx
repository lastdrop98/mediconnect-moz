import { useState } from "react";
import {
  Bell, Menu, Moon, Sun, X, Home, CalendarDays, Stethoscope, Video, Brain,
  HeartHandshake, Map, Pill, Baby, BookOpen, FileText, CreditCard, Siren, HeartPulse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useApp, Page } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const NAV: { id: Page; label: string; icon: LucideIcon; danger?: boolean; badge?: string }[] = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "agendar", label: "Agendar Consulta", icon: CalendarDays },
  { id: "medicos", label: "Meus Médicos", icon: Stethoscope },
  { id: "telemedicina", label: "Telemedicina", icon: Video },
  { id: "ia", label: "Assistente IA", icon: Brain },
  { id: "psicologia", label: "Apoio Psicológico", icon: HeartHandshake, badge: "GRÁTIS" },
  { id: "mapa", label: "Mapa de Saúde", icon: Map },
  { id: "farmacia", label: "Farmácia Digital", icon: Pill },
  { id: "materna", label: "Saúde Materna", icon: Baby },
  { id: "edu", label: "Edu-Saúde", icon: BookOpen },
  { id: "historico", label: "Histórico Médico", icon: FileText },
  { id: "pagamentos", label: "Pagamentos & Planos", icon: CreditCard },
  { id: "emergencia", label: "Emergência", icon: Siren, danger: true },
];

const TITLES: Record<Page, string> = {
  inicio: "Início", agendar: "Agendar Consulta", medicos: "Meus Médicos", telemedicina: "Telemedicina",
  ia: "Assistente IA de Saúde", psicologia: "Apoio Psicológico", mapa: "Mapa de Saúde",
  farmacia: "Farmácia Digital", materna: "Saúde Materna", edu: "Edu-Saúde",
  historico: "Histórico Médico", pagamentos: "Pagamentos & Planos", emergencia: "Emergência", perfil: "Perfil",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, page, setPage, darkMode, toggleDark } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          <button onClick={() => { setPage("inicio"); setMobileOpen(false); }} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-display font-extrabold text-sidebar-foreground leading-tight">MediConnect</div>
              <div className="text-[10px] text-muted-foreground">Saúde Digital para Todos</div>
            </div>
          </button>
          <button className="lg:hidden text-sidebar-foreground" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          {NAV.map((n) => {
            const active = page === n.id;
            return (
              <button
                key={n.id}
                onClick={() => { setPage(n.id); setMobileOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left active:scale-[0.98]",
                  active
                    ? n.danger
                      ? "bg-destructive text-destructive-foreground shadow-soft"
                      : "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-soft"
                    : n.danger
                      ? "text-destructive hover:bg-destructive/10"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <n.icon className={cn("w-[18px] h-[18px] shrink-0", active && "scale-110")} />
                <span className="flex-1 truncate">{n.label}</span>
                {n.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-success text-success-foreground">
                    {n.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <button onClick={() => { setPage("perfil"); setMobileOpen(false); }} className="m-3 p-3 rounded-xl bg-sidebar-accent flex items-center gap-3 hover:bg-muted transition-colors">
          <img src={user.avatar} alt={user.name} loading="lazy" className="w-10 h-10 rounded-full object-cover" />
          <div className="text-left flex-1 min-w-0">
            <div className="font-semibold text-sm text-sidebar-foreground truncate">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border h-16 flex items-center px-4 gap-3">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu className="w-5 h-5" /></button>
          <h1 className="text-lg font-display font-bold flex-1 truncate">{TITLES[page]}</h1>
          <button onClick={toggleDark} className="p-2 rounded-xl hover:bg-muted transition-colors active:scale-90" aria-label="Alternar tema">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="p-2 rounded-xl hover:bg-muted transition-colors relative active:scale-90" aria-label="Notificações">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">3</span>
          </button>
          <button onClick={() => setPage("perfil")} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/30 hover:ring-primary transition-all" aria-label="Perfil">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </button>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden animate-fade-in" key={page}>{children}</main>
      </div>

      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}

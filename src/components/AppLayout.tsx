import { useState } from "react";
import { Bell, Menu, Moon, Sun, X } from "lucide-react";
import { useApp, Page } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const NAV: { id: Page; label: string; emoji: string; danger?: boolean; badge?: string }[] = [
  { id: "inicio", label: "Início", emoji: "🏠" },
  { id: "agendar", label: "Agendar Consulta", emoji: "📅" },
  { id: "medicos", label: "Meus Médicos", emoji: "👨‍⚕️" },
  { id: "telemedicina", label: "Telemedicina", emoji: "💬" },
  { id: "ia", label: "Assistente IA", emoji: "🧠" },
  { id: "psicologia", label: "Apoio Psicológico", emoji: "💙", badge: "GRÁTIS" },
  { id: "mapa", label: "Mapa de Saúde", emoji: "🗺️" },
  { id: "farmacia", label: "Farmácia Digital", emoji: "💊" },
  { id: "materna", label: "Saúde Materna", emoji: "👶" },
  { id: "edu", label: "Edu-Saúde", emoji: "📚" },
  { id: "historico", label: "Histórico Médico", emoji: "📋" },
  { id: "pagamentos", label: "Pagamentos & Planos", emoji: "💳" },
  { id: "emergencia", label: "Emergência", emoji: "🚨", danger: true },
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
          <button onClick={() => { setPage("inicio"); setMobileOpen(false); }} className="flex items-center gap-2">
            <span className="text-2xl">💚</span>
            <div className="text-left">
              <div className="font-display font-extrabold text-sidebar-foreground">MediConnect</div>
              <div className="text-xs text-muted-foreground">Saúde Digital para Todos</div>
            </div>
          </button>
          <button className="lg:hidden text-sidebar-foreground" onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { setPage(n.id); setMobileOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                page === n.id
                  ? n.danger ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground shadow-card"
                  : n.danger ? "text-destructive hover:bg-destructive/10" : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <span className="text-lg">{n.emoji}</span>
              <span className="flex-1">{n.label}</span>
              {n.badge && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-success text-success-foreground">{n.badge}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => { setPage("perfil"); setMobileOpen(false); }} className="m-3 p-3 rounded-xl bg-sidebar-accent flex items-center gap-3 hover:bg-muted transition-colors">
          <div className="w-10 h-10 rounded-full gradient-blue flex items-center justify-center text-lg">{user.emoji}</div>
          <div className="text-left flex-1 min-w-0">
            <div className="font-semibold text-sm text-sidebar-foreground truncate">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border h-16 flex items-center px-4 gap-3">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
          <h1 className="text-lg font-display font-bold flex-1 truncate">{TITLES[page]}</h1>
          <button onClick={toggleDark} className="p-2 rounded-xl hover:bg-muted transition-colors">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="p-2 rounded-xl hover:bg-muted transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">3</span>
          </button>
          <button onClick={() => setPage("perfil")} className="w-9 h-9 rounded-full gradient-blue flex items-center justify-center">{user.emoji}</button>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>

      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}

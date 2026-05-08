import { useState } from "react";
import {
  Bell, Menu, Moon, Sun, X, Home, CalendarDays, Stethoscope, Video, Brain,
  HeartHandshake, Map, Pill, Baby, BookOpen, FileText, CreditCard, Siren, HeartPulse, LogOut,
  LayoutDashboard, Users, MessageSquare, ClipboardList, Wallet, Settings, UserCog,
  ShieldCheck, Megaphone, BarChart3, User, UserRound, Crown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useApp, Page, Role } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type NavItem = { id: Page; label: string; icon: LucideIcon; danger?: boolean; badge?: string };

const PATIENT_NAV: NavItem[] = [
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

const DOCTOR_NAV: NavItem[] = [
  { id: "doc-inicio", label: "Painel", icon: LayoutDashboard },
  { id: "doc-agenda", label: "Minha Agenda", icon: CalendarDays },
  { id: "doc-pacientes", label: "Meus Pacientes", icon: Users },
  { id: "doc-mensagens", label: "Mensagens", icon: MessageSquare },
  { id: "doc-receitas", label: "Receitas Digitais", icon: ClipboardList },
  { id: "doc-ganhos", label: "Meus Ganhos", icon: Wallet },
  { id: "doc-perfil", label: "Perfil Médico", icon: UserCog },
];

const ADMIN_NAV: NavItem[] = [
  { id: "adm-dashboard", label: "Dashboard Geral", icon: BarChart3 },
  { id: "adm-medicos", label: "Gerir Médicos", icon: ShieldCheck },
  { id: "adm-pacientes", label: "Gerir Pacientes", icon: Users },
  { id: "adm-consultas", label: "Todas as Consultas", icon: CalendarDays },
  { id: "adm-financeiro", label: "Financeiro", icon: Wallet },
  { id: "adm-alertas", label: "Alertas de Saúde", icon: Megaphone },
  { id: "adm-definicoes", label: "Definições", icon: Settings },
];

const TITLES: Partial<Record<Page, string>> = {
  inicio: "Início", agendar: "Agendar Consulta", medicos: "Meus Médicos", telemedicina: "Telemedicina",
  ia: "Assistente IA de Saúde", psicologia: "Apoio Psicológico", mapa: "Mapa de Saúde",
  farmacia: "Farmácia Digital", materna: "Saúde Materna", edu: "Edu-Saúde",
  historico: "Histórico Médico", pagamentos: "Pagamentos & Planos", emergencia: "Emergência", perfil: "Perfil",
  "doc-inicio": "Painel do Médico", "doc-agenda": "Minha Agenda", "doc-pacientes": "Meus Pacientes",
  "doc-mensagens": "Mensagens", "doc-receitas": "Receitas Digitais", "doc-ganhos": "Meus Ganhos",
  "doc-perfil": "Perfil Médico",
  "adm-dashboard": "Dashboard Geral", "adm-medicos": "Gerir Médicos", "adm-pacientes": "Gerir Pacientes",
  "adm-consultas": "Todas as Consultas", "adm-financeiro": "Financeiro", "adm-alertas": "Alertas de Saúde",
  "adm-definicoes": "Definições",
};

const ROLE_LABELS: Record<Role, { label: string; suffix: string; icon: LucideIcon; color: string }> = {
  patient: { label: "Paciente", suffix: "Paciente", icon: User, color: "from-blue-500 to-cyan-500" },
  doctor: { label: "Médico", suffix: "Médico", icon: Stethoscope, color: "from-emerald-500 to-teal-500" },
  admin: { label: "Admin", suffix: "Administrador", icon: Crown, color: "from-violet-600 to-purple-600" },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, user, page, setPage, role, setRole, darkMode, toggleDark, signOut } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV = role === "doctor" ? DOCTOR_NAV : role === "admin" ? ADMIN_NAV : PATIENT_NAV;
  const baseName = profile?.full_name || user?.email?.split("@")[0] || "Utilizador";
  const displayName = role === "doctor" ? `Dr. ${baseName}` : baseName;
  const email = user?.email ?? "";
  const avatar = profile?.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(baseName)}`;
  const roleSuffix = ROLE_LABELS[role].suffix;

  const handleLogout = async () => {
    await signOut();
    toast.success("Sessão terminada");
  };

  const sidebarBrand = role === "doctor"
    ? { from: "from-emerald-500", to: "to-teal-600" }
    : role === "admin"
      ? { from: "from-violet-600", to: "to-purple-700" }
      : { from: "from-primary", to: "to-success" };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          <button onClick={() => { setPage(NAV[0].id); setMobileOpen(false); }} className="flex items-center gap-2 group">
            <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform", sidebarBrand.from, sidebarBrand.to)}>
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-display font-extrabold text-sidebar-foreground leading-tight">MediConnect</div>
              <div className="text-[10px] text-muted-foreground">{ROLE_LABELS[role].label} · Saúde Digital</div>
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
                      : cn("bg-gradient-to-r text-white shadow-soft", sidebarBrand.from, sidebarBrand.to)
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
        <div className="m-3 p-3 rounded-xl bg-sidebar-accent flex items-center gap-3">
          <button onClick={() => { if (role === "patient") setPage("perfil"); else if (role === "doctor") setPage("doc-perfil"); setMobileOpen(false); }} className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-80">
            <img src={avatar} alt={displayName} loading="lazy" className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-sidebar-foreground truncate">{displayName}</div>
              <div className="text-xs text-muted-foreground truncate">{roleSuffix}</div>
            </div>
          </button>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive press" aria-label="Sair" title="Sair">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border h-16 flex items-center px-4 gap-3">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu className="w-5 h-5" /></button>
          <h1 className="text-lg font-display font-bold flex-1 truncate">{TITLES[page] ?? "MediConnect"}</h1>

          {/* Role switcher */}
          <div className="hidden md:flex items-center gap-1 bg-muted rounded-full p-1">
            {(["patient", "doctor", "admin"] as Role[]).map((r) => {
              const cfg = ROLE_LABELS[r];
              const active = role === r;
              return (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  title={`Ver como ${cfg.label}`}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all press",
                    active
                      ? cn("bg-gradient-to-r text-white shadow-soft", cfg.color)
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <cfg.icon className="w-3.5 h-3.5" />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          <button onClick={toggleDark} className="p-2 rounded-xl hover:bg-muted transition-colors active:scale-90" aria-label="Alternar tema">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="p-2 rounded-xl hover:bg-muted transition-colors relative active:scale-90" aria-label="Notificações">
            <Bell className="w-5 h-5" />
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen((o) => !o)} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/30 hover:ring-primary transition-all" aria-label="Perfil">
              <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-12 z-40 w-64 bg-card rounded-xl shadow-elevated border border-border overflow-hidden animate-scale-in">
                  <div className="p-3 border-b border-border">
                    <div className="font-semibold text-sm truncate">{displayName} — {roleSuffix}</div>
                    <div className="text-xs text-muted-foreground truncate">{email}</div>
                  </div>
                  <div className="p-2 border-b border-border md:hidden">
                    <div className="text-[10px] uppercase text-muted-foreground px-1 mb-1">Trocar papel</div>
                    {(["patient", "doctor", "admin"] as Role[]).map((r) => {
                      const cfg = ROLE_LABELS[r];
                      return (
                        <button key={r} onClick={() => { setRole(r); setMenuOpen(false); }}
                          className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                            role === r ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted")}>
                          <cfg.icon className="w-4 h-4" /> {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-left px-3 py-2 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Terminar sessão
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden animate-fade-in" key={page}>{children}</main>
      </div>

      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}

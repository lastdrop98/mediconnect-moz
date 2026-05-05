import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Plan = "gratuito" | "essencial" | "familia";
export type Page =
  | "inicio" | "agendar" | "medicos" | "telemedicina" | "ia" | "psicologia"
  | "mapa" | "farmacia" | "materna" | "edu" | "historico" | "pagamentos" | "emergencia" | "perfil";

export type Appointment = { id: string; doctorId: string; doctorName: string; specialty: string; date: string; time: string; status: "Confirmada" };
export type Transaction = { id: string; date: string; type: "consulta" | "assinatura" | "contribuicao"; description: string; amountMzn: number; status: "Concluída" | "Pendente" };

type Ctx = {
  user: { name: string; email: string; emoji: string };
  plan: Plan; setPlan: (p: Plan) => void;
  page: Page; setPage: (p: Page) => void;
  appointments: Appointment[]; addAppointment: (a: Appointment) => void;
  transactions: Transaction[]; addTransaction: (t: Transaction) => void;
  darkMode: boolean; toggleDark: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan>(() => (localStorage.getItem("mc_plan") as Plan) ?? "gratuito");
  const [page, setPage] = useState<Page>("inicio");
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try { return JSON.parse(localStorage.getItem("mc_appts") ?? "[]"); } catch { return []; }
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try { return JSON.parse(localStorage.getItem("mc_tx") ?? "[]"); } catch { return []; }
  });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("mc_dark") === "1");

  useEffect(() => { localStorage.setItem("mc_plan", plan); }, [plan]);
  useEffect(() => { localStorage.setItem("mc_appts", JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem("mc_tx", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("mc_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  return (
    <AppCtx.Provider value={{
      user: { name: "Shelton Chibindji", email: "sheltonbrjr@gmail.com", emoji: "👤" },
      plan, setPlan, page, setPage,
      appointments, addAppointment: (a) => setAppointments((p) => [a, ...p]),
      transactions, addTransaction: (t) => setTransactions((p) => [t, ...p]),
      darkMode, toggleDark: () => setDarkMode((d) => !d),
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

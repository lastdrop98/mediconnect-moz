import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type Plan = "free" | "essential" | "family";
export type Role = "patient" | "doctor" | "admin";

export type PatientPage =
  | "inicio" | "agendar" | "medicos" | "telemedicina" | "ia" | "psicologia"
  | "mapa" | "farmacia" | "materna" | "edu" | "historico" | "pagamentos" | "emergencia" | "perfil";
export type DoctorPage =
  | "doc-inicio" | "doc-agenda" | "doc-pacientes" | "doc-mensagens" | "doc-receitas" | "doc-ganhos" | "doc-perfil";
export type AdminPage =
  | "adm-dashboard" | "adm-medicos" | "adm-pacientes" | "adm-consultas" | "adm-financeiro" | "adm-alertas" | "adm-definicoes";
export type Page = PatientPage | DoctorPage | AdminPage;

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  blood_type: string | null;
  plan: Plan;
};

export type DoctorRow = {
  id: string; name: string; specialty: string; hospital: string | null;
  experience_years: number; price_mzn: number; rating: number;
  is_online: boolean; is_verified?: boolean; is_active?: boolean;
  bio: string | null; avatar_url: string | null;
};

export type Appointment = {
  id: string; doctor_id: string | null; doctorName?: string; specialty: string | null;
  appointment_date: string | null; appointment_time: string | null; status: string; modality: string | null;
  patient_id?: string;
};

export type Transaction = {
  id: string; created_at: string; description: string | null;
  amount_mzn: number; payment_method: string; status: string;
};

export type HealthAlert = {
  id: string; title: string; description: string | null; alert_type: string;
  expires_at?: string | null; is_active?: boolean;
};

const ROLE_HOME: Record<Role, Page> = {
  patient: "inicio",
  doctor: "doc-inicio",
  admin: "adm-dashboard",
};

type Ctx = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  role: Role; setRole: (r: Role) => void;
  page: Page; setPage: (p: Page) => void;
  doctors: DoctorRow[];
  appointments: Appointment[];
  transactions: Transaction[];
  alerts: HealthAlert[];
  refreshAppointments: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshDoctors: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
  signOut: () => Promise<void>;
  darkMode: boolean; toggleDark: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRoleState] = useState<Role>(() => {
    const v = localStorage.getItem("mc_role");
    return (v === "doctor" || v === "admin" || v === "patient") ? v : "patient";
  });
  const [page, setPage] = useState<Page>(ROLE_HOME[(localStorage.getItem("mc_role") as Role) || "patient"]);
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("mc_dark") === "1");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("mc_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    localStorage.setItem("mc_role", r);
    setPage(ROLE_HOME[r]);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess); setUser(sess?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s); setUser(s?.user ?? null); setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) { setProfile(null); return; }
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (data) setProfile(data as Profile);
  }, [user]);

  const refreshAppointments = useCallback(async () => {
    if (!user) { setAppointments([]); return; }
    const { data } = await supabase
      .from("appointments")
      .select("*, doctors(name)")
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false });
    setAppointments(((data as any[]) ?? []).map((r) => ({
      id: r.id, doctor_id: r.doctor_id, doctorName: r.doctors?.name ?? "Médico",
      specialty: r.specialty, appointment_date: r.appointment_date, patient_id: r.patient_id,
      appointment_time: r.appointment_time, status: r.status, modality: r.modality,
    })));
  }, [user]);

  const refreshTransactions = useCallback(async () => {
    if (!user) { setTransactions([]); return; }
    const { data } = await supabase
      .from("payments").select("*").eq("patient_id", user.id).order("created_at", { ascending: false });
    setTransactions((data as any[]) ?? []);
  }, [user]);

  const refreshDoctors = useCallback(async () => {
    const { data } = await supabase.from("doctors").select("*");
    setDoctors((data as DoctorRow[]) ?? []);
  }, []);

  const refreshAlerts = useCallback(async () => {
    const { data } = await supabase.from("health_alerts").select("*").eq("is_active", true);
    setAlerts((data as HealthAlert[]) ?? []);
  }, []);

  useEffect(() => {
    if (!user) { setProfile(null); setAppointments([]); setTransactions([]); return; }
    refreshProfile(); refreshAppointments(); refreshTransactions();
  }, [user, refreshProfile, refreshAppointments, refreshTransactions]);

  useEffect(() => {
    if (!user) return;
    refreshDoctors(); refreshAlerts();
  }, [user, refreshDoctors, refreshAlerts]);

  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <AppCtx.Provider value={{
      session, user, profile, loading,
      role, setRole, page, setPage,
      doctors, appointments, transactions, alerts,
      refreshAppointments, refreshTransactions, refreshProfile, refreshDoctors, refreshAlerts,
      signOut,
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

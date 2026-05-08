import { useApp } from "@/context/AppContext";
import AppLayout from "@/components/AppLayout";
import HomePage from "./HomePage";
import SchedulePage from "./SchedulePage";
import DoctorsPage from "./DoctorsPage";
import TelemedicinePage from "./TelemedicinePage";
import AIPage from "./AIPage";
import PsychologyPage from "./PsychologyPage";
import MapPage from "./MapPage";
import PharmacyPage from "./PharmacyPage";
import MaternalPage from "./MaternalPage";
import EduPage from "./EduPage";
import HistoryPage from "./HistoryPage";
import PaymentsPage from "./PaymentsPage";
import EmergencyPage from "./EmergencyPage";
import ProfilePage from "./ProfilePage";

import DoctorHomePage from "./doctor/DoctorHomePage";
import DoctorAgendaPage from "./doctor/DoctorAgendaPage";
import DoctorPatientsPage from "./doctor/DoctorPatientsPage";
import DoctorMessagesPage from "./doctor/DoctorMessagesPage";
import DoctorPrescriptionsPage from "./doctor/DoctorPrescriptionsPage";
import DoctorEarningsPage from "./doctor/DoctorEarningsPage";
import DoctorProfilePage from "./doctor/DoctorProfilePage";

import AdminDashboardPage from "./admin/AdminDashboardPage";
import AdminDoctorsPage from "./admin/AdminDoctorsPage";
import AdminPatientsPage from "./admin/AdminPatientsPage";
import AdminAppointmentsPage from "./admin/AdminAppointmentsPage";
import AdminFinancePage from "./admin/AdminFinancePage";
import AdminAlertsPage from "./admin/AdminAlertsPage";
import AdminSettingsPage from "./admin/AdminSettingsPage";

function Router() {
  const { page } = useApp();
  switch (page) {
    case "inicio": return <HomePage />;
    case "agendar": return <SchedulePage />;
    case "medicos": return <DoctorsPage />;
    case "telemedicina": return <TelemedicinePage />;
    case "ia": return <AIPage />;
    case "psicologia": return <PsychologyPage />;
    case "mapa": return <MapPage />;
    case "farmacia": return <PharmacyPage />;
    case "materna": return <MaternalPage />;
    case "edu": return <EduPage />;
    case "historico": return <HistoryPage />;
    case "pagamentos": return <PaymentsPage />;
    case "emergencia": return <EmergencyPage />;
    case "perfil": return <ProfilePage />;

    case "doc-inicio": return <DoctorHomePage />;
    case "doc-agenda": return <DoctorAgendaPage />;
    case "doc-pacientes": return <DoctorPatientsPage />;
    case "doc-mensagens": return <DoctorMessagesPage />;
    case "doc-receitas": return <DoctorPrescriptionsPage />;
    case "doc-ganhos": return <DoctorEarningsPage />;
    case "doc-perfil": return <DoctorProfilePage />;

    case "adm-dashboard": return <AdminDashboardPage />;
    case "adm-medicos": return <AdminDoctorsPage />;
    case "adm-pacientes": return <AdminPatientsPage />;
    case "adm-consultas": return <AdminAppointmentsPage />;
    case "adm-financeiro": return <AdminFinancePage />;
    case "adm-alertas": return <AdminAlertsPage />;
    case "adm-definicoes": return <AdminSettingsPage />;

    default: return <HomePage />;
  }
}

export default function Index() {
  return <AppLayout><Router /></AppLayout>;
}

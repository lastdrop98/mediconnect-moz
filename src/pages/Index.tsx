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
    default: return <HomePage />;
  }
}

export default function Index() {
  return <AppLayout><Router /></AppLayout>;
}

import { useApp } from "@/context/AppContext";
import { Pencil, Bell, Moon, Globe, Lock } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, plan, toggleDark, darkMode } = useApp();

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-card rounded-2xl p-5 shadow-card">
      <h3 className="font-display font-bold mb-3">{title}</h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span>
    </div>
  );

  const settings = [
    { icon: Bell, label: "Notificações", action: () => toast.success("Notificações ativadas") },
    { icon: Moon, label: darkMode ? "Tema Claro" : "Tema Escuro", action: toggleDark },
    { icon: Globe, label: "Idioma: PT-MZ", action: () => toast("Idioma: Português (Moçambique)") },
    { icon: Lock, label: "Privacidade", action: () => toast("Política de privacidade") },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <section className="gradient-hero text-white rounded-2xl p-6 shadow-elevated flex flex-wrap items-center gap-4">
        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30" />
        <div className="flex-1 min-w-[200px]">
          <h2 className="font-display text-2xl font-extrabold">{user.name}</h2>
          <p className="opacity-90">{user.email}</p>
          <span className="inline-block mt-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold capitalize">Plano: {plan}</span>
        </div>
        <button onClick={() => toast("Edição de perfil em breve")} className="bg-white text-primary rounded-xl px-4 py-2 font-semibold flex items-center gap-2 press">
          <Pencil className="w-4 h-4" /> Editar
        </button>
      </section>

      <Card title="Informações Pessoais">
        <Row label="Nome" value={user.name} />
        <Row label="Email" value={user.email} />
        <Row label="Telefone" value="+258 84 000 0000" />
        <Row label="Sexo" value="Masculino" />
        <Row label="Data de Nascimento" value="—" />
        <Row label="Tipo de Sangue" value="—" />
      </Card>

      <Card title="Dados de Saúde">
        <Row label="Peso" value="—" />
        <Row label="Altura" value="—" />
        <Row label="Alergias" value="Nenhuma registada" />
        <Row label="Condições Crónicas" value="Nenhuma registada" />
        <Row label="Medicação Atual" value="Nenhuma registada" />
      </Card>

      <Card title="Definições">
        <div className="grid grid-cols-2 gap-2">
          {settings.map((s) => (
            <button key={s.label} onClick={s.action} className="bg-muted rounded-xl p-3 text-left flex items-center gap-2 hover:bg-muted/70 press">
              <s.icon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">{s.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

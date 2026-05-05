import { useApp } from "@/context/AppContext";

export default function ProfilePage() {
  const { user, plan } = useApp();

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

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <section className="gradient-hero text-white rounded-2xl p-6 shadow-elevated flex flex-wrap items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl">{user.emoji}</div>
        <div className="flex-1 min-w-[200px]">
          <h2 className="font-display text-2xl font-extrabold">{user.name}</h2>
          <p className="opacity-90">{user.email}</p>
          <span className="inline-block mt-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold capitalize">Plano: {plan}</span>
        </div>
        <button className="bg-white text-primary rounded-xl px-4 py-2 font-semibold">✏️ Editar Perfil</button>
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
          {[["🔔", "Notificações"], ["🌙", "Modo Escuro"], ["🌍", "Idioma"], ["🔒", "Privacidade"]].map(([e, l]) => (
            <button key={l} className="bg-muted rounded-xl p-3 text-left flex items-center gap-2 hover:bg-muted/70">
              <span className="text-xl">{e}</span><span className="font-semibold text-sm">{l}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

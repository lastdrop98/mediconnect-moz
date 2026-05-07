import { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Bell, Moon, Globe, Lock, Loader2, Save, X, Camera } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, profile, refreshProfile, toggleDark, darkMode } = useApp();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    date_of_birth: profile?.date_of_birth ?? "",
    gender: profile?.gender ?? "",
    blood_type: profile?.blood_type ?? "",
  });

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Utilizador";
  const avatar = profile?.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

  const startEdit = () => {
    setForm({
      full_name: profile?.full_name ?? "",
      phone: profile?.phone ?? "",
      date_of_birth: profile?.date_of_birth ?? "",
      gender: profile?.gender ?? "",
      blood_type: profile?.blood_type ?? "",
    });
    setEditing(true);
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name || null,
      phone: form.phone || null,
      date_of_birth: form.date_of_birth || null,
      gender: form.gender || null,
      blood_type: form.blood_type || null,
    }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    await refreshProfile();
    setEditing(false);
    toast.success("Perfil atualizado");
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { setUploading(false); toast.error(upErr.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
    setUploading(false);
    if (error) return toast.error(error.message);
    await refreshProfile();
    toast.success("Foto de perfil atualizada");
  };

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-card rounded-2xl p-5 shadow-card">
      <h3 className="font-display font-bold mb-3">{title}</h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span><span className="font-semibold">{value || "—"}</span>
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
        <div className="relative group">
          <img src={avatar} alt={displayName} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); }} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <h2 className="font-display text-2xl font-extrabold">{displayName}</h2>
          <p className="opacity-90">{user?.email}</p>
          <span className="inline-block mt-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold capitalize">Plano: {profile?.plan ?? "free"}</span>
        </div>
        {!editing ? (
          <button onClick={startEdit} className="bg-white text-primary rounded-xl px-4 py-2 font-semibold flex items-center gap-2 press">
            <Pencil className="w-4 h-4" /> Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="bg-white/20 rounded-xl px-3 py-2 press"><X className="w-4 h-4" /></button>
            <button onClick={save} disabled={saving} className="bg-white text-primary rounded-xl px-4 py-2 font-semibold flex items-center gap-2 press">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar
            </button>
          </div>
        )}
      </section>

      <Card title="Informações Pessoais">
        {!editing ? (
          <>
            <Row label="Nome" value={profile?.full_name ?? ""} />
            <Row label="Email" value={user?.email ?? ""} />
            <Row label="Telefone" value={profile?.phone ?? ""} />
            <Row label="Sexo" value={profile?.gender ?? ""} />
            <Row label="Data de Nascimento" value={profile?.date_of_birth ?? ""} />
            <Row label="Tipo de Sangue" value={profile?.blood_type ?? ""} />
          </>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Nome completo" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
            <Field label="Telefone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Data de Nascimento" type="date" value={form.date_of_birth} onChange={(v) => setForm({ ...form, date_of_birth: v })} />
            <Select label="Sexo" value={form.gender} onChange={(v) => setForm({ ...form, gender: v })} options={["", "Masculino", "Feminino", "Outro"]} />
            <Select label="Tipo de Sangue" value={form.blood_type} onChange={(v) => setForm({ ...form, blood_type: v })} options={["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} />
          </div>
        )}
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

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
    </label>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
        {options.map((o) => <option key={o} value={o}>{o || "—"}</option>)}
      </select>
    </label>
  );
}

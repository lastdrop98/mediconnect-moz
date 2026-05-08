import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function DoctorProfilePage() {
  const { profile, user } = useApp();
  const [specialty, setSpecialty] = useState("Medicina Geral");
  const [hospital, setHospital] = useState("Hospital Central de Maputo");
  const [bio, setBio] = useState("Médico dedicado ao bem-estar dos pacientes.");
  const [price, setPrice] = useState(800);
  const [online, setOnline] = useState(true);

  const baseName = profile?.full_name || user?.email?.split("@")[0] || "Médico";

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: would update doctors row by user.id
    toast.success("Perfil profissional actualizado");
  };

  return (
    <form onSubmit={save} className="max-w-2xl mx-auto bg-card rounded-2xl p-6 shadow-card space-y-4">
      <div>
        <h3 className="font-display font-bold text-xl">Dr. {baseName}</h3>
        <p className="text-sm text-muted-foreground">Edite o seu perfil profissional visível aos pacientes.</p>
      </div>
      <label className="block text-xs font-semibold">Especialidade
        <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm" />
      </label>
      <label className="block text-xs font-semibold">Hospital / Clínica
        <input value={hospital} onChange={(e) => setHospital(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm" />
      </label>
      <label className="block text-xs font-semibold">Bio
        <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm" />
      </label>
      <label className="block text-xs font-semibold">Preço da consulta (MZN)
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm" />
      </label>
      <label className="flex items-center justify-between p-3 rounded-xl bg-muted">
        <div>
          <div className="text-sm font-semibold">Disponível online</div>
          <div className="text-xs text-muted-foreground">Aparece como online no mapa de médicos.</div>
        </div>
        <button type="button" onClick={() => setOnline((o) => !o)} className={`w-12 h-6 rounded-full transition-colors ${online ? "bg-success" : "bg-muted-foreground/30"} relative`}>
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${online ? "left-6" : "left-0.5"}`} />
        </button>
      </label>
      <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold press">
        Guardar alterações
      </button>
    </form>
  );
}

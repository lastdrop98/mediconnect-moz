export type Facility = {
  id: string;
  emoji: string;
  name: string;
  address: string;
  type: "hospital" | "clinic" | "pharmacy" | "lab";
  rating: number;
  emergency?: boolean;
};

export const FACILITIES: Facility[] = [
  { id: "f1", emoji: "🏥", name: "Hospital Privado de Maputo", address: "Rua da Resistência, 500", type: "hospital", rating: 4.8, emergency: true },
  { id: "f2", emoji: "🔬", name: "Laboratório de Análises Clínicas", address: "Rua do Bagamoio, 200", type: "lab", rating: 4.7 },
  { id: "f3", emoji: "🏨", name: "Clínica Médica Polana", address: "Av. Julius Nyerere, 250", type: "clinic", rating: 4.6 },
  { id: "f4", emoji: "💊", name: "Farmácia Saúde+", address: "Av. 24 de Julho, 100", type: "pharmacy", rating: 4.5 },
  { id: "f5", emoji: "🏥", name: "Hospital Central de Maputo", address: "Av. Agostinho Neto", type: "hospital", rating: 4.4, emergency: true },
  { id: "f6", emoji: "🦷", name: "Clínica Dental Sorriso", address: "Rua Fernão Melo e Castro", type: "clinic", rating: 4.6 },
];

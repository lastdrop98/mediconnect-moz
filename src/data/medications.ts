export type Medication = {
  id: string;
  name: string;
  generic: string;
  category: string;
  indication: string;
  status: "available" | "limited" | "out";
  priceMzn: number;
  pharmacies: { name: string; distanceKm: number }[];
};

export const MEDICATIONS: Medication[] = [
  { id: "m1", name: "Coartem", generic: "Artemeter-Lumefantrina", category: "Antimaláricos", indication: "Tratamento da malária", status: "available", priceMzn: 350,
    pharmacies: [{ name: "Farmácia Saúde+", distanceKm: 0.8 }, { name: "Farmácia Calêndula", distanceKm: 1.5 }] },
  { id: "m2", name: "Paracetamol 500mg", generic: "Paracetamol", category: "Analgésicos", indication: "Dor e febre", status: "available", priceMzn: 45,
    pharmacies: [{ name: "Farmácia Saúde+", distanceKm: 0.8 }, { name: "Farmácia Popular", distanceKm: 1.2 }] },
  { id: "m3", name: "Amoxicilina 500mg", generic: "Amoxicilina", category: "Antibióticos", indication: "Infeções bacterianas", status: "limited", priceMzn: 180,
    pharmacies: [{ name: "Farmácia Calêndula", distanceKm: 1.5 }] },
  { id: "m4", name: "Metformina 500mg", generic: "Metformina", category: "Diabetes", indication: "Diabetes tipo 2", status: "available", priceMzn: 120,
    pharmacies: [{ name: "Farmácia Saúde+", distanceKm: 0.8 }] },
  { id: "m5", name: "Amlodipina 5mg", generic: "Amlodipina", category: "Hipertensão", indication: "Pressão alta", status: "out", priceMzn: 95, pharmacies: [] },
  { id: "m6", name: "TDF/3TC/DTG", generic: "Tenofovir+Lamivudina+Dolutegravir", category: "HIV/SIDA", indication: "Antirretroviral (gratuito SNS)", status: "available", priceMzn: 0,
    pharmacies: [{ name: "Centro de Saúde 1º de Maio", distanceKm: 0.5 }] },
  { id: "m7", name: "Sulfato Ferroso", generic: "Sulfato Ferroso", category: "Maternidade", indication: "Anemia / gravidez", status: "available", priceMzn: 60,
    pharmacies: [{ name: "Farmácia Saúde+", distanceKm: 0.8 }] },
  { id: "m8", name: "Ibuprofeno 400mg", generic: "Ibuprofeno", category: "Analgésicos", indication: "Dor e inflamação", status: "available", priceMzn: 85,
    pharmacies: [{ name: "Farmácia Popular", distanceKm: 1.2 }] },
  { id: "m9", name: "ORS (Sais de Reidratação)", generic: "ORS", category: "Febre", indication: "Diarreia / cólera", status: "available", priceMzn: 25,
    pharmacies: [{ name: "Farmácia Saúde+", distanceKm: 0.8 }] },
  { id: "m10", name: "Albendazol 400mg", generic: "Albendazol", category: "Antibióticos", indication: "Desparasitante", status: "limited", priceMzn: 55,
    pharmacies: [{ name: "Farmácia Calêndula", distanceKm: 1.5 }] },
];

export const MED_CATEGORIES = [
  { label: "Analgésicos", emoji: "💊" },
  { label: "Antimaláricos", emoji: "🦟" },
  { label: "Antibióticos", emoji: "💉" },
  { label: "Hipertensão", emoji: "❤️" },
  { label: "HIV/SIDA", emoji: "🩸" },
  { label: "Febre", emoji: "🌡️" },
  { label: "Maternidade", emoji: "🤰" },
  { label: "Diabetes", emoji: "🍬" },
  { label: "Sono", emoji: "😴" },
];

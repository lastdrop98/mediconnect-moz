export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  emoji: string;
  rating: number;
  hospital: string;
  experience: number;
  priceMzn: number;
  online: boolean;
};

export const DOCTORS: Doctor[] = [
  { id: "d1", name: "Dr. Armando Macuácua", specialty: "Clínica Geral", emoji: "👨‍⚕️", rating: 4.9, hospital: "Hospital Privado de Maputo", experience: 12, priceMzn: 1500, online: true },
  { id: "d2", name: "Dra. Lúcia Mondlane", specialty: "Cardiologia", emoji: "👩‍⚕️", rating: 4.8, hospital: "Clínica Cruz Azul", experience: 15, priceMzn: 2500, online: true },
  { id: "d3", name: "Dr. Eduardo Sitoe", specialty: "Pediatria", emoji: "👨‍⚕️", rating: 4.9, hospital: "Hospital Central de Maputo", experience: 10, priceMzn: 1800, online: false },
  { id: "d4", name: "Dra. Joana Cossa", specialty: "Ginecologia", emoji: "👩‍⚕️", rating: 4.7, hospital: "Clínica Médica Polana", experience: 8, priceMzn: 2200, online: true },
  { id: "d5", name: "Dr. Manuel Tembe", specialty: "Ortopedia", emoji: "👨‍⚕️", rating: 4.6, hospital: "Hospital Privado de Maputo", experience: 14, priceMzn: 2300, online: false },
  { id: "d6", name: "Dra. Sónia Bila", specialty: "Dermatologia", emoji: "👩‍⚕️", rating: 4.8, hospital: "Clínica Sommerschield", experience: 9, priceMzn: 2000, online: true },
  { id: "d7", name: "Dr. Carlos Nhantumbo", specialty: "Psicologia", emoji: "👨‍⚕️", rating: 4.9, hospital: "Centro Saúde Mental Maputo", experience: 11, priceMzn: 1700, online: true },
  { id: "d8", name: "Dra. Helena Massingue", specialty: "Nutrição", emoji: "👩‍⚕️", rating: 4.7, hospital: "Clínica Nutrir+", experience: 7, priceMzn: 1300, online: true },
];

export const SPECIALTIES = [
  { name: "Clínico Geral", emoji: "🩺" },
  { name: "Cardiologia", emoji: "❤️" },
  { name: "Pediatria", emoji: "👶" },
  { name: "Ginecologia", emoji: "🌸" },
  { name: "Ortopedia", emoji: "🦴" },
  { name: "Dermatologia", emoji: "✨" },
  { name: "Neurologia", emoji: "🧠" },
  { name: "Psicologia", emoji: "💙" },
  { name: "Nutrição", emoji: "🥗" },
];

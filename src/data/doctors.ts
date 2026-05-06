import d1 from "@/assets/doctors/doctor-1.jpg";
import d2 from "@/assets/doctors/doctor-2.jpg";
import d3 from "@/assets/doctors/doctor-3.jpg";
import d4 from "@/assets/doctors/doctor-4.jpg";
import d5 from "@/assets/doctors/doctor-5.jpg";
import d6 from "@/assets/doctors/doctor-6.jpg";
import d7 from "@/assets/doctors/doctor-7.jpg";
import d8 from "@/assets/doctors/doctor-8.jpg";
import {
  Stethoscope, HeartPulse, Baby, Flower2, Bone, Sparkles, Brain, Salad, Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  hospital: string;
  experience: number;
  priceMzn: number;
  online: boolean;
};

export const DOCTORS: Doctor[] = [
  { id: "d1", name: "Dr. Armando Macuácua", specialty: "Clínica Geral", avatar: d1, rating: 4.9, hospital: "Hospital Privado de Maputo", experience: 12, priceMzn: 1500, online: true },
  { id: "d2", name: "Dra. Lúcia Mondlane", specialty: "Cardiologia", avatar: d2, rating: 4.8, hospital: "Clínica Cruz Azul", experience: 15, priceMzn: 2500, online: true },
  { id: "d3", name: "Dr. Eduardo Sitoe", specialty: "Pediatria", avatar: d3, rating: 4.9, hospital: "Hospital Central de Maputo", experience: 10, priceMzn: 1800, online: false },
  { id: "d4", name: "Dra. Joana Cossa", specialty: "Ginecologia", avatar: d4, rating: 4.7, hospital: "Clínica Médica Polana", experience: 8, priceMzn: 2200, online: true },
  { id: "d5", name: "Dr. Manuel Tembe", specialty: "Ortopedia", avatar: d5, rating: 4.6, hospital: "Hospital Privado de Maputo", experience: 14, priceMzn: 2300, online: false },
  { id: "d6", name: "Dra. Sónia Bila", specialty: "Dermatologia", avatar: d6, rating: 4.8, hospital: "Clínica Sommerschield", experience: 9, priceMzn: 2000, online: true },
  { id: "d7", name: "Dr. Carlos Nhantumbo", specialty: "Psicologia", avatar: d7, rating: 4.9, hospital: "Centro Saúde Mental Maputo", experience: 11, priceMzn: 1700, online: true },
  { id: "d8", name: "Dra. Helena Massingue", specialty: "Nutrição", avatar: d8, rating: 4.7, hospital: "Clínica Nutrir+", experience: 7, priceMzn: 1300, online: true },
];

export const SPECIALTIES: { name: string; icon: LucideIcon; color: string }[] = [
  { name: "Clínica Geral", icon: Stethoscope, color: "from-blue-500 to-cyan-500" },
  { name: "Cardiologia", icon: HeartPulse, color: "from-red-500 to-pink-500" },
  { name: "Pediatria", icon: Baby, color: "from-amber-500 to-orange-500" },
  { name: "Ginecologia", icon: Flower2, color: "from-pink-500 to-rose-500" },
  { name: "Ortopedia", icon: Bone, color: "from-slate-500 to-slate-700" },
  { name: "Dermatologia", icon: Sparkles, color: "from-violet-500 to-purple-500" },
  { name: "Neurologia", icon: Brain, color: "from-indigo-500 to-purple-500" },
  { name: "Psicologia", icon: Activity, color: "from-pink-400 to-fuchsia-500" },
  { name: "Nutrição", icon: Salad, color: "from-green-500 to-emerald-500" },
];

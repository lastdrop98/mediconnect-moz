export const MATERNAL_WEEKS: Record<number, { baby: string; mother: string; care: string; alert: string }> = {
  default: { baby: "O bebé continua a crescer e desenvolver-se.", mother: "Pode sentir alterações de humor e cansaço.", care: "Mantenha consultas pré-natais regulares e alimentação saudável.", alert: "Procure ajuda se tiver sangramento, dor de cabeça forte ou febre." } as any,
};

export function getWeekInfo(week: number) {
  if (week <= 12) return {
    baby: "O bebé tem o tamanho de um limão. Os órgãos principais já estão a formar-se.",
    mother: "Náuseas matinais, cansaço, sensibilidade nos seios. Tudo normal!",
    care: "Primeira consulta pré-natal, análises de sangue (HIV, sífilis, anemia), iniciar ácido fólico.",
    alert: "Sangramento intenso ou dor pélvica forte → ir HOJE ao hospital.",
  };
  if (week <= 27) return {
    baby: "O bebé já mexe e ouve sons. Tem o tamanho de uma manga.",
    mother: "Barriga visível, possível azia, primeiros movimentos do bebé sentidos.",
    care: "Ecografia morfológica (18-20 semanas), vacina TT, suplemento de ferro se anemia.",
    alert: "Bebé não mexe há mais de 12h, dor de cabeça forte com visão turva (pré-eclâmpsia) → urgente.",
  };
  return {
    baby: "O bebé tem o tamanho de uma melancia e está pronto para nascer.",
    mother: "Cansaço, falta de ar, contrações de treino, ansiedade pelo parto.",
    care: "Plano de parto, kit para o hospital pronto, identificar sinais de trabalho de parto.",
    alert: "Contrações regulares de 5 em 5 min, perda de líquido amniótico, sangramento → ir ao hospital.",
  };
}

export const PRENATAL_CHECKLIST = [
  "Primeira consulta pré-natal (até 12 semanas)",
  "Análises de sangue (HIV, sífilis, anemia)",
  "Ecografia (18-20 semanas)",
  "Vacina TT (Tétano)",
  "Suplemento de Ácido Fólico",
  "Plano de parto",
  "Kit para o hospital",
];

export const MATERNAL_ALERTS = [
  { emoji: "🚨", title: "Sangramento vaginal", desc: "Qualquer sangramento na gravidez deve ser avaliado. Ligue 112 ou vá imediatamente ao hospital." },
  { emoji: "🚨", title: "Dor de cabeça forte + visão turva", desc: "Pode ser pré-eclâmpsia, uma complicação grave. Vá ao hospital agora." },
  { emoji: "🚨", title: "Bebé não mexe", desc: "Conte os movimentos: deve sentir pelo menos 10 movimentos em 2 horas. Se não sentir, vá ao hospital." },
  { emoji: "🚨", title: "Febre alta", desc: "Pode ser malária — perigosa na gravidez. Faça teste rápido HOJE." },
];

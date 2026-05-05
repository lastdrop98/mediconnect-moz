export type EduArticle = {
  id: string;
  emoji: string;
  title: string;
  category: string;
  what: string;
  prevention: string[];
  symptoms: string;
  myth: { myth: string; truth: string };
  whenDoctor: string;
};

export const EDU_CATEGORIES = [
  { id: "malaria", emoji: "🦟", title: "Malária", color: "from-red-500 to-orange-500" },
  { id: "colera", emoji: "💧", title: "Cólera", color: "from-blue-500 to-cyan-500" },
  { id: "hiv", emoji: "🩸", title: "HIV/SIDA", color: "from-pink-500 to-red-500" },
  { id: "vacinacao", emoji: "💉", title: "Vacinação", color: "from-green-500 to-emerald-500" },
  { id: "nutricao", emoji: "🍎", title: "Nutrição", color: "from-orange-500 to-amber-500" },
  { id: "materna", emoji: "🤰", title: "Saúde Materna", color: "from-pink-500 to-rose-500" },
  { id: "hipertensao", emoji: "🫀", title: "Hipertensão", color: "from-red-500 to-pink-500" },
  { id: "mental", emoji: "🧠", title: "Saúde Mental", color: "from-purple-500 to-indigo-500" },
  { id: "higiene", emoji: "🚿", title: "Higiene", color: "from-cyan-500 to-blue-500" },
  { id: "oral", emoji: "🦷", title: "Saúde Oral", color: "from-blue-400 to-indigo-400" },
  { id: "ocular", emoji: "👁️", title: "Saúde Ocular", color: "from-indigo-500 to-purple-500" },
  { id: "tb", emoji: "🌡️", title: "Tuberculose", color: "from-amber-500 to-yellow-500" },
];

export const EDU_ARTICLES: Record<string, EduArticle> = {
  malaria: {
    id: "malaria", emoji: "🦟", title: "Malária", category: "Doença Tropical",
    what: "Doença transmitida pelo mosquito Anopheles fêmea, muito comum em Moçambique. É uma das principais causas de morte no país, especialmente em crianças e grávidas.",
    prevention: [
      "Dormir sob mosquiteiro impregnado todas as noites",
      "Usar repelente ao anoitecer",
      "Eliminar água parada perto de casa",
      "Tomar profilaxia se recomendado pelo médico",
      "Vestir manga comprida ao entardecer",
    ],
    symptoms: "Febre alta e súbita, calafrios, dores no corpo, dor de cabeça intensa, vómitos. Em crianças pode evoluir rapidamente para forma grave.",
    myth: { myth: "Malária cura-se sozinha", truth: "FALSO. Sem tratamento pode ser fatal em 24-48h, especialmente em crianças menores de 5 anos e grávidas." },
    whenDoctor: "Febre alta sem causa clara → ir HOJE ao centro de saúde fazer teste rápido.",
  },
  colera: {
    id: "colera", emoji: "💧", title: "Cólera", category: "Doença Infecciosa",
    what: "Infeção intestinal grave transmitida por água ou alimentos contaminados com a bactéria Vibrio cholerae. Causa surtos frequentes em Moçambique.",
    prevention: [
      "Beber apenas água fervida, tratada ou engarrafada",
      "Lavar as mãos com sabão antes de comer e após WC",
      "Cozinhar bem os alimentos",
      "Lavar frutas e legumes com água tratada",
      "Evitar gelo de origem desconhecida",
    ],
    symptoms: "Diarreia aquosa muito abundante (\"água de arroz\"), vómitos, cãibras, desidratação rápida e perigosa.",
    myth: { myth: "Cólera só atinge pessoas pobres ou sujas", truth: "FALSO. Qualquer pessoa pode ser afetada se beber água contaminada — é uma questão de água segura, não de higiene pessoal." },
    whenDoctor: "Diarreia intensa com sinais de desidratação → emergência. Comece já a beber soro de reidratação (ORS).",
  },
  hiv: {
    id: "hiv", emoji: "🩸", title: "HIV/SIDA", category: "Doença Crónica",
    what: "Vírus que ataca o sistema imunológico. Moçambique tem uma das maiores taxas de HIV do mundo (≈12% da população adulta).",
    prevention: [
      "Uso consistente de preservativo",
      "Teste regular (a cada 6-12 meses se vida sexual ativa)",
      "TARV (tratamento antirretroviral) previne transmissão",
      "PrEP para pessoas em alto risco",
      "Não partilhar agulhas ou objetos cortantes",
    ],
    symptoms: "Podem demorar anos a aparecer. Fazer o teste é o único modo de saber. Sintomas tardios incluem perda de peso, infeções repetidas, suores noturnos.",
    myth: { myth: "HIV é sentença de morte", truth: "FALSO. Com TARV vive-se décadas com qualidade de vida. Pessoas com carga viral indetetável NÃO transmitem o vírus." },
    whenDoctor: "Qualquer unidade sanitária pública faz teste GRATUITAMENTE e em sigilo. Se positivo, TARV começa de imediato.",
  },
};

export const QUIZ: { topic: string; questions: { q: string; opts: string[]; correct: number; explanation: string }[] }[] = [
  {
    topic: "Malária",
    questions: [
      { q: "Como se transmite a malária?", opts: ["Tosse", "Mosquito Anopheles fêmea", "Água contaminada", "Contacto direto"], correct: 1, explanation: "É transmitida pela picada da fêmea do mosquito Anopheles." },
      { q: "Qual o sintoma mais característico?", opts: ["Tosse seca", "Febre alta com calafrios", "Dor abdominal", "Erupção cutânea"], correct: 1, explanation: "Febre alta súbita com calafrios é o sinal clássico." },
      { q: "Qual a melhor prevenção?", opts: ["Beber água fervida", "Mosquiteiro impregnado", "Vacina anual", "Tomar antibiótico"], correct: 1, explanation: "O mosquiteiro impregnado é a medida mais eficaz e acessível." },
      { q: "Quem corre maior risco?", opts: ["Idosos", "Adultos saudáveis", "Crianças <5 anos e grávidas", "Adolescentes"], correct: 2, explanation: "Crianças pequenas e grávidas têm maior risco de forma grave." },
      { q: "O que fazer ao suspeitar de malária?", opts: ["Esperar passar", "Tomar paracetamol e descansar", "Fazer teste rápido HOJE", "Beber chá"], correct: 2, explanation: "Tratamento precoce salva vidas — fazer o teste o mais cedo possível." },
    ],
  },
];

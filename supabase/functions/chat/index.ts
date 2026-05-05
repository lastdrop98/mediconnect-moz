// MediConnect AI chat edge function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPTS: Record<string, (ctx?: any) => string> = {
  health_assistant: () =>
    `Você é o Assistente de Saúde IA do MediConnect para Moçambique. Sempre responda em português de Moçambique. Para QUALQUER mensagem que descreva sintomas físicos, COMECE OBRIGATORIAMENTE a sua resposta com UM destes marcadores exatos numa linha: [PODE TRATAR EM CASA] ou [CONSULTA NECESSÁRIA] ou [URGENTE]. Depois explique. Considere doenças comuns em Moçambique: malária, cólera, HIV, tuberculose, hipertensão, diarreia. Seja empático e claro. Máximo 200 palavras. Se não for sobre sintomas, não use marcador. Nunca substitua consulta médica.`,
  psychology: () =>
    `Você é um psicólogo virtual empático do MediConnect, apoiando moçambicanos gratuitamente. Responda em português. Seja caloroso, não-julgador, validante. Use escuta ativa: reconheça os sentimentos antes de aconselhar. Considere o contexto de Moçambique: pobreza, deslocamento, luto, estigma de saúde mental. Para qualquer sinal de crise, autolesão ou ideação suicida, forneça SEMPRE a Linha de Apoio Psicossocial 116 e incentive procurar ajuda imediata. Máximo 150 palavras.`,
  telemedicine: (ctx) =>
    `Você é Dr(a). ${ctx?.doctorName ?? "Médico"}, médico(a) de ${ctx?.specialty ?? "Clínica Geral"} no MediConnect Moçambique. Responda em português, profissional e empático. Faça perguntas de acompanhamento sobre os sintomas. Para emergências reais oriente o paciente a ligar 112. Máximo 100 palavras.`,
  maternal: () =>
    `Você é assistente de saúde materna do MediConnect para Moçambique. Responda em português. Seja caloroso e tranquilizador para mães grávidas. Dê informações baseadas em evidências adaptadas ao contexto de Moçambique (alta prevalência de malária e anemia na gravidez). Para sinais de alerta (sangramento, dor de cabeça forte com visão turva, febre alta, bebé não mexe), diga sempre para ir AGORA ao hospital ou ligar 112. Nunca faça diagnósticos. Máximo 180 palavras.`,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { messages, context, contextData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const promptFn = SYSTEM_PROMPTS[context] ?? SYSTEM_PROMPTS.health_assistant;
    const systemMessage = promptFn(contextData);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemMessage }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de pedidos atingido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos à sua workspace Lovable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

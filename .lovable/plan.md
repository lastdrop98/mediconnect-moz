# MediConnect — Plataforma de Saúde Digital para Moçambique

Aplicação web completa em React + Tailwind, totalmente responsiva, com 14 páginas, integração de IA via Lovable AI Gateway e simulação de pagamentos M-Pesa.

## Identidade Visual

- **Nome:** MediConnect 💚 — "Saúde Digital para Todos"
- **Paleta:** azul #1E88E5, verde #43A047, roxo #7C3AED, rosa #EC4899, vermelho #E53935, fundo #F0F4F8
- **Tipografia:** Plus Jakarta Sans (títulos) + DM Sans (corpo)
- **Estilo:** cards 16px radius, sombras suaves, gradientes nos banners, sidebar 240px fixa, topbar sticky
- Tudo configurado via design tokens HSL em `index.css` e `tailwind.config.ts` (sem cores hardcoded em componentes)

## Arquitetura

- **Layout:** sidebar fixa + topbar (com toggle dark mode, sino com badge 3, avatar), navegação por estado (sem router para sub-páginas), responsiva com hamburger no mobile
- **Estado global:** Context API para utilizador (Shelton Chibindji), plano (Gratuito/Essencial/Família), consultas agendadas, transações, conversas de chat por contexto
- **IA:** Edge function única (`/chat`) usando **Lovable AI Gateway** (modelo `google/gemini-3-flash-preview`) com system prompts diferentes consoante o contexto enviado pelo cliente: `health_assistant`, `psychology`, `telemedicine` (recebe nome+especialidade do médico), `maternal`. Streaming SSE token-a-token. Tratamento de 429/402 com toast.
- **Triagem inteligente:** o system prompt do Health Assistant instrui a IA a iniciar respostas sobre sintomas com `[PODE TRATAR EM CASA]`, `[CONSULTA NECESSÁRIA]` ou `[URGENTE]`; o frontend deteta o marcador e renderiza badge colorido 🟢🟡🔴
- **Mensagens:** renderizadas com `react-markdown`

## Páginas (14)

1. **Início** — hero gradiente com saudação dinâmica, 4 stat cards translúcidos, 4 quick actions coloridas, alertas de saúde, banner IA, grid de médicos disponíveis
2. **Agendar Consulta** — tabs (Agendadas/Nova/Histórico) + modal 3 passos (especialidade → dia/hora → resumo), gera consulta com badge "Confirmada"
3. **Meus Médicos** — pesquisa, toggle online, filtros por especialidade, grid de 8 médicos de Maputo com avatar emoji, rating, preço MZN, botões chat/agendar
4. **Telemedicina** — 2 colunas: lista médicos online + chat ao vivo com IA personificando o médico (vídeo botão decorativo)
5. **Assistente IA de Saúde** — header roxo, 4 pills rápidas, chat com triagem visual por badge de urgência, disclaimer amarelo
6. **Apoio Psicológico (GRATUITO)** — banner rosa/roxo destacando gratuidade, 2 tabs: *Conversar* (seletor de humor + chat empático) e *Recursos de Bem-Estar* (4 modais: Respiração com círculo animado 4-4-4 × 5 ciclos, Meditação Guiada, Mindfulness, Diário Emocional). Linha 116 sempre visível.
7. **Mapa de Saúde** — pesquisa, filtros, banner emergência 112, placeholder visual de mapa, 6 estabelecimentos reais de Maputo
8. **Farmácia Digital** ← NOVA — pesquisa, 9 categorias pills, lista de 10 medicamentos com badge disponibilidade 🟢🟡🔴, preço MZN, farmácias próximas, secção "mercado informal" e "Receita Digital" (upload + IA)
9. **Saúde Materna** ← NOVA — slider 1-40 semanas com card personalizado por semana, checklist pré-natal com progresso, sinais de alerta vermelhos, secção pós-parto, chat IA materno
10. **Edu-Saúde** ← NOVA — 12 categorias em grid, artigos completos (Malária, Cólera, HIV hardcoded com Mitos vs Realidade), quiz interativo de 5 perguntas com pontuação
11. **Emergência** — hero vermelho, botão pulsante `tel:112`, grid 5 números reais MZ, 5 cards de primeiros socorros, card linha 116
12. **Pagamentos & Planos** ← REFORMULADA — 6 secções: 3 planos (Gratuito/Essencial 299/Família 599), pagar consulta avulso, 5 métodos de pagamento (M-Pesa, eMola, Mkesh, Cartão, Dinheiro) com formulário M-Pesa e simulação 3s, Fundo Solidário com barra de progresso, Meu Plano, Histórico com 4 stat cards
13. **Histórico Médico** — 5 stat cards, pesquisa, tabs por tipo, estado vazio com CTA
14. **Perfil** — header gradiente, info pessoal, dados de saúde, definições

## Funcionalidades-chave

- **Triagem IA com badges visuais** detetados pelo cliente
- **Simulação M-Pesa**: input → loading 3s → toast de sucesso → transação no histórico
- **Animação de respiração**: círculo CSS scale 1↔1.3 com fases Inspire/Segure/Expire/Pausa e contador de ciclos
- **Modo escuro** via toggle (classe `.dark` já definida)
- **Apoio psicológico sem paywall** — badge "💙 Gratuito" sempre visível na sidebar

## Detalhes técnicos

- **Stack:** React 18 + Vite + TS + Tailwind + shadcn/ui + react-markdown
- **Backend:** Lovable Cloud (necessário ativar) para a edge function `/chat`
- **IA:** Lovable AI Gateway, `LOVABLE_API_KEY` auto-provisionada, streaming SSE, fallback de erro 402/429 com toast
- **Sem autenticação** — utilizador hardcoded Shelton Chibindji
- **Dados** em memória (Context + useState); persistência opcional via `localStorage` para consultas/transações/diário emocional
- **Idioma:** PT-MZ; **moeda:** MZN
- **Estrutura de ficheiros:** `src/pages/*` (14), `src/components/layout/{Sidebar,Topbar,AppLayout}`, `src/components/chat/ChatWindow`, `src/components/psychology/BreathingCircle`, `src/context/AppContext`, `src/data/{doctors,medications,facilities,articles,quiz}.ts`, `supabase/functions/chat/index.ts`

## Fora do âmbito desta primeira versão

- Pagamentos reais (apenas simulação visual)
- Mapa interativo real (placeholder visual)
- Upload OCR real de receita (botão funcional, processamento mock)
- Persistência em base de dados (tudo em memória/localStorage)

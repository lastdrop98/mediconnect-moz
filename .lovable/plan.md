Vou transformar o MediConnect numa aplicação visualmente mais profissional, real e interativa, substituindo emojis por ícones Lucide e avatares gerados, adicionando um mapa real e ligando todos os botões a ações.

## 1. Sistema visual mais profissional

- Substituir emojis decorativos por ícones Lucide (Stethoscope, HeartPulse, Baby, Brain, Pill, Hospital, etc.) com fundos gradientes em containers redondos.
- Gerar 8 avatares fotorrealistas de médicos (4 homens / 4 mulheres, contexto africano/moçambicano, jaleco branco) via imagegen e usá-los nos cards e na telemedicina.
- Adicionar animações suaves: `animate-fade-in`, `hover-scale`, `transition-all`, hover lift nos cards (`-translate-y-1`), shimmer em loading, pulse em status online.
- Refinar hierarquia visual: gradientes sutis nos cards de destaque, badges com ícone, micro-interações em todos os botões (`active:scale-95`).

## 2. Mapa real (Google Maps embed)

Em `MapPage.tsx`, substituir o placeholder por um `<iframe>` do Google Maps embed centrado em Maputo, com pins simulados sobrepostos via CSS para os estabelecimentos selecionados. Sem necessidade de API key (usa o embed público). Lista lateral sincroniza com o item ativo (clique no card → highlight + scroll do iframe via re-render do `src` com novas coordenadas).

## 3. Todos os botões funcionais

Auditar e ligar cada botão a uma ação real (toast, modal, navegação, mudança de estado):

- **DoctorsPage**: "Online" abre modal de chat / navega para `/telemedicina?doctor=`; "Agendar" abre modal de agendamento (3 passos) e adiciona ao contexto; filtros já funcionam.
- **HomePage**: cards de quick actions navegam; "Ver tudo" funciona.
- **SchedulePage**: confirma agendamento via toast e adiciona ao contexto.
- **TelemedicinePage**: botões de vídeo/áudio/encerrar mudam estado visual.
- **PsychologyPage**: botão respiração abre modal; SOS 116 com `tel:`.
- **MapPage**: "Ver" centra mapa + abre detalhes; "Ligar" via `tel:`.
- **PharmacyPage**: "Adicionar ao carrinho" incrementa badge; "Ver receita" abre modal com receita simulada.
- **MaternalPage**: checklist marca/desmarca persistindo.
- **EduPage**: "Ler artigo" abre modal com conteúdo completo; quiz com feedback.
- **EmergencyPage**: todos os números com `tel:`.
- **PaymentsPage**: M-Pesa simulação 3s + toast de sucesso; histórico atualiza.
- **ProfilePage / HistoryPage**: editar/exportar com toasts.

## 4. Componentes novos

- `src/components/ui/IconBadge.tsx` — wrapper para ícones com fundo gradiente.
- `src/components/DoctorAvatar.tsx` — usa imagens geradas com fallback.
- `src/components/InteractiveMap.tsx` — Google embed + overlay de pins.

## Detalhes técnicos

- Imagens dos médicos em `src/assets/doctors/` (8 PNG quadrados ~512px, importadas via ES6).
- Google Maps: `https://www.google.com/maps/embed?pb=...` centrado em Maputo (-25.9692, 32.5732).
- Toast via `sonner` (já instalado).
- Animações em `tailwind.config.ts` (fade-in, scale-in, slide-up) e classes utility já presentes.
- Sem mudanças de schema de DB nem nova edge function.

Itens fora de escopo: nada de novo backend, sem auth real, sem pagamento real.

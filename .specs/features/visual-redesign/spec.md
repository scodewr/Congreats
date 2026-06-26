# Visual Redesign — Especificação

**Feature ID**: REDESIGN  
**Design System**: `.specs/project/DESIGN-SYSTEM.md`  
**Status**: Implementada ✅ — 2026-06-26  
**Prioridade**: Alta — afeta toda a experiência do produto  
**Versão alvo**: v1.0 (aplicar retroativamente antes do próximo release)

---

## Problema

A interface atual do Congreats usa o preset padrão do Tailwind (azul/cinza/branco), navegação por links de texto, sem animações e sem identidade visual própria. O produto é uma plataforma gamificada de reconhecimento profissional, mas o visual não comunica isso — parece um dashboard corporativo genérico. O resultado é uma experiência que não engaja e não reforça o valor do reconhecimento.

## Goals

- [ ] Estabelecer identidade visual premium e gamificada: paleta preta/roxo/vinho/dourado
- [ ] Tornar a navegação assíncrona com animações de transição entre rotas e áreas
- [ ] Substituir botões e links de texto por componentes visuais coerentes
- [ ] Criar uma biblioteca de componentes reutilizável alinhada ao design system
- [ ] Introduzir navegação horizontal (tab strips) nas páginas de perfil, discovery e admin

## Out of Scope

| Item | Motivo |
|------|--------|
| Redesign mobile (React Native) | Escopo separado — app mobile tem ciclo próprio |
| Novas funcionalidades de produto | Esta spec é puramente visual/UX — sem novos endpoints |
| Backend / API changes | Nenhuma mudança de contrato de API |
| Animações de conquista (particles) | Depende do sistema de notificações (v4.1) — adiado |
| Dark/Light mode toggle | Somente dark mode — light mode é v2 do design system |

---

## User Stories

### P1: Design Token System ⭐ MVP

**User Story**: Como desenvolvedor, quero que todos os tokens de cor, sombra, fonte e animação estejam centralizados no Tailwind config, para que nenhuma cor seja inserida de forma ad-hoc no código.

**Por que P1**: Fundação. Todas as outras histórias dependem dos tokens corretos estando disponíveis via classes Tailwind.

**Acceptance Criteria**:

1. WHEN o projeto é buildado THEN o Tailwind SHALL expor todos os tokens de `DESIGN-SYSTEM.md` seção 8 (void, surface, elevated, overlay, border-subtle, border-dim, purple-*, wine-*, gold-*, text-*, box-shadow glow variants, keyframes shimmer e gold-pulse)
2. WHEN qualquer cor do preset padrão do Tailwind (blue-*, gray-*, white como bg) é usada nos arquivos src/ THEN o linter SHALL reportar violação (via `eslint-plugin-tailwindcss` ou via remoção do preset)
3. WHEN a fonte Inter não carrega THEN o sistema SHALL fazer fallback para system-ui sem quebrar layout

**Independent Test**: `npm run build` conclui sem erro; inspecionar qualquer elemento no browser mostra `--tw-bg-opacity` aplicado nas cores `purple-500`, `gold-500`, `surface`.

---

### P1: Global Layout Dark ⭐ MVP

**User Story**: Como usuário, quero que toda a aplicação tenha fundo escuro (void) e que o texto seja legível, para que a experiência visual seja coerente desde o primeiro acesso.

**Por que P1**: Sem isso, todos os outros componentes ficam inconsistentes.

**Acceptance Criteria**:

1. WHEN a aplicação carrega THEN o `<body>` e o container raiz SHALL ter `background-color: #080809` (void)
2. WHEN qualquer página autenticada é renderizada THEN o Layout SHALL usar `bg-void min-h-screen text-text-primary`
3. WHEN a página de Login/Register é renderizada THEN ela SHALL usar o mesmo fundo void com o formulário centralizado em `bg-surface` card
4. WHEN o usuário rola a página THEN a TopBar SHALL permanecer fixa no topo com `bg-surface border-b border-border-subtle backdrop-blur-sm`

**Independent Test**: Abrir qualquer rota — inspecionar `<body>` mostra background `#080809`; TopBar visível e fixa ao scroll.

---

### P1: TopBar Redesign ⭐ MVP

**User Story**: Como usuário, quero uma barra de navegação superior com ícones + labels, logo com identidade visual e avatar de perfil, para que a navegação seja intuitiva e reflita o caráter premium da plataforma.

**Por que P1**: A navbar é o elemento presente em 100% das telas autenticadas.

**Acceptance Criteria**:

1. WHEN a TopBar é renderizada THEN SHALL exibir: logo "◆ Congreats" com gradiente roxo→vinho (esquerda), nav items com ícone+label (centro), avatar do usuário com dropdown (direita)
2. WHEN o usuário está na rota `/dashboard` THEN o nav item "Início" SHALL ter estado ativo: `bg-purple-900 text-purple-300 border border-purple-700 rounded-full px-4 py-1.5`
3. WHEN o usuário hover em um nav item inativo THEN ele SHALL transitar para `bg-overlay text-primary` em 150ms
4. WHEN o usuário clica no avatar THEN SHALL abrir dropdown com opções: "Ver Perfil", "Sair"
5. WHEN o usuário tem role ADMIN THEN a TopBar SHALL exibir um ícone de escudo com dropdown contendo os links de admin (não links individuais na nav principal)
6. WHEN a navegação ocorre THEN o browser NÃO SHALL recarregar a página (react-router SPA)

**Independent Test**: Clicar em todos os nav items — URL muda, página transiciona sem reload; nav item correto fica ativo.

---

### P1: Route Transition Animations ⭐ MVP

**User Story**: Como usuário, quero que toda mudança de rota principal seja acompanhada de uma animação de slide + fade, para que a sensação de navegação seja fluida e dinâmica.

**Por que P1**: Um dos requisitos centrais do redesign — "toda mudança de área deve ter animação".

**Acceptance Criteria**:

1. WHEN o usuário navega de qualquer rota para qualquer outra rota THEN a página nova SHALL entrar com `opacity: 0 → 1` + `translateX: 24px → 0` em 250ms ease-out
2. WHEN a página atual sai THEN ela SHALL sair com `opacity: 1 → 0` + `translateX: 0 → -24px` em 200ms ease-in
3. WHEN `prefers-reduced-motion: reduce` está ativo no sistema operacional do usuário THEN as animações SHALL ser desabilitadas (apenas fade sem translate)
4. WHEN a transição está ocorrendo THEN a TopBar NÃO SHALL animar — apenas o conteúdo da `<main>` anima
5. WHEN o usuário navega rapidamente (click rápido) THEN a animação de saída SHALL ser interrompida e a entrada da nova página SHALL começar imediatamente (AnimatePresence mode="wait" OR exitBeforeEnter)

**Independent Test**: Navegar entre Dashboard → Discovery → Perfil observando slide suave sem flash de tela branca.

---

### P1: Button Component Library ⭐ MVP

**User Story**: Como desenvolvedor, quero um componente `<Button>` com variantes (primary, secondary, destructive, achievement, ghost, icon), para que não existam mais botões ad-hoc com classes soltas.

**Por que P1**: Botões aparecem em todas as páginas. Sem componente unificado, o redesign fica inconsistente.

**Acceptance Criteria**:

1. WHEN `<Button variant="primary">` é usado THEN SHALL renderizar com `bg-purple-500 hover:bg-purple-400 text-white rounded-xl px-6 py-3 font-semibold` + shadow glow roxo
2. WHEN `<Button variant="secondary">` é usado THEN SHALL renderizar com borda `border-purple-700`, texto `text-purple-300`, fundo transparente, hover `bg-purple-900`
3. WHEN `<Button variant="destructive">` é usado THEN SHALL renderizar com `bg-wine-700 hover:bg-wine-500 text-white`
4. WHEN `<Button variant="achievement">` é usado THEN SHALL renderizar com borda `border-gold-700`, texto `text-gold-400`, fundo `bg-gold-900`
5. WHEN `<Button variant="ghost">` é usado THEN SHALL renderizar com fundo transparente, texto `text-secondary`, hover `text-primary bg-overlay`
6. WHEN `<Button isLoading>` é usado THEN SHALL exibir spinner e desabilitar clique
7. WHEN qualquer botão recebe foco via teclado THEN SHALL exibir `focus-visible:ring-2 focus-visible:ring-purple-500`
8. WHEN um botão é pressionado THEN SHALL animar `scale(0.97)` em 80ms

**Independent Test**: Renderizar um Storybook ou página de teste mostrando todos as variantes lado a lado.

---

### P1: Card Component ⭐ MVP

**User Story**: Como desenvolvedor, quero componentes de card (`<Card>`, `<RecognitionCard>`, `<StatCard>`) com os estilos do design system, para substituir as divs ad-hoc com fundo branco/cinza.

**Por que P1**: Cards são o container visual dominante de todo o conteúdo.

**Acceptance Criteria**:

1. WHEN `<Card>` é usado THEN SHALL renderizar com `bg-surface border border-border-subtle rounded-2xl p-6` + hover com `border-purple-700/50 shadow-purple-glow` em 200ms
2. WHEN `<RecognitionCard recognition={...}>` é usado THEN SHALL exibir: barra lateral roxa, avatar do reconhecedor, nome + categoria badge roxo, mensagem truncada, data
3. WHEN `<StatCard label="Reconhecimentos" value={42} icon={...}>` é usado THEN SHALL exibir número grande em `text-purple-300`, label em `text-secondary`, ícone em container `bg-purple-900`
4. WHEN um card é hover THEN a transição de borda e sombra SHALL ocorrer em 200ms ease-out sem layout shift

**Independent Test**: Dashboard mostra stat cards e recognition cards com visual correto — sem bordas brancas ou fundos cinzas.

---

### P2: Input Component Library

**User Story**: Como desenvolvedor, quero componentes `<Input>`, `<Select>`, `<Textarea>` estilizados conforme o design system, para que formulários sejam visualmente coerentes com o dark theme.

**Por que P2**: Formulários são frequentes mas não são o primeiro impacto visual — podem vir logo após P1.

**Acceptance Criteria**:

1. WHEN `<Input>` é renderizado THEN SHALL ter `bg-elevated border border-border-dim rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary`
2. WHEN `<Input>` recebe foco THEN SHALL transitar para `border-purple-500 ring-2 ring-purple-500/20`
3. WHEN `<Input error="mensagem">` é usado THEN SHALL exibir borda `border-error` e mensagem de erro em `text-xs text-error` abaixo
4. WHEN `<Select>` é aberto THEN o dropdown SHALL ter `bg-elevated border border-border-dim rounded-xl` com options no dark theme
5. WHEN todos os formulários da aplicação são renderizados THEN não SHALL existir nenhum input com fundo branco

**Independent Test**: Abrir Create Recognition, Edit Profile — todos os inputs têm fundo elevated dark.

---

### P2: Horizontal Tab Navigation

**User Story**: Como usuário, quero navegar entre seções de uma mesma página (ex: perfil) via tabs horizontais, para que a navegação seja fluida e sem recarregar a página.

**Por que P2**: Melhora significativa de UX nas páginas de Perfil e Admin, mas a aplicação funciona sem isso.

**Acceptance Criteria**:

1. WHEN o componente `<TabNav>` é usado THEN SHALL renderizar um strip `bg-elevated rounded-2xl p-1` com tabs como pills
2. WHEN uma tab está ativa THEN ela SHALL ter `bg-purple-900 text-purple-300 border border-purple-700 rounded-xl`
3. WHEN o usuário clica em outra tab THEN o conteúdo SHALL trocar com fade-in 200ms (sem mudança de URL)
4. WHEN a página de Perfil é aberta THEN SHALL exibir tabs: "Reconhecimentos" | "Medalhas" | "Troféus" | "Validações"
5. WHEN a página Admin é aberta THEN SHALL exibir tabs: "Usuários" | "Workspaces" | "Campanhas" | "Eventos" | "Validações" | "Integrações"

**Independent Test**: Navegar pelas tabs do Perfil — conteúdo muda com fade; tab ativa destacada em roxo.

---

### P2: Profile Page Redesign

**User Story**: Como usuário, quero que meu perfil tenha um header visualmente impactante com avatar, stats e tabs, para que minha página de reconhecimento reflita minha importância na plataforma.

**Por que P2**: O perfil é o cartão de visitas do usuário — essencial para a proposta de valor.

**Acceptance Criteria**:

1. WHEN a página de Perfil é aberta THEN SHALL exibir header com: gradiente de fundo roxo→vinho, avatar XL (128px) centralizado (com borda dourada se tiver troféus), nome em `text-3xl font-bold text-text-primary`, cargo em `text-secondary`
2. WHEN o perfil exibe stats THEN SHALL usar uma barra horizontal com 3 stat cards: "Reconhecimentos Recebidos", "Medalhas", "Posição no Ranking"
3. WHEN as tabs são exibidas THEN seguem os critérios de REDESIGN-10 (P2: Horizontal Tab Navigation)
4. WHEN o usuário visualiza o próprio perfil THEN SHALL exibir botão "Editar Perfil" (secondary variant) no header

**Independent Test**: Acessar `/profile/:id` — header com gradiente, avatar, stats bar e tabs visíveis.

---

### P2: Achievement Visual Components

**User Story**: Como usuário, quero que medalhas e troféus sejam exibidos com visual dourado e metálico, para que as conquistas pareçam valiosas e motivem o engajamento.

**Por que P2**: Gamification é core do produto — o visual dourado reforça o valor das conquistas.

**Acceptance Criteria**:

1. WHEN um componente `<MedalBadge>` é exibido THEN SHALL ter gradiente radial dourado, borda `border-gold-300/40`, sombra `shadow-gold-glow`
2. WHEN um componente `<TrophyBadge>` é exibido THEN SHALL ter visual hexagonal (via clip-path), gradiente dourado mais complexo, label abaixo em `text-gold-300 text-xs`
3. WHEN o usuário está em posição 1 no ranking THEN o badge SHALL usar a cor gold-500; posição 2 = prata (#A8A8B0); posição 3 = bronze (#C07830)
4. WHEN o usuário hover em uma medalha ou troféu THEN ela SHALL animar `scale(1.1)` + intensificar o gold glow em 200ms
5. WHEN o usuário não possui conquistas THEN o estado vazio SHALL exibir placeholder com texto motivacional em `text-secondary`, sem espaço vazio não comunicado

**Independent Test**: Acessar perfil de usuário com medalhas — visual dourado; hover nas medalhas anima.

---

### P2: Create Recognition — Visual Category Selector

**User Story**: Como usuário, quero selecionar a categoria do reconhecimento via cards visuais com ícone, em vez de um dropdown, para que a ação de reconhecer seja mais expressiva e engajante.

**Por que P2**: Melhora o fluxo mais importante da aplicação, mas o dropdown atual ainda funciona.

**Acceptance Criteria**:

1. WHEN o passo de categoria é exibido THEN SHALL renderizar um grid 3-4 colunas de cards de 100×80px
2. WHEN cada categoria card está no estado padrão THEN SHALL ter `bg-surface border border-border-subtle text-text-secondary` com ícone centralizado
3. WHEN o usuário seleciona uma categoria THEN o card SHALL transitar para `bg-purple-900 border border-purple-500 text-purple-300`
4. WHEN o Create Recognition tem múltiplos passos THEN SHALL exibir step indicator (pills ●○○) mostrando progresso
5. WHEN o passo final é exibido THEN SHALL mostrar preview do recognition card antes do envio

**Independent Test**: Acessar `/recognitions/new` — grid de categorias; selecionar uma; step indicator atualiza; preview no último step.

---

### P3: Dashboard Hero Section

**User Story**: Como usuário, quero que o Dashboard tenha uma seção hero personalizada com meu nome e destaques rápidos, para que o ingresso na plataforma seja acolhedor e motivante.

**Por que P3**: Melhoria de experiência mas o dashboard é utilizável sem isso.

**Acceptance Criteria**:

1. WHEN o Dashboard é carregado THEN SHALL exibir saudação personalizada "Bom dia/tarde/noite, [Nome]" com texto em gradient roxo
2. WHEN o Dashboard é carregado THEN SHALL exibir contagem de reconhecimentos recebidos no mês atual
3. WHEN o Dashboard é carregado THEN SHALL exibir CTA visual "Reconhecer alguém" destacado como primary button de tamanho maior

**Independent Test**: Acessar `/dashboard` — saudação com nome do usuário, stats do mês, CTA visível.

---

### P3: Workspace Cards Grid

**User Story**: Como usuário, quero ver meus workspaces como cards visuais em grid, para que a navegação entre espaços de trabalho seja mais intuitiva.

**Por que P3**: A lista atual funciona; o grid é upgrade visual.

**Acceptance Criteria**:

1. WHEN `/workspaces` é aberto THEN SHALL exibir grid 3 colunas (responsive: 1 mobile, 2 tablet, 3 desktop) de Workspace Cards
2. WHEN cada Workspace Card é exibido THEN SHALL ter: emoji/ícone do workspace, nome em `text-lg font-semibold`, badge de membros, última atividade em `text-secondary text-sm`
3. WHEN o usuário hover em um Workspace Card THEN ele SHALL elevar com `translateY(-4px)` + `shadow-purple-glow` em 200ms

**Independent Test**: Acessar `/workspaces` — grid de cards; hover anima; clicar navega para o workspace.

---

## Edge Cases

- WHEN o usuário está em conexão lenta e a página carrega THEN o conteúdo SHALL exibir skeleton screens (shimmer dark) em vez de espaços vazios ou spinners genéricos
- WHEN o avatar de um usuário falha ao carregar THEN SHALL exibir as iniciais em `bg-purple-900 text-purple-300`
- WHEN o usuário não tem nenhuma conquista THEN as seções de medalhas/troféus SHALL exibir estado vazio motivacional, não um espaço em branco
- WHEN uma rota não existe THEN o 404 SHALL usar o mesmo dark theme e oferecer link de volta ao dashboard
- WHEN o usuário está na animação de transição e clica novamente THEN a AnimatePresence SHALL tratar isso sem flash ou estado inconsistente

---

## Requirement Traceability

| ID | História | Fase | Status |
|----|---------|------|--------|
| REDESIGN-01 | P1: Design Token System | Done | Verified ✅ |
| REDESIGN-02 | P1: Global Layout Dark | Done | Verified ✅ |
| REDESIGN-03 | P1: TopBar Redesign | Done | Verified ✅ |
| REDESIGN-04 | P1: Route Transition Animations | Done | Verified ✅ |
| REDESIGN-05 | P1: Button Component Library | Done | Verified ✅ |
| REDESIGN-06 | P1: Card Component | Done | Verified ✅ |
| REDESIGN-07 | P2: Input Component Library | Done | Verified ✅ |
| REDESIGN-08 | P2: Horizontal Tab Navigation | Done | Verified ✅ |
| REDESIGN-09 | P2: Profile Page Redesign | Done | Verified ✅ |
| REDESIGN-10 | P2: Achievement Visual Components | Done | Verified ✅ |
| REDESIGN-11 | P2: Create Recognition Visual Category | Done | Verified ✅ |
| REDESIGN-12 | P3: Dashboard Hero Section | Done | Verified ✅ |
| REDESIGN-13 | P3: Workspace Cards Grid | Done | Verified ✅ |

**Coverage**: 13 total, 0 mapeados em tasks, 13 pendentes

---

## Success Criteria

- [ ] Nenhuma cor do preset padrão do Tailwind (blue, gray, white) usada nos arquivos src/
- [ ] Todas as rotas transitam com animação suave — sem flash de tela branca
- [ ] O browser nunca recarrega a página durante a navegação
- [ ] Botões, cards, inputs e badges seguem o design system — sem componentes ad-hoc com classes soltas
- [ ] A identidade visual comunica o caráter premium e gamificado do produto
- [ ] `npm run build` passa sem erros de TypeScript após o redesign

# Visual Redesign — Tasks

**Spec**: `.specs/features/visual-redesign/spec.md`  
**Design System**: `.specs/project/DESIGN-SYSTEM.md`  
**Status**: Done ✅  
**Gate commands**:
- Quick: `cd frontend && npm run typecheck`
- Full: `cd frontend && npm run build`

> **Nota sobre testes**: O projeto não possui framework de testes configurado.
> O gate de qualidade é TypeScript (`typecheck`) + build sem erros.
> Tasks marcadas `Tests: none` são legítimas neste contexto.

---

## Execution Plan

### Phase 1: Setup (Sequential)

Fundação que tudo o mais depende. Deve rodar em sequência.

```
T1 → T2 → T3
```

### Phase 2: Primitive Components (Parallel)

Após T3, todos os componentes base podem ser criados em paralelo — arquivos independentes.

```
T3 complete, then:
  ├── T4  [P] Button component
  ├── T5  [P] Card base component
  ├── T6  [P] Avatar component
  ├── T7  [P] Badge/Pill components
  ├── T8  [P] Input + Textarea components
  ├── T9  [P] Select component
  ├── T10 [P] TabNav component
  └── T11 [P] MedalBadge + TrophyBadge components
```

### Phase 3: App Shell (Sequential)

Depende de T2 (tokens), T1 (framer-motion + lucide), T4 (Button), T6 (Avatar), T7 (Badge).
Deve rodar em sequência — cada peça é base da próxima.

```
T12 → T13 → T14
```

### Phase 4: Pages (Parallel)

Todas as páginas dependem do shell (T14) e dos componentes específicos.
Podem ser implementadas em paralelo entre si.

```
T14 complete, then:
  ├── T15 [P] Auth pages (Login + Register)
  ├── T16 [P] DashboardPage          (depends: T5, T7)
  ├── T17 [P] ProfilePage            (depends: T5, T6, T10, T11)
  ├── T18 [P] DiscoveryPage          (depends: T5, T7, T10)
  ├── T19 [P] CreateRecognitionPage  (depends: T4, T5, T7)
  ├── T20 [P] WorkspacesPage         (depends: T5)
  └── T21 [P] Admin pages            (depends: T10)
```

### Phase 5: Final Gate (Sequential)

```
All Phase 4 → T22
```

---

## Task Breakdown

---

### T1: Instalar framer-motion e lucide-react

**What**: Adicionar `framer-motion` e `lucide-react` ao `package.json` do frontend e confirmar que o build passa após a instalação
**Where**: `frontend/package.json`
**Depends on**: None
**Reuses**: —
**Requirement**: REDESIGN-04 (animações), REDESIGN-03 (ícones na TopBar)

**Done when**:

- [ ] `framer-motion@^11` presente em `dependencies`
- [ ] `lucide-react@^0.400` presente em `dependencies`
- [ ] `npm install` executado sem erros
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T2: Atualizar tailwind.config.js com design tokens

**What**: Substituir a configuração atual do Tailwind pela paleta completa do DESIGN-SYSTEM.md seção 8 — tokens void, surface, elevated, overlay, border, purple, wine, gold, text, boxShadow glow, keyframes shimmer e gold-pulse
**Where**: `frontend/tailwind.config.js`
**Depends on**: T1
**Reuses**: `frontend/tailwind.config.js` (substituição total do bloco `colors`)
**Requirement**: REDESIGN-01

**Done when**:

- [ ] Cores void, surface, elevated, overlay presentes
- [ ] Escalas completas: `purple-{900,700,500,400,300,100}`, `wine-{900,700,500,400,300}`, `gold-{900,700,500,400,300}`
- [ ] `border.subtle` e `border.dim` presentes
- [ ] `text-{primary,secondary,tertiary,inverse}` presentes
- [ ] `boxShadow` com `purple-glow`, `purple-glow-lg`, `gold-glow`, `wine-glow`
- [ ] `keyframes` com `shimmer` e `gold-pulse` e suas `animation` aliases
- [ ] `fontFamily.sans` com Inter como primeira opção
- [ ] Preset padrão do Tailwind (`blue-*`, `gray-*`) removido ou sobrescrito pelos tokens
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T3: Atualizar index.css — Inter font + body dark theme

**What**: Importar a fonte Inter do Google Fonts, definir estilos globais para `html`/`body` com `background-color: #080809` (void) e `color: #F0F0F5` (text-primary), e adicionar o keyframe `shimmer`
**Where**: `frontend/src/index.css`
**Depends on**: T2
**Reuses**: `frontend/src/index.css` (adicionar ao existente)
**Requirement**: REDESIGN-02

**Done when**:

- [ ] `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')` no topo
- [ ] `body { background-color: #080809; color: #F0F0F5; font-family: 'Inter', ... }` definido
- [ ] `* { box-sizing: border-box }` presente
- [ ] Keyframe `@keyframes shimmer` definido com traveling gradient
- [ ] Gate check passes: `cd frontend && npm run build`

**Tests**: none  
**Gate**: full

---

### T4: Criar componente Button com todas as variantes [P]

**What**: Criar `src/components/ui/Button.tsx` — componente React com variantes `primary | secondary | destructive | achievement | ghost | icon`, props `isLoading`, `size` (`sm | md | lg`), e animação de press via framer-motion
**Where**: `frontend/src/components/ui/Button.tsx`
**Depends on**: T3
**Reuses**: padrões de tipos TypeScript existentes no projeto
**Requirement**: REDESIGN-05

**Done when**:

- [ ] Interface `ButtonProps` estende `React.ButtonHTMLAttributes<HTMLButtonElement>` com `variant`, `size`, `isLoading` opcionais
- [ ] Variante `primary`: `bg-purple-500 hover:bg-purple-400 text-white rounded-xl px-6 py-3 font-semibold shadow-purple-glow`
- [ ] Variante `secondary`: `border border-purple-700 text-purple-300 hover:bg-purple-900 rounded-xl`
- [ ] Variante `destructive`: `bg-wine-700 hover:bg-wine-500 text-white rounded-xl`
- [ ] Variante `achievement`: `bg-gold-900 border border-gold-700 text-gold-400 hover:bg-gold-900/80 rounded-xl`
- [ ] Variante `ghost`: `text-text-secondary hover:text-text-primary hover:bg-overlay rounded-xl`
- [ ] Variante `icon`: circular 40px, sem label
- [ ] `isLoading=true` mostra spinner (SVG animado) e desabilita clique
- [ ] `focus-visible:ring-2 focus-visible:ring-purple-500` em todas as variantes
- [ ] Animação de press: `whileTap={{ scale: 0.97 }}` via framer-motion
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T5: Criar componente Card base [P]

**What**: Criar `src/components/ui/Card.tsx` — componente com `bg-surface border border-border-subtle rounded-2xl p-6` e hover com `border-purple-700/50 shadow-purple-glow` via framer-motion `whileHover`
**Where**: `frontend/src/components/ui/Card.tsx`
**Depends on**: T3
**Reuses**: —
**Requirement**: REDESIGN-06

**Done when**:

- [ ] Interface `CardProps` com `className?`, `children`, `onClick?`, `hoverable?` (boolean, default true)
- [ ] Estilos base: `bg-surface border border-border-subtle rounded-2xl p-6`
- [ ] Quando `hoverable=true`: `whileHover={{ scale: 1.015 }}` + classe hover `hover:border-purple-700/50 hover:shadow-purple-glow`
- [ ] Transição: `transition={{ duration: 0.2, ease: 'easeOut' }}`
- [ ] Exportar também `CardHeader`, `CardBody`, `CardFooter` como sub-componentes simples
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T6: Criar componente Avatar [P]

**What**: Criar `src/components/ui/Avatar.tsx` — componente com tamanhos `sm | md | lg | xl | 2xl`, estados de borda `default | gold | wine`, e fallback de iniciais em `bg-purple-900 text-purple-300`
**Where**: `frontend/src/components/ui/Avatar.tsx`
**Depends on**: T3
**Reuses**: —
**Requirement**: REDESIGN-03 (nav), REDESIGN-09 (perfil)

**Done when**:

- [ ] Prop `size`: `'sm'(24px) | 'md'(36px) | 'lg'(56px) | 'xl'(80px) | '2xl'(128px)`
- [ ] Prop `border`: `'default' | 'gold' | 'wine'` — aplica `border-2` com a cor correspondente
- [ ] Prop `src?`: URL da imagem; quando ausente ou com erro, exibe iniciais
- [ ] Prop `name`: usado para calcular iniciais e `alt`
- [ ] Fallback de iniciais: `bg-purple-900 text-purple-300 font-semibold`
- [ ] Forma circular: `rounded-full overflow-hidden`
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T7: Criar componentes Badge e Pill [P]

**What**: Criar `src/components/ui/Badge.tsx` com variantes `category | admin | achievement | status (success | warning | error | info)` — pequenos elementos inline de identificação
**Where**: `frontend/src/components/ui/Badge.tsx`
**Depends on**: T3
**Reuses**: —
**Requirement**: REDESIGN-06 (RecognitionCard usa category badge)

**Done when**:

- [ ] Prop `variant`: `'category' | 'admin' | 'achievement' | 'success' | 'warning' | 'error' | 'info'`
- [ ] Variante `category`: `bg-purple-900 text-purple-300 border-purple-700/30`
- [ ] Variante `admin`: `bg-wine-900 text-wine-300 border-wine-700/30`
- [ ] Variante `achievement`: `bg-gold-900 text-gold-400 border-gold-700/50`
- [ ] Variantes de status: cada uma com bg/text/border na cor correspondente ao status
- [ ] Todos: `rounded-full px-3 py-1 text-xs font-medium border`
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T8: Criar componentes Input e Textarea [P]

**What**: Criar `src/components/ui/Input.tsx` e `src/components/ui/Textarea.tsx` — inputs dark com `bg-elevated border border-border-dim rounded-xl`, focus roxo, e estado de erro
**Where**: `frontend/src/components/ui/Input.tsx`, `frontend/src/components/ui/Textarea.tsx`
**Depends on**: T3
**Reuses**: —
**Requirement**: REDESIGN-07

**Done when**:

- [ ] `Input`: estende `React.InputHTMLAttributes<HTMLInputElement>` + props `label?`, `error?`, `leftIcon?`
- [ ] Estilos base: `bg-elevated border border-border-dim rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary w-full`
- [ ] Focus: `focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none`
- [ ] Estado de erro: `border-error focus:border-error focus:ring-error/20`; mensagem `text-xs text-error mt-1`
- [ ] Label renderizado como `<label>` com `text-sm font-medium text-text-secondary mb-2`
- [ ] `Textarea`: mesmo padrão do Input, prop extra `rows?` (default 3), `resize-y`
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T9: Criar componente Select [P]

**What**: Criar `src/components/ui/Select.tsx` — select estilizado dark com as mesmas bases de Input, ícone chevron em `text-text-secondary`
**Where**: `frontend/src/components/ui/Select.tsx`
**Depends on**: T3
**Reuses**: padrão de Input (T8) — mesmas props de base
**Requirement**: REDESIGN-07

**Done when**:

- [ ] Estende `React.SelectHTMLAttributes<HTMLSelectElement>` + `label?`, `error?`
- [ ] Mesmos estilos base de Input (T8) + `appearance-none cursor-pointer`
- [ ] Ícone chevron (lucide-react `ChevronDown`) posicionado absolutamente à direita
- [ ] Options herdam `bg-elevated text-text-primary` (via CSS global)
- [ ] Estados label e error idênticos ao Input (T8)
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T10: Criar componente TabNav [P]

**What**: Criar `src/components/ui/TabNav.tsx` — tab strip horizontal com `bg-elevated rounded-2xl p-1`, tab ativa em `bg-purple-900 border border-purple-700 rounded-xl`, e troca de conteúdo com fade via framer-motion
**Where**: `frontend/src/components/ui/TabNav.tsx`
**Depends on**: T3
**Reuses**: —
**Requirement**: REDESIGN-08

**Done when**:

- [ ] Interface `Tab` com `{ id: string; label: string; icon?: React.ReactNode; content: React.ReactNode }`
- [ ] Prop `tabs: Tab[]`, `defaultTab?: string`
- [ ] Container do strip: `bg-elevated rounded-2xl p-1 flex gap-1`
- [ ] Tab ativa: `bg-purple-900 text-purple-300 border border-purple-700 rounded-xl px-4 py-2 text-sm font-medium`
- [ ] Tab inativa: `text-text-secondary hover:text-text-primary px-4 py-2 text-sm font-medium rounded-xl transition-colors`
- [ ] Conteúdo: renderizado com `AnimatePresence mode="wait"` e `initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}` em 200ms
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T11: Criar componentes MedalBadge e TrophyBadge [P]

**What**: Criar `src/components/ui/AchievementBadge.tsx` — dois componentes: `MedalBadge` (circular com gradiente dourado) e `TrophyBadge` (hexagonal via clip-path), ambos com hover `scale(1.1)` e gold-pulse glow
**Where**: `frontend/src/components/ui/AchievementBadge.tsx`
**Depends on**: T3
**Reuses**: —
**Requirement**: REDESIGN-10

**Done when**:

- [ ] `MedalBadge`: círculo 64px (lg: 80px), gradiente radial `from-gold-700 via-gold-500 to-gold-400`, borda `border-2 border-gold-300/40`, sombra `shadow-gold-glow`
- [ ] `TrophyBadge`: mesmo visual + clip-path hexagonal + label abaixo em `text-gold-300 text-xs text-center`
- [ ] Ambos aceitam prop `label?` (texto dentro do badge), `size?: 'md' | 'lg'`
- [ ] Hover: `whileHover={{ scale: 1.1 }}` via framer-motion + classe `animate-gold-pulse` no container
- [ ] `RankingBadge`: variante especial para rankings — posição 1 usa gold-500, posição 2 usa `#A8A8B0` (prata), posição 3 usa `#C07830` (bronze), demais: `text-secondary bg-overlay`
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T12: Criar AnimatedRoute — wrapper de transição de rota

**What**: Criar `src/components/AnimatedRoute.tsx` — componente que envolve o conteúdo de página com `motion.div` aplicando `initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}` e suporte a `prefers-reduced-motion`
**Where**: `frontend/src/components/AnimatedRoute.tsx`
**Depends on**: T1 (framer-motion)
**Reuses**: —
**Requirement**: REDESIGN-04

**Done when**:

- [ ] Componente `AnimatedRoute` envolve `children` em `motion.div`
- [ ] Variantes: `initial: { opacity: 0, x: 24 }`, `animate: { opacity: 1, x: 0 }`, `exit: { opacity: 0, x: -24 }`
- [ ] Transição: `{ duration: 0.25, ease: 'easeOut' }`
- [ ] Quando `prefers-reduced-motion: reduce` está ativo no SO: `x` é 0 em todas as variantes (apenas fade)
- [ ] Hook `useReducedMotion()` do framer-motion usado para detectar a preferência
- [ ] O componente NÃO tem height/width próprios — apenas passthrough de layout
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T13: Reconstruir TopBar (substitui Navbar.tsx)

**What**: Substituir `src/components/Navbar.tsx` pela nova `TopBar` com: logo gradiente, nav items ícone+label com estado ativo, dropdown de admin (ícone escudo), dropdown de usuário com avatar
**Where**: `frontend/src/components/Navbar.tsx` (reescrever o arquivo existente)
**Depends on**: T12, T4 (Button), T6 (Avatar), T7 (Badge)
**Reuses**: `useAuth` de `../contexts/AuthContext`, `useNavigate` e `useLocation` do react-router-dom
**Requirement**: REDESIGN-03

**Done when**:

- [ ] Container: `bg-surface border-b border-border-subtle backdrop-blur-sm h-16 fixed top-0 left-0 right-0 z-50`
- [ ] Logo: `◆` + texto "Congreats" com `bg-gradient-to-r from-purple-300 to-wine-400 bg-clip-text text-transparent font-bold text-xl`
- [ ] Nav items (usando lucide-react): Home(`LayoutDashboard`), Descobrir(`Compass`), Reconhecer(`Star`), Workspaces(`Layers`), Validações(`CheckCircle`)
- [ ] Item ativo (detectado via `useLocation`): `bg-purple-900 text-purple-300 border border-purple-700 rounded-full px-4 py-1.5`
- [ ] Item inativo: `text-text-secondary hover:text-text-primary hover:bg-overlay rounded-full px-4 py-1.5 transition-colors`
- [ ] Admin dropdown (role ADMIN): ícone `Shield` + "Admin", ao hover abre painel com links para todas as rotas admin estilizados com wine accent
- [ ] Avatar dropdown (direita): `Avatar` component md, ao click abre dropdown com "Ver Perfil" e "Sair"
- [ ] Dropdown menus: `bg-elevated border border-border-subtle rounded-xl shadow-lg` posicionado absolutamente
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T14: Reconstruir Layout.tsx — dark shell + AnimatedRoute

**What**: Reescrever `src/components/Layout.tsx` para: fundo void, padding-top para compensar TopBar fixa (pt-16), `Outlet` envolvido em `AnimatePresence` + `AnimatedRoute`, e max-width de 6xl
**Where**: `frontend/src/components/Layout.tsx`
**Depends on**: T12 (AnimatedRoute), T13 (Navbar/TopBar)
**Reuses**: `Outlet`, `useLocation` do react-router-dom
**Requirement**: REDESIGN-02, REDESIGN-04

**Done when**:

- [ ] Container raiz: `min-h-screen bg-void`
- [ ] `<Navbar />` renderizado no topo (fixo via CSS na própria Navbar)
- [ ] `<main>` com `pt-16 max-w-6xl mx-auto px-6 py-8`
- [ ] `<AnimatePresence mode="wait">` envolvendo `<AnimatedRoute key={location.pathname}>`
- [ ] `location` obtido via `useLocation()` e usado como `key` do AnimatedRoute para disparar re-animação a cada mudança de rota
- [ ] `<Outlet />` dentro do `AnimatedRoute`
- [ ] Gate check passes: `cd frontend && npm run build`

**Tests**: none  
**Gate**: full

---

### T15: Redesign LoginPage + RegisterPage [P]

**What**: Reescrever `src/pages/LoginPage.tsx` e `src/pages/RegisterPage.tsx` com fundo void, card centralizado em `bg-surface`, logo com gradiente, inputs usando componente `Input` (T8), botão usando `Button` variant primary (T4)
**Where**: `frontend/src/pages/LoginPage.tsx`, `frontend/src/pages/RegisterPage.tsx`
**Depends on**: T14, T4, T8
**Reuses**: `useAuth` de `../contexts/AuthContext`, lógica de submit existente (preservar)
**Requirement**: REDESIGN-02

**Done when**:

- [ ] LoginPage: `min-h-screen bg-void flex items-center justify-center`
- [ ] Card do formulário: `bg-surface border border-border-subtle rounded-2xl p-8 w-full max-w-md`
- [ ] Logo no topo do card: `◆ Congreats` com gradiente
- [ ] Inputs de email e senha usando `<Input>` (T8) — sem inputs nativos soltos
- [ ] Botão de submit usando `<Button variant="primary" className="w-full">` (T4)
- [ ] Link para Register: `text-purple-300 hover:text-purple-400`
- [ ] RegisterPage: mesmo padrão visual + campos adicionais (nome, cargo)
- [ ] Toda a lógica de autenticação existente preservada (apenas visual muda)
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T16: Redesign DashboardPage [P]

**What**: Reescrever `src/pages/DashboardPage.tsx` — hero section personalizada com saudação + stat cards (`StatCard`) + recognition cards recentes (`RecognitionCard`)
**Where**: `frontend/src/pages/DashboardPage.tsx`
**Depends on**: T14, T5 (Card), T7 (Badge)
**Reuses**: lógica de fetch e state existente na DashboardPage; serviços existentes
**Requirement**: REDESIGN-06, REDESIGN-12

**Done when**:

- [ ] Hero section: saudação dinâmica "Bom dia/tarde/noite, [Nome]" com `text-3xl font-bold` e texto em `text-purple-300`; subtext com contagem do mês
- [ ] CTA "Reconhecer alguém": `<Button variant="primary" size="lg">` linkando para `/recognitions/new`
- [ ] Grid de stat cards (usando `<Card>` de T5): reconhecimentos recebidos, medalhas, posição no ranking
- [ ] Feed de reconhecimentos recentes: lista de cards usando `bg-surface border border-border-subtle rounded-2xl p-4` com barra lateral roxa
- [ ] Skeleton screen (shimmer dark via CSS) enquanto dados carregam — sem spinner branco
- [ ] Nenhum uso de `bg-white`, `bg-gray-*`, `text-gray-*`, `border-gray-*`
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T17: Redesign ProfilePage [P]

**What**: Reescrever `src/pages/ProfilePage.tsx` — header com gradiente, avatar XL, stats bar, `TabNav` com tabs Reconhecimentos | Medalhas | Troféus | Validações
**Where**: `frontend/src/pages/ProfilePage.tsx`
**Depends on**: T14, T5 (Card), T6 (Avatar), T10 (TabNav), T11 (AchievementBadge)
**Reuses**: lógica de fetch existente; `useParams` para userId
**Requirement**: REDESIGN-09, REDESIGN-10

**Done when**:

- [ ] Header: `bg-gradient-to-br from-purple-900 to-wine-900 rounded-2xl p-8` com avatar XL centralizado
- [ ] Avatar com borda gold quando usuário tem troféus, borda default caso contrário
- [ ] Nome em `text-3xl font-bold text-text-primary`, cargo em `text-text-secondary`
- [ ] Stats bar horizontal com 3 métricas separadas por `border-l border-border-subtle`
- [ ] Botão "Editar Perfil" (variant secondary) visível somente quando `userId === user.id`
- [ ] `<TabNav>` com 4 tabs: Reconhecimentos, Medalhas, Troféus, Validações
- [ ] Aba Medalhas: grid de `<MedalBadge>` (T11)
- [ ] Aba Troféus: grid de `<TrophyBadge>` (T11)
- [ ] Estado vazio de cada aba: mensagem motivacional em `text-text-secondary`, sem espaço em branco
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T18: Redesign DiscoveryPage [P]

**What**: Reescrever `src/pages/DiscoveryPage.tsx` — `TabNav` com filtros (Todos | Por Workspace | Ranking), feed de recognition cards dark, loading skeleton
**Where**: `frontend/src/pages/DiscoveryPage.tsx`
**Depends on**: T14, T5 (Card), T7 (Badge), T10 (TabNav)
**Reuses**: lógica de fetch e paginação existente; `discoveryService`
**Requirement**: REDESIGN-08

**Done when**:

- [ ] `<TabNav>` no topo com tabs: "Todos", "Por Workspace", "Ranking"
- [ ] Tab "Todos": feed de recognition cards com barra lateral roxa, avatar, nome, categoria badge, mensagem truncada, data
- [ ] Tab "Ranking": lista com `RankingBadge` (posição), avatar, nome, contagem de reconhecimentos
- [ ] Skeleton screens (dark shimmer) durante loading — sem spinner branco
- [ ] Estado vazio: mensagem em `text-text-secondary` — sem espaço em branco não comunicado
- [ ] Nenhum uso de cores padrão do Tailwind (branco/cinza)
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T19: Redesign CreateRecognitionPage [P]

**What**: Reescrever `src/pages/CreateRecognitionPage.tsx` — step indicator visual (pills ●○○), step 1 (busca de usuário), step 2 (grid visual de categorias), step 3 (textarea + preview card antes do envio)
**Where**: `frontend/src/pages/CreateRecognitionPage.tsx`
**Depends on**: T14, T4 (Button), T5 (Card), T7 (Badge)
**Reuses**: lógica de submit existente; `recognitionService`; lista de usuários e categorias
**Requirement**: REDESIGN-11

**Done when**:

- [ ] Step indicator: pills com `●` preenchido para step atual/completo, `○` para futuros — transição com framer-motion
- [ ] Step 1 "Para quem?": input de busca (`<Input>` de T8) + lista de usuários como cards clicáveis (`bg-surface hover:bg-overlay`)
- [ ] Step 2 "Por quê?": grid 3-4 colunas de category cards 100×80px — estado padrão `bg-surface border border-border-subtle text-text-secondary`, selecionado `bg-purple-900 border border-purple-500 text-purple-300`
- [ ] Step 3 "Mensagem": `<Textarea>` (T8) + preview do recognition card final ao lado
- [ ] Botão "Enviar": `<Button variant="primary">` ativo somente quando todos os steps válidos
- [ ] Transição entre steps: slide lateral com framer-motion
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T20: Redesign WorkspacesPage [P]

**What**: Reescrever `src/pages/WorkspacesPage.tsx` — grid responsivo de workspace cards (1 col mobile, 2 tablet, 3 desktop) com hover lift + purple glow
**Where**: `frontend/src/pages/WorkspacesPage.tsx`
**Depends on**: T14, T5 (Card)
**Reuses**: lógica de fetch existente; `workspaceService`
**Requirement**: REDESIGN-13

**Done when**:

- [ ] Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- [ ] Cada workspace card usa `<Card hoverable>` (T5) com: emoji/ícone do workspace (ou inicial em `bg-purple-900`), nome em `text-lg font-semibold`, badge de membros (Badge T7), última atividade em `text-text-secondary text-sm`
- [ ] Hover: `motion.div whileHover={{ y: -4 }}` + `shadow-purple-glow` (via Card de T5)
- [ ] Botão "Criar Workspace" no topo: `<Button variant="secondary">` — preservar lógica existente
- [ ] Estado vazio: card de CTA para criar primeiro workspace
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T21: Redesign Admin pages com TabNav [P]

**What**: Reescrever as 6 páginas admin (`AdminUsersPage`, `AdminWorkspacesPage`, `AdminCampaignsPage`, `AdminEventsPage`, `AdminValidationsPage`, `AdminIntegrationsPage`) para usar `TabNav` como navegação unificada, com wine accent nas tabs
**Where**: `frontend/src/pages/admin/Admin*.tsx` (todos os 6 arquivos)
**Depends on**: T14, T10 (TabNav), T4 (Button)
**Reuses**: toda a lógica de fetch e CRUD existente em cada arquivo; `adminService`
**Requirement**: REDESIGN-08

**Done when**:

- [ ] Cada arquivo admin ainda funciona independentemente (rota própria preservada)
- [ ] Cada página admin exibe `TabNav` no topo com todas as seções admin como tabs (reutilizar o mesmo strip em cada página, com a tab correspondente ativa por padrão)
- [ ] Tabs admin: ícone escudo + wine accent — tab ativa `bg-wine-900 text-wine-300 border border-wine-700`
- [ ] Tabelas e listas: `bg-surface border border-border-subtle rounded-2xl` — sem tabelas com fundo branco
- [ ] Botões de ação nas tabelas: variante `destructive` para exclusão, `secondary` para edição
- [ ] Gate check passes: `cd frontend && npm run typecheck`

**Tests**: none  
**Gate**: quick

---

### T22: Gate final — build limpo sem erros de TypeScript

**What**: Executar `npm run build` e corrigir TODOS os erros de TypeScript e Vite que emergirem da integração completa das fases anteriores
**Where**: qualquer arquivo em `frontend/src/` que tenha erros de compilação
**Depends on**: T15, T16, T17, T18, T19, T20, T21
**Reuses**: —
**Requirement**: todos (critério de sucesso global da spec)

**Done when**:

- [ ] `cd frontend && npm run build` executa sem erros (`exit code 0`)
- [ ] Zero warnings de TypeScript `error TS*`
- [ ] Bundle gerado em `frontend/dist/` sem arquivos faltando
- [ ] Nenhum `import` quebrado ou componente não encontrado
- [ ] Nenhuma cor hard-coded fora dos tokens do design system (verificar grep por `bg-white`, `bg-gray-`, `text-gray-`, `border-gray-`, `text-blue-`, `bg-blue-`)

**Verify**:
```bash
cd frontend && npm run build
# Expected: output sem erros, tamanho de bundle razoável

grep -r "bg-white\|bg-gray-\|text-gray-\|text-blue-\|bg-blue-\|border-gray-" src/ --include="*.tsx" --include="*.ts"
# Expected: sem resultados (zero linhas)
```

**Tests**: none  
**Gate**: full

---

## Parallel Execution Map

```
Phase 1 (Sequential — foundation):
  T1 ──→ T2 ──→ T3

Phase 2 (Parallel — após T3):
  T3 complete, then simultaneously:
    ├── T4  [P] Button
    ├── T5  [P] Card
    ├── T6  [P] Avatar
    ├── T7  [P] Badge
    ├── T8  [P] Input + Textarea
    ├── T9  [P] Select
    ├── T10 [P] TabNav
    └── T11 [P] AchievementBadge

Phase 3 (Sequential — app shell):
  T12 ──→ T13 ──→ T14

Phase 4 (Parallel — após T14 + respectivos componentes):
  T14 complete, then simultaneously:
    ├── T15 [P] Auth pages
    ├── T16 [P] DashboardPage
    ├── T17 [P] ProfilePage
    ├── T18 [P] DiscoveryPage
    ├── T19 [P] CreateRecognitionPage
    ├── T20 [P] WorkspacesPage
    └── T21 [P] Admin pages

Phase 5 (Sequential — gate):
  All Phase 4 ──→ T22
```

---

## Task Granularity Check

| Task | Escopo | Status |
|------|--------|--------|
| T1: Instalar dependências | 1 arquivo (package.json) | ✅ Granular |
| T2: Tailwind tokens | 1 arquivo (tailwind.config.js) | ✅ Granular |
| T3: index.css + font | 1 arquivo (index.css) | ✅ Granular |
| T4: Button component | 1 componente | ✅ Granular |
| T5: Card component | 1 componente | ✅ Granular |
| T6: Avatar component | 1 componente | ✅ Granular |
| T7: Badge component | 1 componente | ✅ Granular |
| T8: Input + Textarea | 2 componentes relacionados (mesma interface) | ⚠️ OK — coesos |
| T9: Select | 1 componente | ✅ Granular |
| T10: TabNav | 1 componente | ✅ Granular |
| T11: MedalBadge + TrophyBadge | 2 variantes de 1 componente (1 arquivo) | ⚠️ OK — coesos |
| T12: AnimatedRoute | 1 componente | ✅ Granular |
| T13: Navbar/TopBar | 1 componente | ✅ Granular |
| T14: Layout | 1 componente | ✅ Granular |
| T15: Login + Register | 2 páginas de auth (mesmo padrão visual, sem lógica diferente) | ⚠️ OK — coesos |
| T16: DashboardPage | 1 página | ✅ Granular |
| T17: ProfilePage | 1 página | ✅ Granular |
| T18: DiscoveryPage | 1 página | ✅ Granular |
| T19: CreateRecognitionPage | 1 página | ✅ Granular |
| T20: WorkspacesPage | 1 página | ✅ Granular |
| T21: Admin pages | 6 páginas com mesmo padrão (TabNav wrapper) | ⚠️ OK — mudança mecânica uniforme |
| T22: Build gate | verificação de integração | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends on (corpo) | Diagrama mostra | Status |
|------|-------------------|-----------------|--------|
| T1 | None | — | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 | ✅ Match |
| T4 | T3 | T3 → T4 [P] | ✅ Match |
| T5 | T3 | T3 → T5 [P] | ✅ Match |
| T6 | T3 | T3 → T6 [P] | ✅ Match |
| T7 | T3 | T3 → T7 [P] | ✅ Match |
| T8 | T3 | T3 → T8 [P] | ✅ Match |
| T9 | T3 | T3 → T9 [P] | ✅ Match |
| T10 | T3 | T3 → T10 [P] | ✅ Match |
| T11 | T3 | T3 → T11 [P] | ✅ Match |
| T12 | T1 | T4..T11 → T12 (sequencial) | ✅ Match |
| T13 | T12, T4, T6, T7 | T12 → T13 | ✅ Match |
| T14 | T12, T13 | T13 → T14 | ✅ Match |
| T15 | T14, T4, T8 | T14 → T15 [P] | ✅ Match |
| T16 | T14, T5, T7 | T14 → T16 [P] | ✅ Match |
| T17 | T14, T5, T6, T10, T11 | T14 → T17 [P] | ✅ Match |
| T18 | T14, T5, T7, T10 | T14 → T18 [P] | ✅ Match |
| T19 | T14, T4, T5, T7 | T14 → T19 [P] | ✅ Match |
| T20 | T14, T5 | T14 → T20 [P] | ✅ Match |
| T21 | T14, T10, T4 | T14 → T21 [P] | ✅ Match |
| T22 | T15..T21 | All Phase 4 → T22 | ✅ Match |

---

## Requirement Traceability (atualizado)

| Req ID | História | Tasks | Status |
|--------|---------|-------|--------|
| REDESIGN-01 | Design Token System | T2 | Pending |
| REDESIGN-02 | Global Layout Dark | T3, T14, T15 | Pending |
| REDESIGN-03 | TopBar Redesign | T1, T6, T7, T13 | Pending |
| REDESIGN-04 | Route Transitions | T1, T12, T14 | Pending |
| REDESIGN-05 | Button Component | T4 | Pending |
| REDESIGN-06 | Card Component | T5, T16 | Pending |
| REDESIGN-07 | Input Components | T8, T9 | Pending |
| REDESIGN-08 | Horizontal Tab Nav | T10, T18, T21 | Pending |
| REDESIGN-09 | Profile Page Redesign | T17 | Pending |
| REDESIGN-10 | Achievement Visuals | T11, T17 | Pending |
| REDESIGN-11 | Visual Category Selector | T19 | Pending |
| REDESIGN-12 | Dashboard Hero | T16 | Pending |
| REDESIGN-13 | Workspace Cards Grid | T20 | Pending |

**Coverage**: 13 requisitos, 22 tasks, 13/13 mapeados ✅

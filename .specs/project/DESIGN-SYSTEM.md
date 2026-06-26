# Congreats — Design System

**Versão**: 1.0  
**Criado em**: 2026-06-26  
**Escopo**: Frontend Web (React 18 + TypeScript + Tailwind CSS)  
**Status**: Referência ativa — todas as features de UI devem seguir este documento

---

## 1. Filosofia de Design

**Premium Gamificado.** O Congreats não é um software corporativo genérico — é uma plataforma de reconhecimento que deve fazer o profissional *sentir* que está sendo premiado. O visual reforça esse posicionamento:

- **Dark primeiro**: fundo escuro como palco. O conteúdo e as conquistas brilham *sobre* ele.
- **Cor com significado**: roxo = interação e progresso; vinho = autoridade e ações críticas; dourado = conquista e excelência.
- **Movimento como feedback**: toda transição de área tem animação. O usuário sabe onde está e para onde vai.
- **Componentes visuais, não botões de texto**: ações são representadas por formas, ícones e gradientes — não links azuis sublinhados.
- **Navegação assíncrona**: o browser nunca recarrega a página. Toda mudança de rota é uma transição suave dentro do mesmo shell.

---

## 2. Sistema de Cores (Design Tokens)

### 2.1 Fundação (Backgrounds)

| Token | Hex | Uso |
|-------|-----|-----|
| `void` | `#080809` | Background principal da aplicação |
| `surface` | `#111114` | Superfície de cards, painéis |
| `elevated` | `#1A1A1F` | Elementos elevados: modals, dropdowns, tooltips |
| `overlay` | `#22222A` | Hover states, hover de cards, fundos secundários |
| `border-subtle` | `#2A2A34` | Bordas padrão |
| `border-dim` | `#3A3A48` | Bordas com mais contraste |

### 2.2 Roxo — Cor Primária de Interação

| Token | Hex | Uso |
|-------|-----|-----|
| `purple-900` | `#1A0840` | Tint de fundo em áreas ativas (ex: nav item ativo) |
| `purple-700` | `#4A1090` | Deep purple, fundos de destaque |
| `purple-500` | `#7B2FBE` | Cor primária — botões, links, estados ativos |
| `purple-400` | `#9B4FDE` | Hover de elementos interativos |
| `purple-300` | `#B87FEF` | Glow, highlights, ícones ativos |
| `purple-100` | `#EDD9FF` | Texto sobre fundo escuro com destaque roxo |

### 2.3 Vinho — Cor de Autoridade e Ação Crítica

| Token | Hex | Uso |
|-------|-----|-----|
| `wine-900` | `#2E0810` | Tint de fundo para ações destrutivas |
| `wine-700` | `#5A0F1E` | Deep wine, zona de admin, alertas críticos |
| `wine-500` | `#8B1A2E` | Cor primária de vinho — badges admin, botões destrutivos |
| `wine-400` | `#B02040` | Hover de elementos wine |
| `wine-300` | `#D04060` | Highlights e ícones em contexto wine |

### 2.4 Dourado — Conquistas e Excelência

| Token | Hex | Uso |
|-------|-----|-----|
| `gold-900` | `#1C1408` | Tint de fundo em áreas de conquista |
| `gold-700` | `#7A5C10` | Deep gold, base de troféus e medalhas |
| `gold-500` | `#C9A84C` | Cor primária de conquistas — troféus, medalhas, rankings |
| `gold-400` | `#E8C56A` | Highlight e brilho de conquistas |
| `gold-300` | `#F5E29A` | Texto em superfícies douradas |
| `gold-shimmer` | gradient | `linear-gradient(135deg, #C9A84C 0%, #F5E29A 50%, #C9A84C 100%)` — efeito metálico |

### 2.5 Texto

| Token | Hex | Uso |
|-------|-----|-----|
| `text-primary` | `#F0F0F5` | Texto principal |
| `text-secondary` | `#94949E` | Texto auxiliar, labels, descrições |
| `text-tertiary` | `#5A5A65` | Placeholders, texto desabilitado |
| `text-inverse` | `#080809` | Texto em fundos claros (botões com fundo dourado) |

### 2.6 Status

| Token | Hex | Uso |
|-------|-----|-----|
| `success` | `#2EAF6A` | Validações aprovadas, ações concluídas |
| `warning` | `#E8A020` | Atenção, pendentes |
| `error` | `#E83050` | Erros, falhas |
| `info` | `#3098E8` | Informativos, hints |

---

## 3. Tipografia

**Família principal**: Inter (Google Fonts) — já compatível com Tailwind  
**Fallback**: system-ui, -apple-system, sans-serif

### Escala

| Nível | Classe Tailwind | Uso |
|-------|-----------------|-----|
| Display | `text-4xl font-bold tracking-tight` | Títulos de página heroica |
| H1 | `text-3xl font-bold` | Título principal de página |
| H2 | `text-2xl font-semibold` | Seção de página |
| H3 | `text-xl font-semibold` | Sub-seção, card título |
| Body | `text-base font-normal` | Texto corrido |
| Small | `text-sm font-normal` | Labels, metadados, textos auxiliares |
| Micro | `text-xs font-medium` | Badges, timestamps, contagens |

### Brand Logotype

O nome "Congreats" na navbar usa gradiente:

```css
background: linear-gradient(90deg, #9B4FDE 0%, #B02040 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 4. Arquitetura de Navegação

### 4.1 App Shell

```
┌──────────────────────────────────────────────────────┐
│  ◆ Congreats        [Nav Items]         [Avatar] [▾] │  ← TopBar (h-16, bg-surface)
├──────────────────────────────────────────────────────┤
│                                                      │
│                  [Page Content]                      │  ← bg-void, max-w-6xl mx-auto px-6
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 4.2 TopBar — Redesign da Navbar

**Container**: `bg-surface` com `border-b border-border-subtle`, `backdrop-blur-sm`

**Logo**: ícone geométrico (◆) + texto "Congreats" com gradiente roxo→vinho  

**Nav Items** (área central):  
Cada item é um **componente visual** composto por ícone + label, com estado ativo:

| Ícone | Label | Rota |
|-------|-------|------|
| 🏠 Home | Início | `/dashboard` |
| 🔍 Discover | Descobrir | `/discovery` |
| ⭐ Recognize | Reconhecer | `/recognitions/new` |
| 🏛 Workspaces | Workspaces | `/workspaces` |
| ✓ Validate | Validações | `/validations/mine` |

**Estado Ativo**: pill `bg-purple-900 text-purple-300` com `border border-purple-700`  
**Estado Hover**: fundo `bg-overlay`, text `text-primary`  
**Estado Inativo**: text `text-secondary`

**Admin Items** (somente role ADMIN):  
Agrupamento separado com badge vinho e acesso via menu dropdown:
- ícone escudo + label "Admin" → abre dropdown com sub-itens

**User Avatar** (direita):  
- Avatar circular, 36px
- Borda `border-2 border-purple-700` por padrão
- Borda `border-2 border-gold-500` quando usuário tem troféus
- Click → dropdown: Ver Perfil | Configurações | Sair

### 4.3 Navegação Horizontal (Dentro de Páginas)

Usado nas páginas: Perfil, Admin, Workspaces.

```
┌──────────────────────────────────────┐
│  Reconhecimentos | Medalhas | Troféus │  ← Tab strip
├──────────────────────────────────────┤
│                                      │
│         [Tab Content]                │
└──────────────────────────────────────┘
```

**Tab Strip**: `bg-elevated rounded-2xl p-1` inline com as tabs  
**Tab Ativa**: `bg-purple-900 text-purple-300` com `border border-purple-700 rounded-xl`  
**Tab Inativa**: `text-secondary hover:text-primary`  
**Transição entre tabs**: `framer-motion AnimatePresence` — fade in 200ms

---

## 5. Sistema de Animações

### 5.1 Transições de Rota

**Biblioteca**: `framer-motion` com `AnimatePresence`

```typescript
// Variantes de animação para páginas
const pageVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -24 }
}

const pageTransition = {
  duration: 0.25,
  ease: 'easeOut'
}
```

Toda mudança de rota principal: slide horizontal (entra da direita, sai pela esquerda).  
Tabs internas: somente fade (sem slide).

### 5.2 Micro-interações de Componentes

| Componente | Animação | Duração |
|-----------|----------|---------|
| Card hover | `scale(1.015)` + `shadow-purple-glow` | 200ms ease-out |
| Botão primário hover | `translateY(-2px)` + brighter bg | 150ms ease |
| Botão primário press | `scale(0.97)` | 80ms ease-in |
| Nav item hover | bg fade in | 150ms |
| Avatar hover | border color shift | 200ms |
| Badge/medalha hover | `scale(1.1)` + pulse glow | 200ms |

### 5.3 Animações de Conquista

Quando um usuário recebe um novo troféu ou medalha (notificação futura):

- **Entrada**: scale de 0 → 1 com spring (stiffness: 200, damping: 15)
- **Shimmer**: keyframe animation no gradiente dourado (traveling light effect)
- **Partículas**: burst de 8 partículas douradas (CSS puro, keyframe `float-up + fade-out`)

### 5.4 Loading States

Skeleton screens com gradiente animado:

```css
background: linear-gradient(
  90deg,
  #1A1A1F 25%,
  #22222A 50%,
  #1A1A1F 75%
);
background-size: 400% 100%;
animation: shimmer 1.5s infinite;
```

---

## 6. Biblioteca de Componentes

### 6.1 Botões

Não existem mais botões de texto padrão do browser. Todos os botões seguem este sistema:

**Primary** (ação principal):
```
bg: purple-500 → hover: purple-400
text: white
border-radius: rounded-xl
padding: px-6 py-3
font: font-semibold
shadow: 0 4px 20px rgba(123, 47, 190, 0.35)
hover-shadow: 0 6px 28px rgba(123, 47, 190, 0.5)
```

**Secondary** (ação alternativa):
```
bg: transparent
border: border border-purple-700
text: purple-300
hover-bg: purple-900
hover-border: purple-500
rounded-xl
```

**Destructive** (ações críticas, área admin):
```
bg: wine-700 → hover: wine-500
text: white
shadow: 0 4px 20px rgba(139, 26, 46, 0.3)
```

**Achievement** (ações em contexto de troféus/medalhas):
```
bg: gold-900
border: border border-gold-700
text: gold-400 → hover: gold-300
hover-bg: gold-900/80
```

**Ghost** (ações terciárias):
```
bg: transparent
text: text-secondary → hover: text-primary
hover-bg: overlay
```

**Icon Button** (ação sem label):
```
Circular, 40x40px
bg: overlay → hover: border-subtle
text: text-secondary → hover: text-primary
rounded-full
```

### 6.2 Cards

**Card Base**:
```
bg: surface
border: border border-border-subtle
border-radius: rounded-2xl
padding: p-6
hover-border: border-purple-700/50
hover-shadow: 0 0 0 1px rgba(123, 47, 190, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)
transition: all 200ms ease-out
```

**Recognition Card** (card de reconhecimento no feed):
```
Card Base +
left accent bar: w-1 rounded-l-2xl bg-purple-500 (absolute, inset-y-0 left-0)
layout: avatar | nome + categoria | data
category badge: pill bg-purple-900 text-purple-300 text-xs
```

**Achievement Card** (troféu ou medalha):
```
bg: gold-900/40
border: border border-gold-700/50
hover-border: gold-500/70
hover-shadow: 0 0 0 1px rgba(201, 168, 76, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)
accent: gradiente dourado no topo (h-1 w-full rounded-t-2xl bg-gold-shimmer)
```

**Stat Card** (métricas no dashboard/perfil):
```
Card Base +
large number: text-3xl font-bold text-purple-300
label: text-sm text-secondary
icon: 48px, fundo purple-900, ícone purple-400
```

**Workspace Card**:
```
Card Base +
header: emoji/ícone + nome + badge de membros
footer: última atividade (texto secondary)
hover: lift suave (translateY -4px) + purple glow
```

### 6.3 Inputs e Formulários

**Input Base**:
```
bg: elevated
border: border border-border-dim
text: text-primary
placeholder: text-tertiary
border-radius: rounded-xl
padding: px-4 py-3
focus-border: border-purple-500
focus-ring: ring-2 ring-purple-500/20
```

**Select**:
```
Mesmo estilo do Input Base
ícone chevron: text-secondary
options dropdown: bg-elevated border border-border-dim rounded-xl
option hover: bg-overlay
option active: bg-purple-900 text-purple-300
```

**Textarea**:
```
Mesmo Input Base, min-rows: 3, resize: vertical
```

**Form Label**:
```
text-sm font-medium text-secondary
margin-bottom: mb-2
```

**Error Message**:
```
text-xs text-error
margin-top: mt-1
```

**Visual Category Selector** (específico para criar reconhecimento):  
Grid de cards clicáveis em vez de dropdown:
```
Cada categoria = card 100x80px
ícone centralizado (40px)
label abaixo do ícone (text-xs)
estado padrão: bg-surface border border-border-subtle text-secondary
estado selecionado: bg-purple-900 border border-purple-500 text-purple-300
grid: 3-4 colunas
```

### 6.4 Badges e Pills

**Category Badge**:
```
bg-purple-900 text-purple-300 text-xs font-medium
rounded-full px-3 py-1
```

**Admin Badge**:
```
bg-wine-900 text-wine-300 text-xs font-medium
rounded-full px-3 py-1
```

**Achievement Badge** (conquistas no perfil):
```
bg-gold-900 text-gold-400 text-xs font-medium
rounded-full px-3 py-1
border border-gold-700/50
```

**Status Badge** (validado / pendente / reprovado):
```
Variantes por status:
  Aprovado: bg-success/10 text-success border-success/30
  Pendente: bg-warning/10 text-warning border-warning/30
  Reprovado: bg-error/10 text-error border-error/30
```

### 6.5 Avatar

**Tamanhos**: `sm` (24px), `md` (36px), `lg` (56px), `xl` (80px), `2xl` (128px)

**Estados**:
```
Padrão: border-2 border-border-dim
Com troféu de ouro: border-2 border-gold-500 + sombra gold glow
Admin: border-2 border-wine-500
```

**Fallback** (sem foto): iniciais em `bg-purple-900 text-purple-300`

### 6.6 Medalhas e Troféus (Achievement Visual)

**Medalha**:
```
Círculo 64px (lg: 80px)
Gradiente radial: gold-700 → gold-500 → gold-400
Borda: 3px solid gold-300/40
Ícone ou número centralizado em text-inverse font-bold
Sombra: 0 0 20px rgba(201, 168, 76, 0.4)
Hover: scale(1.1) + sombra intensificada
```

**Troféu**:
```
Similar à medalha, mas forma hexagonal (via clip-path ou SVG)
Gradiente: gold-900 → gold-500, mais complexo
Label abaixo: nome do troféu em gold-300 text-xs
```

**Ranking Badge** (posição no ranking):
```
Posição 1: Dourado (gold-500)
Posição 2: Prata (#A8A8B0)
Posição 3: Bronze (#C07830)
Demais: text-secondary bg-overlay
```

### 6.7 Progress e Skeleton

**Progress Bar**:
```
Track: bg-overlay rounded-full h-2
Fill: bg-purple-500 rounded-full
animated: transition-width 500ms ease-out
```

**Skeleton Block**:
```
bg: overlay com shimmer animation (ver seção 5.4)
rounded: mesma border-radius do elemento real
opacity: 0.6
```

---

## 7. Direção Visual por Página

### 7.1 Dashboard

```
┌──────────────────────────────────────┐
│  Bom dia, [Nome] ☀️                  │  ← Hero: text-3xl, gradient text
│  [N] reconhecimentos recebidos       │  ← text-secondary
│                      [+ Reconhecer]  │  ← Botão Primary
├──────────────┬───────────────────────┤
│  Feed Recente│  Seu Ranking          │
│              │  [Posição e pontos]   │
│  [Cards de   │  ─────────────────    │
│   reconheci- │  Top Reconhecidos     │
│   mentos]    │  [Lista compacta]     │
└──────────────┴───────────────────────┘
```

### 7.2 Perfil

```
┌──────────────────────────────────────┐
│  [Header com gradiente roxo→vinho]   │
│     [Avatar XL com borda gold]       │
│     [Nome] [Cargo]                   │
│  [N] Recebidos | [N] Medalhas | #[K] │  ← Stat bar horizontal
├──────────────────────────────────────┤
│  Reconhecimentos | Medalhas | Troféus│  ← Tab nav horizontal
├──────────────────────────────────────┤
│  [Conteúdo da tab ativa]             │
└──────────────────────────────────────┘
```

### 7.3 Discovery

```
┌──────────────────────────────────────┐
│  Descobrir  [Todos | Workspaces | ↑] │  ← Filtros como tabs
├──────────────────────────────────────┤
│  [Recognition Card]                  │
│  [Recognition Card]                  │
│  [Recognition Card]                  │
│  [Carregar mais ↓]                   │
└──────────────────────────────────────┘
```

### 7.4 Criar Reconhecimento

```
┌──────────────────────────────────────┐
│  Reconhecer um Colega                │
│  ●──○──○  (step indicator)           │
├──────────────────────────────────────┤
│  Step 1: Para quem?                  │
│  [Search input + avatar list]        │
│                                      │
│  Step 2: Por quê? (categoria visual) │
│  [Grid de category cards]            │
│                                      │
│  Step 3: Mensagem + Preview          │
│  [Textarea + Preview card]           │
├──────────────────────────────────────┤
│                    [Enviar ✓]        │
└──────────────────────────────────────┘
```

### 7.5 Admin Panel

```
┌──────────────────────────────────────┐
│  Admin  [Usuários | Workspaces | ... ]│  ← Tabs admin com wine accent
├──────────────────────────────────────┤
│  [Conteúdo da tab admin]             │
└──────────────────────────────────────┘
```

---

## 8. Tailwind Config — Mapeamento de Tokens

O arquivo `tailwind.config.js` deve expor todos os tokens do sistema:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        void:    '#080809',
        surface: '#111114',
        elevated:'#1A1A1F',
        overlay: '#22222A',
        border: {
          subtle: '#2A2A34',
          dim:    '#3A3A48',
        },
        purple: {
          900: '#1A0840',
          700: '#4A1090',
          500: '#7B2FBE',
          400: '#9B4FDE',
          300: '#B87FEF',
          100: '#EDD9FF',
        },
        wine: {
          900: '#2E0810',
          700: '#5A0F1E',
          500: '#8B1A2E',
          400: '#B02040',
          300: '#D04060',
        },
        gold: {
          900: '#1C1408',
          700: '#7A5C10',
          500: '#C9A84C',
          400: '#E8C56A',
          300: '#F5E29A',
        },
        text: {
          primary:   '#F0F0F5',
          secondary: '#94949E',
          tertiary:  '#5A5A65',
          inverse:   '#080809',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'purple-glow': '0 0 0 1px rgba(123, 47, 190, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)',
        'purple-glow-lg': '0 0 0 1px rgba(123, 47, 190, 0.3), 0 12px 48px rgba(123, 47, 190, 0.2)',
        'gold-glow': '0 0 0 1px rgba(201, 168, 76, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)',
        'wine-glow': '0 0 0 1px rgba(139, 26, 46, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'gold-pulse': 'gold-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'gold-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(201, 168, 76, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.7)' },
        },
      },
    },
  },
}
```

---

## 9. Dependências a Adicionar

| Pacote | Versão | Motivo |
|--------|--------|--------|
| `framer-motion` | `^11.0` | Animações de rota e componentes |
| `lucide-react` | `^0.400` | Ícones SVG consistentes e leves |

---

## 10. Princípios de Acessibilidade

Mesmo com o design escuro e premium, garantir:

- Contraste mínimo 4.5:1 para texto body, 3:1 para texto grande (WCAG AA)
- Focus ring visível em todos os elementos interativos: `focus-visible:ring-2 focus-visible:ring-purple-500`
- Animações respeitam `prefers-reduced-motion` — usar `motion-safe:` do Tailwind ou variant do framer-motion
- Não depender apenas de cor para comunicar estado (usar ícone + cor + texto)

---

## 11. O que NÃO fazer

- **Não usar** bg-white, bg-gray-*, text-gray-* — a paleta é dark e os tokens acima são a única fonte de verdade
- **Não criar** botões com `<button>` sem estilização — usar sempre os componentes do sistema
- **Não navegar** com `<a href>` que cause reload — sempre react-router `<Link>` ou `useNavigate`
- **Não animar** com CSS puro quando framer-motion está disponível para elementos de rota
- **Não usar** ícones emoji no código (apenas como placeholder de design) — usar lucide-react
- **Não misturar** o accent dourado em elementos não relacionados a conquistas — o dourado tem significado específico

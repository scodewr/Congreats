# Roadmap — Congreats

**Current Milestone:** v1.0 — Foundation (MVP)
**Status:** Planning

---

## v1.0 — Foundation (MVP)

**Goal:** Sistema funcional com autenticação (suporte a World e Enterprise mode), perfil profissional completo e fluxo de reconhecimento entre colegas.
**Target:** MVP utilizável internamente — todas as features P1 implementadas e verificadas.

### Features

**Authentication & User Management** — PLANNED

- **World Mode:** Auto-registro público — usuário criado como admin com acesso completo
- **Enterprise Mode:** Apenas admin master cria e delega acesso a usuários (modelo IAM)
- Login com JWT + refresh token
- Alteração de senha
- Modo configurável via `CONGREATS_MODE` environment variable

**Professional Profile** — PLANNED

- Foto de perfil
- Seção "Sobre"
- Habilidades reconhecidas (com contagem)
- Projetos ativos e anteriores
- Equipes e iniciativas
- Depoimentos recebidos
- Edição de perfil

**Recognition System** — PLANNED

- Criação de reconhecimento (categoria, projeto opcional, equipe opcional, habilidades, depoimento)
- Visualização dos reconhecimentos recebidos no perfil
- Reconhecimentos imutáveis após criação

---

## v1.1 — Discovery

**Goal:** Permitir que os profissionais descubram talentos e acompanhem reconhecimentos na organização.

### Features

**Discovery Feed** — PLANNED

- Feed geral associado à empresa ou área
- Atualizações dos reconhecimentos mais recentes
- Ranking dos profissionais mais bem reconhecidos

---

## v1.2 — Workspaces

**Goal:** Granularidade no contexto dos reconhecimentos através de workspaces específicos.

### Features

**Workspaces** — PLANNED

- Criação e gestão de workspaces (projetos, times, squads)
- Atribuição de usuários a workspaces
- Reconhecimentos com escopo de workspace
- Navegação entre workspaces

---

## v1.3 — Administration

**Goal:** Permitir que administradores gerenciem a plataforma, usuários, workspaces e criem campanhas.

### Features

**Admin Panel** — PLANNED

- Gestão de usuários (criar, editar, desativar)
- Gestão de workspaces
- Criação e gestão de campanhas de reconhecimento
- Criação e gestão de eventos e campeonatos

---

## v2.0 — Gamification

**Goal:** Engajamento sustentado através de um sistema de progressão com medalhas e troféus.

### Features

**Medals & Trophies** — PLANNED

- Medalhas por marcos de reconhecimento (recorrência, validação, eventos)
- Troféus por progressão em habilidades específicas
- Exibição de conquistas no perfil profissional
- Notificação de conquista desbloqueada

---

## v2.1 — Skill Validation

**Goal:** Garantir autenticidade dos reconhecimentos técnicos por meio de mecanismos de validação.

### Features

**Skill Validation** — PLANNED

- Questionários de validação de habilidades técnicas
- Designação de profissionais validadores
- Fluxo de aprovação de validação
- Integração de validação com sistema de medalhas

---

## v2.2 — Notifications

**Goal:** Manter profissionais informados em tempo real sobre reconhecimentos e validações via múltiplos canais.

### Features

**Notification System** — PLANNED

- Notificação ao ser reconhecido por colega (Email obrigatório; WhatsApp/SMS opcionais)
- Notificação ao ter validação de habilidade solicitada
- Notificação ao ter validação aprovada ou rejeitada
- Configuração de canais de notificação pelo próprio usuário
- Templates de mensagem configuráveis por admin

---

## v3.0 — API Integrations

**Goal:** Gerar reconhecimentos automaticamente a partir de indicadores de ferramentas externas, tornando o reconhecimento dinâmico e baseado em evidências.

### Features

**External API Integrations** — PLANNED

- Conector genérico via webhooks / API REST para integrações externas
- Reconhecimento dinâmico disparado por: tasks fechadas, PRs mergeados, projetos entregues, itens criados
- Mapeamento configurável: evento externo → categoria + habilidade + profissional reconhecido
- Painel de gestão de integrações no admin
- Primeiros conectores-alvo: Jira, GitHub, Linear, Trello

---

## v3.1 — Challenges

**Goal:** Sistema de desafios para engajamento adicional (escopo a definir).

### Features

**Challenges** — PLANNED

- Desafios individuais e coletivos (escopo e mecânicas a definir na fase de especificação)

---

## v4.0 — Certifications of Excellence

**Goal:** Certificação formal dentro da plataforma — profissional reconhecido como referência em áreas criadas no próprio Congreats, com emissão baseada em condições objetivas mensuráveis.

### Features

**Certifications** — PLANNED

- Criação de áreas de certificação pelo admin (ex: "Arquiteto de Solução Congreats Certified")
- Critérios objetivos: nível de troféus, validações aprovadas, eventos vencidos, reconhecimentos acumulados
- Emissão de certificado digital verificável
- Exibição de certificações no perfil profissional
- Expiração e renovação configuráveis por área

---

## Future Considerations

- Integração com sistemas de RH (HRIS) para importar dados organizacionais
- Notificações push via React Native
- Social login (OAuth2 — Google, Microsoft)
- Dashboards analíticos avançados para gestores
- Reconhecimento anônimo (opcional por empresa)
- Modo nativo GraalVM para deploy de alta performance

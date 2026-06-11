# Roadmap — Congreats

**Current Milestone:** v1.0 — Foundation (MVP)
**Status:** Planning

---

## v1.0 — Foundation (MVP)

**Goal:** Sistema funcional com autenticação, perfil profissional completo e fluxo de reconhecimento entre colegas.
**Target:** MVP utilizável internamente — todas as features P1 implementadas e verificadas.

### Features

**Authentication & User Management** — PLANNED

- Registro de usuário (nome, email, empresa)
- Login com JWT + refresh token
- Alteração de senha
- Gestão básica de conta

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

## v3.0 — Challenges

**Goal:** Sistema de desafios para engajamento adicional (escopo a definir).

### Features

**Challenges** — PLANNED

- Desafios individuais e coletivos (escopo e mecânicas a definir na fase de especificação)

---

## Future Considerations

- Integração com sistemas de RH (HRIS) para importar dados organizacionais
- Notificações push via React Native
- Social login (OAuth2 — Google, Microsoft)
- API pública para integrações de terceiros
- Dashboards analíticos avançados para gestores
- Reconhecimento anônimo (opcional por empresa)

# Congreats

**Vision:** Plataforma gamificada de reconhecimento profissional que incentiva o feedback positivo entre colegas de uma mesma empresa, equipe ou projeto, destacando referências em diversas categorias e habilidades.

**For:** Profissionais de empresas, equipes e projetos que desejam promover uma cultura de reconhecimento e boa vizinhança.

**Solves:** A ausência de mecanismos formais e engajantes para reconhecer contribuições de colegas — o que resulta em falta de motivação, visibilidade reduzida de talentos internos e cultura organizacional fraca.

---

## Goals

- Aumentar o engajamento profissional através de um sistema de reconhecimento gamificado e contínuo.
- Tornar visíveis as habilidades e contribuições de cada profissional dentro do contexto da organização.
- Criar uma cultura de feedback positivo sustentada por mecânicas de progressão (medalhas, troféus, rankings).
- Garantir a autenticidade dos reconhecimentos por meio de mecanismos de validação de habilidades técnicas.

---

## Tech Stack

**Backend:**
- Language: Java 21 (LTS)
- Platform: Jakarta EE 10
- Server: Quarkus
- Database: PostgreSQL 16

**Frontend Web:**
- Framework: React 18
- Language: TypeScript 5
- Runtime: Node.js 20 LTS

**Mobile:**
- Framework: React Native (iOS + Android)

**Arquitetura:**
- Hexagonal (Ports & Adapters adaptado) — Controllers concretos chamam Use Cases específicos
- DDD Tático — Entidades, Agregados, Value Objects, Repositórios, Eventos de Domínio (sem full DDD para evitar excesso de complexidade)
- Pacotes: `application` (use cases, ports) | `domain` (entities, value objects, events) | `infrastructure` (repositories, controllers, config)
- Camadas de acesso: `Front-End → Authorization Layer → Back-End`
- Front-End não expõe dados pessoais nem entidades de domínio diretamente (usa DTOs/ViewModels)

---

## Scope

**v1.0 — Foundation (MVP):**
- Autenticação e gestão de usuários
- Painel do Profissional (perfil completo)
- Sistema de Reconhecimento (fluxo core)

**v1.1 — Discovery:**
- Área de Descoberta (feed geral, atualizações, ranking)

**v1.2 — Workspaces:**
- Workspaces (áreas contextuais para granularidade dos reconhecimentos)

**v1.3 — Administration:**
- Área de Administração (gestão de usuários, workspaces, campanhas, eventos, campeonatos)

**v2.0 — Gamification:**
- Medalhas e Troféus (sistema de progressão)

**v2.1 — Validation:**
- Validação de Habilidades Reconhecidas (questionários, validadores, eventos)

**v3.0 — Challenges (Future):**
- Desafios (implementação futura — escopo a definir)

**Explicitly out of scope:**
- Integração com sistemas externos de RH (v1)
- Pagamentos ou planos pagos (v1)
- Notificações push mobile (v1)
- Reconhecimento entre empresas diferentes
- Social login (OAuth) — v1 usa autenticação própria

---

## Constraints

- **Technical:** Backend Java EE antes de definir servidor de aplicação final (WildFly vs Quarkus)
- **Architecture:** Front-End não pode expor entidades de domínio — sempre via DTOs
- **Data:** Reconhecimentos são imutáveis após criação (sem edição ou exclusão por usuários)
- **Security:** JWT com expiração curta + refresh token; autorização granular por workspace

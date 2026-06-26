# Congreats

**Vision:** Plataforma gamificada de reconhecimento profissional que incentiva o feedback positivo entre colegas de uma mesma empresa, equipe ou projeto, destacando referências em diversas categorias e habilidades — disponível como produto aberto (modo World) ou solução corporativa controlada (modo Enterprise).

**For:** Profissionais de empresas, equipes e projetos que desejam promover uma cultura de reconhecimento e boa vizinhança; e organizações que precisam de controle hierárquico sobre a plataforma.

**Solves:** A ausência de mecanismos formais e engajantes para reconhecer contribuições de colegas — o que resulta em falta de motivação, visibilidade reduzida de talentos internos e cultura organizacional fraca.

---

## Operating Modes

A plataforma opera em dois modos configuráveis via variável de ambiente (`CONGREATS_MODE`):

| | **World Mode** | **Enterprise Mode** |
|---|---|---|
| **Registro** | Auto-registro público — usuário nasce como admin | Apenas admin master cria usuários |
| **Autoridade** | Cada usuário administra seus próprios recursos | Hierarquia delegada (modelo AWS IAM) |
| **Visibilidade** | Usuário controla visibilidade de sua organização/equipe/workspace | Definida pela hierarquia |
| **Caso de uso** | Comunidades, times distribuídos, uso individual | Empresas, departamentos, corporações |

**World Mode:** Qualquer pessoa se registra e automaticamente tem acesso completo à plataforma. Pode criar e gerenciar seus próprios workspaces, projetos, equipes, e controlar o que exibe publicamente sobre sua organização.

**Enterprise Mode:** Um usuário master (provisionado na instalação) detém todos os recursos e delega capacidades a outros usuários com escopos específicos. Segue o modelo IAM: permissões explícitas, hierarquia de delegação, sem acesso por default.

---

## Goals

- Aumentar o engajamento profissional através de um sistema de reconhecimento gamificado e contínuo.
- Tornar visíveis as habilidades e contribuições de cada profissional dentro do contexto da organização.
- Criar uma cultura de feedback positivo sustentada por mecânicas de progressão (medalhas, troféus, rankings).
- Garantir a autenticidade dos reconhecimentos por meio de mecanismos de validação de habilidades técnicas.
- Suportar reconhecimento dinâmico a partir de indicadores de ferramentas externas (tasks, entregas, projetos).
- Oferecer flexibilidade de implantação: uso aberto (World) ou corporativo controlado (Enterprise).

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
- Quarkus como runtime: prioriza economia de recursos (GraalVM native opcional) e alto throughput
- Modo de operação configurável via `CONGREATS_MODE=WORLD|ENTERPRISE`

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

**v3.0 — API Integrations:**
- Integração com APIs externas para gerar reconhecimentos dinâmicos (tasks fechadas, PRs mergeados, projetos entregues, etc.)

**v3.1 — Challenges (Future):**
- Desafios individuais e coletivos (escopo a definir)

**v4.0 — Certifications of Excellence (Future):**
- Área de certificações formais da própria plataforma — profissional reconhecido como referência em áreas criadas dentro do Congreats, emitidas a partir de condições objetivas (nível de troféu, validações aprovadas, eventos vencidos)

**v4.1 — Notifications (Future):**
- Notificações ao ser reconhecido, ao ter validação solicitada/aprovada
- Canais: Email, WhatsApp, SMS
- Preferências configuráveis por usuário (opt-in por canal e evento)

**Explicitly out of scope:**
- Integração com sistemas externos de RH (v1)
- Pagamentos ou planos pagos (v1)
- Reconhecimento entre empresas diferentes (World mode tem escopo de rede própria)
- Social login (OAuth) — v1 usa autenticação própria

---

## Constraints

- **Architecture:** Front-End não pode expor entidades de domínio — sempre via DTOs
- **Data:** Reconhecimentos são imutáveis após criação (sem edição ou exclusão por usuários)
- **Security:** JWT com expiração curta + refresh token; autorização granular por workspace e modo de operação
- **Runtime:** Quarkus — priorizar economia de recursos; avaliar modo nativo (GraalVM) para produção
- **Config:** `CONGREATS_MODE` define comportamento de registro e hierarquia de permissões no boot

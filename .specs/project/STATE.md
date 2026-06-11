# State — Congreats

**Last Updated:** 2026-06-11T00:00:00Z
**Current Work:** Project Initialization — Specs & Planning

---

## Recent Decisions (Last 60 days)

### AD-001: Arquitetura Hexagonal Adaptada (2026-06-11)

**Decision:** Usar arquitetura hexagonal adaptada onde Controllers são concretos (não abstratos) e chamam Use Cases específicos.
**Reason:** Simplicidade operacional. Ports abstratos aumentam a complexidade sem benefício real no contexto atual.
**Trade-off:** Menor flexibilidade para trocar o mecanismo de entrega sem refatoração, mas menor overhead de abstração.
**Impact:** Controllers ficam em `infrastructure/`, Use Cases em `application/`, Entidades em `domain/`.

### AD-002: DDD Tático sem Full DDD (2026-06-11)

**Decision:** Aplicar padrões táticos do DDD (Entidades, Agregados, VOs, Repositórios, Eventos de Domínio) sem adotar o paradigma completo (Bounded Contexts segregados, CQRS, Event Sourcing).
**Reason:** Evitar over-engineering. A plataforma tem complexidade moderada — full DDD adicionaria cerimônia desnecessária.
**Trade-off:** Menor isolamento de contextos, mas maior velocidade de desenvolvimento e manutenção.
**Impact:** Um único serviço backend com separação clara de camadas (domain/application/infrastructure).

### AD-003: Frontend não expõe entidades de domínio (2026-06-11)

**Decision:** O front-end sempre recebe DTOs/ViewModels, nunca entidades de domínio diretamente.
**Reason:** Segurança e desacoplamento — mudanças no domínio não quebram o contrato da API.
**Trade-off:** Camada adicional de mapeamento, mas API estável e protegida.
**Impact:** Todos os controllers devem mapear entidades para DTOs antes de retornar respostas.

### AD-004: Reconhecimentos imutáveis (2026-06-11)

**Decision:** Reconhecimentos não podem ser editados ou excluídos por usuários após a criação.
**Reason:** Garante autenticidade e histórico auditável do reconhecimento.
**Trade-off:** Usuário não pode corrigir erros — mitigado por revisão antes do envio.
**Impact:** Sem endpoints de UPDATE/DELETE para reconhecimentos no domínio de usuário.

### AD-005: Servidor de aplicação Java EE a definir (2026-06-11)

**Decision:** Backend será Jakarta EE 10 + Java 21, mas o servidor (WildFly vs Quarkus) ainda não foi definido.
**Reason:** Quarkus oferece startup rápido e modo nativo; WildFly é mais tradicional e full-spec.
**Trade-off:** Quarkus = menor footprint, curva de aprendizado diferente. WildFly = mais familiar, maior overhead.
**Impact:** Estrutura de projeto e configurações de deploy diferem. Decisão deve ser tomada antes de AUTH-T1.

---

## Active Blockers

### B-001: Servidor de aplicação Java EE não definido

**Discovered:** 2026-06-11
**Impact:** Alto — afeta scaffolding do projeto backend, configuração de CDI, JPA e JWT.
**Workaround:** Iniciar com a estrutura de domínio e application (agnóstica ao servidor) enquanto a decisão é tomada.
**Resolution:** Decidir entre WildFly e Quarkus antes de iniciar AUTH-T1.

---

## Lessons Learned

_(Nenhum ainda — projeto recém iniciado)_

---

## Quick Tasks Completed

| # | Description | Date | Commit | Status |
|---|-------------|------|--------|--------|
| — | — | — | — | — |

---

## Deferred Ideas

- [ ] Reconhecimento anônimo (opcional por empresa) — Capturado durante: Project Init
- [ ] Integração com HRIS para importar estrutura organizacional — Capturado durante: Project Init
- [ ] API pública para integrações de terceiros — Capturado durante: Project Init
- [ ] Notificações push mobile (React Native) — Capturado durante: Project Init
- [ ] Social login OAuth2 (Google, Microsoft) — Capturado durante: Project Init
- [ ] Dashboards analíticos para gestores — Capturado durante: Project Init

---

## Todos

- [ ] Decidir servidor de aplicação: WildFly vs Quarkus (resolve B-001)
- [ ] Definir estratégia de upload de fotos (S3? FileSystem local? CDN?)
- [ ] Definir estratégia de autenticação mobile (mesmo JWT ou sessão separada?)
- [ ] Definir categorias de reconhecimento iniciais (valores fixos ou configuráveis por admin?)

---

## Preferences

**Model Guidance Shown:** never

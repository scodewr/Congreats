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

### AD-005: Quarkus como runtime do backend (2026-06-11)

**Decision:** Backend usa Quarkus com Jakarta EE 10 / Java 21. WildFly descartado.
**Reason:** Quarkus prioriza economia de recursos (startup sub-segundo, menor footprint de memória) e alto throughput. Ecossistema maduro com CDI, JPA (Hibernate ORM), SmallRye JWT e RESTEasy.
**Trade-off:** Quarkus não é full Java EE spec — algumas APIs diferem (ex: JAX-RS via RESTEasy, CDI via ArC). Menor overhead porém com especificidades do ecossistema Quarkus.
**Impact:** AUTH-T1 scaffolding usa `quarkus-maven-plugin`. Dependências: `quarkus-resteasy-reactive-jackson`, `quarkus-hibernate-orm-panache`, `quarkus-smallrye-jwt`, `quarkus-jdbc-postgresql`.

### AD-006: Dois modos de operação — World e Enterprise (2026-06-11)

**Decision:** A plataforma opera em dois modos configurados via `CONGREATS_MODE=WORLD|ENTERPRISE`.
**Reason:** Flexibilidade de implantação: World para uso aberto/comunitário; Enterprise para organizações com controle hierárquico (modelo IAM).
**Trade-off:** Lógica de autorização mais complexa — requer estratégia de permissões condicional ao modo.
**Impact:** `AuthorizationService` deve verificar o modo ativo. No World: auto-registro, usuário nasce como ADMIN. No Enterprise: apenas master user cria usuários e delega permissões. Afeta AUTH-T1 e AUTH-T5.

### AD-007: Reconhecimento dinâmico via integração com APIs externas (2026-06-11)

**Decision:** Versão 3.0 incluirá conector genérico para APIs externas dispararem reconhecimentos automaticamente.
**Reason:** Evidências objetivas (tasks fechadas, PRs, entregas) tornam o reconhecimento mais justo e frequente.
**Trade-off:** Reconhecimentos automáticos podem parecer menos pessoais — mitigar permitindo revisão antes de publicar ou marcando como "automático".
**Impact:** Requer modelagem de `IntegrationEvent` no domínio e endpoints de webhook no v3.0.

### AD-008: Sistema de notificações multi-canal (v2.2) (2026-06-11)

**Decision:** Notificações serão enviadas por Email (obrigatório), WhatsApp e SMS (opcionais, configuráveis pelo usuário).
**Reason:** Manter o profissional informado em canais que já usa aumenta engajamento e senso de valorização.
**Trade-off:** Integração com WhatsApp (Twilio/Meta API) e SMS adiciona dependência externa e custo por mensagem.
**Impact:** Requer `NotificationService` port com implementações por canal. v2.2 entrega email primeiro; WhatsApp/SMS em releases seguintes do mesmo milestone.

### AD-009: Certificações de excelência como feature v4.0 (2026-06-11)

**Decision:** Área de certificações formais emitidas pela própria plataforma baseadas em condições objetivas mensuráveis.
**Reason:** Evolução natural do sistema de troféus — o reconhecimento formal dentro da plataforma tem valor de credencial.
**Trade-off:** Valor percebido das certificações depende da adoção da plataforma — quanto mais organizações usarem, mais valiosa a certificação.
**Impact:** Requer entidade `Certification`, `CertificationCriteria`, e emissão de certificado digital (PDF ou badge verificável).

---

## Active Blockers

_(B-001 resolvido — Quarkus confirmado como runtime. Ver AD-005.)_

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

- [x] Decidir servidor de aplicação: WildFly vs Quarkus → **Quarkus confirmado (AD-005)**
- [ ] Definir estratégia de upload de fotos (S3? FileSystem local? CDN?)
- [ ] Definir estratégia de autenticação mobile (mesmo JWT ou sessão separada?)
- [ ] Definir categorias de reconhecimento iniciais (valores fixos ou configuráveis por admin?)
- [ ] Detalhar spec do modo Enterprise: hierarquia de permissões e modelo de delegação (antes de iniciar AUTH-T1)
- [ ] Definir provedores de notificação para v2.2: Twilio (WhatsApp+SMS)? SendGrid (email)?
- [ ] Mapear primeiros conectores de integração para v3.0: Jira, GitHub, Linear?
- [ ] Definir critérios de emissão de certificações para v4.0

---

## Preferences

**Model Guidance Shown:** never

# Admin Panel — Tasks

**Feature:** ADM | **Version:** v1.3
**Spec:** [spec.md](spec.md)

---

## ADM-T1: Use Cases — Gestão de Usuários (Admin)

**What:** Implementar `AdminCreateUserUseCase`, `AdminUpdateUserUseCase`, `AdminDeactivateUserUseCase`, `AdminListUsersUseCase`. Adicionar role `ADMIN` na entidade User.

**Where:**
- `domain/model/UserRole.java` (enum: ADMIN, USER)
- `application/usecase/admin/AdminCreateUserUseCase.java`
- `application/usecase/admin/AdminUpdateUserUseCase.java`
- `application/usecase/admin/AdminDeactivateUserUseCase.java`
- `application/usecase/admin/AdminListUsersUseCase.java`
- `infrastructure/adapter/in/AdminUserController.java`

**Depends on:** AUTH-T5, AUTH-T7 (proteção de endpoints)

**Done when:**
- [ ] Apenas ADMIN acessa endpoints `/admin/*` — 403 para USER
- [ ] Admin cria usuário com senha temporária gerada automaticamente
- [ ] Admin desativa usuário → login bloqueado (active=false)
- [ ] Não pode desativar último admin ativo
- [ ] Testes de integração passam

**Tests:** `mvn test -Dtest="AdminUserManagementIT"`

**Commit:** `feat(application): implement admin user management use cases with ADMIN role enforcement`

---

## ADM-T2: Use Cases — Gestão de Workspaces (Admin)

**What:** Implementar `AdminArchiveWorkspaceUseCase` e melhorar `AdminManageWorkspaceMembersUseCase` com operações em lote.

**Where:**
- `application/usecase/admin/AdminArchiveWorkspaceUseCase.java`
- `application/usecase/admin/AdminManageWorkspaceMembersUseCase.java`
- `infrastructure/adapter/in/AdminWorkspaceController.java`

**Depends on:** WS-T4, ADM-T1

**Done when:**
- [ ] Admin arquiva workspace → bloqueia novos reconhecimentos
- [ ] Admin adiciona/remove membros em lote
- [ ] Testes passam

**Tests:** `mvn test -Dtest="AdminWorkspaceManagementIT"`

**Commit:** `feat(application): implement admin workspace archive and member management use cases`

---

## ADM-T3: Use Case CreateCampaign

**What:** Implementar entidade `Campaign`, migration e `CreateCampaignUseCase`.

**Where:**
- `domain/model/Campaign.java`
- `db/migration/V011__create_campaigns_table.sql`
- `application/usecase/admin/CreateCampaignUseCase.java`
- `application/usecase/GetActiveCampaignsUseCase.java`
- `infrastructure/adapter/in/AdminCampaignController.java`

**Depends on:** ADM-T1

**Done when:**
- [ ] Admin cria campanha com nome, período e categoria
- [ ] Endpoint público `GET /campaigns/active` retorna campanhas vigentes
- [ ] Campanha expirada não aparece em campanhas ativas
- [ ] Testes passam

**Tests:** `mvn test -Dtest="CampaignUseCaseIT"`

**Commit:** `feat(application): implement Campaign entity and CreateCampaign use case`

---

## ADM-T4: Use Cases CreateEvent / CreateChampionship

**What:** Implementar entidades `Event` e `Championship`, migrations e use cases de criação e ranking do evento.

**Where:**
- `domain/model/Event.java`
- `domain/model/Championship.java`
- `db/migration/V012__create_events_table.sql`
- `application/usecase/admin/CreateEventUseCase.java`
- `application/usecase/admin/CreateChampionshipUseCase.java`
- `application/usecase/GetEventRankingUseCase.java`

**Depends on:** ADM-T3, REC-T4

**Done when:**
- [ ] Admin cria evento/campeonato com critérios de período e categoria
- [ ] Ranking do evento calculado com base em reconhecimentos do período
- [ ] Encerramento automático ao fim do período
- [ ] Testes passam

**Tests:** `mvn test -Dtest="EventChampionshipUseCaseIT"`

**Commit:** `feat(application): implement Event and Championship use cases with event ranking`

---

## ADM-T5: UI — Gestão de Usuários (Admin Panel, React)

**What:** Implementar painel admin de usuários com lista, criação e desativação.

**Where:**
- `frontend/src/pages/admin/AdminUsersPage.tsx`
- `frontend/src/components/admin/UserTable.tsx`
- `frontend/src/components/admin/CreateUserModal.tsx`
- `frontend/src/services/adminService.ts`

**Depends on:** ADM-T1, AUTH-T9 (guards de rota admin)

**Done when:**
- [ ] Lista de usuários com status, role, data de criação
- [ ] Modal de criação de usuário
- [ ] Botão de desativar com confirmação
- [ ] Rota `/admin/*` redireciona para home se não for ADMIN

**Tests:** Visual — fluxo de criação e desativação de usuário.

**Commit:** `feat(frontend): add Admin User Management page with create, list, and deactivate`

---

## ADM-T6: UI — Gestão de Workspaces (Admin Panel, React)

**What:** Implementar painel admin de workspaces com criação, edição, arquivo e gestão de membros.

**Where:**
- `frontend/src/pages/admin/AdminWorkspacesPage.tsx`
- `frontend/src/components/admin/WorkspaceTable.tsx`
- `frontend/src/components/admin/WorkspaceMembersModal.tsx`

**Depends on:** ADM-T2

**Done when:**
- [ ] Lista de workspaces com status e contagem de membros
- [ ] Modal de edição e arquivamento
- [ ] Modal de gestão de membros (adicionar/remover)

**Tests:** Visual — ciclo completo de gestão de workspace.

**Commit:** `feat(frontend): add Admin Workspace Management page with member management`

---

## ADM-T7: UI — Campanhas, Eventos e Campeonatos (React)

**What:** Implementar páginas admin de campanhas e eventos, e banner de campanha ativa no feed.

**Where:**
- `frontend/src/pages/admin/AdminCampaignsPage.tsx`
- `frontend/src/pages/admin/AdminEventsPage.tsx`
- `frontend/src/components/feed/CampaignBanner.tsx`

**Depends on:** ADM-T3, ADM-T4, FEED-T3

**Done when:**
- [ ] Admin cria e gerencia campanhas e eventos
- [ ] Banner de campanha ativa aparece no feed de descoberta
- [ ] Ranking do evento visível na página de descoberta

**Tests:** Visual — campanha ativa exibe banner; evento exibe ranking.

**Commit:** `feat(frontend): add Admin Campaigns and Events pages with active campaign banner in feed`

---

## ADM-T8: Teste de Integração — Operações Administrativas

**What:** Testes de integração cobrindo fluxo admin completo.

**Where:**
- `backend/src/test/java/com/congreats/integration/AdminOperationsIT.java`

**Depends on:** ADM-T5, ADM-T6, ADM-T7

**Done when:**
- [ ] Não-admin recebe 403 em todos os endpoints `/admin/*`
- [ ] Admin cria usuário → usuário faz login → admin desativa → login bloqueado
- [ ] Admin arquiva workspace → novos reconhecimentos bloqueados
- [ ] Campanha ativa retorna em `GET /campaigns/active`

**Tests:** `mvn test -Dtest="AdminOperationsIT"` passa.

**Commit:** `test(admin): add integration tests for admin user, workspace, and campaign operations`

# Workspaces — Tasks

**Feature:** WS | **Version:** v1.2
**Spec:** [spec.md](spec.md)

---

## WS-T1: Entidade de Domínio Workspace

**What:** Implementar `Workspace` entity, `WorkspaceMember` VO e portas de repositório.

**Where:**
- `domain/model/Workspace.java`
- `domain/model/WorkspaceMember.java`
- `application/port/out/WorkspaceRepository.java`

**Depends on:** AUTH-T3

**Done when:**
- [ ] `Workspace` encapsula adição/remoção de membros
- [ ] Testes unitários passando

**Tests:** `mvn test -Dtest="WorkspaceTest"`

**Commit:** `feat(domain): add Workspace entity and WorkspaceMember value object`

---

## WS-T2: Migration — Tabelas de Workspace

**What:** Criar migrations para `workspaces` e `workspace_members`.

**Where:**
- `db/migration/V009__create_workspaces_table.sql`
- `db/migration/V010__create_workspace_members_table.sql`

**Depends on:** AUTH-T4

**Done when:**
- [ ] Migrations executam sem erros
- [ ] FKs para `users` corretas com ON DELETE CASCADE para membros

**Tests:** `psql \d workspaces` mostra schema correto.

**Commit:** `feat(infra): add database migrations for workspaces and workspace_members tables`

---

## WS-T3: Use Case CreateWorkspace

**What:** Implementar `CreateWorkspaceUseCase` (apenas admin) e `GetWorkspacesForUserUseCase`.

**Where:**
- `application/usecase/CreateWorkspaceUseCase.java`
- `application/usecase/GetWorkspacesForUserUseCase.java`
- `infrastructure/adapter/out/WorkspaceRepositoryJPA.java`

**Depends on:** WS-T1, WS-T2

**Done when:**
- [ ] Admin cria workspace com nome e descrição
- [ ] Não-admin recebe 403
- [ ] Usuário obtém lista dos seus workspaces
- [ ] Testes de integração passam

**Tests:** `mvn test -Dtest="CreateWorkspaceUseCaseIT"`

**Commit:** `feat(application): implement CreateWorkspace and GetWorkspacesForUser use cases`

---

## WS-T4: Use Case AssignUserToWorkspace

**What:** Implementar `AssignUserToWorkspaceUseCase` e `RemoveUserFromWorkspaceUseCase`.

**Where:**
- `application/usecase/AssignUserToWorkspaceUseCase.java`
- `application/usecase/RemoveUserFromWorkspaceUseCase.java`

**Depends on:** WS-T3

**Done when:**
- [ ] Admin atribui usuário a workspace → usuário vê workspace na lista
- [ ] Admin remove usuário → workspace desaparece da lista
- [ ] Tentativa de usuário duplicado na mesma workspace é idempotente

**Tests:** `mvn test -Dtest="AssignUserToWorkspaceUseCaseIT"`

**Commit:** `feat(application): implement AssignUserToWorkspace and RemoveUserFromWorkspace use cases`

---

## WS-T5: Use Case GetWorkspaceRecognitions

**What:** Implementar `GetWorkspaceRecognitionsUseCase` com filtro por workspace_id no feed.

**Where:**
- `application/usecase/GetWorkspaceRecognitionsUseCase.java`

**Depends on:** WS-T4, REC-T4

**Done when:**
- [ ] Feed filtrado por workspace retorna apenas reconhecimentos com aquele workspace_id
- [ ] Usuário não membro recebe 403
- [ ] Paginação funciona corretamente

**Tests:** `mvn test -Dtest="GetWorkspaceRecognitionsUseCaseIT"`

**Commit:** `feat(application): implement GetWorkspaceRecognitions use case with membership check`

---

## WS-T6: UI — Seletor de Workspace (React)

**What:** Implementar seletor de workspace na navegação principal.

**Where:**
- `frontend/src/components/workspace/WorkspaceSwitcher.tsx`
- Integrar no layout principal/navbar

**Depends on:** WS-T3

**Done when:**
- [ ] Dropdown lista todos os workspaces do usuário + opção "Todos"
- [ ] Seleção atualiza o contexto ativo globalmente (WorkspaceContext)
- [ ] Usuário sem workspaces não vê o seletor

**Tests:** Visual — alternar entre workspaces atualiza contexto.

**Commit:** `feat(frontend): add Workspace switcher in navigation with context persistence`

---

## WS-T7: UI — Feed Filtrado por Workspace (React)

**What:** Integrar filtro de workspace no feed de descoberta.

**Where:**
- `frontend/src/pages/DiscoveryPage.tsx` (update)
- `frontend/src/services/feedService.ts` (update — adicionar workspaceId param)

**Depends on:** WS-T5, WS-T6, FEED-T3

**Done when:**
- [ ] Feed filtra reconhecimentos pelo workspace ativo
- [ ] Trocar workspace atualiza o feed automaticamente
- [ ] Workspace no formulário de reconhecimento usa contexto ativo como padrão

**Tests:** Visual — criar reconhecimento em workspace X → verificar no feed de X, não em Y.

**Commit:** `feat(frontend): integrate workspace filter in discovery feed and recognition form`

---

## WS-T8: Teste de Integração — Fluxo de Workspace

**What:** Testes de integração cobrindo: criação, atribuição, reconhecimento com workspace e feed filtrado.

**Where:**
- `backend/src/test/java/com/congreats/integration/WorkspaceFlowIT.java`

**Depends on:** WS-T6, WS-T7

**Done when:**
- [ ] Criar workspace → atribuir membro → membro vê workspace
- [ ] Criar reconhecimento com workspace → aparece no feed do workspace
- [ ] Criar reconhecimento sem workspace → não aparece no feed do workspace
- [ ] Não-membro recebe 403 ao acessar feed do workspace

**Tests:** `mvn test -Dtest="WorkspaceFlowIT"` passa.

**Commit:** `test(workspace): add integration tests for workspace creation, membership, and scoped feed`

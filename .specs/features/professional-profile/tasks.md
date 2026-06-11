# Professional Profile — Tasks

**Feature:** PROF | **Version:** v1.0
**Spec:** [spec.md](spec.md) | **Design:** [design.md](design.md)

---

## PROF-T1: Entidades de Domínio do Perfil

**What:** Implementar entidade `Profile` (aggregate root), Value Objects `ProfileProject`, `ProfileTeam`, `RecognizedSkill`.

**Where:**
- `domain/model/Profile.java`
- `domain/model/ProfileProject.java`
- `domain/model/ProfileTeam.java`
- `domain/model/RecognizedSkill.java`
- `application/port/out/ProfileRepository.java`
- `application/port/out/FileStorageService.java`

**Depends on:** AUTH-T3 (User entity)

**Done when:**
- [ ] `Profile` encapsula lógica de adição/remoção de projetos e equipes
- [ ] `ProfileProject` valida status (ACTIVE/PAST) e nome não vazio
- [ ] Portas de saída definidas sem dependência de infraestrutura
- [ ] Testes unitários para `Profile` passando

**Tests:** `mvn test -Dtest="ProfileTest"`

**Commit:** `feat(domain): add Profile aggregate with project, team, and skill value objects`

---

## PROF-T2: Migration — Tabelas de Perfil

**What:** Criar migrations SQL para `profiles`, `profile_projects`, `profile_teams`.

**Where:**
- `backend/src/main/resources/db/migration/V003__create_profiles_table.sql`
- `backend/src/main/resources/db/migration/V004__create_profile_projects_table.sql`
- `backend/src/main/resources/db/migration/V005__create_profile_teams_table.sql`

**Depends on:** AUTH-T4 (tabela users existe)

**Done when:**
- [ ] Migrations executam sem erros
- [ ] FK para `users(id)` está correta
- [ ] CASCADE DELETE configurado em tabelas filhas
- [ ] Índices em `profile_id` e `user_id`

**Tests:** `psql \d profiles` mostra schema correto.

**Commit:** `feat(infra): add database migrations for profiles, projects, and teams tables`

---

## PROF-T3: Use Case UpdateProfile

**What:** Implementar `UpdateProfileUseCase` com autorização, validação e persistência.

**Where:**
- `application/usecase/UpdateProfileUseCase.java`
- `application/usecase/UpdateProfileCommand.java`
- `infrastructure/adapter/out/ProfileRepositoryJPA.java`

**Depends on:** PROF-T1, PROF-T2

**Done when:**
- [ ] Usuário pode atualizar bio, cargo, empresa, projetos e equipes do próprio perfil
- [ ] Tentativa de editar perfil alheio retorna 403
- [ ] Perfil é criado automaticamente se não existir (primeira edição)
- [ ] Teste de integração com banco real passa

**Tests:** `mvn test -Dtest="UpdateProfileUseCaseIT"`

**Commit:** `feat(application): implement UpdateProfile use case with authorization check`

---

## PROF-T4: Use Case GetProfile

**What:** Implementar `GetProfileUseCase` que agrega dados do usuário, perfil, habilidades reconhecidas (via query) e depoimentos.

**Where:**
- `application/usecase/GetProfileUseCase.java`
- `application/usecase/GetProfileQuery.java`
- `application/dto/ProfileView.java`

**Depends on:** PROF-T3

**Done when:**
- [ ] Retorna `ProfileView` completo com todas as seções
- [ ] Habilidades reconhecidas são computadas via query (JOIN com recognitions se existirem)
- [ ] 404 para userId inexistente
- [ ] Teste de integração passa com perfil com dados e sem dados

**Tests:** `mvn test -Dtest="GetProfileUseCaseIT"`

**Commit:** `feat(application): implement GetProfile use case with aggregated profile view`

---

## PROF-T5: Use Case UploadProfilePhoto

**What:** Implementar `UploadProfilePhotoUseCase` com validação de tipo/tamanho e `LocalFileStorageService`.

**Where:**
- `application/usecase/UploadProfilePhotoUseCase.java`
- `infrastructure/adapter/out/LocalFileStorageService.java`

**Depends on:** PROF-T3

**Done when:**
- [ ] Upload de JPG/PNG ≤ 5MB armazena arquivo e atualiza `profile.photoUrl`
- [ ] Tipo inválido retorna 400
- [ ] Tamanho > 5MB retorna 400
- [ ] Foto anterior é excluída ao fazer novo upload
- [ ] URL retornada é acessível via endpoint estático

**Tests:** `mvn test -Dtest="UploadProfilePhotoUseCaseIT"`

**Commit:** `feat(application): implement UploadProfilePhoto use case with local file storage`

---

## PROF-T6: UI — Página de Visualização de Perfil (React)

**What:** Implementar `ProfilePage` com todos os componentes de visualização do perfil.

**Where:**
- `frontend/src/pages/ProfilePage.tsx`
- `frontend/src/components/profile/ProfileHeader.tsx`
- `frontend/src/components/profile/SkillsSection.tsx`
- `frontend/src/components/profile/ProjectsSection.tsx`
- `frontend/src/components/profile/TeamsSection.tsx`
- `frontend/src/components/profile/TestimonialsSection.tsx`
- `frontend/src/services/profileService.ts`

**Depends on:** AUTH-T9, PROF-T4

**Done when:**
- [ ] Perfil completo renderiza: foto, nome, bio, habilidades, projetos, equipes, depoimentos
- [ ] Estado vazio exibe mensagens de convite por seção
- [ ] Avatar padrão com iniciais quando sem foto
- [ ] Botão "Editar Perfil" visível apenas no próprio perfil
- [ ] Loading state durante fetch

**Tests:** Visual — perfil com dados completos e perfil vazio funcionam corretamente.

**Commit:** `feat(frontend): add Profile page with all sections and empty states`

---

## PROF-T7: UI — Página de Edição de Perfil (React)

**What:** Implementar `EditProfilePage` com formulário de edição, upload de foto inline e gerenciamento de projetos/equipes.

**Where:**
- `frontend/src/pages/EditProfilePage.tsx`
- `frontend/src/components/profile/PhotoUploader.tsx`
- `frontend/src/components/profile/ProfileBio.tsx`

**Depends on:** PROF-T6, PROF-T3, PROF-T5

**Done when:**
- [ ] Formulário pré-preenchido com dados atuais do perfil
- [ ] Upload de foto com preview antes de confirmar
- [ ] Adição e remoção de projetos inline (sem recarregar página)
- [ ] Adição e remoção de equipes inline
- [ ] Salvar mostra feedback de sucesso e redireciona para visualização
- [ ] Validação client-side: nome obrigatório, bio ≤ 1000 chars

**Tests:** Visual — ciclo completo de edição e persistência funcional.

**Commit:** `feat(frontend): add Edit Profile page with photo upload and inline project/team management`

---

## PROF-T8: Teste de Integração — Fluxo Completo de Perfil

**What:** Testes de integração cobrindo: criar perfil → atualizar → upload de foto → visualizar perfil completo.

**Where:**
- `backend/src/test/java/com/congreats/integration/ProfileFlowIT.java`

**Depends on:** PROF-T6, PROF-T7

**Done when:**
- [ ] Teste cria usuário → acessa perfil vazio (200, seções vazias)
- [ ] Teste atualiza perfil → verifica persistência
- [ ] Teste faz upload de foto → verifica URL retornada e acessível
- [ ] Teste tenta editar perfil alheio → verifica 403
- [ ] Teste acessa userId inválido → verifica 404
- [ ] Todos os testes passam com PostgreSQL real

**Tests:** `mvn test -Dtest="ProfileFlowIT"` passa.

**Commit:** `test(profile): add end-to-end integration tests for complete profile flow`

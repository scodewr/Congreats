# Recognition System — Tasks

**Feature:** REC | **Version:** v1.0
**Spec:** [spec.md](spec.md) | **Design:** [design.md](design.md)

---

## REC-T1: Entidades de Domínio do Reconhecimento

**What:** Implementar `Recognition` (aggregate root), `Category`, evento `RecognitionCreated` e portas de repositório.

**Where:**
- `domain/model/Recognition.java`
- `domain/model/Category.java`
- `domain/event/RecognitionCreated.java`
- `application/port/out/RecognitionRepository.java`
- `application/port/out/CategoryRepository.java`

**Depends on:** AUTH-T3

**Done when:**
- [ ] `Recognition` valida invariantes (sem auto-reconhecimento, skills não vazio, testimonial ≥ 20 chars)
- [ ] `Category` contém lista de habilidades sugeridas
- [ ] Portas de saída definidas
- [ ] Testes unitários para `Recognition` passando (incluindo casos de erro)

**Tests:** `mvn test -Dtest="RecognitionTest"`

**Commit:** `feat(domain): add Recognition aggregate, Category entity, and RecognitionCreated event`

---

## REC-T2: Migration — Tabelas de Reconhecimento

**What:** Criar migrations SQL para `categories`, `category_suggested_skills`, `recognitions`, `recognition_skills` + seed inicial de categorias.

**Where:**
- `db/migration/V006__create_categories_table.sql`
- `db/migration/V007__create_recognitions_table.sql`
- `db/migration/V008__seed_categories.sql`

**Depends on:** PROF-T2 (tabela profile_projects e profile_teams para FK opcionais)

**Done when:**
- [ ] Migrations executam sem erros
- [ ] Constraint `no_self_recognition` está no banco
- [ ] 7 categorias iniciais seed inseridas
- [ ] Índices em `recognized_id` e `recognizer_id` com ordenação por `created_at DESC`

**Tests:** `psql \d recognitions` + `SELECT COUNT(*) FROM categories` = 7.

**Commit:** `feat(infra): add recognition and category migrations with initial category seed`

---

## REC-T3: Use Case CreateRecognition

**What:** Implementar `CreateRecognitionUseCase` com validações, persistência e publicação de evento.

**Where:**
- `application/usecase/CreateRecognitionUseCase.java`
- `application/usecase/CreateRecognitionCommand.java`
- `infrastructure/adapter/out/RecognitionRepositoryJPA.java`

**Depends on:** REC-T1, REC-T2

**Done when:**
- [ ] Reconhecimento válido é persistido com skills normalizadas (Title Case)
- [ ] Auto-reconhecimento retorna 400 com mensagem específica
- [ ] Campo vazio (categoria, skill, testimonial curto) retorna 400 com campo identificado
- [ ] Evento `RecognitionCreated` é publicado após persistência
- [ ] Teste de integração com banco real passa

**Tests:** `mvn test -Dtest="CreateRecognitionUseCaseIT"`

**Commit:** `feat(application): implement CreateRecognition use case with validation and event publishing`

---

## REC-T4: Use Case GetRecognitionsByProfessional

**What:** Implementar `GetRecognitionsByProfessionalUseCase` e `ListCategoriesUseCase`.

**Where:**
- `application/usecase/GetRecognitionsByProfessionalUseCase.java`
- `application/usecase/ListCategoriesUseCase.java`
- `infrastructure/adapter/out/CategoryRepositoryJPA.java`

**Depends on:** REC-T3

**Done when:**
- [ ] Retorna reconhecimentos paginados (10 por página) ordenados por data desc
- [ ] DTO inclui nome e foto do reconhecedor
- [ ] Categorias retornam com habilidades sugeridas
- [ ] Teste de integração passa com múltiplos reconhecimentos

**Tests:** `mvn test -Dtest="GetRecognitionsUseCaseIT"`

**Commit:** `feat(application): implement GetRecognitionsByProfessional and ListCategories use cases`

---

## REC-T5: UI — Formulário de Reconhecimento (React)

**What:** Implementar `CreateRecognitionPage` com seletor de profissional, grade de categorias, chips de habilidades, textarea de depoimento e campos opcionais de projeto/equipe.

**Where:**
- `frontend/src/pages/CreateRecognitionPage.tsx`
- `frontend/src/components/recognition/RecognitionForm.tsx`
- `frontend/src/components/recognition/ProfessionalSelector.tsx`
- `frontend/src/components/recognition/CategorySelector.tsx`
- `frontend/src/components/recognition/SkillSelector.tsx`
- `frontend/src/components/recognition/TestimonialInput.tsx`
- `frontend/src/services/recognitionService.ts`

**Depends on:** AUTH-T9, REC-T3, REC-T4

**Done when:**
- [ ] Seleção de colega com busca por nome (auto-complete)
- [ ] Grade de categorias com seleção visual
- [ ] Habilidades sugeridas como chips + campo para habilidade personalizada
- [ ] Contador de caracteres no depoimento (mínimo 20, máximo 2000)
- [ ] Campos opcionais de projeto e equipe (dropdowns)
- [ ] Validação client-side antes de submeter
- [ ] Feedback de sucesso com opção de reconhecer outra pessoa

**Tests:** Visual — fluxo completo de criação funcional no browser.

**Commit:** `feat(frontend): add Create Recognition page with category, skill, and testimonial form`

---

## REC-T6: UI — Exibição de Reconhecimentos no Perfil (React)

**What:** Implementar `RecognitionList` e `RecognitionCard` para exibição no perfil profissional.

**Where:**
- `frontend/src/components/recognition/RecognitionCard.tsx`
- `frontend/src/components/recognition/RecognitionList.tsx`

**Depends on:** PROF-T6, REC-T4

**Done when:**
- [ ] Cards exibem: foto e nome do reconhecedor, categoria, habilidades como tags, depoimento, data
- [ ] Lista paginada com botão "Carregar mais"
- [ ] Estado vazio com mensagem de convite
- [ ] Reconhecimento criado aparece no perfil sem reload manual
- [ ] Integrado na `ProfilePage` na seção de reconhecimentos

**Tests:** Visual — perfil com reconhecimentos exibe cards corretamente paginados.

**Commit:** `feat(frontend): add Recognition cards and paginated list on profile page`

---

## REC-T7: Teste de Integração — Fluxo Completo de Reconhecimento

**What:** Testes de integração cobrindo: criar reconhecimento → verificar no perfil → validar invariantes.

**Where:**
- `backend/src/test/java/com/congreats/integration/RecognitionFlowIT.java`

**Depends on:** REC-T5, REC-T6

**Done when:**
- [ ] Teste cria reconhecimento válido → verifica no banco e no GET de reconhecimentos
- [ ] Teste verifica que habilidade aparece contabilizada no perfil do reconhecido
- [ ] Teste tenta auto-reconhecimento → verifica 400
- [ ] Teste tenta criar sem categoria → verifica 400
- [ ] Teste tenta criar com depoimento < 20 chars → verifica 400
- [ ] Todos os testes passam com PostgreSQL real

**Tests:** `mvn test -Dtest="RecognitionFlowIT"` passa.

**Commit:** `test(recognition): add end-to-end integration tests for recognition flow and invariants`

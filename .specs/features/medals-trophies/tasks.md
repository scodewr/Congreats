# Medals & Trophies — Tasks

**Feature:** MEDAL | **Version:** v2.0
**Spec:** [spec.md](spec.md)

---

## MEDAL-T1: Entidades de Domínio — Medalhas e Troféus

**What:** Implementar `Medal`, `Trophy`, `AchievementRule` entities e portas de repositório.

**Where:**
- `domain/model/Medal.java`
- `domain/model/Trophy.java` (com TrophyLevel: BRONZE, SILVER, GOLD)
- `domain/model/AchievementRule.java`
- `application/port/out/MedalRepository.java`
- `application/port/out/TrophyRepository.java`

**Depends on:** AUTH-T3

**Done when:**
- [ ] `Medal` encapsula marco de reconhecimento e idempotência
- [ ] `Trophy` encapsula progressão por habilidade e nível
- [ ] Testes unitários passando

**Tests:** `mvn test -Dtest="MedalTest,TrophyTest"`

**Commit:** `feat(domain): add Medal, Trophy, and AchievementRule domain entities`

---

## MEDAL-T2: Migration — Tabelas de Medalhas e Troféus

**What:** Criar migrations para `medals`, `user_medals`, `trophies`, `user_trophies`.

**Where:**
- `db/migration/V013__create_medals_tables.sql`

**Depends on:** AUTH-T4

**Done when:**
- [ ] Migrations executam sem erros
- [ ] Constraint de unicidade em `(user_id, medal_id)` e `(user_id, skill, level)` para idempotência

**Tests:** `psql \d user_medals` mostra constraint de unicidade.

**Commit:** `feat(infra): add database migrations for medals, trophies, and user achievements tables`

---

## MEDAL-T3: Use Case AwardMedal (Event-Driven)

**What:** Implementar `AwardMedalUseCase` consumindo evento `RecognitionCreated` para verificar marcos e conceder medalhas.

**Where:**
- `application/usecase/AwardMedalUseCase.java`
- `infrastructure/event/RecognitionCreatedMedalHandler.java`
- `infrastructure/adapter/out/MedalRepositoryJPA.java`

**Depends on:** MEDAL-T1, MEDAL-T2, REC-T3 (evento RecognitionCreated)

**Done when:**
- [ ] Handler escuta `RecognitionCreated` e verifica marcos (1, 5, 10, 25, 50, 100)
- [ ] Medalha concedida apenas se não existir (idempotente)
- [ ] Teste: criar 5 reconhecimentos → medalha "5 Reconhecimentos" criada uma vez

**Tests:** `mvn test -Dtest="AwardMedalUseCaseIT"`

**Commit:** `feat(application): implement AwardMedal use case triggered by RecognitionCreated event`

---

## MEDAL-T4: Use Case UpdateTrophyProgress

**What:** Implementar `UpdateTrophyProgressUseCase` consumindo `RecognitionCreated` para atualizar troféus por habilidade.

**Where:**
- `application/usecase/UpdateTrophyProgressUseCase.java`
- `infrastructure/adapter/out/TrophyRepositoryJPA.java`

**Depends on:** MEDAL-T2, REC-T3

**Done when:**
- [ ] Ao criar reconhecimento com habilidade, conta reconhecimentos anteriores da habilidade
- [ ] Concede Bronze (3), Prata (10), Ouro (25) — idempotente
- [ ] Teste: 3 reconhecimentos com "Java" → troféu Bronze "Java"

**Tests:** `mvn test -Dtest="UpdateTrophyProgressUseCaseIT"`

**Commit:** `feat(application): implement UpdateTrophyProgress use case with Bronze/Silver/Gold levels`

---

## MEDAL-T5: UI — Exibição de Medalhas no Perfil (React)

**What:** Implementar `MedalsSection` no perfil com medalhas conquistadas.

**Where:**
- `frontend/src/components/profile/MedalsSection.tsx`
- Integrar em `ProfilePage`

**Depends on:** PROF-T6, MEDAL-T3

**Done when:**
- [ ] Medalhas exibidas com ícone visual, nome e data
- [ ] Badge "Novo" para medalhas recentes (< 7 dias)
- [ ] Estado vazio quando sem medalhas

**Tests:** Visual — medalhas no perfil com badges "Novo".

**Commit:** `feat(frontend): add Medals section in profile with achievement badges`

---

## MEDAL-T6: UI — Vitrine de Troféus (React)

**What:** Implementar `TrophiesSection` no perfil com troféus de habilidades ordenados por nível.

**Where:**
- `frontend/src/components/profile/TrophiesSection.tsx`

**Depends on:** PROF-T6, MEDAL-T4

**Done when:**
- [ ] Troféus exibidos com habilidade, nível (Bronze/Prata/Ouro), ícone visual e data
- [ ] Ordenação: Ouro → Prata → Bronze, depois por habilidade alfabética
- [ ] Estado vazio adequado
- [ ] Integrado em `ProfilePage`

**Tests:** Visual — troféus ordenados corretamente por nível.

**Commit:** `feat(frontend): add Trophies showcase section in profile ordered by level`

---

## MEDAL-T7: Teste de Integração — Fluxo de Medalhas

**What:** Testes de integração cobrindo concessão de medalhas e troféus.

**Where:**
- `backend/src/test/java/com/congreats/integration/MedalTrophyFlowIT.java`

**Depends on:** MEDAL-T5, MEDAL-T6

**Done when:**
- [ ] 5 reconhecimentos → medalha "5 Reconhecimentos" concedida uma vez
- [ ] 3 reconhecimentos da habilidade "Java" → troféu Bronze
- [ ] 10 reconhecimentos → troféu Prata (Bronze mantido)
- [ ] Processar mesmo evento duas vezes → idempotência verificada

**Tests:** `mvn test -Dtest="MedalTrophyFlowIT"` passa.

**Commit:** `test(medals): add integration tests for medal and trophy award flow with idempotency`

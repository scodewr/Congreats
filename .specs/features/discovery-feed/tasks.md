# Discovery Feed — Tasks

**Feature:** FEED | **Version:** v1.1
**Spec:** [spec.md](spec.md)

---

## FEED-T1: Use Case GetDiscoveryFeed

**What:** Implementar `GetDiscoveryFeedUseCase` que retorna reconhecimentos recentes paginados com escopo por empresa.

**Where:**
- `application/usecase/GetDiscoveryFeedUseCase.java`
- `application/usecase/GetDiscoveryFeedQuery.java`

**Depends on:** REC-T3, PROF-T3 (perfil com empresa do usuário)

**Done when:**
- [ ] Retorna reconhecimentos paginados (20 por página) da empresa do usuário, ordenados por `created_at DESC`
- [ ] Sem empresa definida → retorna feed global
- [ ] Teste de integração passa

**Tests:** `mvn test -Dtest="GetDiscoveryFeedUseCaseIT"`

**Commit:** `feat(application): implement GetDiscoveryFeed use case with company scope`

---

## FEED-T2: Use Case GetProfessionalRanking

**What:** Implementar `GetProfessionalRankingUseCase` com suporte a filtro por período.

**Where:**
- `application/usecase/GetProfessionalRankingUseCase.java`
- `application/usecase/GetProfessionalRankingQuery.java` (period: MONTH | QUARTER | YEAR | ALL_TIME)

**Depends on:** REC-T3

**Done when:**
- [ ] Retorna top 10 profissionais por total de reconhecimentos no período
- [ ] Empate desempatado por data do reconhecimento mais recente
- [ ] Teste de integração valida ranking com dados reais

**Tests:** `mvn test -Dtest="GetProfessionalRankingUseCaseIT"`

**Commit:** `feat(application): implement GetProfessionalRanking use case with period filter`

---

## FEED-T3: UI — Página de Descoberta (React)

**What:** Implementar `DiscoveryPage` com feed de reconhecimentos em infinite scroll.

**Where:**
- `frontend/src/pages/DiscoveryPage.tsx`
- `frontend/src/components/feed/RecognitionFeedItem.tsx`
- `frontend/src/services/feedService.ts`

**Depends on:** FEED-T1

**Done when:**
- [ ] Feed exibe reconhecimentos com card: foto do reconhecedor, reconhecido, categoria, skills, depoimento, data
- [ ] Infinite scroll carrega mais 20 ao rolar
- [ ] Estado vazio com convite
- [ ] Loading skeleton durante carregamento

**Tests:** Visual — feed com múltiplos reconhecimentos e infinite scroll funcional.

**Commit:** `feat(frontend): add Discovery page with infinite scroll recognition feed`

---

## FEED-T4: UI — Componente de Ranking (React)

**What:** Implementar `ProfessionalRankingWidget` com top 10 e seletor de período.

**Where:**
- `frontend/src/components/feed/ProfessionalRankingWidget.tsx`

**Depends on:** FEED-T2

**Done when:**
- [ ] Lista top 10 com foto, nome, posição e contagem de reconhecimentos
- [ ] Seletor de período (Este Mês / Trimestre / Ano / Todos)
- [ ] Clique no profissional navega ao perfil
- [ ] Integrado na `DiscoveryPage` como sidebar ou seção

**Tests:** Visual — ranking correto por período com navegação ao perfil.

**Commit:** `feat(frontend): add Professional Ranking widget with period filter`

---

## FEED-T5: Teste de Integração — Feed e Ranking

**What:** Testes de integração cobrindo: feed paginado e ranking por período.

**Where:**
- `backend/src/test/java/com/congreats/integration/DiscoveryFeedIT.java`

**Depends on:** FEED-T3, FEED-T4

**Done when:**
- [ ] Feed retorna reconhecimentos da empresa correta, paginados
- [ ] Ranking reflete contagens corretas para cada período
- [ ] Estado vazio (sem reconhecimentos) retorna lista vazia com 200

**Tests:** `mvn test -Dtest="DiscoveryFeedIT"` passa.

**Commit:** `test(feed): add integration tests for discovery feed and ranking`

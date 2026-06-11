# Skill Validation — Tasks

**Feature:** VALID | **Version:** v2.1
**Spec:** [spec.md](spec.md)

---

## VALID-T1: Entidades de Domínio — Validação de Habilidades

**What:** Implementar `SkillValidation`, `Questionnaire`, `QuestionnaireQuestion`, `ValidatorAssignment` entities.

**Where:**
- `domain/model/SkillValidation.java` (status: PENDING, APPROVED, REJECTED)
- `domain/model/Questionnaire.java`
- `domain/model/QuestionnaireQuestion.java`
- `domain/model/ValidatorAssignment.java`
- `application/port/out/SkillValidationRepository.java`
- `application/port/out/QuestionnaireRepository.java`

**Depends on:** AUTH-T3, REC-T1

**Done when:**
- [ ] `SkillValidation` encapsula transições de status (PENDING → APPROVED/REJECTED)
- [ ] `Questionnaire` agrega perguntas com respostas e pontuação mínima
- [ ] Testes unitários passando

**Tests:** `mvn test -Dtest="SkillValidationTest"`

**Commit:** `feat(domain): add SkillValidation, Questionnaire, and ValidatorAssignment domain entities`

---

## VALID-T2: Migration — Tabelas de Validação

**What:** Criar migrations para `skill_validations`, `questionnaires`, `questionnaire_questions`, `validator_assignments`.

**Where:**
- `db/migration/V014__create_skill_validations_tables.sql`

**Depends on:** REC-T2

**Done when:**
- [ ] Migrations executam sem erros
- [ ] FK para `recognitions` e `users` correta
- [ ] Índices em `(recognition_id, skill)` para busca eficiente

**Tests:** `psql \d skill_validations` mostra schema correto.

**Commit:** `feat(infra): add database migrations for skill validation tables`

---

## VALID-T3: Use Case RequestSkillValidation

**What:** Implementar `RequestSkillValidationUseCase` que cria solicitação de validação após reconhecimento técnico.

**Where:**
- `application/usecase/RequestSkillValidationUseCase.java`
- `infrastructure/adapter/in/SkillValidationController.java`

**Depends on:** VALID-T1, VALID-T2

**Done when:**
- [ ] Solicitação criada com status PENDING
- [ ] Endpoint `POST /validations` protegido e retorna ID da validação
- [ ] Habilidade do perfil marcada como "Em Validação"
- [ ] Testes de integração passam

**Tests:** `mvn test -Dtest="RequestSkillValidationUseCaseIT"`

**Commit:** `feat(application): implement RequestSkillValidation use case`

---

## VALID-T4: Use Case SubmitQuestionnaire

**What:** Implementar `SubmitQuestionnaireUseCase` com lógica de pontuação e aprovação/rejeição.

**Where:**
- `application/usecase/SubmitQuestionnaireUseCase.java`
- `application/usecase/GetQuestionnaireUseCase.java`

**Depends on:** VALID-T3

**Done when:**
- [ ] Pontuação ≥ 70% → validação APPROVED, badge "Validado" no perfil
- [ ] Pontuação < 70% → validação mantida PENDING com cooldown de 7 dias
- [ ] Sem questionário disponível → retorna 404 com sugestão de validação por par
- [ ] Testes passam

**Tests:** `mvn test -Dtest="SubmitQuestionnaireUseCaseIT"`

**Commit:** `feat(application): implement SubmitQuestionnaire use case with scoring and approval logic`

---

## VALID-T5: Use Cases AssignValidator / ApproveValidation

**What:** Implementar `AssignValidatorUseCase` e `ApproveValidationUseCase` para validação por profissional par.

**Where:**
- `application/usecase/AssignValidatorUseCase.java`
- `application/usecase/ApproveValidationUseCase.java`
- `application/usecase/RejectValidationUseCase.java`

**Depends on:** VALID-T3

**Done when:**
- [ ] Profissional indica validador → validador recebe notificação (ou polling)
- [ ] Validador aprova → badge "Validado por Par" com nome do validador
- [ ] Validador rejeita → profissional notificado, status volta a PENDING
- [ ] Testes passam

**Tests:** `mvn test -Dtest="ValidatorAssignmentUseCaseIT"`

**Commit:** `feat(application): implement AssignValidator and ApproveValidation use cases for peer validation`

---

## VALID-T6: UI — Formulário de Questionário (React)

**What:** Implementar `QuestionnaireForm` para responder perguntas de validação.

**Where:**
- `frontend/src/pages/QuestionnaireValidationPage.tsx`
- `frontend/src/components/validation/QuestionnaireForm.tsx`
- `frontend/src/services/validationService.ts`

**Depends on:** VALID-T4

**Done when:**
- [ ] Exibe perguntas uma a uma ou em lista
- [ ] Submissão exibe resultado (aprovado/reprovado) com pontuação
- [ ] Aprovação atualiza badge no perfil

**Tests:** Visual — fluxo de questionário com aprovação e reprovação.

**Commit:** `feat(frontend): add Questionnaire validation page with scoring feedback`

---

## VALID-T7: UI — Interface do Validador (React)

**What:** Implementar `ValidatorApprovalPage` para validadores aprovarem ou rejeitarem validações.

**Where:**
- `frontend/src/pages/ValidatorApprovalPage.tsx`
- `frontend/src/components/validation/ValidationRequestCard.tsx`

**Depends on:** VALID-T5

**Done when:**
- [ ] Validador vê lista de solicitações pendentes
- [ ] Pode aprovar ou rejeitar com comentário opcional
- [ ] Status no perfil do reconhecido é atualizado imediatamente

**Tests:** Visual — fluxo de aprovação e rejeição pelo validador.

**Commit:** `feat(frontend): add Validator Approval page with pending validation requests list`

---

## VALID-T8: Teste de Integração — Fluxo Completo de Validação

**What:** Testes de integração cobrindo ambas as modalidades de validação.

**Where:**
- `backend/src/test/java/com/congreats/integration/SkillValidationFlowIT.java`

**Depends on:** VALID-T6, VALID-T7

**Done when:**
- [ ] Solicitar validação → responder questionário com ≥ 70% → badge "Validado"
- [ ] Solicitar validação → responder com < 70% → status PENDING, cooldown 7 dias
- [ ] Solicitar validação → indicar validador → validador aprova → badge "Validado por Par"
- [ ] Indicar validador inativo → erro 400

**Tests:** `mvn test -Dtest="SkillValidationFlowIT"` passa.

**Commit:** `test(validation): add integration tests for questionnaire and peer validation flows`

# Skill Validation — Specification

**Version:** v2.1
**Feature ID:** VALID

## Problem Statement

Reconhecimentos de habilidades técnicas precisam de um mecanismo que garanta sua autenticidade. Sem validação, qualquer pessoa pode reconhecer qualquer habilidade técnica sem evidência real. Validação estruturada (questionários, profissionais validadores) eleva a credibilidade das habilidades reconhecidas na plataforma.

## Goals

- [ ] Habilidades técnicas validadas têm marca visual diferenciada no perfil.
- [ ] Processo de validação pode ser iniciado por quem reconhece ou pelo próprio profissional.
- [ ] Taxa de conclusão de validações iniciadas > 60%.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Validação por exame externo (certificações) | Deferred |
| Validação automática por IA | Future consideration |
| Validade com prazo de expiração | v2.1 — validações não expiram |

---

## User Stories

### P1: Solicitar Validação de Habilidade ⭐ MVP v2.1

**User Story:** Como profissional que reconheceu uma habilidade técnica, quero solicitar validação formal da habilidade para aumentar a credibilidade do reconhecimento.

**Acceptance Criteria:**

1. WHEN reconhecedor seleciona habilidade técnica (categoria "Técnico") THEN sistema SHALL oferecer opção de solicitar validação após o reconhecimento.
2. WHEN solicitação de validação é criada THEN sistema SHALL notificar o profissional reconhecido sobre a validação pendente.
3. WHEN validação está pendente THEN sistema SHALL exibir indicador "Em Validação" na habilidade do perfil.

**Independent Test:** Criar reconhecimento técnico → solicitar validação → verificar status "Em Validação" no perfil.

---

### P1: Responder Questionário de Validação ⭐ MVP v2.1

**User Story:** Como profissional reconhecido, quero responder um questionário sobre a habilidade técnica para validar meu conhecimento.

**Acceptance Criteria:**

1. WHEN profissional acessa validação pendente THEN sistema SHALL exibir questionário de 5-10 perguntas sobre a habilidade.
2. WHEN profissional responde corretamente ≥ 70% das perguntas THEN sistema SHALL marcar habilidade como "Validada" no perfil.
3. WHEN profissional responde < 70% THEN sistema SHALL manter status "Em Validação" e permitir nova tentativa em 7 dias.
4. WHEN questionário é aprovado THEN sistema SHALL conceder marcador visual especial na habilidade (badge "Validado").

**Independent Test:** Responder questionário com ≥ 70% → verificar badge "Validado" na habilidade do perfil.

---

### P2: Validação por Profissional Validador

**User Story:** Como profissional, quero indicar um colega validador especialista para validar minha habilidade técnica como alternativa ao questionário.

**Acceptance Criteria:**

1. WHEN profissional escolhe validação por colega THEN sistema SHALL permitir buscar e indicar um profissional validador.
2. WHEN validador é indicado THEN sistema SHALL notificar o validador com solicitação de aprovação.
3. WHEN validador aprova THEN sistema SHALL marcar habilidade como "Validada por Par" com nome do validador.
4. WHEN validador rejeita THEN sistema SHALL notificar profissional e manter status "Em Validação".

**Independent Test:** Indicar validador → validador aprova → verificar badge "Validado por Par" no perfil.

---

## Edge Cases

- WHEN questionário de habilidade específica ainda não foi criado pelo admin THEN sistema SHALL redirecionar para validação por par como alternativa.
- WHEN validador indicado está inativo THEN sistema SHALL bloquear indicação com mensagem de erro.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| VALID-01 | P1: Solicitar Validação | Design | Pending |
| VALID-02 | P1: Questionário | Design | Pending |
| VALID-03 | P2: Validador Par | Design | Pending |

**Coverage:** 3 total, 0 mapeadas, 3 unmapped ⚠️

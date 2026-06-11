# Medals & Trophies — Specification

**Version:** v2.0
**Feature ID:** MEDAL

## Problem Statement

Reconhecimentos isolados geram impacto pontual. Medalhas e troféus criam uma narrativa de progressão que sustenta o engajamento de longo prazo. Profissionais que acumulam reconhecimentos em uma habilidade veem sua progressão materializada em conquistas, motivando tanto quem reconhece quanto quem é reconhecido.

## Goals

- [ ] Medalhas são concedidas automaticamente ao atingir marcos de reconhecimento.
- [ ] Troféus representam progressão em habilidades específicas e são exibidos no perfil.
- [ ] Sistema de progressão aumenta frequência de reconhecimentos em 30% (meta de produto).

## Out of Scope

| Feature | Reason |
|---------|--------|
| Marketplace de medalhas | Fora de escopo |
| Medalhas customizadas por empresa | Deferred |
| Compartilhamento externo de conquistas | Deferred |

---

## User Stories

### P1: Concessão Automática de Medalhas ⭐ MVP v2.0

**User Story:** Como profissional, quero receber medalhas automaticamente ao atingir marcos de reconhecimento para ver minha progressão na plataforma.

**Acceptance Criteria:**

1. WHEN profissional recebe o 1º, 5º, 10º, 25º, 50º e 100º reconhecimento THEN sistema SHALL conceder medalha correspondente ao marco.
2. WHEN medalha é concedida THEN sistema SHALL notificar o profissional com mensagem de conquista.
3. WHEN medalha é concedida THEN sistema SHALL exibir a medalha na seção de conquistas do perfil.
4. WHEN profissional já tem uma medalha de marco THEN sistema SHALL não conceder novamente (idempotência).

**Independent Test:** Criar 5 reconhecimentos para o mesmo profissional → verificar medalha "5 Reconhecimentos" no perfil.

---

### P1: Progressão em Habilidades (Troféus) ⭐ MVP v2.0

**User Story:** Como profissional, quero ver meus troféus de progressão em habilidades específicas para entender em que áreas sou reconhecido como referência.

**Acceptance Criteria:**

1. WHEN habilidade é reconhecida 3, 10 e 25 vezes THEN sistema SHALL conceder troféu Bronze, Prata e Ouro para aquela habilidade.
2. WHEN troféu é concedido THEN sistema SHALL exibir no perfil com o nível e a habilidade correspondente.
3. WHEN profissional visualiza perfil THEN sistema SHALL exibir troféus ordenados por nível (Ouro > Prata > Bronze) e depois por habilidade.

**Independent Test:** Reconhecer habilidade "Java" 3 vezes → verificar troféu Bronze "Java" no perfil.

---

### P2: Vitrine de Conquistas no Perfil

**User Story:** Como visitante do perfil, quero ver as conquistas (medalhas e troféus) do profissional em destaque para entender sua trajetória.

**Acceptance Criteria:**

1. WHEN perfil tem medalhas e troféus THEN sistema SHALL exibir seção "Conquistas" com os itens visuais.
2. WHEN conquista é recente (< 7 dias) THEN sistema SHALL marcar com badge "Novo".
3. WHEN profissional não tem conquistas THEN sistema SHALL exibir estado vazio.

**Independent Test:** Ver perfil com medalhas e troféus — verificar seção de conquistas com badges "Novo" para recentes.

---

## Edge Cases

- WHEN reconhecimento é criado mas serviço de medals está indisponível THEN sistema SHALL registrar evento pendente e processar depois (eventual consistency).
- WHEN mesmo reconhecimento é processado duas vezes (retry) THEN sistema SHALL ser idempotente.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| MEDAL-01 | P1: Medalhas por Marco | Design | Pending |
| MEDAL-02 | P1: Troféus por Habilidade | Design | Pending |
| MEDAL-03 | P2: Vitrine de Conquistas | Design | Pending |

**Coverage:** 3 total, 0 mapeadas, 3 unmapped ⚠️

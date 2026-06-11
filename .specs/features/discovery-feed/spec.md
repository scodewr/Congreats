# Discovery Feed — Specification

**Version:** v1.1
**Feature ID:** FEED

## Problem Statement

Após o MVP, os reconhecimentos existem mas ficam isolados no perfil de cada pessoa. Uma área de descoberta centraliza os reconhecimentos mais recentes da empresa/área e destaca os profissionais mais reconhecidos, criando engajamento contínuo e visibilidade organizacional.

## Goals

- [ ] Profissionais visualizam os reconhecimentos mais recentes da organização em tempo real.
- [ ] Ranking de profissionais mais reconhecidos incentiva cultura de reconhecimento.
- [ ] Feed é relevante ao contexto do usuário (empresa ou área).

## Out of Scope

| Feature | Reason |
|---------|--------|
| Feed personalizado por algoritmo de recomendação | Fora do escopo v1.1 |
| Comentários nos reconhecimentos do feed | Deferred |
| Filtro por habilidade no feed | v1.2+ com workspaces |
| Notificações em tempo real (WebSocket) | Deferred |

---

## User Stories

### P1: Feed de Reconhecimentos Recentes ⭐ MVP v1.1

**User Story:** Como profissional, quero ver um feed com os reconhecimentos mais recentes da minha empresa para acompanhar as contribuições dos meus colegas.

**Acceptance Criteria:**

1. WHEN usuário acessa a área de descoberta THEN sistema SHALL exibir os últimos 20 reconhecimentos da empresa do usuário, ordenados por data decrescente.
2. WHEN usuário rola até o final do feed THEN sistema SHALL carregar mais 20 reconhecimentos (infinite scroll).
3. WHEN nenhum reconhecimento existe THEN sistema SHALL exibir estado vazio com convite para ser o primeiro.
4. WHEN novo reconhecimento é criado THEN sistema SHALL aparecer no topo do feed no próximo carregamento.

**Independent Test:** Criar reconhecimento → verificar que aparece no feed da área de descoberta.

---

### P1: Ranking de Profissionais ⭐ MVP v1.1

**User Story:** Como profissional, quero ver o ranking dos colegas mais reconhecidos para identificar referências na organização.

**Acceptance Criteria:**

1. WHEN usuário acessa a área de descoberta THEN sistema SHALL exibir top 10 profissionais mais reconhecidos (por total de reconhecimentos recebidos no mês atual).
2. WHEN usuário clica em um profissional do ranking THEN sistema SHALL navegar para o perfil dele.
3. WHEN nenhum reconhecimento existe ainda THEN sistema SHALL exibir estado vazio no ranking.
4. WHEN empate em número de reconhecimentos THEN sistema SHALL ordenar por data do mais recente.

**Independent Test:** Criar reconhecimentos para 3 pessoas diferentes → verificar ranking reflete contagens corretas.

---

### P2: Filtro por Período no Ranking

**User Story:** Como profissional, quero filtrar o ranking por período (este mês, este trimestre, este ano, todos os tempos) para ver tendências diferentes.

**Acceptance Criteria:**

1. WHEN usuário seleciona período no ranking THEN sistema SHALL recalcular ranking para o período selecionado.
2. WHEN período é "todos os tempos" THEN sistema SHALL considerar todos os reconhecimentos históricos.

**Independent Test:** Criar reconhecimentos em períodos diferentes → filtrar por período → verificar ranking correto.

---

## Edge Cases

- WHEN usuário não tem empresa definida no perfil THEN sistema SHALL exibir feed global (todos da plataforma).
- WHEN feed tem reconhecimentos de usuários inativos THEN sistema SHALL exibir mas marcar como "[Usuário desativado]".

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| FEED-01 | P1: Feed Recentes | Design | Pending |
| FEED-02 | P1: Ranking | Design | Pending |
| FEED-03 | P2: Filtro por Período | Design | Pending |

**Coverage:** 3 total, 0 mapeadas, 3 unmapped ⚠️

---

## Success Criteria

- [ ] Feed carrega em < 1 segundo (p95) com paginação.
- [ ] Ranking calculado corretamente para o período selecionado.
- [ ] Estado vazio exibido quando não há reconhecimentos.

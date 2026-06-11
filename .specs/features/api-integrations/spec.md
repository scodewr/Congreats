# API Integrations — Specification

**Version:** v3.0
**Feature ID:** INTEG

## Problem Statement

Reconhecimentos manuais capturam contribuições interpessoais, mas muitas contribuições são mensuráveis objetivamente: tasks fechadas, PRs mergeados, projetos entregues. Integrar com ferramentas que profissionais já usam (Jira, GitHub, Linear) permite reconhecimentos dinâmicos baseados em evidências reais, aumentando frequência e credibilidade.

## Goals

- [ ] Admin configura integrações com ferramentas externas em < 15 minutos.
- [ ] Eventos externos geram reconhecimentos automáticos (ou propostos para revisão) sem intervenção manual.
- [ ] Primeiros conectores: GitHub, Jira, Linear.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Reconhecimento automático sem revisão | v3.0 — todos passam por aprovação/revisão antes de publicar |
| Conector para todas as ferramentas | v3.0 entrega 3 conectores; arquitetura extensível |
| Analytics de produtividade a partir de integração | Deferred |

---

## User Stories

### P1: Configurar Integração com Ferramenta Externa ⭐ MVP v3.0

**User Story:** Como administrador, quero configurar uma integração com uma ferramenta externa para que eventos da ferramenta possam gerar reconhecimentos na plataforma.

**Acceptance Criteria:**

1. WHEN admin acessa painel de integrações THEN sistema SHALL exibir conectores disponíveis (GitHub, Jira, Linear) com status (conectado/desconectado).
2. WHEN admin configura integração THEN sistema SHALL solicitar credenciais/token de API da ferramenta e validar conexão.
3. WHEN admin define mapeamento (ex: "PR mergeado" → categoria "Técnico" + habilidade "Code Review") THEN sistema SHALL salvar e ativar o mapeamento.
4. WHEN integração está ativa THEN sistema SHALL processar eventos recebidos via webhook e gerar reconhecimentos candidatos.

**Independent Test:** Configurar integração com GitHub → simular evento de PR mergeado → verificar reconhecimento candidato criado.

---

### P1: Reconhecimento Dinâmico Baseado em Evento ⭐ MVP v3.0

**User Story:** Como profissional, quero que minhas contribuições mensuráveis (tasks fechadas, PRs aprovados) gerem reconhecimentos automáticos para valorizar entregas objetivas.

**Acceptance Criteria:**

1. WHEN evento externo é recebido e mapeado THEN sistema SHALL criar reconhecimento candidato com status "PENDENTE_REVISÃO".
2. WHEN reconhecimento candidato está pendente THEN sistema SHALL notificar o autor do reconhecimento (quem executou a ação) para revisar/confirmar antes de publicar.
3. WHEN autor confirma o reconhecimento THEN sistema SHALL publicar e aplicar todas as mecânicas de gamification normalmente.
4. WHEN autor rejeita ou ignora por 48h THEN sistema SHALL descartar o candidato.
5. WHEN reconhecimento dinâmico é publicado THEN sistema SHALL marcar visualmente como "Baseado em entrega" no feed.

**Independent Test:** Evento de PR mergeado → reconhecimento candidato criado → autor confirma → aparece no perfil com marcação "Baseado em entrega".

---

### P2: Webhook Genérico para Integrações Customizadas

**User Story:** Como desenvolvedor de uma ferramenta não listada, quero usar um webhook genérico para enviar eventos ao Congreats e gerar reconhecimentos.

**Acceptance Criteria:**

1. WHEN admin gera um webhook URL e token THEN sistema SHALL publicar endpoint `/integrations/webhook/{integrationId}`.
2. WHEN evento JSON chega no webhook com payload mapeado THEN sistema SHALL criar reconhecimento candidato conforme configuração.
3. WHEN payload não corresponde ao schema esperado THEN sistema SHALL retornar 400 com mensagem de validação.

**Independent Test:** Enviar POST para webhook com payload de teste → verificar reconhecimento candidato criado.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| INTEG-01 | P1: Configurar Integração | Design | Pending |
| INTEG-02 | P1: Reconhecimento Dinâmico | Design | Pending |
| INTEG-03 | P2: Webhook Genérico | Design | Pending |

**Coverage:** 3 total, 0 mapeadas, 3 unmapped ⚠️

---

## Success Criteria

- [ ] Admin configura integração e recebe primeiro reconhecimento candidato em < 30 minutos.
- [ ] Evento externo processado e candidato criado em < 5 segundos.
- [ ] Reconhecimentos dinâmicos marcados visualmente como diferenciados no feed.

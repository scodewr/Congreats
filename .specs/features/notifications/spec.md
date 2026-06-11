# Notification System — Specification

**Version:** v2.2
**Feature ID:** NOTIF

## Problem Statement

O reconhecimento só gera impacto completo quando o profissional reconhecido é informado no momento certo, no canal certo. Sem notificações, o profissional precisa entrar na plataforma ativamente para descobrir que foi reconhecido — o que reduz a sensação de valorização imediata.

## Goals

- [ ] Profissional recebe notificação ao ser reconhecido em < 30 segundos após o evento.
- [ ] Usuário configura quais canais deseja receber notificações (email obrigatório; WhatsApp/SMS opcional).
- [ ] Taxa de entrega de email ≥ 98% (via provider confiável).

## Out of Scope

| Feature | Reason |
|---------|--------|
| Notificações push mobile (WebPush / APNs) | Deferred — v3+ React Native |
| Digest semanal de reconhecimentos | Deferred |
| Notificações in-app em tempo real (WebSocket) | Deferred |

---

## User Stories

### P1: Notificação ao Ser Reconhecido ⭐ MVP v2.2

**User Story:** Como profissional, quero receber uma notificação quando um colega me reconhecer para saber imediatamente sobre o reconhecimento.

**Acceptance Criteria:**

1. WHEN reconhecimento é criado THEN sistema SHALL enviar notificação ao profissional reconhecido via email em < 30 segundos.
2. WHEN notificação de email é enviada THEN SHALL incluir: nome do reconhecedor, categoria, habilidades reconhecidas, depoimento e link para o perfil.
3. WHEN usuário tem WhatsApp configurado e habilitado THEN sistema SHALL enviar mensagem via WhatsApp API além do email.
4. WHEN usuário tem SMS configurado e habilitado THEN sistema SHALL enviar SMS resumido além do email.

**Independent Test:** Criar reconhecimento → verificar email recebido pelo reconhecido com dados corretos.

---

### P1: Notificação de Validação ⭐ MVP v2.2

**User Story:** Como profissional, quero receber notificação quando minha validação de habilidade for solicitada, aprovada ou rejeitada.

**Acceptance Criteria:**

1. WHEN validação é solicitada THEN sistema SHALL notificar profissional reconhecido via email sobre a pendência.
2. WHEN validação é aprovada THEN sistema SHALL notificar via email com parabéns e link para o perfil atualizado.
3. WHEN validação é rejeitada THEN sistema SHALL notificar via email com orientação sobre nova tentativa.
4. WHEN validador é designado THEN sistema SHALL notificar o validador via email com link para aprovar/rejeitar.

**Independent Test:** Solicitar validação → verificar email de pendência recebido pelo reconhecido.

---

### P2: Configuração de Canais de Notificação

**User Story:** Como profissional, quero configurar quais canais de notificação desejo receber para ter controle sobre como sou contactado.

**Acceptance Criteria:**

1. WHEN usuário acessa configurações THEN sistema SHALL exibir preferências de notificação por canal (Email sempre ativo, WhatsApp e SMS opcionais com campo de número).
2. WHEN usuário desabilita WhatsApp THEN sistema SHALL não enviar mais notificações por esse canal.
3. WHEN usuário cadastra número de WhatsApp/celular THEN sistema SHALL enviar mensagem de confirmação antes de ativar.

**Independent Test:** Desabilitar WhatsApp → criar reconhecimento → verificar que apenas email é enviado.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| NOTIF-01 | P1: Notificação ao Ser Reconhecido | Design | Pending |
| NOTIF-02 | P1: Notificação de Validação | Design | Pending |
| NOTIF-03 | P2: Configuração de Canais | Design | Pending |

**Coverage:** 3 total, 0 mapeadas, 3 unmapped ⚠️

---

## Success Criteria

- [ ] Email entregue em < 30 segundos após criação do reconhecimento (p95).
- [ ] Taxa de entrega de email ≥ 98%.
- [ ] Zero notificações enviadas para usuários que desabilitaram o canal.

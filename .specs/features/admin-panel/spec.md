# Admin Panel — Specification

**Version:** v1.3
**Feature ID:** ADM

## Problem Statement

À medida que a plataforma cresce, administradores precisam gerenciar usuários, workspaces e criar iniciativas de engajamento (campanhas, eventos, campeonatos). Sem um painel administrativo, a gestão da plataforma seria feita diretamente no banco de dados.

## Goals

- [ ] Admins gerenciam usuários (criar, editar, desativar) sem acesso ao banco.
- [ ] Admins gerenciam workspaces e suas associações.
- [ ] Admins criam campanhas e eventos para impulsionar o engajamento.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Auditoria completa de ações admin | Deferred — logs de acesso são suficientes no v1.3 |
| Roles granulares além de Admin/User | v1.3 apenas 2 roles |
| Importação em lote de usuários (CSV) | Deferred |

---

## User Stories

### P1: Gestão de Usuários ⭐ MVP v1.3

**User Story:** Como administrador, quero criar, editar e desativar usuários para gerenciar o acesso à plataforma.

**Acceptance Criteria:**

1. WHEN admin cria usuário THEN sistema SHALL criar conta e enviar email de boas-vindas com senha temporária.
2. WHEN admin edita usuário THEN sistema SHALL atualizar nome, email e role (admin/user).
3. WHEN admin desativa usuário THEN sistema SHALL bloquear login do usuário mas manter histórico de reconhecimentos.
4. WHEN admin acessa lista de usuários THEN sistema SHALL exibir todos com status, data de criação e último login.
5. WHEN não-admin tenta acessar endpoints `/admin/*` THEN sistema SHALL retornar 403.

**Independent Test:** Admin cria usuário → usuário faz login com senha temporária → admin desativa → login bloqueado.

---

### P1: Gestão de Workspaces ⭐ MVP v1.3

**User Story:** Como administrador, quero criar, editar e arquivar workspaces e gerenciar seus membros.

**Acceptance Criteria:**

1. WHEN admin cria/edita workspace THEN sistema SHALL persistir e tornar disponível imediatamente.
2. WHEN admin arquiva workspace THEN sistema SHALL bloquear novos reconhecimentos no workspace mas manter histórico.
3. WHEN admin gerencia membros do workspace THEN sistema SHALL adicionar/remover membros em tempo real.

**Independent Test:** Admin cria workspace, adiciona membro, remove membro — todos os estados refletidos imediatamente.

---

### P2: Campanhas de Reconhecimento

**User Story:** Como administrador, quero criar campanhas temáticas (ex: "Semana de Inovação") para impulsionar reconhecimentos em um período específico.

**Acceptance Criteria:**

1. WHEN admin cria campanha com nome, período e categoria THEN sistema SHALL destacar a campanha no feed durante o período.
2. WHEN campanha está ativa THEN sistema SHALL exibir banner na área de descoberta e formulário de reconhecimento.
3. WHEN campanha expira THEN sistema SHALL automaticamente desativá-la.

**Independent Test:** Criar campanha ativa → verificar banner no feed → campanha expirada → banner desaparece.

---

### P2: Eventos e Campeonatos

**User Story:** Como administrador, quero criar eventos e campeonatos para gerar engajamento pontual e premiação.

**Acceptance Criteria:**

1. WHEN admin cria evento com nome, período, categoria e critério de premiação THEN sistema SHALL registrar o evento.
2. WHEN evento está ativo THEN sistema SHALL computar ranking de participantes com base nos reconhecimentos do período.
3. WHEN evento encerra THEN sistema SHALL finalizar ranking e registrar vencedores (integra com v2.0 medalhas).

**Independent Test:** Criar evento → fazer reconhecimentos → verificar ranking do evento.

---

## Edge Cases

- WHEN admin tenta desativar o único admin do sistema THEN sistema SHALL bloquear com erro "Pelo menos um admin ativo é necessário".
- WHEN admin tenta criar usuário com email já existente THEN sistema SHALL retornar 409.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| ADM-01 | P1: Gestão de Usuários | Design | Pending |
| ADM-02 | P1: Gestão de Workspaces | Design | Pending |
| ADM-03 | P2: Campanhas | Design | Pending |
| ADM-04 | P2: Eventos/Campeonatos | Design | Pending |

**Coverage:** 4 total, 0 mapeadas, 4 unmapped ⚠️

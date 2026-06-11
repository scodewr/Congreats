# Professional Profile — Specification

**Version:** v1.0
**Feature ID:** PROF

## Problem Statement

Cada profissional precisa de um espaço centralizado que consolide sua identidade profissional: quem é, no que é bom, em que projetos atua e o que colegas dizem sobre ele. Sem isso, os reconhecimentos existem isolados, sem contexto de quem os recebe. O perfil é a vitrine pública de cada pessoa na plataforma.

## Goals

- [ ] Qualquer usuário autenticado pode visualizar o perfil completo de qualquer colega.
- [ ] Profissional pode editar suas próprias informações (bio, projetos, equipes) em menos de 3 minutos.
- [ ] Perfil exibe habilidades reconhecidas com contagem, projetos, equipes e depoimentos de forma clara.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Verificação de histórico profissional externo | v1 — foco em auto-declaração |
| Exportar perfil como PDF/LinkedIn | v1 — future feature |
| Perfil público sem login | v1 — requer autenticação |
| Seguir profissionais / notificações de atualizações | Deferred |

---

## User Stories

### P1: Visualizar Perfil Profissional ⭐ MVP

**User Story:** Como profissional autenticado, quero visualizar o perfil completo de um colega para conhecer suas habilidades, projetos e o que os outros dizem sobre ele.

**Why P1:** O perfil é o destino central de toda a plataforma — sem ele, os reconhecimentos não têm contexto.

**Acceptance Criteria:**

1. WHEN usuário acessa `/profiles/{id}` THEN sistema SHALL exibir: foto, nome, cargo/empresa, seção "Sobre", habilidades reconhecidas (com contagem), projetos, equipes e depoimentos.
2. WHEN profissional ainda não recebeu reconhecimentos THEN sistema SHALL exibir seções vazias com mensagem de convite ("Seja o primeiro a reconhecer").
3. WHEN foto de perfil não foi cadastrada THEN sistema SHALL exibir avatar padrão com iniciais do nome.
4. WHEN usuário visualiza o próprio perfil THEN sistema SHALL exibir botão "Editar Perfil".

**Independent Test:** Acessar `/profiles/{id}` de um usuário com dados completos e verificar todas as seções visíveis.

---

### P1: Editar Informações do Perfil ⭐ MVP

**User Story:** Como profissional, quero editar meu perfil (bio, cargo, projetos, equipes) para manter minhas informações atualizadas.

**Why P1:** Auto-declaração de projetos e equipes é necessária no MVP antes de existir importação automática.

**Acceptance Criteria:**

1. WHEN profissional acessa edição do próprio perfil THEN sistema SHALL exibir formulário pré-preenchido com dados atuais.
2. WHEN profissional salva alterações válidas THEN sistema SHALL atualizar perfil e redirecionar para visualização com mensagem de sucesso.
3. WHEN profissional tenta editar perfil de outra pessoa THEN sistema SHALL retornar 403.
4. WHEN campos obrigatórios (nome) são deixados em branco THEN sistema SHALL impedir salvamento com mensagem de validação.
5. WHEN profissional adiciona um projeto THEN sistema SHALL exibir o projeto na lista do perfil imediatamente após salvar.

**Independent Test:** Editar bio e adicionar um projeto; verificar que aparece no perfil sem reload forçado.

---

### P1: Upload de Foto de Perfil ⭐ MVP

**User Story:** Como profissional, quero carregar minha foto de perfil para que meus colegas me identifiquem visualmente na plataforma.

**Why P1:** Identidade visual é essencial para o contexto de reconhecimento entre colegas.

**Acceptance Criteria:**

1. WHEN profissional faz upload de imagem (JPG/PNG, até 5MB) THEN sistema SHALL armazenar a imagem e exibir no perfil.
2. WHEN arquivo não é JPG ou PNG THEN sistema SHALL rejeitar com mensagem de tipo inválido.
3. WHEN arquivo excede 5MB THEN sistema SHALL rejeitar com mensagem de tamanho.
4. WHEN upload é bem-sucedido THEN sistema SHALL exibir preview da nova foto imediatamente.

**Independent Test:** Upload de foto JPG válida — verificar exibição no perfil. Upload de PDF — verificar rejeição.

---

### P2: Gerenciar Projetos e Equipes

**User Story:** Como profissional, quero adicionar e remover projetos e equipes do meu perfil para refletir meu histórico de atuação.

**Why P2:** Contextualiza reconhecimentos mas não é bloqueante para o MVP funcionar.

**Acceptance Criteria:**

1. WHEN profissional adiciona projeto com nome e status (ativo/passado) THEN sistema SHALL incluir na lista do perfil.
2. WHEN profissional remove projeto THEN sistema SHALL removê-lo do perfil (mas manter histórico de reconhecimentos associados).
3. WHEN profissional adiciona equipe/iniciativa THEN sistema SHALL incluir na seção correspondente.
4. WHEN profissional tenta adicionar projeto com nome em branco THEN sistema SHALL bloquear com validação.

**Independent Test:** Adicionar projeto, verificar exibição; remover projeto, verificar remoção sem afetar reconhecimentos.

---

### P3: Seção de Depoimentos no Perfil

**User Story:** Como visitante do perfil, quero ver os depoimentos escritos pelos colegas do profissional para ter uma visão qualitativa das habilidades reconhecidas.

**Why P3:** Depoimentos são gerados automaticamente pelo Recognition System — a exibição é apenas renderização.

**Acceptance Criteria:**

1. WHEN profissional tem reconhecimentos com depoimento THEN sistema SHALL listar os depoimentos mais recentes (ordenados por data desc).
2. WHEN depoimento é muito longo (> 500 chars) THEN sistema SHALL truncar com opção "Ver mais".
3. WHEN profissional não tem depoimentos THEN sistema SHALL exibir estado vazio.

**Independent Test:** Ver perfil de usuário com reconhecimentos — verificar depoimentos listados em ordem cronológica inversa.

---

## Edge Cases

- WHEN usuário acessa `/profiles/{id}` inválido (UUID inexistente) THEN sistema SHALL retornar 404.
- WHEN nome do profissional contém caracteres especiais (acentos) THEN sistema SHALL exibir e armazenar corretamente (UTF-8).
- WHEN foto é enviada via mobile com orientação EXIF diferente THEN sistema SHALL normalizar orientação antes de salvar.
- WHEN profissional tem mais de 50 habilidades reconhecidas THEN sistema SHALL exibir as top 10 e oferecer opção de expandir.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| PROF-01 | P1: Visualizar Perfil | Design | Pending |
| PROF-02 | P1: Editar Perfil | Design | Pending |
| PROF-03 | P1: Upload de Foto | Design | Pending |
| PROF-04 | P2: Gerenciar Projetos/Equipes | Design | Pending |
| PROF-05 | P3: Seção de Depoimentos | Design | Pending |

**Coverage:** 5 total, 0 mapeadas para tasks, 5 unmapped ⚠️

---

## Success Criteria

- [ ] Perfil exibe todas as seções em < 1 segundo (p95) com dados reais.
- [ ] Upload de foto processado em < 3 segundos para imagens até 5MB.
- [ ] Edição de perfil salva e reflete mudanças sem reload de página.
- [ ] 403 garantido ao tentar editar perfil de outro usuário.

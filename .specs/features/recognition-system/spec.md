# Recognition System — Specification

**Version:** v1.0
**Feature ID:** REC

## Problem Statement

O reconhecimento entre colegas é o coração da plataforma. Sem um fluxo claro e incentivado para criar reconhecimentos, a plataforma não cumpre sua missão. O sistema precisa ser simples o suficiente para que alguém reconheça um colega em menos de 2 minutos, mas estruturado o suficiente para gerar dados valiosos sobre habilidades e contribuições.

## Goals

- [ ] Profissional pode criar um reconhecimento para um colega em menos de 2 minutos.
- [ ] Reconhecimentos são imutáveis após criação (garantia de autenticidade).
- [ ] Habilidades reconhecidas são visíveis no perfil do profissional imediatamente.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Reconhecimento anônimo | Deferred — design de confiança exige identidade |
| Editar ou excluir reconhecimento | Por design — imutabilidade garante autenticidade |
| Reconhecimento em lote | v1 — foco em reconhecimento individual |
| Reação / curtida em reconhecimentos | Deferred — gamification v2 |
| Validação de habilidades técnicas | v2.1 — feature separada |

---

## User Stories

### P1: Criar Reconhecimento ⭐ MVP

**User Story:** Como profissional, quero reconhecer um colega escolhendo categoria, habilidades e escrevendo um depoimento para valorizar sua contribuição.

**Why P1:** É a ação core da plataforma — sem isso, não há reconhecimentos.

**Acceptance Criteria:**

1. WHEN profissional acessa formulário de reconhecimento e preenche: colega a reconhecer, categoria, pelo menos uma habilidade e depoimento (mínimo 20 chars) THEN sistema SHALL criar o reconhecimento e notificar o perfil do colega.
2. WHEN profissional tenta criar reconhecimento sem selecionar colega, categoria ou habilidade THEN sistema SHALL bloquear com mensagem de validação por campo.
3. WHEN profissional tenta reconhecer a si mesmo THEN sistema SHALL retornar erro 400 com mensagem "Você não pode reconhecer a si mesmo".
4. WHEN reconhecimento é criado com sucesso THEN sistema SHALL incrementar contagem da habilidade no perfil do colega reconhecido.
5. WHEN reconhecimento é criado THEN sistema SHALL exibir confirmação visual e retornar para o feed ou perfil do colega.

**Independent Test:** Criar reconhecimento completo → verificar no perfil do colega que a habilidade reconhecida aparece com contagem.

---

### P1: Visualizar Reconhecimentos Recebidos ⭐ MVP

**User Story:** Como profissional, quero ver todos os reconhecimentos que recebi no meu perfil para entender como sou percebido pelos colegas.

**Why P1:** Sem exibição, o reconhecimento não tem impacto visível — é o retorno ao usuário reconhecido.

**Acceptance Criteria:**

1. WHEN usuário acessa perfil de um profissional THEN sistema SHALL exibir os reconhecimentos recebidos (categoria, habilidades, depoimento, quem reconheceu, data).
2. WHEN profissional tem muitos reconhecimentos (> 10) THEN sistema SHALL paginar (10 por página) com opção de carregar mais.
3. WHEN profissional não tem reconhecimentos THEN sistema SHALL exibir estado vazio com convite para ser o primeiro a reconhecer.
4. WHEN reconhecimento é criado para um profissional THEN sistema SHALL aparecer nos reconhecimentos recebidos imediatamente.

**Independent Test:** Criar reconhecimento para colega → abrir perfil do colega → verificar reconhecimento listado.

---

### P1: Selecionar Categoria de Reconhecimento ⭐ MVP

**User Story:** Como profissional, quero escolher uma categoria ao criar um reconhecimento para classificar o tipo de contribuição que estou valorizando.

**Why P1:** Categorias estruturam os dados e permitem métricas — sem categoria o reconhecimento perde contexto.

**Acceptance Criteria:**

1. WHEN profissional inicia formulário de reconhecimento THEN sistema SHALL exibir lista de categorias pré-definidas (ex: Liderança, Técnico, Colaboração, Inovação, Mentoria).
2. WHEN profissional seleciona categoria THEN sistema SHALL filtrar/sugerir habilidades relevantes para aquela categoria.
3. WHEN nenhuma categoria é selecionada THEN sistema SHALL bloquear envio com validação.

**Independent Test:** Abrir formulário → verificar categorias disponíveis → selecionar uma → verificar habilidades sugeridas.

---

### P2: Associar Reconhecimento a Projeto ou Equipe

**User Story:** Como profissional, quero (opcionalmente) associar um reconhecimento a um projeto ou equipe para dar contexto à contribuição reconhecida.

**Why P2:** Contexto enriquece o reconhecimento mas não é obrigatório para o MVP funcionar.

**Acceptance Criteria:**

1. WHEN profissional cria reconhecimento THEN sistema SHALL oferecer campo opcional de projeto (lista dos projetos do reconhecido + do reconhecedor).
2. WHEN profissional cria reconhecimento THEN sistema SHALL oferecer campo opcional de equipe (lista das equipes do reconhecido + do reconhecedor).
3. WHEN projeto/equipe é selecionado THEN sistema SHALL incluir referência no reconhecimento persistido.
4. WHEN nenhum projeto/equipe é selecionado THEN sistema SHALL criar reconhecimento normalmente sem esses campos.

**Independent Test:** Criar reconhecimento com e sem projeto — ambos funcionam e são exibidos corretamente.

---

### P3: Histórico de Reconhecimentos Dados

**User Story:** Como profissional, quero ver o histórico de reconhecimentos que dei para acompanhar minhas contribuições ao time.

**Why P3:** Nice-to-have — o MVP foca em receber, mas dar também deve ter visibilidade futura.

**Acceptance Criteria:**

1. WHEN profissional acessa seu próprio perfil THEN sistema SHALL exibir aba "Reconhecimentos Dados" com lista dos que criou.
2. WHEN lista está vazia THEN sistema SHALL exibir estado vazio com convite para reconhecer alguém.

**Independent Test:** Ver histórico de reconhecimentos dados no próprio perfil.

---

## Edge Cases

- WHEN depoimento contém apenas espaços em branco THEN sistema SHALL rejeitar como vazio.
- WHEN mesma pessoa reconhece o mesmo colega com a mesma habilidade repetidamente THEN sistema SHALL permitir (sem limite de reconhecimentos), incrementando a contagem.
- WHEN colega reconhecido é desativado após o reconhecimento THEN sistema SHALL manter o reconhecimento no histórico.
- WHEN habilidade é personalizada pelo usuário (texto livre) THEN sistema SHALL normalizar capitalização antes de salvar.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| REC-01 | P1: Criar Reconhecimento | Design | Pending |
| REC-02 | P1: Visualizar Reconhecimentos | Design | Pending |
| REC-03 | P1: Categorias | Design | Pending |
| REC-04 | P2: Projeto/Equipe Opcional | Design | Pending |
| REC-05 | P3: Histórico de Reconhecimentos Dados | Design | Pending |

**Coverage:** 5 total, 0 mapeadas para tasks, 5 unmapped ⚠️

---

## Success Criteria

- [ ] Criação de reconhecimento completa em < 2 minutos pelo usuário.
- [ ] Habilidade reconhecida visível no perfil em < 2 segundos após criação.
- [ ] Zero reconhecimentos criados por usuário para si mesmo.
- [ ] 100% dos reconhecimentos imutáveis após criação (sem update/delete disponível).

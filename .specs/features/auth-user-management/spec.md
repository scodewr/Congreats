# Authentication & User Management — Specification

**Version:** v1.0
**Feature ID:** AUTH

## Problem Statement

Para que profissionais possam reconhecer colegas e receber reconhecimentos, a plataforma precisa de um sistema de identidade seguro que se adapte ao contexto de implantação. Em **World Mode**, qualquer pessoa se registra e obtém acesso imediato. Em **Enterprise Mode**, um admin master controla quem acessa e com quais permissões (modelo AWS IAM). O foco é simplicidade no World e controle granular no Enterprise, sem sacrificar segurança em nenhum dos casos.

## Goals

- [ ] Profissionais podem se registrar e acessar a plataforma em menos de 2 minutos.
- [ ] Sessões são seguras com JWT de curta duração e renovação via refresh token.
- [ ] Endpoints protegidos rejeitam requisições sem token válido com status 401.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Social login (OAuth2 Google, Microsoft) | v1 — simplicity first |
| Autenticação multifator (MFA) | v1 — fora do escopo MVP |
| Recuperação de senha por email | v1 — pode ser adicionado como quick task |
| SSO corporativo (SAML, LDAP) | Future consideration |
| Registro no Enterprise Mode | Enterprise Mode: usuário só existe se admin master criar |

---

## User Stories

### P1: Registro de Usuário — World Mode ⭐ MVP

**User Story:** Como profissional (World Mode), quero me registrar com nome, email e senha para acessar a plataforma com acesso completo imediato.

**Why P1:** Sem registro não há usuários, sem usuários não há reconhecimentos — é o pré-requisito absoluto.

**Acceptance Criteria:**

1. WHEN `CONGREATS_MODE=WORLD` e usuário submete formulário com nome, email válido e senha (mínimo 8 caracteres) THEN sistema SHALL criar conta com role ADMIN e retornar JWT + refresh token.
2. WHEN `CONGREATS_MODE=ENTERPRISE` e endpoint de auto-registro é chamado THEN sistema SHALL retornar erro 403 com mensagem "Registro público não habilitado nesta instalação".
3. WHEN email já está cadastrado THEN sistema SHALL retornar erro 409 com mensagem "E-mail já cadastrado".
4. WHEN email é inválido ou senha tem menos de 8 caracteres THEN sistema SHALL retornar erro 400 com campo(s) inválido(s) identificados.
5. WHEN registro é bem-sucedido THEN sistema SHALL redirecionar usuário para página de completar perfil.

**Independent Test:** Abrir tela de registro, preencher dados válidos, verificar que o token é recebido e usuário é redirecionado.

---

### P1: Login de Usuário ⭐ MVP

**User Story:** Como profissional registrado, quero fazer login com email e senha para acessar minha conta.

**Why P1:** Sem login não há sessão autenticada — pré-requisito para todas as outras features.

**Acceptance Criteria:**

1. WHEN usuário submete email e senha corretos THEN sistema SHALL retornar JWT (15 min) + refresh token (7 dias) e redirecionar para o painel.
2. WHEN email não existe ou senha está incorreta THEN sistema SHALL retornar erro 401 com mensagem genérica (sem revelar qual campo está errado).
3. WHEN JWT expira THEN sistema SHALL aceitar refresh token válido e emitir novo JWT sem exigir novo login.
4. WHEN refresh token expira ou é inválido THEN sistema SHALL retornar erro 401 e exigir novo login.

**Independent Test:** Fazer login com credenciais válidas, verificar recebimento de tokens; tentar com senha errada, verificar 401 genérico.

---

### P1: Proteção de Endpoints ⭐ MVP

**User Story:** Como sistema, quero que todos os endpoints da API (exceto registro e login) exijam JWT válido para evitar acesso não autorizado.

**Why P1:** Sem proteção, qualquer pessoa pode criar reconhecimentos ou acessar dados sem identidade.

**Acceptance Criteria:**

1. WHEN requisição chega sem header `Authorization: Bearer <token>` THEN sistema SHALL retornar 401.
2. WHEN token está expirado ou mal-formado THEN sistema SHALL retornar 401.
3. WHEN token é válido THEN sistema SHALL extrair identidade do usuário e prosseguir com a requisição.
4. WHEN endpoints `/auth/register` e `/auth/login` são acessados THEN sistema SHALL permitir acesso sem token.

**Independent Test:** Fazer chamada GET /profiles sem token — esperar 401. Fazer mesma chamada com token válido — esperar 200.

---

### P2: Alteração de Senha

**User Story:** Como profissional autenticado, quero alterar minha senha para manter minha conta segura.

**Why P2:** Importante para segurança, mas não bloqueia o MVP — pode ser adicionado logo após o core.

**Acceptance Criteria:**

1. WHEN usuário autenticado submete senha atual e nova senha (mínimo 8 caracteres) THEN sistema SHALL atualizar a senha e invalidar todos os refresh tokens existentes.
2. WHEN senha atual está incorreta THEN sistema SHALL retornar erro 400.
3. WHEN nova senha é igual à atual THEN sistema SHALL retornar erro 400 com mensagem de orientação.

**Independent Test:** Alterar senha, tentar login com senha antiga — esperar 401. Login com nova senha — esperar sucesso.

---

### P2: Logout

**User Story:** Como profissional, quero encerrar minha sessão para proteger minha conta em dispositivos compartilhados.

**Why P2:** Boa prática de segurança, mas não bloqueia o fluxo principal do MVP.

**Acceptance Criteria:**

1. WHEN usuário faz logout THEN sistema SHALL invalidar o refresh token atual no servidor.
2. WHEN usuário tenta usar refresh token invalidado THEN sistema SHALL retornar 401.
3. WHEN usuário faz logout THEN sistema SHALL limpar tokens do storage local do frontend.

**Independent Test:** Fazer logout, tentar refresh com token antigo — esperar 401.

---

## Edge Cases

- WHEN usuário tenta registrar com email com letras maiúsculas THEN sistema SHALL normalizar para minúsculas antes de salvar.
- WHEN múltiplas requisições de login simultâneas com mesmas credenciais THEN sistema SHALL processar todas sem criar sessões duplicadas corrompidas.
- WHEN JWT contém userId inválido (usuário deletado) THEN sistema SHALL retornar 401.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| AUTH-01 | P1: Registro | Design | Pending |
| AUTH-02 | P1: Login | Design | Pending |
| AUTH-03 | P1: Proteção de Endpoints | Design | Pending |
| AUTH-04 | P2: Alteração de Senha | Design | Pending |
| AUTH-05 | P2: Logout | Design | Pending |

**Coverage:** 5 total, 0 mapeadas para tasks, 5 unmapped ⚠️

---

## Success Criteria

- [ ] Registro e login completos em < 1 minuto pelo usuário.
- [ ] 100% dos endpoints protegidos retornam 401 sem token válido.
- [ ] JWT expira em 15 min; refresh token renova sem relogin por 7 dias.
- [ ] Zero vazamento de informação sobre qual campo (email/senha) está incorreto no login.

# Authentication & User Management — Tasks

**Feature:** AUTH | **Version:** v1.0
**Spec:** [spec.md](spec.md) | **Design:** [design.md](design.md)

---

## AUTH-T1: Scaffolding do Projeto Backend

**What:** Criar estrutura do projeto Maven com Jakarta EE 10 / Java 21, configuração do servidor de aplicação, conexão com PostgreSQL.

**Where:**
- `/backend/` — novo módulo Maven
- `/backend/src/main/java/com/congreats/` — raiz dos pacotes
- `/backend/src/main/resources/META-INF/persistence.xml` — JPA config
- `/backend/pom.xml` — dependências

**Depends on:** Decisão sobre servidor (WildFly vs Quarkus) — B-001 em STATE.md

**Done when:**
- [ ] Projeto Maven compila sem erros (`mvn clean compile`)
- [ ] Servidor inicia sem erros
- [ ] Conexão com PostgreSQL validada (DataSource configurado)
- [ ] Estrutura de pacotes `domain/`, `application/`, `infrastructure/` criada

**Tests:** `mvn clean compile` passa; servidor sobe sem exceções.

**Commit:** `feat(backend): scaffold Jakarta EE 10 project with domain/application/infrastructure structure`

---

## AUTH-T2: Scaffolding do Projeto Frontend

**What:** Criar projeto React 18 + TypeScript 5 com estrutura de pastas, configuração de roteamento (React Router), cliente HTTP (Axios) e estado global (Context API).

**Where:**
- `/frontend/` — novo projeto Vite + React
- `/frontend/src/pages/` — páginas
- `/frontend/src/components/` — componentes reutilizáveis
- `/frontend/src/services/` — chamadas de API
- `/frontend/src/contexts/` — providers de estado global
- `/frontend/src/hooks/` — custom hooks

**Depends on:** Nenhuma

**Done when:**
- [ ] `npm run build` sem erros de compilação TypeScript
- [ ] React Router configurado com rotas base (`/login`, `/register`, `/`)
- [ ] Axios configurado com baseURL e interceptors para token
- [ ] `AuthContext` criado (provê `user`, `login()`, `logout()`)

**Tests:** `npm run build` e `npm run typecheck` passam sem erros.

**Commit:** `feat(frontend): scaffold React 18 + TypeScript project with routing and auth context`

---

## AUTH-T3: Entidade de Domínio User e Porta de Repositório

**What:** Implementar entidade `User`, Value Object `Email`, eventos de domínio, e interface `UserRepository`.

**Where:**
- `domain/model/User.java`
- `domain/model/Email.java` (Value Object)
- `domain/event/UserRegistered.java`
- `domain/event/UserPasswordChanged.java`
- `application/port/out/UserRepository.java`
- `application/port/out/PasswordHasher.java`
- `application/port/out/TokenService.java`

**Depends on:** AUTH-T1

**Reuses:** Nenhuma dependência externa além do Java SDK

**Done when:**
- [ ] `User` encapsula regras de negócio (changePassword valida lógica)
- [ ] `Email` normaliza para minúsculas e rejeita formatos inválidos
- [ ] Portas de saída (interfaces) definidas sem dependência de infraestrutura
- [ ] Testes unitários para `User` e `Email` passando

**Tests:** `mvn test` — testes unitários de domínio passam.

**Gate:** `mvn test -pl backend -Dtest="UserTest,EmailTest"`

**Commit:** `feat(domain): add User entity, Email value object, and repository/service ports`

---

## AUTH-T4: Migration do Banco — Tabelas users e refresh_tokens

**What:** Criar scripts SQL de migration para as tabelas `users` e `refresh_tokens` conforme design.

**Where:**
- `backend/src/main/resources/db/migration/V001__create_users_table.sql`
- `backend/src/main/resources/db/migration/V002__create_refresh_tokens_table.sql`

**Depends on:** AUTH-T1 (banco de dados conectado)

**Done when:**
- [ ] Migrations executam sem erros no PostgreSQL local
- [ ] Tabelas `users` e `refresh_tokens` existem com colunas, constraints e índices corretos
- [ ] UUID gerado automaticamente pelo banco (`gen_random_uuid()`)

**Tests:** `psql` — `\d users` e `\d refresh_tokens` mostram schema correto.

**Commit:** `feat(infra): add database migrations for users and refresh_tokens tables`

---

## AUTH-T5: Use Case RegisterUser

**What:** Implementar `RegisterUserUseCase` com validação, hash de senha, persistência e geração de tokens.

**Where:**
- `application/usecase/RegisterUserUseCase.java`
- `application/usecase/RegisterUserCommand.java`
- `infrastructure/adapter/out/BCryptPasswordHasher.java`
- `infrastructure/adapter/out/UserRepositoryJPA.java`

**Depends on:** AUTH-T3, AUTH-T4

**Done when:**
- [ ] Registro com dados válidos cria usuário no banco e retorna tokens
- [ ] Email duplicado lança exceção mapeada para HTTP 409
- [ ] Email inválido / senha curta lança exceção mapeada para HTTP 400
- [ ] Senha nunca é salva em plain text
- [ ] Teste de integração com banco real passa

**Tests:** Teste de integração: registrar usuário → verificar no banco → tokens retornados.

**Gate:** `mvn test -Dtest="RegisterUserUseCaseIT"`

**Commit:** `feat(application): implement RegisterUser use case with BCrypt and JWT`

---

## AUTH-T6: Use Case AuthenticateUser e RefreshToken

**What:** Implementar `AuthenticateUserUseCase`, `RefreshTokenUseCase` e `JwtTokenServiceImpl`.

**Where:**
- `application/usecase/AuthenticateUserUseCase.java`
- `application/usecase/RefreshTokenUseCase.java`
- `application/usecase/LogoutUseCase.java`
- `infrastructure/adapter/out/JwtTokenServiceImpl.java`
- `infrastructure/adapter/out/RefreshTokenRepositoryJPA.java`

**Depends on:** AUTH-T5

**Done when:**
- [ ] Login com credenciais válidas retorna access token (15min) + refresh token (7 dias)
- [ ] Login com credenciais inválidas retorna erro genérico (sem revelar qual campo)
- [ ] Refresh token válido emite novo par de tokens e revoga o anterior
- [ ] Refresh token expirado ou revogado retorna 401
- [ ] Logout revoga refresh token no banco

**Tests:** Testes de integração: login → refresh → logout.

**Gate:** `mvn test -Dtest="AuthenticateUserUseCaseIT,RefreshTokenUseCaseIT"`

**Commit:** `feat(application): implement AuthenticateUser, RefreshToken, and Logout use cases`

---

## AUTH-T7: Filtro de Autorização JWT (JwtAuthFilter)

**What:** Implementar `JwtAuthFilter` como `ContainerRequestFilter` JAX-RS que protege todos os endpoints exceto `/auth/*`.

**Where:**
- `infrastructure/adapter/in/filter/JwtAuthFilter.java`
- `infrastructure/config/SecurityConfig.java`

**Depends on:** AUTH-T6

**Done when:**
- [ ] Requisições sem token retornam 401
- [ ] Requisições com token expirado/inválido retornam 401
- [ ] Requisições com token válido prosseguem com `userId` injetado no contexto
- [ ] Endpoints `/auth/register` e `/auth/login` são acessíveis sem token
- [ ] Teste verifica proteção de endpoint protegido

**Tests:** Teste de integração: GET /profiles sem token → 401; com token → 200.

**Gate:** `mvn test -Dtest="JwtAuthFilterIT"`

**Commit:** `feat(infra): add JWT auth filter protecting all endpoints except /auth/*`

---

## AUTH-T8: UI — Página de Registro (React)

**What:** Implementar `RegisterPage` com formulário de registro, validação client-side e integração com `authService.register()`.

**Where:**
- `frontend/src/pages/RegisterPage.tsx`
- `frontend/src/components/auth/RegisterForm.tsx`
- `frontend/src/services/authService.ts` (método `register`)

**Depends on:** AUTH-T2, AUTH-T5

**Done when:**
- [ ] Formulário exibe campos: nome, email, senha, confirmação de senha
- [ ] Validação client-side: email format, senha ≥ 8 chars, senhas coincidem
- [ ] Erro de email duplicado (409) exibe mensagem amigável
- [ ] Sucesso redireciona para tela de completar perfil (ou dashboard)
- [ ] Loading state durante chamada de API

**Tests:** Visual — fluxo completo de registro funcional no browser.

**Commit:** `feat(frontend): add Register page with form validation and API integration`

---

## AUTH-T9: UI — Página de Login (React)

**What:** Implementar `LoginPage` com formulário de login, integração com `authService.login()` e gerenciamento de tokens.

**Where:**
- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/components/auth/LoginForm.tsx`
- `frontend/src/services/authService.ts` (método `login`)
- `frontend/src/hooks/useAuth.ts`

**Depends on:** AUTH-T2, AUTH-T6

**Done when:**
- [ ] Formulário exibe campos: email e senha
- [ ] Credenciais válidas → armazena tokens → redireciona ao painel
- [ ] Credenciais inválidas → exibe mensagem de erro genérica
- [ ] Token expirado auto-renova via interceptor Axios antes de redirecionar para login
- [ ] Rota `/login` redireciona para `/` se já autenticado

**Tests:** Visual — fluxo de login e auto-refresh testado no browser.

**Commit:** `feat(frontend): add Login page with token management and auto-refresh`

---

## AUTH-T10: Teste de Integração — Fluxo Completo de Auth

**What:** Testes de integração end-to-end cobrindo: registro → login → acesso autenticado → refresh → logout.

**Where:**
- `backend/src/test/java/com/congreats/integration/AuthFlowIT.java`

**Depends on:** AUTH-T7, AUTH-T8, AUTH-T9

**Done when:**
- [ ] Teste registra usuário → verifica criação no banco
- [ ] Teste faz login → verifica tokens retornados
- [ ] Teste acessa endpoint protegido com token → verifica 200
- [ ] Teste faz refresh → verifica novo token
- [ ] Teste faz logout → verifica 401 com token antigo
- [ ] Todos os testes passam em ambiente de CI (banco real via Docker)

**Tests:** `mvn test -Dtest="AuthFlowIT"` passa com banco PostgreSQL real.

**Gate:** Todos os 5 cenários do fluxo passam.

**Commit:** `test(auth): add end-to-end integration tests for complete auth flow`

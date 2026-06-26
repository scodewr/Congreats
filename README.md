<div align="center">

# ◆ Congreats

*Drived by Orbix*

---

**Plataforma gamificada de reconhecimento profissional.**  
Reconheça talentos, destaque habilidades e construa uma cultura de feedback positivo dentro da sua empresa ou comunidade.

</div>

---

## Modos de Operação

| Modo | Comportamento |
|------|---------------|
| **World** | Qualquer pessoa pode se registrar. Ao criar conta, o usuário nasce como `ADMIN` e controla seus próprios recursos. |
| **Enterprise** | Registro público desabilitado (403). Hierarquia IAM — um usuário master cria e delega permissões aos demais (modelo AWS IAM). |

O modo é definido pela variável de ambiente `CONGREATS_MODE` (`WORLD` ou `ENTERPRISE`). O padrão é `WORLD`.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Quarkus 3.8.5, Java 21, Jakarta EE 10 |
| Banco de Dados | PostgreSQL 16 |
| Migrations | Flyway |
| ORM | Hibernate ORM Panache |
| Autenticação | JWT HMAC256 (Auth0 java-jwt 4.4.0) |
| Criptografia | jBCrypt 0.4 (rounds=12) |
| Frontend | React 18, TypeScript 5, Vite 5 |
| Estilização | Tailwind CSS com design system próprio (paleta void/roxo/vinho/dourado) |
| Animações | Framer Motion v11 (AnimatePresence, transições de rota, whileHover/whileTap) |
| Ícones | Lucide React |
| Roteamento | React Router v6 |
| HTTP Client | Axios |

---

## Pré-requisitos

### Para rodar com Docker (recomendado)

- Docker 24+ com o plugin Compose v2 (`docker compose`, não `docker-compose`)
- Node.js 20+ e npm — necessário apenas para gerar o `frontend/package-lock.json` antes do primeiro build
  *(ou use `make build`, que faz isso automaticamente)*

### Para desenvolvimento local (sem Docker)

- Java 21 (OpenJDK recomendado — `sudo apt install openjdk-21-jdk`)
- Maven 3.9+ (`sudo apt install maven`)
- Node.js 20+ e npm
- PostgreSQL 16 (pode ser via Docker: `docker compose up -d postgres`)

---

## Configuração Inicial

Antes de qualquer forma de execução, copie o arquivo de variáveis de ambiente e ajuste os valores sensíveis:

```bash
cp .env.example .env
```

Edite o `.env` e substitua pelo menos o segredo JWT:

```env
CONGREATS_JWT_SECRET=seu-segredo-longo-e-aleatorio-aqui
```

---

## Build das Imagens Docker

As imagens são construídas a partir de Dockerfiles multi-stage. O `Makefile` inclui todas as etapas de pré-build automaticamente.

### Forma recomendada (via Makefile)

```bash
make build
```

O `make build` garante que o `frontend/package-lock.json` existe antes de invocar o Docker, evitando falhas no `npm install` dentro do container.

### Manualmente

Se preferir rodar sem o `make`:

```bash
# 1. Gerar o lockfile do frontend (obrigatório na primeira vez)
cd frontend && npm install --package-lock-only && cd ..

# 2. Build das imagens
docker compose build
```

#### Detalhes de cada imagem

**Backend** (`backend/src/main/docker/Dockerfile.jvm`):
1. `maven:3.9-eclipse-temurin-21` — baixa dependências, compila e empacota o fast-jar
2. `eclipse-temurin:21-jre` — imagem de runtime enxuta com apenas o JRE

**Frontend** (`frontend/Dockerfile`):
1. `node:20-alpine` — instala dependências e gera os assets estáticos com `npm run build`
2. `nginx:1.27-alpine` — serve os assets e faz proxy `/api/` → backend

---

## Subindo o Sistema

### Forma recomendada (via Makefile)

| Comando | O que faz |
|---------|-----------|
| `make up` | Build + sobe todos os serviços em background |
| `make down` | Para e remove os containers (dados preservados) |
| `make down-v` | Para, remove containers **e volumes** (apaga banco e uploads) |
| `make restart` | Para e sobe novamente |
| `make logs` | Acompanha os logs em tempo real |
| `make ps` | Lista containers e status |

### Manualmente (docker compose)

```bash
# Primeira execução (build + start)
docker compose up --build -d

# Execuções seguintes (sem rebuild)
docker compose up -d

# Parar o sistema
docker compose down

# Remover também os volumes (apaga dados do banco e uploads)
docker compose down -v
```

---

## URLs após subir o sistema

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

---

## Variáveis de Ambiente

Todas as variáveis usam o prefixo `CONGREATS_`. Os valores padrão são suficientes para desenvolvimento local; **substitua `CONGREATS_JWT_SECRET` em produção**.

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `CONGREATS_DB_URL` | `jdbc:postgresql://postgres:5432/congreats` | URL JDBC do banco |
| `CONGREATS_DB_USER` | `congreats` | Usuário do banco |
| `CONGREATS_DB_PASSWORD` | `congreats` | Senha do banco |
| `CONGREATS_JWT_SECRET` | `change-me-in-production` | Segredo HMAC256 — **troque em produção** |
| `CONGREATS_MODE` | `WORLD` | Modo de operação (`WORLD` ou `ENTERPRISE`) |
| `CONGREATS_STORAGE_PATH` | `/deployments/uploads/photos` | Diretório interno para fotos |
| `CONGREATS_STORAGE_BASE_URL` | `http://localhost:8080/files` | URL base para servir fotos |

---

## Desenvolvimento Local (sem Docker para app)

Para iteração rápida com hot reload, suba apenas o banco via Docker e rode o backend e frontend diretamente na máquina.

### 1. Banco de dados

```bash
docker compose up -d postgres
```

### 2. Backend

```bash
cd backend
mvn quarkus:dev
```

O Quarkus sobe em `http://localhost:8080`, aplica as migrations automaticamente e recompila em hot reload.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`. Requisições para `/api/*` são proxiadas automaticamente para `localhost:8080`.

---

## Testes

```bash
# Unitários (sem banco, sem Docker)
cd backend && mvn test

# Integração (Quarkus Dev Services sobe um PostgreSQL via Docker automaticamente)
cd backend && mvn verify -DskipITs=false
```

---

## Estrutura do Projeto

```
Congreats/
├── .env.example                          # Variáveis de ambiente (template)
├── docker-compose.yml                    # Orquestra postgres + backend + frontend
├── Makefile                              # Atalhos: build, up, down, logs, ps
├── .specs/                               # Documentação de produto e features
│   ├── project/
│   │   ├── PROJECT.md                    # Visão e objetivos
│   │   ├── ROADMAP.md                    # Features e milestones
│   │   ├── STATE.md                      # Decisões, bloqueios e pendências
│   │   └── DESIGN-SYSTEM.md             # Design system — paleta, tipografia, animações
│   └── features/                         # Specs e tasks por feature
├── backend/                              # Quarkus (Java 21)
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── docker/Dockerfile.jvm     # Imagem multi-stage (build + runtime JRE)
│       │   ├── java/com/congreats/
│       │   │   ├── domain/               # Entidades, Value Objects, exceções de domínio
│       │   │   ├── application/          # Use Cases, Ports (in/out), DTOs
│       │   │   └── infrastructure/       # JPA Entities, Controllers JAX-RS, Adapters
│       │   └── resources/
│       │       ├── application.properties
│       │       └── db/migration/         # Flyway V001–V009
│       └── test/
│           ├── domain/                   # Testes unitários
│           └── integration/              # Testes de integração (Dev Services)
└── frontend/                             # React 18 + TypeScript
    ├── Dockerfile                        # Imagem multi-stage (build + nginx)
    ├── nginx.conf                        # SPA fallback + proxy /api/ → backend
    ├── tailwind.config.js                # Design system completo (tokens de cor, sombras)
    └── src/
        ├── components/
        │   ├── ui/                       # Biblioteca de componentes
        │   │   ├── Button.tsx            # 6 variantes + loading + animação de press
        │   │   ├── Card.tsx              # Card com hover glow e sub-componentes
        │   │   ├── Avatar.tsx            # Foto ou iniciais, 5 tamanhos, 3 estilos de borda
        │   │   ├── Badge.tsx             # 7 variantes de cor
        │   │   ├── Input.tsx             # Input dark com foco roxo e estado de erro
        │   │   ├── Textarea.tsx          # Mesmo padrão do Input
        │   │   ├── Select.tsx            # Select dark com ícone chevron
        │   │   ├── TabNav.tsx            # Tabs com pill ativo e fade entre conteúdos
        │   │   └── AchievementBadge.tsx  # MedalBadge, TrophyBadge e RankingBadge
        │   ├── AnimatedRoute.tsx         # Slide+fade entre rotas com prefers-reduced-motion
        │   ├── Layout.tsx                # Shell com TopBar e AnimatePresence
        │   └── Navbar.tsx                # TopBar responsivo (mobile/tablet/desktop)
        ├── contexts/                     # AuthContext (JWT + refresh token)
        ├── pages/                        # Login, Register, Dashboard, Profile, Discovery,
        │                                 # Workspaces, CreateRecognition, EditProfile,
        │                                 # MyValidations, ValidatorAssignments e Admin/*
        ├── services/                     # authService, profileService, recognitionService,
        │                                 # workspaceService, validationService, adminService
        └── types/                        # Tipos TypeScript globais
```

### Arquitetura Backend

Hexagonal adaptada com DDD Tático:

- **`domain/`** — Java puro, sem dependências de framework. Entidades, Value Objects, exceções de domínio.
- **`application/`** — Use cases (`@ApplicationScoped`), portas de saída (interfaces), DTOs.
- **`infrastructure/`** — Implementações concretas: JPA entities com mappers `from()`/`toDomain()`, controllers JAX-RS, adaptadores de repositório com Panache.

---

## Endpoints da API

### Autenticação

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/auth/register` | Criar conta (apenas modo World) | Não |
| `POST` | `/auth/login` | Login com email e senha | Não |
| `POST` | `/auth/refresh` | Renovar access token via refresh token | Não |
| `POST` | `/auth/logout` | Revogar refresh token | Sim |
| `PUT` | `/auth/password` | Alterar senha | Sim |

### Perfis

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/profiles` | Listar profissionais (`?page&size&q`) | Sim |
| `GET` | `/profiles/me` | Ver o próprio perfil | Sim |
| `GET` | `/profiles/{userId}` | Ver perfil de um profissional | Sim |
| `PUT` | `/profiles/{userId}` | Atualizar perfil (bio, cargo, projetos, equipes) | Sim |
| `POST` | `/profiles/{userId}/photo` | Enviar foto de perfil (multipart) | Sim |

### Reconhecimentos

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/recognitions` | Criar reconhecimento | Sim |
| `GET` | `/recognitions` | Listar reconhecimentos (`?professionalId&page&size`) | Sim |

### Descoberta

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/discovery/feed` | Feed global de reconhecimentos (`?page&size`) | Sim |
| `GET` | `/discovery/ranking` | Ranking de profissionais mais reconhecidos | Sim |

### Categorias

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/categories` | Listar categorias ativas | Sim |

### Workspaces

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/workspaces` | Criar workspace | Sim |
| `GET` | `/workspaces/mine` | Listar workspaces do usuário | Sim |
| `POST` | `/workspaces/{id}/members` | Adicionar membro | Sim |
| `GET` | `/workspaces/{id}/feed` | Feed do workspace (`?page&size`) | Sim |

### Medalhas e Troféus

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/medals/{userId}` | Listar medalhas de um profissional | Sim |
| `GET` | `/trophies/{userId}` | Listar troféus de um profissional | Sim |

### Validação de Habilidades

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/skill-validations` | Solicitar validação de habilidade | Sim |
| `GET` | `/skill-validations/mine` | Ver minhas validações | Sim |
| `GET` | `/skill-validations/assignments` | Ver validações atribuídas a mim (validator) | Sim |
| `POST` | `/skill-validations/{id}/questionnaire` | Submeter questionário de validação | Sim |

### Integrações (Webhooks)

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/webhooks/github` | Receber eventos do GitHub | Não* |
| `POST` | `/webhooks/jira` | Receber eventos do Jira | Não* |
| `POST` | `/webhooks/linear` | Receber eventos do Linear | Não* |

*Verificação por token de integração no header.

### Admin

| Método | Path | Descrição | Auth (ADMIN) |
|--------|------|-----------|------|
| `GET` | `/admin/users` | Listar usuários (`?page&size`) | Sim |
| `PUT` | `/admin/users/{id}/role` | Alterar papel do usuário | Sim |
| `GET` | `/admin/workspaces` | Listar todos os workspaces | Sim |
| `GET` | `/admin/categories` | Listar categorias | Sim |
| `POST` | `/admin/categories` | Criar categoria | Sim |
| `PUT` | `/admin/categories/{id}` | Atualizar categoria | Sim |
| `DELETE` | `/admin/categories/{id}` | Desativar categoria | Sim |
| `GET` | `/admin/campaigns` | Listar campanhas | Sim |
| `POST` | `/admin/campaigns` | Criar campanha | Sim |
| `GET` | `/admin/events` | Listar eventos | Sim |
| `POST` | `/admin/events` | Criar evento de reconhecimento | Sim |
| `GET` | `/admin/validations` | Listar todas as validações de habilidade | Sim |
| `POST` | `/admin/validations/{id}/assign` | Atribuir validador | Sim |
| `GET` | `/admin/integrations` | Listar integrações configuradas | Sim |
| `POST` | `/admin/integrations` | Criar integração | Sim |

### Arquivos

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/files/{filename}` | Servir foto de perfil | Não |

---

## Roadmap

| Versão | Status | Features |
|--------|--------|----------|
| v1.0 | ✅ Concluída | Auth (World/Enterprise), Perfil Profissional, Sistema de Reconhecimentos |
| v1.1 | ✅ Concluída | Feed de Descoberta, Ranking de Profissionais |
| v1.2 | ✅ Concluída | Workspaces — espaços colaborativos com feed próprio |
| v1.3 | ✅ Concluída | Painel Administrativo — usuários, categorias, campanhas e eventos |
| v2.0 | ✅ Concluída | Medalhas e Troféus — gamificação de reconhecimentos |
| v2.1 | ✅ Concluída | Validação de Habilidades — questionários e validadores |
| v2.2 | ⏳ Adiado para v4.1 | Notificações (Email, WhatsApp, SMS) |
| v3.0 | ✅ Concluída | Integrações com APIs (GitHub, Jira, Linear via webhooks) |
| v3.1 | ✅ Concluída | Design System — visual dark (void/roxo/vinho/dourado), animações e componentes |
| v4.0 | 🗓 Planejado | Certificações de Excelência |
| v4.1 | 🗓 Planejado | Notificações (Email, WhatsApp, SMS) |

Detalhes em [`.specs/project/ROADMAP.md`](.specs/project/ROADMAP.md) e decisões arquiteturais em [`.specs/project/STATE.md`](.specs/project/STATE.md).

---

<div align="center">

*© Orbix Drive — Todos os direitos reservados*

</div>

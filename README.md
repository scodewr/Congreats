# Congreats

Plataforma gamificada de reconhecimento profissional. Reconheça talentos, destaque habilidades e construa uma cultura de feedback positivo dentro da sua empresa ou comunidade.

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
| Frontend | React 18, TypeScript 5, Vite 5, Tailwind CSS |
| Roteamento | React Router v6 |
| HTTP Client | Axios |

---

## Pré-requisitos

- Docker 24+ e Docker Compose v2+
- Java 21+ *(apenas para desenvolvimento local sem Docker)*
- Maven 3.9+ *(apenas para desenvolvimento local sem Docker)*
- Node.js 20+ e npm *(apenas para desenvolvimento local sem Docker)*

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

As imagens são construídas a partir de Dockerfiles multi-stage — nenhum pré-requisito local é necessário além do Docker.

### Backend

```bash
docker build \
  -t congreats-backend:latest \
  -f backend/src/main/docker/Dockerfile.jvm \
  ./backend
```

O build acontece em dois estágios:
1. `maven:3.9-eclipse-temurin-21` — compila o projeto e empacota o fast-jar
2. `eclipse-temurin:21-jre` — imagem de runtime enxuta com apenas o JRE

### Frontend

```bash
docker build \
  -t congreats-frontend:latest \
  ./frontend
```

O build acontece em dois estágios:
1. `node:20-alpine` — instala dependências e gera os assets estáticos com `npm run build`
2. `nginx:1.27-alpine` — serve os assets e faz proxy `/api/` → backend

### Ambos de uma vez

```bash
docker-compose build
```

---

## Subindo o Sistema

### Primeira execução (build + start)

```bash
docker-compose up --build
```

### Execuções seguintes (sem rebuild)

```bash
docker-compose up -d
```

### Parar o sistema

```bash
docker-compose down
```

Para remover também os volumes (apaga dados do banco e uploads):

```bash
docker-compose down -v
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
docker-compose up -d postgres
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
├── .env.example                        # Variáveis de ambiente (template)
├── docker-compose.yml                  # Orquestra postgres + backend + frontend
├── backend/                            # Quarkus (Java 21)
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── docker/Dockerfile.jvm   # Imagem multi-stage (build + runtime JRE)
│       │   ├── java/com/congreats/
│       │   │   ├── domain/             # Entidades, Value Objects, exceções
│       │   │   ├── application/        # Use Cases, Ports (in/out), DTOs
│       │   │   └── infrastructure/     # JPA Entities, Controllers, Adapters, Config
│       │   └── resources/
│       │       ├── application.properties
│       │       └── db/migration/       # Flyway V001–V005
│       └── test/
│           ├── domain/                 # Testes unitários
│           └── integration/            # Testes de integração (Dev Services)
└── frontend/                           # React 18 + TypeScript
    ├── Dockerfile                      # Imagem multi-stage (build + nginx)
    ├── nginx.conf                      # SPA fallback + proxy /api/ → backend
    └── src/
        ├── contexts/                   # AuthContext (JWT + refresh token)
        ├── pages/                      # Login, Register, Dashboard, Profile, etc.
        ├── services/                   # authService, profileService, recognitionService
        └── types/                      # Tipos TypeScript
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
| `GET` | `/profiles` | Listar profissionais (`?page=0&size=20`) | Sim |
| `GET` | `/profiles/me` | Ver o próprio perfil | Sim |
| `GET` | `/profiles/{userId}` | Ver perfil de um profissional | Sim |
| `PUT` | `/profiles/{userId}` | Atualizar perfil | Sim |
| `POST` | `/profiles/{userId}/photo` | Enviar foto de perfil (multipart) | Sim |

### Reconhecimentos

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/recognitions` | Criar reconhecimento | Sim |
| `GET` | `/recognitions?professionalId={id}` | Listar reconhecimentos de um profissional | Sim |

### Categorias

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/categories` | Listar categorias ativas | Sim |

### Arquivos

| Método | Path | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/files/{filename}` | Servir foto de perfil | Não |

---

## Roadmap

| Versão | Status | Features |
|--------|--------|----------|
| v1.0 | ✅ Concluída | Auth (World/Enterprise), Perfil Profissional, Sistema de Reconhecimentos |
| v1.1 | Planejado | Feed de Descoberta, Ranking |
| v1.2 | Planejado | Workspaces |
| v1.3 | Planejado | Painel Administrativo |
| v2.0 | Planejado | Medalhas e Troféus (gamificação) |
| v2.1 | Planejado | Validação de Habilidades |
| v2.2 | Planejado | Notificações (Email, WhatsApp, SMS) |
| v3.0 | Planejado | Integrações com APIs (GitHub, Jira, Linear) |
| v4.0 | Planejado | Certificações de Excelência |

Detalhes em [`.specs/project/ROADMAP.md`](.specs/project/ROADMAP.md) e progresso em [`.specs/project/PROGRESS.md`](.specs/project/PROGRESS.md).

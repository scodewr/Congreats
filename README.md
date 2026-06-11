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

- Java 21+
- Maven 3.9+ (ou use o wrapper `./mvnw` se disponível)
- Node.js 20+ e npm
- Docker e Docker Compose

---

## Rodando Localmente

### Opção A — Stack completa com Docker

Sobe PostgreSQL + backend + frontend em um único comando:

```bash
# Copie o arquivo de variáveis de ambiente (ajuste os valores sensíveis)
cp .env.example .env

docker-compose up --build
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

---

### Opção B — Desenvolvimento local

#### 1. Banco de dados

```bash
docker-compose up -d postgres
```

Sobe um PostgreSQL 16 na porta `5432` com banco `congreats`, usuário `congreats`, senha `congreats`.

---

### 2. Backend

```bash
cd backend
mvn quarkus:dev
```

O servidor sobe em `http://localhost:8080`.

O Quarkus em modo dev aplica as migrations do Flyway automaticamente e recompila em hot reload.

**Variáveis de ambiente disponíveis:**

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `CONGREATS_DB_URL` | `jdbc:postgresql://localhost:5432/congreats` | URL do banco |
| `CONGREATS_DB_USER` | `congreats` | Usuário do banco |
| `CONGREATS_DB_PASSWORD` | `congreats` | Senha do banco |
| `CONGREATS_JWT_SECRET` | `change-me-in-production` | Segredo HMAC256 do JWT |
| `CONGREATS_MODE` | `WORLD` | Modo de operação (`WORLD` ou `ENTERPRISE`) |
| `CONGREATS_STORAGE_PATH` | `./uploads/photos` | Diretório local para fotos |
| `CONGREATS_STORAGE_BASE_URL` | `http://localhost:8080/files` | URL base para servir fotos |

Para sobrescrever em desenvolvimento, crie um arquivo `backend/src/main/resources/.env` ou exporte as variáveis no shell antes de subir.

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`. Requisições para `/api/*` são proxiadas automaticamente para o backend em `localhost:8080`.

---

## Estrutura do Projeto

```
Congreats/
├── docker-compose.yml              # PostgreSQL para desenvolvimento
├── backend/                        # Quarkus (Java 21)
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/congreats/
│       │   │   ├── domain/         # Entidades, Value Objects, exceções
│       │   │   ├── application/    # Use Cases, Ports (in/out), DTOs
│       │   │   └── infrastructure/ # JPA Entities, Controllers, Adapters, Config
│       │   └── resources/
│       │       ├── application.properties
│       │       └── db/migration/   # Flyway (V001–V005)
│       └── test/
│           ├── domain/             # Testes unitários de domínio
│           └── integration/        # Testes de integração (Quarkus Dev Services)
└── frontend/                       # React 18 + TypeScript
    └── src/
        ├── contexts/               # AuthContext
        ├── pages/                  # Login, Register, Dashboard, Profile, etc.
        ├── services/               # authService, profileService, recognitionService
        └── types/                  # Tipos TypeScript
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

## Rodando os Testes

```bash
# Testes unitários (sem banco)
cd backend && mvn test

# Testes de integração (requer Docker — Quarkus Dev Services sobe o banco automaticamente)
cd backend && mvn verify -DskipITs=false
```

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

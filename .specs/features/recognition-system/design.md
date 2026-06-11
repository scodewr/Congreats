# Recognition System — Design

**Feature:** REC | **Version:** v1.0

---

## Architecture Overview

```
[React Frontend]
     |
     v
[RecognitionController] ← infrastructure/
     |
     ├── CreateRecognition ───→ [RecognitionRepositoryJPA]
     │                               |
     │                               ↓ on commit
     │                        [RecognitionCreatedEvent]
     │                               |
     │                        [ProfileSkillUpdater]  ← updates recognized skills
     │
     └── GetRecognitionsByProfessional → [RecognitionRepositoryJPA]

[CategoryController]
     └── ListCategories → [CategoryRepositoryJPA]
```

---

## Domain Layer (`domain/`)

### Entity: `Recognition` (Aggregate Root)

```
Recognition
├── id: UUID
├── recognizerId: UUID        ← quem reconheceu
├── recognizedId: UUID        ← quem foi reconhecido (≠ recognizerId)
├── categoryId: UUID
├── projectId: UUID (nullable)
├── teamId: UUID (nullable)
├── skills: List<String>      ← min 1, normalizado para Title Case
├── testimonial: String       ← min 20 chars, max 2000 chars
├── createdAt: Instant
└── [immutable after creation — no update/delete]

behaviors:
└── [none after creation — aggregate is immutable]
```

**Invariants:**
- `recognizerId ≠ recognizedId`
- `skills` não pode ser vazio
- `testimonial.length ≥ 20`

### Entity: `Category`

```
Category
├── id: UUID
├── name: String
├── description: String
├── suggestedSkills: List<String>
└── active: boolean
```

### Domain Event: `RecognitionCreated`

```
RecognitionCreated {
    recognitionId: UUID
    recognizerId: UUID
    recognizedId: UUID
    skills: List<String>
    occurredAt: Instant
}
```

Este evento é consumido por:
- `ProfileSkillUpdater` — incrementa contagem de habilidades no perfil
- `MedalAwarder` (v2.0) — verifica se medalhas são devidas

---

## Application Layer (`application/`)

### Port: `RecognitionRepository`

```java
interface RecognitionRepository {
    void save(Recognition recognition);
    List<Recognition> findByRecognizedId(UUID userId, int page, int size);
    List<Recognition> findByRecognizerId(UUID userId, int page, int size);
    int countByRecognizedId(UUID userId);
}
```

### Port: `CategoryRepository`

```java
interface CategoryRepository {
    List<Category> findAllActive();
    Optional<Category> findById(UUID id);
}
```

### Use Case: `CreateRecognition`

**Input:** `CreateRecognitionCommand { recognizerId, recognizedId, categoryId, skills, testimonial, projectId?, teamId? }`
**Output:** `RecognitionView`

**Steps:**
1. Validate: `recognizerId ≠ recognizedId` → `SelfRecognitionException`.
2. Validate: recognized user exists and is active.
3. Validate: category exists and is active.
4. Validate: skills not empty, testimonial ≥ 20 chars.
5. Normalize skills to Title Case.
6. Create `Recognition` aggregate.
7. Save via `RecognitionRepository`.
8. Publish `RecognitionCreated` event.
9. Return `RecognitionView` DTO.

### Use Case: `GetRecognitionsByProfessional`

**Input:** `GetRecognitionsQuery { professionalId, page, size }`
**Output:** `Page<RecognitionView>`

**Steps:**
1. Validate user exists.
2. Query recognitions received by userId (paginated).
3. Map to `RecognitionView` DTOs (inclui nome do reconhecedor via UserRepository).
4. Return paginado.

### Use Case: `ListCategories`

**Input:** none
**Output:** `List<CategoryView>`

**Steps:**
1. Query all active categories with suggested skills.
2. Return list.

### Domain Service: `ProfileSkillUpdater`

Escuta `RecognitionCreated` event e atualiza contagem de habilidades no perfil do `recognizedId`.

```java
// Opção v1: query-time computation (sem evento)
// SELECT skill, COUNT(*) FROM recognized_skills rs
// JOIN recognitions r ON r.id = rs.recognition_id
// WHERE r.recognized_id = ?
// GROUP BY skill ORDER BY COUNT(*) DESC
```

Decisão v1: computar habilidades via query ao carregar perfil (simples). Event-driven no v2.

---

## Infrastructure Layer (`infrastructure/`)

### `RecognitionController` (REST)

| Method | Path | Protected | Use Case |
|--------|------|-----------|----------|
| POST | `/recognitions` | Yes | CreateRecognition |
| GET | `/recognitions?professionalId={id}&page={n}` | Yes | GetRecognitionsByProfessional |

### `CategoryController` (REST)

| Method | Path | Protected | Use Case |
|--------|------|-----------|----------|
| GET | `/categories` | Yes | ListCategories |

### DTOs

```
CreateRecognitionRequest {
    recognizedId: UUID
    categoryId: UUID
    skills: List<String>     // min 1
    testimonial: String      // min 20, max 2000
    projectId?: UUID
    teamId?: UUID
}

RecognitionView {
    id: UUID
    recognizer: { id, name, photoUrl }
    recognized: { id, name, photoUrl }
    category: { id, name }
    skills: List<String>
    testimonial: String
    projectId?: UUID
    teamId?: UUID
    createdAt: Instant
}

CategoryView {
    id: UUID
    name: String
    description: String
    suggestedSkills: List<String>
}
```

---

## Database Schema

### `categories`

```sql
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    active      BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO categories (name, description) VALUES
    ('Liderança', 'Capacidade de guiar, inspirar e motivar pessoas'),
    ('Técnico', 'Domínio de habilidades técnicas e de engenharia'),
    ('Colaboração', 'Trabalho em equipe e apoio aos colegas'),
    ('Inovação', 'Criatividade e resolução criativa de problemas'),
    ('Mentoria', 'Desenvolvimento e apoio ao crescimento de outros'),
    ('Comunicação', 'Clareza e eficácia na transmissão de ideias'),
    ('Entrega', 'Consistência e qualidade nas entregas');
```

### `category_suggested_skills`

```sql
CREATE TABLE category_suggested_skills (
    category_id UUID NOT NULL REFERENCES categories(id),
    skill       VARCHAR(100) NOT NULL,
    PRIMARY KEY (category_id, skill)
);
```

### `recognitions`

```sql
CREATE TABLE recognitions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recognizer_id   UUID NOT NULL REFERENCES users(id),
    recognized_id   UUID NOT NULL REFERENCES users(id),
    category_id     UUID NOT NULL REFERENCES categories(id),
    testimonial     TEXT NOT NULL CHECK (LENGTH(testimonial) >= 20),
    project_id      UUID REFERENCES profile_projects(id),
    team_id         UUID REFERENCES profile_teams(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT no_self_recognition CHECK (recognizer_id <> recognized_id)
);

CREATE INDEX idx_recognitions_recognized ON recognitions(recognized_id, created_at DESC);
CREATE INDEX idx_recognitions_recognizer ON recognitions(recognizer_id, created_at DESC);
```

### `recognition_skills`

```sql
CREATE TABLE recognition_skills (
    recognition_id  UUID NOT NULL REFERENCES recognitions(id) ON DELETE CASCADE,
    skill           VARCHAR(100) NOT NULL,
    PRIMARY KEY (recognition_id, skill)
);
```

---

## Frontend Components

```
src/
├── pages/
│   └── CreateRecognitionPage.tsx
├── components/recognition/
│   ├── RecognitionForm.tsx        ← formulário completo
│   ├── ProfessionalSelector.tsx   ← busca e seleciona colega
│   ├── CategorySelector.tsx       ← grid de categorias
│   ├── SkillSelector.tsx          ← chips de habilidades + campo livre
│   ├── TestimonialInput.tsx       ← textarea com contador
│   ├── RecognitionCard.tsx        ← card de reconhecimento no perfil
│   └── RecognitionList.tsx        ← lista paginada de reconhecimentos
└── services/
    └── recognitionService.ts     ← createRecognition, getRecognitions
```

---

## Notes

- Habilidades são strings normalizadas (Title Case). Não há entidade Skill separada no v1 — são tags livres com sugestões por categoria.
- A contagem de habilidades no perfil é computada via query no v1. No v2, pode migrar para tabela materializada alimentada por eventos.
- `recognitions` não tem endpoints de UPDATE ou DELETE por design — imutabilidade é uma invariante de negócio.

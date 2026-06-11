# Professional Profile — Design

**Feature:** PROF | **Version:** v1.0

---

## Architecture Overview

```
[React Frontend]
     |
     | HTTP/HTTPS (Bearer JWT)
     v
[ProfileController] ← infrastructure/
     |
     ├── GetProfile ──────────────→ [ProfileRepositoryJPA]
     ├── UpdateProfile ───────────→ [ProfileRepositoryJPA]
     └── UploadProfilePhoto ──────→ [FileStorageService]
                                           |
                                    [Local FS / S3 (futuro)]
                                    [PostgreSQL — profiles, skills, projects, teams]
```

---

## Domain Layer (`domain/`)

### Entity: `Profile` (Aggregate Root)

```
Profile
├── id: UUID (= userId)
├── userId: UUID
├── bio: String (nullable, max 1000 chars)
├── jobTitle: String (nullable, max 150 chars)
├── company: String (nullable, max 150 chars)
├── photoUrl: String (nullable)
├── skills: List<RecognizedSkill>   ← managed by Recognition domain events
├── projects: List<ProfileProject>
├── teams: List<ProfileTeam>
└── createdAt: Instant
```

### Value Object: `ProfileProject`

```
ProfileProject
├── id: UUID
├── name: String (max 100 chars)
├── status: ProjectStatus (ACTIVE | PAST)
└── addedAt: Instant
```

### Value Object: `ProfileTeam`

```
ProfileTeam
├── id: UUID
├── name: String (max 100 chars)
└── addedAt: Instant
```

### Value Object: `RecognizedSkill`

```
RecognizedSkill
├── skillName: String
├── recognitionCount: int
└── lastRecognizedAt: Instant
```

Note: `RecognizedSkill` é computado a partir dos reconhecimentos — não é editado diretamente pelo usuário.

---

## Application Layer (`application/`)

### Port: `ProfileRepository`

```java
interface ProfileRepository {
    Optional<Profile> findByUserId(UUID userId);
    void save(Profile profile);
    void update(Profile profile);
}
```

### Port: `FileStorageService`

```java
interface FileStorageService {
    String store(byte[] content, String filename, String mimeType); // returns URL
    void delete(String url);
}
```

### Use Case: `GetProfile`

**Input:** `GetProfileQuery { profileUserId }`
**Output:** `ProfileView` (DTO com todos os dados públicos)

**Steps:**
1. Find profile by userId → 404 if not found.
2. Map to `ProfileView` DTO (inclui dados do usuário via UserRepository).
3. Return DTO.

### Use Case: `UpdateProfile`

**Input:** `UpdateProfileCommand { requestingUserId, targetUserId, bio, jobTitle, company, projects, teams }`
**Output:** `ProfileView`

**Steps:**
1. Verify `requestingUserId == targetUserId` → 403 if not.
2. Find profile by userId → create if not exists.
3. Validate fields (bio ≤ 1000 chars, etc.).
4. Update profile fields.
5. Persist via `ProfileRepository`.
6. Return updated `ProfileView`.

### Use Case: `UploadProfilePhoto`

**Input:** `UploadProfilePhotoCommand { requestingUserId, imageBytes, mimeType, filename }`
**Output:** `String photoUrl`

**Steps:**
1. Verify `requestingUserId` matches profile.
2. Validate: mimeType in [image/jpeg, image/png], size ≤ 5MB.
3. Delete old photo if exists.
4. Store new image via `FileStorageService`.
5. Update `profile.photoUrl`.
6. Persist.
7. Return new URL.

---

## Infrastructure Layer (`infrastructure/`)

### `ProfileController` (REST)

| Method | Path | Protected | Use Case |
|--------|------|-----------|----------|
| GET | `/profiles/{userId}` | Yes | GetProfile |
| PUT | `/profiles/{userId}` | Yes | UpdateProfile |
| POST | `/profiles/{userId}/photo` | Yes | UploadProfilePhoto |

### DTOs

```
UpdateProfileRequest  { bio, jobTitle, company, projects[{name,status}], teams[{name}] }
ProfileView           { userId, name, email, bio, jobTitle, company, photoUrl,
                        skills[{name, count, lastRecognizedAt}],
                        projects[{id, name, status}],
                        teams[{id, name}],
                        testimonials[{author, text, date, category}] }
```

### `ProfileRepositoryJPA`

- Aggregate `Profile` mapped to `profiles` table.
- Collections `projects` and `teams` mapped as `@ElementCollection` or separate entities.

### `LocalFileStorageService`

- v1: armazena fotos em diretório local configurável (`/var/congreats/photos/`).
- Gera URL relativa: `/static/photos/{userId}/{filename}`.
- Tamanho máximo validado antes do write.
- Migração para S3 futura: basta trocar a implementação da porta.

---

## Database Schema

### `profiles`

```sql
CREATE TABLE profiles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE REFERENCES users(id),
    bio         TEXT,
    job_title   VARCHAR(150),
    company     VARCHAR(150),
    photo_url   VARCHAR(500),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `profile_projects`

```sql
CREATE TABLE profile_projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    status      VARCHAR(10) NOT NULL CHECK (status IN ('ACTIVE','PAST')),
    added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `profile_teams`

```sql
CREATE TABLE profile_teams (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Frontend Components

```
src/
├── pages/
│   ├── ProfilePage.tsx        ← visualização pública do perfil
│   └── EditProfilePage.tsx    ← edição do próprio perfil
├── components/profile/
│   ├── ProfileHeader.tsx      ← foto, nome, cargo, empresa
│   ├── ProfileBio.tsx         ← seção "Sobre"
│   ├── SkillsSection.tsx      ← habilidades reconhecidas com contagem
│   ├── ProjectsSection.tsx    ← projetos (view + edit)
│   ├── TeamsSection.tsx       ← equipes/iniciativas (view + edit)
│   ├── TestimonialsSection.tsx ← depoimentos recebidos
│   └── PhotoUploader.tsx      ← upload de foto com preview
├── services/
│   └── profileService.ts     ← getProfile, updateProfile, uploadPhoto
└── hooks/
    └── useProfile.ts
```

---

## Notes

- `RecognizedSkill` no perfil é uma **view derivada** — atualizada via evento `RecognitionCreated` quando o Recognition System salvar um reconhecimento.
- No v1, a atualização das habilidades reconhecidas pode ser feita via query SQL direta ao carregar o perfil (JOIN com tabela `recognitions`), sem eventos, para simplicidade.
- Decisão sobre estratégia de `RecognizedSkill` deve ser registrada em STATE.md.

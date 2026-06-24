CREATE TABLE skill_validations (
    id           UUID PRIMARY KEY,
    user_id      UUID         NOT NULL REFERENCES users(id),
    skill        VARCHAR(100) NOT NULL,
    status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    resolved_at  TIMESTAMPTZ
);

CREATE TABLE validator_assignments (
    id            UUID PRIMARY KEY,
    validation_id UUID        NOT NULL REFERENCES skill_validations(id),
    validator_id  UUID        NOT NULL REFERENCES users(id),
    assigned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (validation_id, validator_id)
);

CREATE TABLE questionnaires (
    id            UUID         PRIMARY KEY,
    validation_id UUID         NOT NULL REFERENCES skill_validations(id),
    validator_id  UUID         NOT NULL REFERENCES users(id),
    decision      VARCHAR(20)  NOT NULL,
    level         VARCHAR(20)  NOT NULL,
    reasoning     TEXT,
    submitted_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (validation_id, validator_id)
);

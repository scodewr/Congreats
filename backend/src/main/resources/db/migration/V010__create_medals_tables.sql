CREATE TABLE medals (
    id          UUID PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id),
    milestone   VARCHAR(50) NOT NULL,
    awarded_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, milestone)
);

CREATE INDEX idx_medals_user ON medals(user_id);

CREATE TABLE trophies (
    id          UUID PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id),
    skill       VARCHAR(100) NOT NULL,
    level       VARCHAR(20) NOT NULL,
    awarded_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, skill, level)
);

CREATE INDEX idx_trophies_user ON trophies(user_id);

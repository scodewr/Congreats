CREATE TABLE integrations (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform       VARCHAR(20)  NOT NULL,
    name           VARCHAR(120) NOT NULL,
    webhook_secret VARCHAR(128) NOT NULL,
    category_id    UUID REFERENCES categories(id),
    workspace_id   UUID REFERENCES workspaces(id),
    owner_id       UUID NOT NULL REFERENCES users(id),
    active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

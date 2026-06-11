CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    job_title VARCHAR(255),
    company VARCHAR(255),
    photo_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE profile_projects (
    id UUID PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    added_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE profile_teams (
    id UUID PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    added_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profile_projects_profile_id ON profile_projects(profile_id);
CREATE INDEX idx_profile_teams_profile_id ON profile_teams(profile_id);

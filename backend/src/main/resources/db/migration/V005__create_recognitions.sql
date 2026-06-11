CREATE TABLE recognitions (
    id UUID PRIMARY KEY,
    recognizer_id UUID NOT NULL REFERENCES users(id),
    recognized_id UUID NOT NULL REFERENCES users(id),
    category_id UUID NOT NULL REFERENCES categories(id),
    testimonial TEXT NOT NULL,
    project_id UUID,
    team_id UUID,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT no_self_recognition CHECK (recognizer_id != recognized_id)
);

CREATE TABLE recognition_skills (
    recognition_id UUID NOT NULL REFERENCES recognitions(id) ON DELETE CASCADE,
    skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (recognition_id, skill)
);

CREATE INDEX idx_recognitions_recognized_id ON recognitions(recognized_id);
CREATE INDEX idx_recognitions_recognizer_id ON recognitions(recognizer_id);
CREATE INDEX idx_recognitions_created_at ON recognitions(created_at DESC);

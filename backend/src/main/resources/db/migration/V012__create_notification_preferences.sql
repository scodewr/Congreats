CREATE TABLE notification_preferences (
    user_id          UUID        PRIMARY KEY REFERENCES users(id),
    email_enabled    BOOLEAN     NOT NULL DEFAULT TRUE,
    whatsapp_number  VARCHAR(20),
    whatsapp_enabled BOOLEAN     NOT NULL DEFAULT FALSE,
    sms_number       VARCHAR(20),
    sms_enabled      BOOLEAN     NOT NULL DEFAULT FALSE
);

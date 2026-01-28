-- Tabella per memorizzare i token push degli utenti
CREATE TABLE push_token (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(500) NOT NULL,
    platform VARCHAR(20) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMP,
    CONSTRAINT uk_push_token_user UNIQUE (token, user_id)
);

CREATE INDEX idx_push_token_user_active ON push_token(user_id, active);
CREATE INDEX idx_push_token_active ON push_token(active);

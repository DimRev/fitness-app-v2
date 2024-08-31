-- +goose Up
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + '1 hour',
  session_token TEXT NOT NULL,
  session_data JSONB NOT NULL
);


-- +goose Down
DROP TABLE IF EXISTS sessions;

-- +goose Up

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash bytea NOT NULL,
  username TEXT NOT NULL,
  image_url TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- +goose Down
DROP TABLE users;
DROP EXTENSION IF EXISTS "uuid-ossp";
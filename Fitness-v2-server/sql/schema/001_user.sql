-- +goose Up
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY DEFAULT get_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash bytea NOT NULL,
  username VARCHAR(255) NOT NULL,
  image_url VARCHAR(255),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- +goose Down
DROP TABLE users
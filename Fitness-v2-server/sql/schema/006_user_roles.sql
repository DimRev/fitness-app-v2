-- +goose Up
CREATE TYPE user_role AS ENUM (
  'admin',
  'user'
);
ALTER TABLE users ADD COLUMN role user_role NOT NULL DEFAULT 'user';

-- +goose Down
ALTER TABLE users DROP COLUMN role;
DROP TYPE user_role;
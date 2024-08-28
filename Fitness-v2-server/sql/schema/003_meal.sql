-- +goose Up
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_meals_created_at ON meals(created_at);

-- +goose Down
DROP INDEX idx_meals_created_at;
DROP TABLE meals;
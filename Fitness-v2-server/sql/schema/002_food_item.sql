-- +goose Up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE food_item_type AS ENUM (
  'vegetable',
  'fruit',
  'grain',
  'protein'
);

CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  food_type food_item_type NOT NULL,
  
  calories NUMERIC(10, 2) NOT NULL,
  fat NUMERIC(10, 2) NOT NULL,
  protein NUMERIC(10, 2) NOT NULL,
  carbs NUMERIC(10, 2) NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- +goose Down
DROP TABLE food_items;
DROP TYPE food_item_type;
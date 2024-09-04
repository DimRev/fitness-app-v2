-- +goose Up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";



CREATE TABLE food_items_pending (
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
  updated_at TIMESTAMP DEFAULT NOW(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE rel_user_like_food_item_pending (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES food_items_pending(id),

  PRIMARY KEY (user_id, food_item_id)
);

-- +goose Down
DROP TABLE food_items_pending;
DROP TABLE rel_user_like_food_item_pending;
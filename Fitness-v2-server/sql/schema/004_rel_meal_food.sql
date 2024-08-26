-- +goose Up
CREATE TABLE rel_meal_food (
  meal_id UUID NOT NULL REFERENCES meals(id),
  food_item_id UUID NOT NULL REFERENCES food_items(id),
  user_id UUID NOT NULL REFERENCES users(id),

  amount INTEGER DEFAULT 1,

  PRIMARY KEY (meal_id, food_item_id, user_id)
)

-- +goose Down
DROP TABLE rel_meal_food;
-- +goose Up
ALTER TABLE rel_meal_food
  DROP CONSTRAINT rel_meal_food_food_item_id_fkey;

ALTER TABLE rel_meal_food
  ADD CONSTRAINT rel_meal_food_food_item_id_fkey
  FOREIGN KEY (food_item_id) 
  REFERENCES food_items(id)
  ON DELETE CASCADE;

-- +goose Down
ALTER TABLE rel_meal_food
  DROP CONSTRAINT rel_meal_food_food_item_id_fkey;

ALTER TABLE rel_meal_food
  ADD CONSTRAINT rel_meal_food_food_item_id_fkey
  FOREIGN KEY (food_item_id)
  REFERENCES food_items(id);

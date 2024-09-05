-- +goose Up
ALTER TABLE rel_user_like_food_item_pending 
DROP CONSTRAINT rel_user_like_food_item_pending_food_item_id_fkey;

ALTER TABLE rel_user_like_food_item_pending 
ADD CONSTRAINT rel_user_like_food_item_pending_food_item_id_fkey 
FOREIGN KEY (food_item_id) REFERENCES food_items_pending(id) ON DELETE CASCADE;

-- +goose Down
ALTER TABLE rel_user_like_food_item_pending 
DROP CONSTRAINT rel_user_like_food_item_pending_food_item_id_fkey;

ALTER TABLE rel_user_like_food_item_pending 
ADD CONSTRAINT rel_user_like_food_item_pending_food_item_id_fkey 
FOREIGN KEY (food_item_id) REFERENCES food_items_pending(id);
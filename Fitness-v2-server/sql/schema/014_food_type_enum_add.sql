-- +goose Up
ALTER TYPE food_item_type ADD VALUE 'dairy';

-- +goose Down
BEGIN;
-- Step 1: Create a new enum type without 'dairy'
CREATE TYPE food_item_type_new AS ENUM ('vegetable', 'fruit', 'grain', 'protein');
-- Step 2: Alter the table to temporarily use the new enum
ALTER TABLE food_items
ALTER COLUMN food_type TYPE food_item_type_new USING food_type::text::food_item_type_new;
-- Step 3: Drop the old enum type
DROP TYPE food_item_type;
-- Step 4: Rename the new enum type to the original name
ALTER TYPE food_item_type_new RENAME TO food_item_type;
COMMIT;

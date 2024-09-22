-- +goose Up
DELETE FROM meal_consumed
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY meal_id, date ORDER BY id) as rn
    FROM meal_consumed
  ) t
  WHERE t.rn > 1
);

ALTER TABLE meal_consumed DROP CONSTRAINT meal_consumed_pkey;  -- Drop the existing primary key
ALTER TABLE meal_consumed DROP COLUMN id;  -- Drop the 'id' column
ALTER TABLE meal_consumed ADD PRIMARY KEY (meal_id, date, user_id);  -- Add composite primary key on 'meal_id' and 'date'

-- +goose Down
ALTER TABLE meal_consumed DROP CONSTRAINT meal_consumed_pkey;  -- Drop the composite primary key
ALTER TABLE meal_consumed ADD COLUMN id uuid DEFAULT uuid_generate_v4();  -- Re-add the 'id' column
ALTER TABLE meal_consumed ADD PRIMARY KEY (id);  -- Set 'id' as the primary key

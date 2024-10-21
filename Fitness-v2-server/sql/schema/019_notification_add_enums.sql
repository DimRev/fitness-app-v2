-- +goose Up

ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'user-score-pending';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'user-score-approved';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'user-score-rejected';

-- +goose Down 
BEGIN;
-- Step 1: Create a new enum type without 'user-score-pending'
CREATE TYPE notification_type_new AS ENUM (
  'user-like-food-item-pending'
);
-- Step 2: Alter the table to temporarily use the new enum
ALTER TABLE notifications
ALTER COLUMN type TYPE notification_type_new USING type::text::notification_type_new;
-- Step 3: Drop the old enum type
DROP TYPE notification_type;
-- Step 4: Rename the new enum type to the original name
ALTER TYPE notification_type_new RENAME TO notification_type;
COMMIT;
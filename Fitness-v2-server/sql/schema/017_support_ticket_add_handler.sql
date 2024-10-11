-- +goose Up
ALTER TABLE support_tickets
  RENAME COLUMN user_id TO owner_id;

ALTER TABLE support_tickets
  ADD COLUMN handler_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- +goose Down
ALTER TABLE support_tickets
  DROP COLUMN handler_id;

ALTER TABLE support_tickets
  RENAME COLUMN owner_id TO user_id;
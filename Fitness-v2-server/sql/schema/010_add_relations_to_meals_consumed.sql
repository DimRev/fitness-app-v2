-- +goose Up
ALTER TABLE meal_consumed
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE meal_consumed
ADD CONSTRAINT fk_meal
FOREIGN KEY (meal_id)
REFERENCES meals(id)
ON DELETE CASCADE;

-- +goose Down
ALTER TABLE meal_consumed
DROP CONSTRAINT fk_user;

ALTER TABLE meal_consumed
DROP CONSTRAINT fk_meal;

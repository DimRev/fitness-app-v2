-- name: InsertMeal :one
INSERT INTO meals (
  name, 
  description, 
  image_url, 
  user_id
)
VALUES (
  $1, $2, $3, $4
)
RETURNING *;


-- name: InsertMealFoodItems :exec
INSERT INTO rel_meal_food (
  meal_id, 
  food_item_id, 
  user_id, 
  amount
) 
VALUES ($1, unnest($2::uuid[]), $3, unnest($4::int[]));


-- name: GetMealByID :one
SELECT 
  m.*, 
  COALESCE(SUM(fi.calories * rmf.amount), 0) AS total_calories,
  COALESCE(SUM(fi.fat * rmf.amount), 0) AS total_fat,
  COALESCE(SUM(fi.protein * rmf.amount), 0) AS total_protein,
  COALESCE(SUM(fi.carbs * rmf.amount), 0) AS total_carbs
FROM meals m
LEFT JOIN rel_meal_food rmf ON m.id = rmf.meal_id
LEFT JOIN food_items fi ON rmf.food_item_id = fi.id
WHERE m.id = $1
GROUP BY m.id;

-- name: GetMealsByUserID :many
SELECT 
  m.*, 
  COALESCE(SUM(fi.calories * rmf.amount), 0) AS total_calories,
  COALESCE(SUM(fi.fat * rmf.amount), 0) AS total_fat,
  COALESCE(SUM(fi.protein * rmf.amount), 0) AS total_protein,
  COALESCE(SUM(fi.carbs * rmf.amount), 0) AS total_carbs
FROM meals m
LEFT JOIN rel_meal_food rmf ON m.id = rmf.meal_id
LEFT JOIN food_items fi ON rmf.food_item_id = fi.id
WHERE m.user_id = $1
GROUP BY m.id
ORDER BY m.created_at DESC
LIMIT $2
OFFSET $3;

-- name: GetMealsByUserIDWithTextFilter :many
SELECT 
  m.*, 
  COALESCE(SUM(fi.calories * rmf.amount), 0) AS total_calories,
  COALESCE(SUM(fi.fat * rmf.amount), 0) AS total_fat,
  COALESCE(SUM(fi.protein * rmf.amount), 0) AS total_protein,
  COALESCE(SUM(fi.carbs * rmf.amount), 0) AS total_carbs
FROM meals m
LEFT JOIN rel_meal_food rmf ON m.id = rmf.meal_id
LEFT JOIN food_items fi ON rmf.food_item_id = fi.id
WHERE m.user_id = $1
AND m.name ILIKE '%' || $2 || '%'
GROUP BY m.id
ORDER BY m.created_at DESC
LIMIT $3
OFFSET $4;

-- name: GetMealsCountByUserID :one
SELECT COUNT(*) AS total_rows
FROM meals
WHERE user_id = $1;

-- name: GetMealsCountByUserIDWithTextFilter :one
SELECT COUNT(*) AS total_rows
FROM meals
WHERE user_id = $1
AND name ILIKE '%' || $2 || '%';

-- name: UpdateMeal :one
UPDATE meals
SET name = $2,
  description = $3,
  image_url = $4
WHERE id = $1
RETURNING *;

-- name: DeleteFoodItemsByMealID :exec
DELETE FROM rel_meal_food
WHERE meal_id = $1
AND user_id = $2;

-- name: ConsumeMeal :one
INSERT INTO meal_consumed (
  user_id, 
  meal_id, 
  date
)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetConsumedMealsByMealID :many
SELECT * FROM meal_consumed
WHERE meal_id = $1;

-- name: GetConsumedMealsByDate :many
SELECT * FROM meal_consumed
WHERE date = $1;

-- name: RemoveConsumedMeal :exec
DELETE FROM meal_consumed
WHERE id = $1;
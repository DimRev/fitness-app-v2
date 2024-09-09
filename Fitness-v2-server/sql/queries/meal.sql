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

-- name: GetMealsCountByUserID :one
SELECT COUNT(*) AS total_rows
FROM meals
WHERE user_id = $1;
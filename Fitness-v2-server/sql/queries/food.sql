-- name: GetFoods :many
SELECT * FROM food_items 
ORDER BY name ASC
LIMIT $1
OFFSET $2;

-- name: GetFoodItemsTotalPages :one
SELECT COUNT(*) AS total_pages
FROM food_items;

-- name: CreateFood :one
INSERT INTO food_items (
    name, 
    description, 
    image_url, 
    food_type, 
    calories, 
    fat, 
    protein, 
    carbs
  ) 
VALUES (
  $1, 
  $2, 
  $3, 
  $4, 
  $5, 
  $6, 
  $7, 
  $8
) 
RETURNING *;
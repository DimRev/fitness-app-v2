-- name: GetFoodsWithFilter :many
SELECT * FROM food_items 
WHERE name ILIKE '%' || $3 || '%'
ORDER BY name ASC
LIMIT $1
OFFSET $2;

-- name: GetFoods :many
SELECT * FROM food_items 
ORDER BY name ASC
LIMIT $1
OFFSET $2;

-- name: GetFoodItemsTotalPagesWithFilter :one
SELECT COUNT(*) AS total_pages
FROM food_items
WHERE name ILIKE '%' || $1 || '%';

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

-- name: GetFoodItemsByMealID :many
SELECT rmf.*, fi.*
FROM rel_meal_food rmf
LEFT JOIN food_items fi ON fi.id = rmf.food_item_id
WHERE rmf.meal_id = $1
AND rmf.user_id = $2;

-- name: GetMealsByID :one
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

-- name: CreateMealWithFoodItems :many
WITH new_meal AS (
  INSERT INTO meals (
      name, 
      description, 
      image_url
      user_id
    ) 
  VALUES (
      $1, 
      $2, 
      $3,
      $4
    ) 
  RETURNING id
)
INSERT INTO rel_meal_food (
    meal_id, 
    food_item_id, 
    user_id, 
    amount
  ) 
SELECT 
  new_meal.id, 
  unset($5::uuid[]),
  $4::uuid,
  unset($6::numeric[])
FROM new_meal;

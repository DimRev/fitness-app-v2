-- name: CreateMealWithFoodItems :one
WITH new_meal AS (
  INSERT INTO meals (
      name, 
      description, 
      image_url,
      user_id
    ) 
  VALUES (
      $1, 
      $2, 
      $3,
      $4
    ) 
  RETURNING id, name, description, image_url, created_at, updated_at, user_id
),
inserted_food_items AS (
  INSERT INTO rel_meal_food (
      meal_id, 
      food_item_id, 
      user_id, 
      amount
    ) 
  SELECT 
    new_meal.id, 
    unnest($5::uuid[]), -- unnest to expand array into rows
    $4::uuid,
    unnest($6::int[]) -- unnest to expand array into rows
  FROM new_meal
  RETURNING meal_id, food_item_id
)
SELECT 
  m.id AS meal_id,
  m.name,
  m.description,
  m.image_url,
  m.created_at,
  m.updated_at,
  m.user_id,
  json_agg(
    json_build_object(
      'id', f.food_item_id,
      'name', fi.name,
      'description', fi.description,
      'image_url', fi.image_url,
      'food_type', fi.food_type,
      'calories', fi.calories,
      'fat', fi.fat,
      'protein', fi.protein,
      'carbs', fi.carbs,
      'created_at', fi.created_at,
      'updated_at', fi.updated_at
    )
  ) AS foods
FROM new_meal m
JOIN inserted_food_items f ON f.meal_id = m.id
JOIN food_items fi ON fi.id = f.food_item_id
GROUP BY m.id;


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

-- name: UpdateMealWithFoodItems :one
WITH updated_meal AS (
  UPDATE meals
  SET name = $2,
      description = $3,
      image_url = $4,
      updated_at = NOW()
  WHERE meals.id = $1  -- Explicitly reference meals.id
  RETURNING id, name, description, image_url, created_at, updated_at, user_id
),
deleted_old_relations AS (
  DELETE FROM rel_meal_food WHERE meal_id = $1
),
inserted_food_items AS (
  INSERT INTO rel_meal_food (
      meal_id, 
      food_item_id, 
      user_id, 
      amount
  )
  SELECT 
    updated_meal.id, 
    unnest($5::uuid[]), -- unnest to expand array into rows
    $4::uuid,           -- user_id (assuming same as meal)
    unnest($6::int[]) -- unnest to expand array into rows
  FROM updated_meal
  RETURNING meal_id, food_item_id
)
SELECT 
  updated_meal.id AS meal_id, -- Explicitly reference updated_meal.id
  updated_meal.name,
  updated_meal.description,
  updated_meal.image_url,
  updated_meal.created_at,
  updated_meal.updated_at,
  updated_meal.user_id,
  json_agg(
    json_build_object(
      'id', f.food_item_id,
      'name', fi.name,
      'description', fi.description,
      'image_url', fi.image_url,
      'food_type', fi.food_type,
      'calories', fi.calories,
      'fat', fi.fat,
      'protein', fi.protein,
      'carbs', fi.carbs,
      'created_at', fi.created_at,
      'updated_at', fi.updated_at
    )
  ) AS foods
FROM updated_meal
JOIN inserted_food_items f ON f.meal_id = updated_meal.id -- Explicitly reference updated_meal.id
JOIN food_items fi ON fi.id = f.food_item_id
GROUP BY updated_meal.id; -- Explicitly reference updated_meal.id

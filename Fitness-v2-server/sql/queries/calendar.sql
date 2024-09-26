-- name: GetCalendarMealsByDate :many

SELECT m.name
FROM meal_consumed AS mc 
LEFT JOIN meals AS m 
ON m.id = mc.meal_id 
WHERE mc.date=$1
AND m.user_id=$2;

-- name: GetCalendarNutritionByDate :one
SELECT
  COALESCE(SUM(fi.calories * rmf.amount), 0) AS total_calories,
  COALESCE(SUM(fi.fat * rmf.amount), 0) AS total_fat,
  COALESCE(SUM(fi.protein * rmf.amount), 0) AS total_protein,
  COALESCE(SUM(fi.carbs * rmf.amount), 0) AS total_carbs
  FROM meal_consumed AS mc
  LEFT JOIN rel_meal_food AS rmf ON mc.meal_id = rmf.meal_id
  LEFT JOIN food_items AS fi ON rmf.food_item_id = fi.id
  WHERE mc.user_id = $2 
  AND mc.date = $1
  GROUP BY mc.date;
-- name: GetMealsConsumedChartData :many
SELECT
  mc.date as date,
  COALESCE(SUM(fi.calories * rmf.amount), 0) AS total_calories,
  COALESCE(SUM(fi.fat * rmf.amount), 0) AS total_fat,
  COALESCE(SUM(fi.protein * rmf.amount), 0) AS total_protein,
  COALESCE(SUM(fi.carbs * rmf.amount), 0) AS total_carbs
  FROM meal_consumed AS mc
  LEFT JOIN rel_meal_food AS rmf ON mc.meal_id = rmf.meal_id
  LEFT JOIN food_items AS fi ON rmf.food_item_id = fi.id
  WHERE mc.user_id = $1
  GROUP BY mc.date
  ORDER BY mc.date ASC;

-- name: GetMeasurementsChartData :many
SELECT
  m.date as date,
  m.weight as weight,
  m.height as height,
  m.bmi as bmi
  FROM measurements AS m
  WHERE m.user_id = $1;
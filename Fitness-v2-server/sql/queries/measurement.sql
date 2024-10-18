-- name: GetMeasurementsByUserID :many
SELECT * FROM measurements
WHERE user_id = $1
ORDER BY date DESC
LIMIT 5;

-- name: CheckTodayMeasurement :one
SELECT * FROM measurements
WHERE user_id = $1
AND date = CURRENT_DATE;

-- name: CheckYesterdayMeasurement :one
SELECT * FROM measurements
WHERE user_id = $1
AND date = CURRENT_DATE - 1;

-- name: CreateMeasurement :one
INSERT INTO measurements (
  user_id, 
  weight, 
  height, 
  bmi,
  date
)
VALUES (
  $1, 
  $2, 
  $3, 
  $4,
  CURRENT_DATE
) RETURNING *;
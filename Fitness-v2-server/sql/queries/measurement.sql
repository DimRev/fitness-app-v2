-- name: GetMeasurementsByUserID :many
SELECT * FROM measurements
WHERE user_id = $1;

-- name: CheckTodayMeasurement :one
SELECT * FROM measurements
WHERE user_id = $1
AND date = CURRENT_DATE;

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
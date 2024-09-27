-- name: GetMeasurementsByUserID :many
SELECT * FROM measurements
WHERE user_id = $1;

-- name: CheckTodayMeasurement :one
SELECT * FROM measurements
WHERE user_id = $1
AND date = CURRENT_DATE;

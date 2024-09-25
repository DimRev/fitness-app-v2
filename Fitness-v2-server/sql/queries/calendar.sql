-- name: GetCalendarDataByDate :many

SELECT m.name
FROM meal_consumed AS mc 
LEFT JOIN meals AS m 
ON m.id = mc.meal_id 
WHERE date=$1
AND m.user_id=$2;
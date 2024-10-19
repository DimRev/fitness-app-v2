-- name: CreateScore :one
INSERT INTO score (
  score,
  is_approved,
  details,
  user_id
)
VALUES (
  $1,
  $2,
  $3,
  $4
)
RETURNING *;

-- name: GetScoreRowsByUserID :many
SELECT * FROM score WHERE user_id = $1;

-- name: GetTotalScoreSumByUserID :one
SELECT COALESCE(SUM(score), 0)::int FROM score WHERE user_id = $1;

-- name: GetPendingScoreSumByUserID :one
SELECT COALESCE(SUM(score), 0)::int FROM score WHERE user_id = $1 AND is_approved = false;

-- name: GetApprovedScoreSumByUserID :one
SELECT COALESCE(SUM(score), 0)::int FROM score WHERE user_id = $1 AND is_approved = true;


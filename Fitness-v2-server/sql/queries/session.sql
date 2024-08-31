-- name: CreateSession :one
INSERT INTO sessions (
  user_id, 
  session_token, 
  session_data
) 
VALUES (
  $1, 
  $2, 
  $3
) 
RETURNING *;

-- name: GetSessionByID :one
SELECT sessions.*, users.*
FROM sessions
LEFT JOIN users ON users.id = sessions.user_id
WHERE sessions.id = $1;

-- name: GetSessionByToken :one
SELECT sessions.*, users.*
FROM sessions
LEFT JOIN users ON users.id = sessions.user_id
WHERE sessions.session_token = $1;

-- name: RefreshSession :one
UPDATE sessions
SET updated_at = NOW(),
    expires_at = NOW() + '1 hour'
WHERE session_token = $1
RETURNING *;

-- name: DeleteSession :exec
DELETE FROM sessions
WHERE session_token = $1;

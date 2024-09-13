-- name: GetUserByEmail :one
SELECT * FROM users 
WHERE email = $1;

-- name: GetUserByID :one
SELECT * FROM users 
WHERE id = $1;

-- name: CreateUser :one
INSERT INTO users (
  email, 
  password_hash, 
  username, 
  image_url
  ) 
VALUES (
  $1, 
  $2, 
  $3, 
  $4
) 
RETURNING *;

-- name: GetUsers :many
SELECT * FROM users
LIMIT $1
OFFSET $2;

-- name: GetUsersCount :one
SELECT COUNT(*) AS total_rows
FROM users;

-- name: UpdateUser :one
UPDATE users
SET image_url = $2,
  username = $3,
  email = $4,
  updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: UpdateUserByAdmin :one
UPDATE users
SET image_url = $2,
  username = $3,
  role = $4,
  email = $5,
  updated_at = NOW()
WHERE id = $1
RETURNING *;
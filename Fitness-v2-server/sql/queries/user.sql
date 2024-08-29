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


-- name: UpdateUser :one
UPDATE users
SET image_url = $2,
  username = $3,
  updated_at = NOW()
WHERE id = $1
RETURNING *;

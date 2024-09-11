// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: user.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const createUser = `-- name: CreateUser :one
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
RETURNING id, email, password_hash, username, image_url, created_at, updated_at, role
`

type CreateUserParams struct {
	Email        string
	PasswordHash []byte
	Username     string
	ImageUrl     sql.NullString
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, createUser,
		arg.Email,
		arg.PasswordHash,
		arg.Username,
		arg.ImageUrl,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.PasswordHash,
		&i.Username,
		&i.ImageUrl,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Role,
	)
	return i, err
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, email, password_hash, username, image_url, created_at, updated_at, role FROM users 
WHERE email = $1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.PasswordHash,
		&i.Username,
		&i.ImageUrl,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Role,
	)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
SELECT id, email, password_hash, username, image_url, created_at, updated_at, role FROM users 
WHERE id = $1
`

func (q *Queries) GetUserByID(ctx context.Context, id uuid.UUID) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.PasswordHash,
		&i.Username,
		&i.ImageUrl,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Role,
	)
	return i, err
}

const getUsers = `-- name: GetUsers :many
SELECT id, email, password_hash, username, image_url, created_at, updated_at, role FROM users
LIMIT $1
OFFSET $2
`

type GetUsersParams struct {
	Limit  int32
	Offset int32
}

func (q *Queries) GetUsers(ctx context.Context, arg GetUsersParams) ([]User, error) {
	rows, err := q.db.QueryContext(ctx, getUsers, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.Email,
			&i.PasswordHash,
			&i.Username,
			&i.ImageUrl,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Role,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getUsersCount = `-- name: GetUsersCount :one
SELECT COUNT(*) AS total_rows
FROM users
`

func (q *Queries) GetUsersCount(ctx context.Context) (int64, error) {
	row := q.db.QueryRowContext(ctx, getUsersCount)
	var total_rows int64
	err := row.Scan(&total_rows)
	return total_rows, err
}

const updateUser = `-- name: UpdateUser :one
UPDATE users
SET image_url = $2,
  username = $3,
  updated_at = NOW()
WHERE id = $1
RETURNING id, email, password_hash, username, image_url, created_at, updated_at, role
`

type UpdateUserParams struct {
	ID       uuid.UUID
	ImageUrl sql.NullString
	Username string
}

func (q *Queries) UpdateUser(ctx context.Context, arg UpdateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUser, arg.ID, arg.ImageUrl, arg.Username)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.PasswordHash,
		&i.Username,
		&i.ImageUrl,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Role,
	)
	return i, err
}

const updateUserByAdmin = `-- name: UpdateUserByAdmin :one
UPDATE users
SET image_url = $2,
  username = $3,
  role = $4,
  email = $5,
  updated_at = NOW()
WHERE id = $1
RETURNING id, email, password_hash, username, image_url, created_at, updated_at, role
`

type UpdateUserByAdminParams struct {
	ID       uuid.UUID
	ImageUrl sql.NullString
	Username string
	Role     UserRole
	Email    string
}

func (q *Queries) UpdateUserByAdmin(ctx context.Context, arg UpdateUserByAdminParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUserByAdmin,
		arg.ID,
		arg.ImageUrl,
		arg.Username,
		arg.Role,
		arg.Email,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.PasswordHash,
		&i.Username,
		&i.ImageUrl,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Role,
	)
	return i, err
}

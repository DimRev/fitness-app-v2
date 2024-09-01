// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: food_item_pending.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const approveFoodItemPending = `-- name: ApproveFoodItemPending :exec
WITH moved_item AS (
    DELETE FROM food_items_pending
    WHERE food_items_pending.id = $1
    RETURNING name, description, image_url, food_type, calories, fat, protein, carbs
)
INSERT INTO food_items (
    name, 
    description, 
    image_url, 
    food_type, 
    calories, 
    fat, 
    protein, 
    carbs
) 
SELECT 
    name, 
    description, 
    image_url, 
    food_type, 
    calories, 
    fat, 
    protein, 
    carbs
FROM moved_item
`

func (q *Queries) ApproveFoodItemPending(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, approveFoodItemPending, id)
	return err
}

const createFoodItemPending = `-- name: CreateFoodItemPending :one
INSERT INTO food_items_pending (
    name, 
    description, 
    image_url, 
    food_type, 
    calories, 
    fat, 
    protein, 
    carbs,
    user_id
  ) 
VALUES (
  $1, 
  $2, 
  $3, 
  $4, 
  $5, 
  $6, 
  $7, 
  $8,
  $9
) 
RETURNING id, name, description, image_url, food_type, calories, fat, protein, carbs, created_at, updated_at, user_id
`

type CreateFoodItemPendingParams struct {
	Name        string
	Description sql.NullString
	ImageUrl    sql.NullString
	FoodType    FoodItemType
	Calories    string
	Fat         string
	Protein     string
	Carbs       string
	UserID      uuid.UUID
}

func (q *Queries) CreateFoodItemPending(ctx context.Context, arg CreateFoodItemPendingParams) (FoodItemsPending, error) {
	row := q.db.QueryRowContext(ctx, createFoodItemPending,
		arg.Name,
		arg.Description,
		arg.ImageUrl,
		arg.FoodType,
		arg.Calories,
		arg.Fat,
		arg.Protein,
		arg.Carbs,
		arg.UserID,
	)
	var i FoodItemsPending
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.ImageUrl,
		&i.FoodType,
		&i.Calories,
		&i.Fat,
		&i.Protein,
		&i.Carbs,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserID,
	)
	return i, err
}

const getFoodItemPendingLikeForUser = `-- name: GetFoodItemPendingLikeForUser :one
SELECT user_id, food_item_id FROM rel_user_like_food_item_pending
WHERE user_id = $1
AND food_item_id = $2
`

type GetFoodItemPendingLikeForUserParams struct {
	UserID     uuid.UUID
	FoodItemID uuid.UUID
}

func (q *Queries) GetFoodItemPendingLikeForUser(ctx context.Context, arg GetFoodItemPendingLikeForUserParams) (RelUserLikeFoodItemPending, error) {
	row := q.db.QueryRowContext(ctx, getFoodItemPendingLikeForUser, arg.UserID, arg.FoodItemID)
	var i RelUserLikeFoodItemPending
	err := row.Scan(&i.UserID, &i.FoodItemID)
	return i, err
}

const getFoodItemsPending = `-- name: GetFoodItemsPending :many
SELECT 
  fip.id, fip.name, fip.description, fip.image_url, fip.food_type, fip.calories, fip.fat, fip.protein, fip.carbs, fip.created_at, fip.updated_at, fip.user_id, 
  COUNT(rufip.user_id) AS likes,
  EXISTS (
    SELECT 1 
    FROM rel_user_like_food_item_pending rufip_check
    WHERE rufip_check.food_item_id = fip.id 
    AND rufip_check.user_id = $1
  ) AS liked,
  u.username
FROM food_items_pending fip
LEFT JOIN rel_user_like_food_item_pending rufip ON rufip.food_item_id = fip.id
LEFT JOIN users u ON u.id = fip.user_id
GROUP BY fip.id, u.username
LIMIT $2
OFFSET $3
`

type GetFoodItemsPendingParams struct {
	UserID uuid.UUID
	Limit  int32
	Offset int32
}

type GetFoodItemsPendingRow struct {
	ID          uuid.UUID
	Name        string
	Description sql.NullString
	ImageUrl    sql.NullString
	FoodType    FoodItemType
	Calories    string
	Fat         string
	Protein     string
	Carbs       string
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
	UserID      uuid.UUID
	Likes       int64
	Liked       bool
	Username    sql.NullString
}

func (q *Queries) GetFoodItemsPending(ctx context.Context, arg GetFoodItemsPendingParams) ([]GetFoodItemsPendingRow, error) {
	rows, err := q.db.QueryContext(ctx, getFoodItemsPending, arg.UserID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetFoodItemsPendingRow
	for rows.Next() {
		var i GetFoodItemsPendingRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.ImageUrl,
			&i.FoodType,
			&i.Calories,
			&i.Fat,
			&i.Protein,
			&i.Carbs,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.UserID,
			&i.Likes,
			&i.Liked,
			&i.Username,
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

const getFoodItemsPendingByUserID = `-- name: GetFoodItemsPendingByUserID :many
SELECT 
  fip.id, fip.name, fip.description, fip.image_url, fip.food_type, fip.calories, fip.fat, fip.protein, fip.carbs, fip.created_at, fip.updated_at, fip.user_id, 
  COUNT(rufip.user_id) AS likes,
  EXISTS (
    SELECT 1 
    FROM rel_user_like_food_item_pending rufip_check
    WHERE rufip_check.food_item_id = fip.id 
    AND rufip_check.user_id = $1
  ) AS liked,
  u.username
FROM food_items_pending fip
LEFT JOIN rel_user_like_food_item_pending rufip ON rufip.food_item_id = fip.id
LEFT JOIN users u ON u.id = fip.user_id
WHERE fip.user_id = $1
GROUP BY fip.id, u.username
LIMIT $2
OFFSET $3
`

type GetFoodItemsPendingByUserIDParams struct {
	UserID uuid.UUID
	Limit  int32
	Offset int32
}

type GetFoodItemsPendingByUserIDRow struct {
	ID          uuid.UUID
	Name        string
	Description sql.NullString
	ImageUrl    sql.NullString
	FoodType    FoodItemType
	Calories    string
	Fat         string
	Protein     string
	Carbs       string
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
	UserID      uuid.UUID
	Likes       int64
	Liked       bool
	Username    sql.NullString
}

func (q *Queries) GetFoodItemsPendingByUserID(ctx context.Context, arg GetFoodItemsPendingByUserIDParams) ([]GetFoodItemsPendingByUserIDRow, error) {
	rows, err := q.db.QueryContext(ctx, getFoodItemsPendingByUserID, arg.UserID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetFoodItemsPendingByUserIDRow
	for rows.Next() {
		var i GetFoodItemsPendingByUserIDRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.ImageUrl,
			&i.FoodType,
			&i.Calories,
			&i.Fat,
			&i.Protein,
			&i.Carbs,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.UserID,
			&i.Likes,
			&i.Liked,
			&i.Username,
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

const likeFoodItemPendingForUser = `-- name: LikeFoodItemPendingForUser :exec
INSERT INTO rel_user_like_food_item_pending (
    user_id, 
    food_item_id
  ) 
VALUES (
  $1, 
  $2
)
`

type LikeFoodItemPendingForUserParams struct {
	UserID     uuid.UUID
	FoodItemID uuid.UUID
}

func (q *Queries) LikeFoodItemPendingForUser(ctx context.Context, arg LikeFoodItemPendingForUserParams) error {
	_, err := q.db.ExecContext(ctx, likeFoodItemPendingForUser, arg.UserID, arg.FoodItemID)
	return err
}

const unlikeFoodItemPendingForUser = `-- name: UnlikeFoodItemPendingForUser :exec
DELETE FROM rel_user_like_food_item_pending
WHERE user_id = $1
AND food_item_id = $2
`

type UnlikeFoodItemPendingForUserParams struct {
	UserID     uuid.UUID
	FoodItemID uuid.UUID
}

func (q *Queries) UnlikeFoodItemPendingForUser(ctx context.Context, arg UnlikeFoodItemPendingForUserParams) error {
	_, err := q.db.ExecContext(ctx, unlikeFoodItemPendingForUser, arg.UserID, arg.FoodItemID)
	return err
}

// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: meal.sql

package database

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

const deleteFoodItemsByMealID = `-- name: DeleteFoodItemsByMealID :exec
DELETE FROM rel_meal_food
WHERE meal_id = $1
AND user_id = $2
`

type DeleteFoodItemsByMealIDParams struct {
	MealID uuid.UUID
	UserID uuid.UUID
}

func (q *Queries) DeleteFoodItemsByMealID(ctx context.Context, arg DeleteFoodItemsByMealIDParams) error {
	_, err := q.db.ExecContext(ctx, deleteFoodItemsByMealID, arg.MealID, arg.UserID)
	return err
}

const getConsumedMealsByDate = `-- name: GetConsumedMealsByDate :many
SELECT user_id, meal_id, date, created_at, updated_at FROM meal_consumed
WHERE date = $1
`

func (q *Queries) GetConsumedMealsByDate(ctx context.Context, date time.Time) ([]MealConsumed, error) {
	rows, err := q.db.QueryContext(ctx, getConsumedMealsByDate, date)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []MealConsumed
	for rows.Next() {
		var i MealConsumed
		if err := rows.Scan(
			&i.UserID,
			&i.MealID,
			&i.Date,
			&i.CreatedAt,
			&i.UpdatedAt,
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

const getConsumedMealsByMealID = `-- name: GetConsumedMealsByMealID :many
SELECT user_id, meal_id, date, created_at, updated_at FROM meal_consumed
WHERE meal_id = $1
`

func (q *Queries) GetConsumedMealsByMealID(ctx context.Context, mealID uuid.UUID) ([]MealConsumed, error) {
	rows, err := q.db.QueryContext(ctx, getConsumedMealsByMealID, mealID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []MealConsumed
	for rows.Next() {
		var i MealConsumed
		if err := rows.Scan(
			&i.UserID,
			&i.MealID,
			&i.Date,
			&i.CreatedAt,
			&i.UpdatedAt,
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

const getMealByID = `-- name: GetMealByID :one
SELECT 
  m.id, m.name, m.description, m.image_url, m.created_at, m.updated_at, m.user_id, 
  COALESCE(SUM(fi.calories * rmf.amount), 0) AS total_calories,
  COALESCE(SUM(fi.fat * rmf.amount), 0) AS total_fat,
  COALESCE(SUM(fi.protein * rmf.amount), 0) AS total_protein,
  COALESCE(SUM(fi.carbs * rmf.amount), 0) AS total_carbs
FROM meals m
LEFT JOIN rel_meal_food rmf ON m.id = rmf.meal_id
LEFT JOIN food_items fi ON rmf.food_item_id = fi.id
WHERE m.id = $1
GROUP BY m.id
`

type GetMealByIDRow struct {
	ID            uuid.UUID
	Name          string
	Description   sql.NullString
	ImageUrl      sql.NullString
	CreatedAt     sql.NullTime
	UpdatedAt     sql.NullTime
	UserID        uuid.UUID
	TotalCalories interface{}
	TotalFat      interface{}
	TotalProtein  interface{}
	TotalCarbs    interface{}
}

func (q *Queries) GetMealByID(ctx context.Context, id uuid.UUID) (GetMealByIDRow, error) {
	row := q.db.QueryRowContext(ctx, getMealByID, id)
	var i GetMealByIDRow
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.ImageUrl,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserID,
		&i.TotalCalories,
		&i.TotalFat,
		&i.TotalProtein,
		&i.TotalCarbs,
	)
	return i, err
}

const getMealsByUserID = `-- name: GetMealsByUserID :many
SELECT 
  m.id, m.name, m.description, m.image_url, m.created_at, m.updated_at, m.user_id, 
  COALESCE(SUM(fi.calories * rmf.amount), 0) AS total_calories,
  COALESCE(SUM(fi.fat * rmf.amount), 0) AS total_fat,
  COALESCE(SUM(fi.protein * rmf.amount), 0) AS total_protein,
  COALESCE(SUM(fi.carbs * rmf.amount), 0) AS total_carbs
FROM meals m
LEFT JOIN rel_meal_food rmf ON m.id = rmf.meal_id
LEFT JOIN food_items fi ON rmf.food_item_id = fi.id
WHERE m.user_id = $1
GROUP BY m.id
ORDER BY m.created_at DESC
LIMIT $2
OFFSET $3
`

type GetMealsByUserIDParams struct {
	UserID uuid.UUID
	Limit  int32
	Offset int32
}

type GetMealsByUserIDRow struct {
	ID            uuid.UUID
	Name          string
	Description   sql.NullString
	ImageUrl      sql.NullString
	CreatedAt     sql.NullTime
	UpdatedAt     sql.NullTime
	UserID        uuid.UUID
	TotalCalories interface{}
	TotalFat      interface{}
	TotalProtein  interface{}
	TotalCarbs    interface{}
}

func (q *Queries) GetMealsByUserID(ctx context.Context, arg GetMealsByUserIDParams) ([]GetMealsByUserIDRow, error) {
	rows, err := q.db.QueryContext(ctx, getMealsByUserID, arg.UserID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMealsByUserIDRow
	for rows.Next() {
		var i GetMealsByUserIDRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.ImageUrl,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.UserID,
			&i.TotalCalories,
			&i.TotalFat,
			&i.TotalProtein,
			&i.TotalCarbs,
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

const getMealsByUserIDWithTextFilter = `-- name: GetMealsByUserIDWithTextFilter :many
SELECT 
  m.id, m.name, m.description, m.image_url, m.created_at, m.updated_at, m.user_id, 
  COALESCE(SUM(fi.calories * rmf.amount), 0) AS total_calories,
  COALESCE(SUM(fi.fat * rmf.amount), 0) AS total_fat,
  COALESCE(SUM(fi.protein * rmf.amount), 0) AS total_protein,
  COALESCE(SUM(fi.carbs * rmf.amount), 0) AS total_carbs
FROM meals m
LEFT JOIN rel_meal_food rmf ON m.id = rmf.meal_id
LEFT JOIN food_items fi ON rmf.food_item_id = fi.id
WHERE m.user_id = $1
AND m.name ILIKE '%' || $2 || '%'
GROUP BY m.id
ORDER BY m.created_at DESC
LIMIT $3
OFFSET $4
`

type GetMealsByUserIDWithTextFilterParams struct {
	UserID  uuid.UUID
	Column2 sql.NullString
	Limit   int32
	Offset  int32
}

type GetMealsByUserIDWithTextFilterRow struct {
	ID            uuid.UUID
	Name          string
	Description   sql.NullString
	ImageUrl      sql.NullString
	CreatedAt     sql.NullTime
	UpdatedAt     sql.NullTime
	UserID        uuid.UUID
	TotalCalories interface{}
	TotalFat      interface{}
	TotalProtein  interface{}
	TotalCarbs    interface{}
}

func (q *Queries) GetMealsByUserIDWithTextFilter(ctx context.Context, arg GetMealsByUserIDWithTextFilterParams) ([]GetMealsByUserIDWithTextFilterRow, error) {
	rows, err := q.db.QueryContext(ctx, getMealsByUserIDWithTextFilter,
		arg.UserID,
		arg.Column2,
		arg.Limit,
		arg.Offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMealsByUserIDWithTextFilterRow
	for rows.Next() {
		var i GetMealsByUserIDWithTextFilterRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.ImageUrl,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.UserID,
			&i.TotalCalories,
			&i.TotalFat,
			&i.TotalProtein,
			&i.TotalCarbs,
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

const getMealsCountByUserID = `-- name: GetMealsCountByUserID :one
SELECT COUNT(*) AS total_rows
FROM meals
WHERE user_id = $1
`

func (q *Queries) GetMealsCountByUserID(ctx context.Context, userID uuid.UUID) (int64, error) {
	row := q.db.QueryRowContext(ctx, getMealsCountByUserID, userID)
	var total_rows int64
	err := row.Scan(&total_rows)
	return total_rows, err
}

const getMealsCountByUserIDWithTextFilter = `-- name: GetMealsCountByUserIDWithTextFilter :one
SELECT COUNT(*) AS total_rows
FROM meals
WHERE user_id = $1
AND name ILIKE '%' || $2 || '%'
`

type GetMealsCountByUserIDWithTextFilterParams struct {
	UserID  uuid.UUID
	Column2 sql.NullString
}

func (q *Queries) GetMealsCountByUserIDWithTextFilter(ctx context.Context, arg GetMealsCountByUserIDWithTextFilterParams) (int64, error) {
	row := q.db.QueryRowContext(ctx, getMealsCountByUserIDWithTextFilter, arg.UserID, arg.Column2)
	var total_rows int64
	err := row.Scan(&total_rows)
	return total_rows, err
}

const insertMeal = `-- name: InsertMeal :one
INSERT INTO meals (
  name, 
  description, 
  image_url, 
  user_id
)
VALUES (
  $1, $2, $3, $4
)
RETURNING id, name, description, image_url, created_at, updated_at, user_id
`

type InsertMealParams struct {
	Name        string
	Description sql.NullString
	ImageUrl    sql.NullString
	UserID      uuid.UUID
}

func (q *Queries) InsertMeal(ctx context.Context, arg InsertMealParams) (Meal, error) {
	row := q.db.QueryRowContext(ctx, insertMeal,
		arg.Name,
		arg.Description,
		arg.ImageUrl,
		arg.UserID,
	)
	var i Meal
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.ImageUrl,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserID,
	)
	return i, err
}

const insertMealFoodItems = `-- name: InsertMealFoodItems :exec
INSERT INTO rel_meal_food (
  meal_id, 
  food_item_id, 
  user_id, 
  amount
) 
VALUES ($1, unnest($2::uuid[]), $3, unnest($4::int[]))
`

type InsertMealFoodItemsParams struct {
	MealID  uuid.UUID
	Column2 []uuid.UUID
	UserID  uuid.UUID
	Column4 []int32
}

func (q *Queries) InsertMealFoodItems(ctx context.Context, arg InsertMealFoodItemsParams) error {
	_, err := q.db.ExecContext(ctx, insertMealFoodItems,
		arg.MealID,
		pq.Array(arg.Column2),
		arg.UserID,
		pq.Array(arg.Column4),
	)
	return err
}

const toggleConsumeMeal = `-- name: ToggleConsumeMeal :one
WITH deleted AS (
  DELETE FROM meal_consumed
  WHERE user_id = $1
    AND meal_id = $2
    AND date = $3
  RETURNING user_id, meal_id, date, created_at, updated_at
)
INSERT INTO meal_consumed (user_id, meal_id, date)
SELECT $1, $2, $3
WHERE NOT EXISTS (
  SELECT 1 FROM deleted
)
RETURNING user_id, meal_id, date, created_at, updated_at
`

type ToggleConsumeMealParams struct {
	UserID uuid.UUID
	MealID uuid.UUID
	Date   time.Time
}

// Only insert if no rows were deleted
func (q *Queries) ToggleConsumeMeal(ctx context.Context, arg ToggleConsumeMealParams) (MealConsumed, error) {
	row := q.db.QueryRowContext(ctx, toggleConsumeMeal, arg.UserID, arg.MealID, arg.Date)
	var i MealConsumed
	err := row.Scan(
		&i.UserID,
		&i.MealID,
		&i.Date,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateMeal = `-- name: UpdateMeal :one
UPDATE meals
SET name = $2,
  description = $3,
  image_url = $4
WHERE id = $1
RETURNING id, name, description, image_url, created_at, updated_at, user_id
`

type UpdateMealParams struct {
	ID          uuid.UUID
	Name        string
	Description sql.NullString
	ImageUrl    sql.NullString
}

func (q *Queries) UpdateMeal(ctx context.Context, arg UpdateMealParams) (Meal, error) {
	row := q.db.QueryRowContext(ctx, updateMeal,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.ImageUrl,
	)
	var i Meal
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.ImageUrl,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserID,
	)
	return i, err
}

// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: food.sql

package database

import (
	"context"
	"database/sql"
)

const createFood = `-- name: CreateFood :one
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
VALUES (
  $1, 
  $2, 
  $3, 
  $4, 
  $5, 
  $6, 
  $7, 
  $8
) 
RETURNING id, name, description, image_url, food_type, calories, fat, protein, carbs, created_at, updated_at
`

type CreateFoodParams struct {
	Name        string
	Description sql.NullString
	ImageUrl    sql.NullString
	FoodType    FoodItemType
	Calories    string
	Fat         string
	Protein     string
	Carbs       string
}

func (q *Queries) CreateFood(ctx context.Context, arg CreateFoodParams) (FoodItem, error) {
	row := q.db.QueryRowContext(ctx, createFood,
		arg.Name,
		arg.Description,
		arg.ImageUrl,
		arg.FoodType,
		arg.Calories,
		arg.Fat,
		arg.Protein,
		arg.Carbs,
	)
	var i FoodItem
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
	)
	return i, err
}

const getFoods = `-- name: GetFoods :many
SELECT id, name, description, image_url, food_type, calories, fat, protein, carbs, created_at, updated_at FROM food_items 
ORDER BY name DESC
LIMIT $1
OFFSET $2
`

type GetFoodsParams struct {
	Limit  int32
	Offset int32
}

func (q *Queries) GetFoods(ctx context.Context, arg GetFoodsParams) ([]FoodItem, error) {
	rows, err := q.db.QueryContext(ctx, getFoods, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []FoodItem
	for rows.Next() {
		var i FoodItem
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

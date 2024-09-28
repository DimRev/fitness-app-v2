// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: measurement.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const checkTodayMeasurement = `-- name: CheckTodayMeasurement :one
SELECT user_id, weight, height, bmi, date, created_at, updated_at FROM measurements
WHERE user_id = $1
AND date = CURRENT_DATE
`

func (q *Queries) CheckTodayMeasurement(ctx context.Context, userID uuid.UUID) (Measurement, error) {
	row := q.db.QueryRowContext(ctx, checkTodayMeasurement, userID)
	var i Measurement
	err := row.Scan(
		&i.UserID,
		&i.Weight,
		&i.Height,
		&i.Bmi,
		&i.Date,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const createMeasurement = `-- name: CreateMeasurement :one
INSERT INTO measurements (
  user_id, 
  weight, 
  height, 
  bmi,
  date
)
VALUES (
  $1, 
  $2, 
  $3, 
  $4,
  CURRENT_DATE
) RETURNING user_id, weight, height, bmi, date, created_at, updated_at
`

type CreateMeasurementParams struct {
	UserID uuid.UUID
	Weight string
	Height string
	Bmi    string
}

func (q *Queries) CreateMeasurement(ctx context.Context, arg CreateMeasurementParams) (Measurement, error) {
	row := q.db.QueryRowContext(ctx, createMeasurement,
		arg.UserID,
		arg.Weight,
		arg.Height,
		arg.Bmi,
	)
	var i Measurement
	err := row.Scan(
		&i.UserID,
		&i.Weight,
		&i.Height,
		&i.Bmi,
		&i.Date,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getMeasurementsByUserID = `-- name: GetMeasurementsByUserID :many
SELECT user_id, weight, height, bmi, date, created_at, updated_at FROM measurements
WHERE user_id = $1
ORDER BY date DESC
LIMIT 5
`

func (q *Queries) GetMeasurementsByUserID(ctx context.Context, userID uuid.UUID) ([]Measurement, error) {
	rows, err := q.db.QueryContext(ctx, getMeasurementsByUserID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Measurement
	for rows.Next() {
		var i Measurement
		if err := rows.Scan(
			&i.UserID,
			&i.Weight,
			&i.Height,
			&i.Bmi,
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

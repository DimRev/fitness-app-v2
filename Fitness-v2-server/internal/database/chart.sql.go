// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: chart.sql

package database

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const getMealsConsumedChartData = `-- name: GetMealsConsumedChartData :many
SELECT
  mc.date as date,
  COALESCE(SUM(fi.calories * rmf.amount), 0) AS total_calories,
  COALESCE(SUM(fi.fat * rmf.amount), 0) AS total_fat,
  COALESCE(SUM(fi.protein * rmf.amount), 0) AS total_protein,
  COALESCE(SUM(fi.carbs * rmf.amount), 0) AS total_carbs
  FROM meal_consumed AS mc
  LEFT JOIN rel_meal_food AS rmf ON mc.meal_id = rmf.meal_id
  LEFT JOIN food_items AS fi ON rmf.food_item_id = fi.id
  WHERE mc.user_id = $1
  GROUP BY mc.date
  ORDER BY mc.date ASC
`

type GetMealsConsumedChartDataRow struct {
	Date          time.Time
	TotalCalories interface{}
	TotalFat      interface{}
	TotalProtein  interface{}
	TotalCarbs    interface{}
}

func (q *Queries) GetMealsConsumedChartData(ctx context.Context, userID uuid.UUID) ([]GetMealsConsumedChartDataRow, error) {
	rows, err := q.db.QueryContext(ctx, getMealsConsumedChartData, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMealsConsumedChartDataRow
	for rows.Next() {
		var i GetMealsConsumedChartDataRow
		if err := rows.Scan(
			&i.Date,
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

const getMeasurementsChartData = `-- name: GetMeasurementsChartData :many
SELECT
  m.date as date,
  m.weight as weight,
  m.height as height,
  m.bmi as bmi
  FROM measurements AS m
  WHERE m.user_id = $1
`

type GetMeasurementsChartDataRow struct {
	Date   time.Time
	Weight string
	Height string
	Bmi    string
}

func (q *Queries) GetMeasurementsChartData(ctx context.Context, userID uuid.UUID) ([]GetMeasurementsChartDataRow, error) {
	rows, err := q.db.QueryContext(ctx, getMeasurementsChartData, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMeasurementsChartDataRow
	for rows.Next() {
		var i GetMeasurementsChartDataRow
		if err := rows.Scan(
			&i.Date,
			&i.Weight,
			&i.Height,
			&i.Bmi,
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
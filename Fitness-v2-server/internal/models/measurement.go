package models

import "time"

type Measurement struct {
	UserID    string    `json:"-"`
	Weight    float64   `json:"weight"`
	Height    float64   `json:"height"`
	Bmi       float64   `json:"bmi"`
	Date      time.Time `json:"date"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

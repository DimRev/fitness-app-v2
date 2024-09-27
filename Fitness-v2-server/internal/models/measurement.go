package models

import "time"

type Measurement struct {
	UserID    string    `json:"user_id"`
	Weight    float64   `json:"weight"`
	Height    float64   `json:"height"`
	Date      time.Time `json:"date"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

package models

import "database/sql"

type User struct {
	ID           string         `json:"id"`
	Email        string         `json:"email"`
	PasswordHash []byte         `json:"-"`
	Username     string         `json:"username"`
	ImageUrl     sql.NullString `json:"image_url"`
	CreatedAt    sql.NullTime   `json:"-"`
	UpdatedAt    sql.NullTime   `json:"-"`
}

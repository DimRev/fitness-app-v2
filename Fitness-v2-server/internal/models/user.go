package models

import (
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/google/uuid"
)

type AuthUser struct {
	ID           uuid.UUID `json:"-"`
	Email        string    `json:"email"`
	PasswordHash []byte    `json:"-"`
	Username     string    `json:"username"`
	ImageUrl     *string   `json:"image_url"`
	CreatedAt    time.Time `json:"-"`
	UpdatedAt    time.Time `json:"-"`

	Role         database.UserRole `json:"role"`
	SessionToken string            `json:"session_token"`
}

type User struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	PasswordHash []byte    `json:"-"`
	Username     string    `json:"username"`
	ImageUrl     *string   `json:"image_url"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`

	Role         database.UserRole `json:"role"`
	SessionToken string            `json:"-"`
}

type UsersWithPages struct {
	Users      []User `json:"users"`
	TotalPages int64  `json:"total_pages"`
}

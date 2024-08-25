package controllers

import "github.com/DimRev/Fitness-v2-server/internal/database"

type MiddlewareState struct {
	User database.User
}

func NewAuthState() *MiddlewareState {
	return &MiddlewareState{}
}

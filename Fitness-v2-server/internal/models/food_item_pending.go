package models

import (
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/google/uuid"
)

type FoodItemsPending struct {
	ID          uuid.UUID             `json:"id"`
	Name        string                `json:"name"`
	Description *string               `json:"description"`
	ImageUrl    *string               `json:"image_url"`
	FoodType    database.FoodItemType `json:"food_type"`
	Calories    string                `json:"calories"`
	Fat         string                `json:"fat"`
	Protein     string                `json:"protein"`
	Carbs       string                `json:"carbs"`
	CreatedAt   time.Time             `json:"-"`
	UpdatedAt   time.Time             `json:"-"`
	UserID      uuid.UUID             `json:"-"`
	Likes       int64                 `json:"likes"`
	Liked       bool                  `json:"liked"`
	Author      string                `json:"author_name"`
}

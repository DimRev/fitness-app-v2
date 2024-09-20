package models

import (
	"fmt"

	"github.com/google/uuid"
)

type NotificationTypes string

const (
	NotificationTypeUserLikeFoodItemPending NotificationTypes = "user-like-food-item-pending"
)

type Notification struct {
	ID        string            `json:"id"`
	Type      NotificationTypes `json:"type"`
	Data      string            `json:"data"`
	IsNew     bool              `json:"is_new"`
	CreatedAt string            `json:"created_at"`
	UpdatedAt string            `json:"updated_at"`
	UserID    string            `json:"user_id"`
}

type NotificationDataInterface interface {
	Print()
}

type NotificationDataUserLikeFoodItemPending struct {
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	FoodItemName string    `json:"food_item_name"`
	FoodItemID   uuid.UUID `json:"food_item_id"`
}

func (n *NotificationDataUserLikeFoodItemPending) Print() {
	fmt.Printf("Title: %s\n", n.Title)
	fmt.Printf("Description: %s\n", n.Description)
	fmt.Printf("FoodItemName: %s\n", n.FoodItemName)
	fmt.Printf("FoodItemID: %s\n", n.FoodItemID)
}

type NotificationNewFoodItemLikes struct {
	ID         string `json:"id"`
	FoodItemID string `json:"food_item_id"`
	Name       string `json:"food_item_name"`
	Count      int    `json:"count"`
}

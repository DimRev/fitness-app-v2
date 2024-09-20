package models

import (
	"encoding/json"
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
	UnmarshalJSON([]byte) error
	MarshalJSON() ([]byte, error)
}

type NotificationDataUserLikeFoodItemPending struct {
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	FoodItemName string    `json:"food_item_name"`
	FoodItemID   uuid.UUID `json:"food_item_id"`
}

func (n *NotificationDataUserLikeFoodItemPending) UnmarshalJSON(data []byte) error {
	notificationData := NotificationDataUserLikeFoodItemPending{}
	if err := json.Unmarshal(data, &notificationData); err != nil {
		return fmt.Errorf("failed to unmarshal notification data: %s", err)
	}
	n.Title = notificationData.Title
	n.Description = notificationData.Description
	n.FoodItemName = notificationData.FoodItemName
	n.FoodItemID = notificationData.FoodItemID
	return nil
}

func (n *NotificationDataUserLikeFoodItemPending) MarshalJSON() ([]byte, error) {
	notificationData := NotificationDataUserLikeFoodItemPending{
		Title:        n.Title,
		Description:  n.Description,
		FoodItemName: n.FoodItemName,
		FoodItemID:   n.FoodItemID,
	}
	return json.Marshal(notificationData)
}

type NotificationNewFoodItemLikes struct {
	ID         string `json:"id"`
	FoodItemID string `json:"food_item_id"`
	Name       string `json:"food_item_name"`
	Count      int    `json:"count"`
}

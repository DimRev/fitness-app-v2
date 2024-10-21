package models

import (
	"fmt"

	"github.com/google/uuid"
)

type NotificationTypes string

const (
	NotificationTypeUserLikeFoodItemPending NotificationTypes = "user-like-food-item-pending"
	NotificationTypeUserScorePending        NotificationTypes = "user-score-pending"
	NotificationTypeUserScoreApproved       NotificationTypes = "user-score-approved"
	NotificationTypeUserScoreRejected       NotificationTypes = "user-score-rejected"
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

type NotificationDataUserLikeFoodItemPendingJSONData struct {
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	FoodItemName string    `json:"food_item_name"`
	FoodItemID   uuid.UUID `json:"food_item_id"`
}

func (n *NotificationDataUserLikeFoodItemPendingJSONData) Print() {
	fmt.Printf("Title: %s\n", n.Title)
	fmt.Printf("Description: %s\n", n.Description)
	fmt.Printf("FoodItemName: %s\n", n.FoodItemName)
	fmt.Printf("FoodItemID: %s\n", n.FoodItemID)
}

type NotificationDataUserScorePendingJSONData struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Score       int    `json:"score"`
}

func (n *NotificationDataUserScorePendingJSONData) Print() {
	fmt.Printf("Title: %s\n", n.Title)
	fmt.Printf("Description: %s\n", n.Description)
	fmt.Printf("Score: %d\n", n.Score)
}

type NotificationDataUserScoreApprovedJSONData struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Score       int    `json:"score"`
}

func (n *NotificationDataUserScoreApprovedJSONData) Print() {
	fmt.Printf("Title: %s\n", n.Title)
	fmt.Printf("Description: %s\n", n.Description)
	fmt.Printf("Score: %d\n", n.Score)
}

type NotificationDataUserScoreRejected struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Score       int    `json:"score"`
}

type NotificationNewFoodItemLikes struct {
	Type       NotificationTypes `json:"type"`
	FoodItemID string            `json:"food_item_id"`
	Name       string            `json:"food_item_name"`
	Count      int               `json:"count"`
}

func NewNotificationNewFoodItemLikes() NotificationNewFoodItemLikes {
	return NotificationNewFoodItemLikes{
		Type:       NotificationTypeUserLikeFoodItemPending,
		FoodItemID: "",
		Name:       "",
		Count:      0,
	}
}

type NotificationNewScore struct {
	Type  NotificationTypes `json:"type"`
	Title string            `json:"title"`
	Score int               `json:"score"`
	ID    string            `json:"id"`
}

func NewNotificationNewScore(ID uuid.UUID, score int, title string, notificationType NotificationTypes) NotificationNewScore {
	return NotificationNewScore{
		Type:  notificationType,
		Title: title,
		Score: score,
		ID:    ID.String(),
	}
}

type NotificationsResponse struct {
	Notifications []NotificationNewFoodItemLikes `json:"food_item_likes"`
	PendingScore  []NotificationNewScore         `json:"pending_score"`
	ApprovedScore []NotificationNewScore         `json:"approved_score"`
	RejectedScore []NotificationNewScore         `json:"rejected_score"`
}

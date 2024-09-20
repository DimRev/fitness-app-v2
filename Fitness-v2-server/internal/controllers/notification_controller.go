package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/google/uuid"
	"github.com/labstack/echo"
)

func GetNewUserNotifications(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError(
			"notification_controller.go",
			"GetUserNotifications",
			fmt.Errorf("reached get user notifications without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get user notifications, unauthorized",
		})
	}

	newNotifications, err := config.Queries.GetNewUserNotifications(c.Request().Context(), user.ID)
	if err != nil {
		utils.FmtLogError(
			"notification_controller.go",
			"GetUserNotifications",
			fmt.Errorf("failed to get user notifications: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get user notifications, trouble with server",
		})
	}

	notificationFoodItemPendingLikeCount := make(map[uuid.UUID]models.NotificationNewFoodItemLikes)

	for _, notification := range newNotifications {
		switch notification.Type {
		case database.NotificationTypeUserLikeFoodItemPending:
			var notificationData models.NotificationDataUserLikeFoodItemPending

			err := json.Unmarshal(notification.Data, &notificationData)
			if err != nil {
				utils.FmtLogError(
					"notification_controller.go",
					"GetUserNotifications",
					fmt.Errorf("failed to unmarshal notification data: %s", err),
				)
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to get user notifications, trouble with server",
				})
			}

			notificationFoodItemPendingLikeCount[notificationData.FoodItemID] = models.NotificationNewFoodItemLikes{
				FoodItemID: notificationData.FoodItemID.String(),
				Name:       notificationData.FoodItemName,
				Type:       models.NotificationTypeUserLikeFoodItemPending,
				Count:      notificationFoodItemPendingLikeCount[notificationData.FoodItemID].Count + 1,
			}
		}
	}

	respNotifications := make([]models.NotificationNewFoodItemLikes, len(notificationFoodItemPendingLikeCount))
	i := 0
	for _, notification := range notificationFoodItemPendingLikeCount {
		respNotifications[i] = notification
	}

	return c.JSON(http.StatusOK, respNotifications)
}

type MarkNotificationAsReadRequest struct {
	FoodItemPendingID string                   `json:"food_item_pending_id,omitempty"`
	Type              models.NotificationTypes `json:"type,omitempty"`
}

func MarkNotificationAsRead(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError(
			"notification_controller.go",
			"MarkNotificationAsRead",
			fmt.Errorf("reached mark notification as read without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to mark notification as read, unauthorized",
		})
	}

	markNotificationAsReadReq := MarkNotificationAsReadRequest{}
	if err := c.Bind(&markNotificationAsReadReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to mark notification as read, malformed request",
		})
	}

	switch markNotificationAsReadReq.Type {
	case models.NotificationTypeUserLikeFoodItemPending:
		markNotificationAsReadParams := database.MarkNotificationAsReadByFoodItemPendingIDParams{
			UserID:  user.ID,
			Column2: markNotificationAsReadReq.FoodItemPendingID,
		}

		err := config.Queries.MarkNotificationAsReadByFoodItemPendingID(c.Request().Context(), markNotificationAsReadParams)
		if err != nil {
			utils.FmtLogError(
				"notification_controller.go",
				"MarkNotificationAsRead",
				fmt.Errorf("failed to mark notification as read: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to mark notification as read, trouble with server",
			})
		}

		return c.JSON(http.StatusOK, map[string]string{
			"message": "Notification marked as read",
		})
	default:
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to mark notification as read, invalid type",
		})
	}
}

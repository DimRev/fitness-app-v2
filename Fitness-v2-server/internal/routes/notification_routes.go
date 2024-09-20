package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func NotificationRoutes(e *echo.Echo) {

	notification := e.Group("/notifications", middleware.ProtectedRoute)
	{
		notification.GET("", controllers.GetNewUserNotifications)
		notification.PUT("/read/:notification_id", controllers.MarkNotificationAsRead)
	}
}

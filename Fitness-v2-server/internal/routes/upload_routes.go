package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func UploadRoutesV1(e *echo.Group) {
	upload := e.Group("/upload", middleware.ProtectedRoute)
	{
		upload.POST("/presigned_avatar_url", controllers.GetPresignedUrlAvatar)
		upload.POST("/presigned_food_image_url", controllers.GetPresignedUrlFoodImage)
	}
}

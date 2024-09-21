package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func FoodItemRoutesV1(e *echo.Group) {
	foodItem := e.Group("/food_items", middleware.ProtectedRoute)
	{
		foodItem.GET("", controllers.GetFoodItems)
		foodItem.GET("/:food_item_id", controllers.GetFoodItemByID)
		foodItem.POST("", middleware.ProtectedRouteWithRoles(
			controllers.CreateFoodItem,
			[]database.UserRole{database.UserRoleAdmin},
		))
		foodItem.DELETE("/:food_item_id", middleware.ProtectedRouteWithRoles(
			controllers.DeleteFoodItem,
			[]database.UserRole{database.UserRoleAdmin},
		))
	}
}

package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func UserRoutesV1(e *echo.Group) {
	user := e.Group("/users", middleware.ProtectedRoute)
	{
		user.PUT("", controllers.UpdateUser)
		user.GET("/admin", middleware.ProtectedRouteWithRoles(
			controllers.GetUsers,
			[]database.UserRole{database.UserRoleAdmin},
		))
		user.PUT("/admin/:userId", middleware.ProtectedRouteWithRoles(
			controllers.UpdateUserByAdmin,
			[]database.UserRole{database.UserRoleAdmin},
		))
	}
}

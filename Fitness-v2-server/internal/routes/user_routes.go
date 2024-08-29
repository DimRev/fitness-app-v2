package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func UserRoutesV1(e *echo.Group) {
	auth := e.Group("/users", middleware.ProtectedRoute)
	{
		auth.PUT("", controllers.UpdateUser)
	}
}

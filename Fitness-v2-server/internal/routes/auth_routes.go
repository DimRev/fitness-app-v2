package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/labstack/echo"
)

func AuthRoutesV1(e *echo.Group) {
	auth := e.Group("/auth")
	{
		auth.POST("/login", controllers.Login)
		auth.POST("/register", controllers.Register)
		auth.POST("/logout", controllers.Logout)
	}
}

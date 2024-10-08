package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func AuthRoutesV1(e *echo.Group) {
	auth := e.Group("/auth")
	{
		auth.POST("/login", controllers.Login)
		auth.POST("/register", controllers.Register)
		auth.POST("/logout", controllers.Logout)
		auth.POST("/loginFromCookie", middleware.ProtectedRoute(controllers.LoginFromCookie))
		auth.POST("/loginFromSession", controllers.LoginWithSession)
	}
}

package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func ScoreRoutesV1(e *echo.Group) {
	score := e.Group("/score", middleware.ProtectedRoute)
	{
		score.GET("", controllers.GetScoreByUserID)
	}
}

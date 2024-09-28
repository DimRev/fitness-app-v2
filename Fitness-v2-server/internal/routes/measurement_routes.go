package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func MeasurementRoutesV1(e *echo.Group) {
	measurement := e.Group("/measurements", middleware.ProtectedRoute)
	{
		measurement.GET("", controllers.GetMeasurementsByUserID)
		measurement.GET("/check", controllers.GetCheckTodayMeasurement)
		measurement.POST("", controllers.CreateMeasurement)
	}
}

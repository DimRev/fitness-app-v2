package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func ChartRoutesV1(e *echo.Group) {

	chart := e.Group("/charts", middleware.ProtectedRoute)
	{
		chart.GET("/meals", controllers.GetMealsConsumedChartData)
		chart.GET("/measurements", controllers.GetMeasurementsChartData)
	}
}

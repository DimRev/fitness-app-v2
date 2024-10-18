package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/labstack/echo"
)

func CronRoutesV1(e *echo.Group) {
	cron := e.Group("/cron")
	{
		cron.POST("/update_measurements", controllers.CronUpdateMeasurements)
	}
}

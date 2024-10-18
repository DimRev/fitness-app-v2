package controllers

import (
	"fmt"
	"net/http"

	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/labstack/echo"
)

func CronUpdateMeasurements(c echo.Context) error {
	apiKey := c.Request().Header.Get("Authorization")
	utils.FmtLogInfo("cron_controllers.go", "CronUpdateMeasurements", fmt.Sprintf("Executing cron job, apiKey: %s", apiKey))
	return c.JSON(http.StatusOK, map[string]string{"message": "Cron job executed"})
}

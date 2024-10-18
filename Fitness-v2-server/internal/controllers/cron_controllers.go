package controllers

import (
	"crypto/subtle"
	"fmt"
	"net/http"
	"strings"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/labstack/echo"
)

func CronUpdateMeasurements(c echo.Context) error {
	apiKey := strings.Split(c.Request().Header.Get("Authorization"), "Bearer ")
	if len(apiKey) != 2 {
		utils.FmtLogError("cron_controllers.go", "CronUpdateMeasurements", fmt.Errorf("malformed api key"))
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Invalid api key",
		})
	} else if subtle.ConstantTimeCompare([]byte(apiKey[1]), []byte(config.CronApiKey)) != 1 {
		utils.FmtLogError("cron_controllers.go", "CronUpdateMeasurements", fmt.Errorf("invalid api key"))
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Invalid api key",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Cron job executed"})
}

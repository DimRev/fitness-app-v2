package controllers

import (
	"crypto/subtle"
	"database/sql"
	"fmt"
	"math"
	"net/http"
	"strings"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
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

	usersCount, err := config.Queries.GetUsersCount(c.Request().Context())
	if err != nil {
		utils.FmtLogError("cron_controllers.go", "CronUpdateMeasurements", fmt.Errorf("failed to get users count: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to execute cron job, trouble with getting users",
		})
	}

	userCountInt32, err := utils.SafeParseInt64ToInt32(usersCount, 0, math.MaxInt32)
	if err != nil {
		utils.FmtLogError("cron_controllers.go", "CronUpdateMeasurements", fmt.Errorf("failed to parse users count: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to execute cron job, trouble with getting users",
		})
	}

	const batchSize = 100
	for offset := 0; offset < int(userCountInt32); offset += batchSize {
		if offset > math.MaxInt32 {
			utils.FmtLogError("cron_controllers.go", "CronUpdateMeasurements", fmt.Errorf("offset exceeds int32 limit"))
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Offset exceeds int32 limit",
			})
		}
		getUsersParams := database.GetUsersParams{
			Limit:  batchSize,
			Offset: int32(offset),
		}

		users, err := config.Queries.GetUsers(c.Request().Context(), getUsersParams)
		if err != nil {
			utils.FmtLogError("cron_controllers.go", "CronUpdateMeasurements", fmt.Errorf("failed to get users: %s", err))
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to execute cron job, trouble with getting users",
			})
		}

		for _, user := range users {
			yesterdayMeasurement, err := config.Queries.CheckYesterdayMeasurement(c.Request().Context(), user.ID)
			var createMeasurementParams database.CreateMeasurementParams

			if err != nil {
				if err == sql.ErrNoRows { // No measurement found for yesterday, create with "0"
					createMeasurementParams = database.CreateMeasurementParams{
						UserID: user.ID,
						Weight: "0",
						Height: "0",
						Bmi:    "0",
					}
				} else {
					// Log other types of errors but continue the loop
					utils.FmtLogError("cron_controllers.go", "CronUpdateMeasurements", fmt.Errorf("failed to get yesterday's measurement for user %d: %s", user.ID, err))
					continue
				}
			} else {
				// Use the existing measurement if no error occurred
				createMeasurementParams = database.CreateMeasurementParams{
					UserID: user.ID,
					Weight: yesterdayMeasurement.Weight,
					Height: yesterdayMeasurement.Height,
					Bmi:    yesterdayMeasurement.Bmi,
				}
			}

			_, err = config.Queries.CreateMeasurement(c.Request().Context(), createMeasurementParams)
			if err != nil {
				utils.FmtLogError("cron_controllers.go", "CronUpdateMeasurements", fmt.Errorf("failed to create measurement for user %d: %s", user.ID, err))
			}
		}
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Cron job executed"})
}

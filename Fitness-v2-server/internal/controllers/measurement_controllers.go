package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/labstack/echo"
)

func GetMeasurementsByUserID(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError(
			"notification_controller.go",
			"GetUserNotifications",
			fmt.Errorf("reached get user notifications without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get user notifications, unauthorized",
		})
	}

	measurements, err := config.Queries.GetMeasurementsByUserID(c.Request().Context(), user.ID)
	if err != nil {
		utils.FmtLogError(
			"notification_controller.go",
			"GetUserNotifications",
			fmt.Errorf("failed to get user notifications: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get user notifications, trouble with server",
		})
	}

	respMeasurements := make([]models.Measurement, len(measurements))
	for i, measurement := range measurements {
		weight, err := strconv.ParseFloat(measurement.Weight, 64)
		if err != nil {
			utils.FmtLogError(
				"notification_controller.go",
				"GetUserNotifications",
				fmt.Errorf("failed to parse weight: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get user notifications, trouble with server",
			})
		}
		height, err := strconv.ParseFloat(measurement.Height, 64)
		if err != nil {
			utils.FmtLogError(
				"notification_controller.go",
				"GetUserNotifications",
				fmt.Errorf("failed to parse height: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get user notifications, trouble with server",
			})
		}
		bmi, err := strconv.ParseFloat(measurement.Bmi, 64)
		if err != nil {
			utils.FmtLogError(
				"notification_controller.go",
				"GetUserNotifications",
				fmt.Errorf("failed to parse bmi: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get user notifications, trouble with server",
			})
		}

		respMeasurements[i] = models.Measurement{
			UserID:    measurement.UserID.String(),
			Weight:    weight,
			Height:    height,
			Bmi:       bmi,
			Date:      measurement.Date,
			CreatedAt: measurement.CreatedAt,
			UpdatedAt: measurement.UpdatedAt,
		}
	}

	return c.JSON(http.StatusOK, respMeasurements)
}

func GetCheckTodayMeasurement(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError(
			"notification_controller.go",
			"GetUserNotifications",
			fmt.Errorf("reached get user notifications without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get user notifications, unauthorized",
		})
	}

	measurement, err := config.Queries.CheckTodayMeasurement(c.Request().Context(), user.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusOK, map[string]any{
				"isMeasuredToday": false,
			})
		} else {
			utils.FmtLogError(
				"measurement_controller.go",
				"GetCheckTodayMeasurement",
				fmt.Errorf("failed to get check today measurement: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get check today measurement, trouble with server",
			})
		}
	}

	weight, err := strconv.ParseFloat(measurement.Weight, 64)
	if err != nil {
		utils.FmtLogError(
			"measurement_controller.go",
			"GetCheckTodayMeasurement",
			fmt.Errorf("failed to parse weight: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get check today measurement, trouble with server",
		})
	}
	height, err := strconv.ParseFloat(measurement.Height, 64)
	if err != nil {
		utils.FmtLogError(
			"measurement_controller.go",
			"GetCheckTodayMeasurement",
			fmt.Errorf("failed to parse height: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get check today measurement, trouble with server",
		})
	}

	bmi, err := strconv.ParseFloat(measurement.Bmi, 64)
	if err != nil {
		utils.FmtLogError(
			"measurement_controller.go",
			"GetCheckTodayMeasurement",
			fmt.Errorf("failed to parse bmi: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get check today measurement, trouble with server",
		})
	}

	measurementResp := models.Measurement{
		UserID:    user.ID.String(),
		Weight:    weight,
		Height:    height,
		Bmi:       bmi,
		Date:      measurement.Date,
		CreatedAt: measurement.CreatedAt,
		UpdatedAt: measurement.UpdatedAt,
	}

	return c.JSON(http.StatusOK, map[string]any{
		"isMeasuredToday": true,
		"measurement":     measurementResp,
	})
}

type CreateMeasurementRequest struct {
	Weight string `json:"weight"`
	Height string `json:"height"`
}

func CreateMeasurement(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError(
			"measurement_controller.go",
			"CreateMeasurement",
			fmt.Errorf("reached get user notifications without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get user notifications, unauthorized",
		})
	}

	createMeasurementReq := CreateMeasurementRequest{}
	if err := c.Bind(&createMeasurementReq); err != nil {
		utils.FmtLogError(
			"measurement_controller.go",
			"CreateMeasurement",
			fmt.Errorf("failed to bind create measurement request: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create measurement, malformed request",
		})
	}

	weight, err := strconv.ParseFloat(createMeasurementReq.Weight, 64)
	if err != nil {
		utils.FmtLogError(
			"measurement_controller.go",
			"CreateMeasurement",
			fmt.Errorf("failed to parse weight: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create measurement, invalid weight",
		})
	}
	height, err := strconv.ParseFloat(createMeasurementReq.Height, 64)
	if err != nil {
		utils.FmtLogError(
			"measurement_controller.go",
			"CreateMeasurement",
			fmt.Errorf("failed to parse height: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create measurement, invalid height",
		})
	}

	bmi := utils.CalculateBMI(weight, height)

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogError(
			"measurement_controller.go",
			"CreateMeasurement",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get user notifications, trouble with server",
		})
	}

	createMeasurementParams := database.CreateMeasurementParams{
		UserID: user.ID,
		Weight: createMeasurementReq.Weight,
		Height: createMeasurementReq.Height,
		Bmi:    fmt.Sprint(bmi),
	}

	todayMeasurement, err := config.Queries.CreateMeasurement(c.Request().Context(), createMeasurementParams)
	if err != nil {
		utils.FmtLogError(
			"measurement_controller.go",
			"CreateMeasurement",
			fmt.Errorf("failed to create measurement: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create measurement, trouble with server",
		})
	}

	return c.JSON(http.StatusOK, todayMeasurement)
}

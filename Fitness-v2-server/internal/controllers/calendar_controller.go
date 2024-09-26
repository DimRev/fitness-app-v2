package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/labstack/echo"
)

type GetCalendarDateByDateRequest struct {
	Date string `json:"date"`
}

func GetCalendarDataByDate(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError(
			"calendar_controller.go",
			"GetCalendarDataByDate",
			fmt.Errorf("reached get calendar data by date without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get calendar data by date, unauthorized",
		})
	}

	dateStr := c.QueryParam("date")

	date, err := time.Parse(time.RFC3339, dateStr)
	if err != nil {
		utils.FmtLogError(
			"calendar_controller.go",
			"GetCalendarDataByDate",
			fmt.Errorf("failed to parse date: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get calendar data by date, invalid date",
		})
	}

	getCalendarDataByDateParams := database.GetCalendarMealsByDateParams{
		Date:   date,
		UserID: user.ID,
	}

	mealsByDate, err := config.Queries.GetCalendarMealsByDate(c.Request().Context(), getCalendarDataByDateParams)
	if err != nil {

		utils.FmtLogError(
			"calendar_controller.go",
			"GetCalendarDataByDate",
			fmt.Errorf("failed to get calendar data by date: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get calendar data by date, trouble with server",
		})
	}

	getCalendarNutritionByDateParams := database.GetCalendarNutritionByDateParams{
		Date:   date,
		UserID: user.ID,
	}

	nutritionalData, err := config.Queries.GetCalendarNutritionByDate(c.Request().Context(), getCalendarNutritionByDateParams)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusOK, models.CalendarData{
				Name:          []string{},
				TotalCalories: 0,
				TotalFat:      0,
				TotalProtein:  0,
				TotalCarbs:    0,
			})
		}
		utils.FmtLogError(
			"calendar_controller.go",
			"GetCalendarDataByDate",
			fmt.Errorf("failed to get calendar data by date: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get calendar data by date, trouble with server",
		})
	}

	mealNames := make([]string, len(mealsByDate))
	for i, calendarData := range mealsByDate {
		name := ""
		if calendarData.Valid {
			name = calendarData.String
		}
		mealNames[i] = name
	}

	totalCalories, err := strconv.ParseFloat(nutritionalData.TotalCalories.(string), 64)
	if err != nil {
		utils.FmtLogError(
			"calendar_controller.go",
			"GetCalendarDataByDate",
			fmt.Errorf("failed to parse total calories: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get calendar data by date, trouble with server",
		})
	}

	totalFat, err := strconv.ParseFloat(nutritionalData.TotalFat.(string), 64)
	if err != nil {
		utils.FmtLogError(
			"calendar_controller.go",
			"GetCalendarDataByDate",
			fmt.Errorf("failed to parse total fat: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get calendar data by date, trouble with server",
		})
	}

	totalProtein, err := strconv.ParseFloat(nutritionalData.TotalProtein.(string), 64)
	if err != nil {
		utils.FmtLogError(
			"calendar_controller.go",
			"GetCalendarDataByDate",
			fmt.Errorf("failed to parse total protein: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get calendar data by date, trouble with server",
		})
	}

	totalCarbs, err := strconv.ParseFloat(nutritionalData.TotalCarbs.(string), 64)
	if err != nil {
		utils.FmtLogError(
			"calendar_controller.go",
			"GetCalendarDataByDate",
			fmt.Errorf("failed to parse total carbs: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get calendar data by date, trouble with server",
		})
	}

	respCalendarData := models.CalendarData{
		Name:          mealNames,
		TotalCalories: totalCalories,
		TotalFat:      totalFat,
		TotalProtein:  totalProtein,
		TotalCarbs:    totalCarbs,
	}

	return c.JSON(http.StatusOK, respCalendarData)
}

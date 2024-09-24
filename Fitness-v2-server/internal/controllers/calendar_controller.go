package controllers

import (
	"fmt"
	"net/http"
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

	getCalendarDataByDateReq := GetCalendarDateByDateRequest{}
	if err := c.Bind(&getCalendarDataByDateReq); err != nil {
		utils.FmtLogError(
			"calendar_controller.go",
			"GetCalendarDataByDate",
			fmt.Errorf("failed to bind get calendar data by date request: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get calendar data by date, malformed request",
		})
	}

	date, err := time.Parse(time.RFC3339, getCalendarDataByDateReq.Date)
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

	getCalendarDataByDateParams := database.GetCalendarDataByDateParams{
		Date:   date,
		UserID: user.ID,
	}

	calendarData, err := config.Queries.GetCalendarDataByDate(c.Request().Context(), getCalendarDataByDateParams)
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

	respCalendarData := make([]models.CalendarData, len(calendarData))
	for i, calendarData := range calendarData {
		name := ""
		if calendarData.Valid {
			name = calendarData.String
		}
		respCalendarData[i] = models.CalendarData{
			Name: name,
		}
	}

	return c.JSON(http.StatusOK, respCalendarData)
}

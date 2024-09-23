package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/labstack/echo"
)

func GetMealsConsumedChartData(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError(
			"chart_controllers.go",
			"GetMealConsumedChartData",
			fmt.Errorf("reached create meal without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get meals consumed chart data, unauthorized",
		})
	}

	consumedMealsChartData, err := config.Queries.GetMealsConsumedChartData(c.Request().Context(), user.ID)
	if err != nil {
		utils.FmtLogError(
			"chart_controllers.go",
			"GetMealConsumedChartData",
			fmt.Errorf("failed to query for MealsConsumedChartData:, %w", err),
		)
	}

	respConsumedMealsChartData := make([]models.MealsConsumedChartData, len(consumedMealsChartData))
	for idx, consumedMealRow := range consumedMealsChartData {
		totalCalories, err := strconv.ParseFloat(consumedMealRow.TotalCalories.(string), 64)
		if err != nil {
			utils.FmtLogError(
				"chart_controllers.go",
				"GetMealConsumedChartData",
				fmt.Errorf("failed to parse totalCalories: %w", err),
			)
		}
		totalFat, err := strconv.ParseFloat(consumedMealRow.TotalFat.(string), 64)
		if err != nil {
			utils.FmtLogError(
				"chart_controllers.go",
				"GetMealConsumedChartData",
				fmt.Errorf("failed to parse totalFat: %w", err),
			)
		}
		totalProtein, err := strconv.ParseFloat(consumedMealRow.TotalProtein.(string), 64)
		if err != nil {
			utils.FmtLogError(
				"chart_controllers.go",
				"GetMealConsumedChartData",
				fmt.Errorf("failed to parse totalProtein: %w", err),
			)
		}
		totalCarbs, err := strconv.ParseFloat(consumedMealRow.TotalCarbs.(string), 64)
		if err != nil {
			utils.FmtLogError(
				"chart_controllers.go",
				"GetMealConsumedChartData",
				fmt.Errorf("failed to parse totalCarbs: %w", err),
			)
		}

		respConsumedMealsChartDataItem := models.MealsConsumedChartData{
			Date:          consumedMealRow.Date,
			TotalCalories: totalCalories,
			TotalFat:      totalFat,
			TotalProtein:  totalProtein,
			TotalCarbs:    totalCarbs,
		}
		respConsumedMealsChartData[idx] = respConsumedMealsChartDataItem
	}

	return c.JSON(http.StatusOK, respConsumedMealsChartData)
}

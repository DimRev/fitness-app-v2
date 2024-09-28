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

func GetMeasurementsChartData(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError(
			"chart_controllers.go",
			"GetMeasurementsChartData",
			fmt.Errorf("reached get measurements chart data without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get measurements chart data, unauthorized",
		})
	}

	measurementsChartData, err := config.Queries.GetMeasurementsChartData(c.Request().Context(), user.ID)
	if err != nil {
		utils.FmtLogError(
			"chart_controllers.go",
			"GetMeasurementsChartData",
			fmt.Errorf("failed to query for measurements chart data: %w", err),
		)
	}

	respMeasurementsChartData := make([]models.MeasurementsChartData, len(measurementsChartData))
	for idx, measurementRow := range measurementsChartData {
		weight, err := strconv.ParseFloat(measurementRow.Weight, 64)
		if err != nil {
			utils.FmtLogError(
				"chart_controllers.go",
				"GetMeasurementsChartData",
				fmt.Errorf("failed to parse weight: %w", err),
			)
		}
		height, err := strconv.ParseFloat(measurementRow.Height, 64)
		if err != nil {
			utils.FmtLogError(
				"chart_controllers.go",
				"GetMeasurementsChartData",
				fmt.Errorf("failed to parse height: %w", err),
			)
		}
		bmi, err := strconv.ParseFloat(measurementRow.Bmi, 64)
		if err != nil {
			utils.FmtLogError(
				"chart_controllers.go",
				"GetMeasurementsChartData",
				fmt.Errorf("failed to parse bmi: %w", err),
			)
		}

		respMeasurementsChartDataItem := models.MeasurementsChartData{
			Date:   measurementRow.Date,
			Weight: weight,
			Height: height,
			Bmi:    bmi,
		}
		respMeasurementsChartData[idx] = respMeasurementsChartDataItem
	}

	return c.JSON(http.StatusOK, respMeasurementsChartData)
}

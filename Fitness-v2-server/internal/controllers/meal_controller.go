package controllers

import (
	"strconv"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/labstack/echo"
)

type GetMealsByUserIDRequest struct {
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

func (ms *MiddlewareState) GetMealsByUserID(c echo.Context) error {
	offset := int32(0)
	limit := int32(10)
	offsetStr := c.QueryParam("offset")
	if offsetStr != "" {
		convOffset, err := strconv.Atoi(offsetStr)
		if err != nil {
			return echo.NewHTTPError(400, "invalid offset")
		}
		offset = int32(convOffset)
	}
	limitStr := c.QueryParam("limit")
	if limitStr != "" {
		convLimit, err := strconv.Atoi(limitStr)
		if err != nil {
			return echo.NewHTTPError(400, "invalid limit")
		}
		limit = int32(convLimit)
	}

	getMealsByUserIdParams := database.GetMealsByUserIDParams{
		UserID: ms.User.ID,
		Limit:  limit,
		Offset: offset,
	}

	mealWithSums, err := config.Queries.GetMealsByUserID(c.Request().Context(), getMealsByUserIdParams)
	if err != nil {
		return echo.NewHTTPError(500, "failed to get meals")
	}

	mealsWithNutrition := make([]models.MealWithNutrition, len(mealWithSums))
	for i, mealWithSum := range mealWithSums {
		mealsWithNutrition[i] = models.MealWithNutrition{
			ID:            mealWithSum.ID,
			Name:          mealWithSum.Name,
			Description:   mealWithSum.Description,
			ImageUrl:      mealWithSum.ImageUrl,
			CreatedAt:     mealWithSum.CreatedAt,
			UpdatedAt:     mealWithSum.UpdatedAt,
			UserID:        mealWithSum.UserID,
			TotalCalories: mealWithSum.TotalCalories.(int),
			TotalFat:      mealWithSum.TotalFat.(int),
			TotalProtein:  mealWithSum.TotalProtein.(int),
			TotalCarbs:    mealWithSum.TotalCarbs.(int),
		}
	}

	return c.JSON(200, mealsWithNutrition)
}

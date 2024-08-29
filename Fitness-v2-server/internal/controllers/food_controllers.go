package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/labstack/echo"
)

func GetFoodItems(c echo.Context) error {
	_, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached create Meal without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	offset := int32(0)
	limit := int32(10)
	offsetStr := c.QueryParam("offset")
	if offsetStr != "" {
		convOffset, err := strconv.Atoi(offsetStr)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid offset")
		}
		offset = int32(convOffset)
	}
	limitStr := c.QueryParam("limit")
	if limitStr != "" {
		convLimit, err := strconv.Atoi(limitStr)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid limit")
		}
		limit = int32(convLimit)
	}

	getFoodParams := database.GetFoodsParams{
		Limit:  limit,
		Offset: offset,
	}

	foods, err := config.Queries.GetFoods(c.Request().Context(), getFoodParams)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get foods")
	}

	foodItemsResp := make([]models.FoodItem, len(foods))
	for i, food := range foods {
		var description *string
		var imageUrl *string
		if food.Description.Valid {
			description = &food.Description.String
		}
		if food.ImageUrl.Valid {
			imageUrl = &food.ImageUrl.String
		}

		foodItemsResp[i] = models.FoodItem{
			ID:          food.ID,
			Name:        food.Name,
			Description: description,
			ImageUrl:    imageUrl,
			FoodType:    food.FoodType,
			Calories:    food.Calories,
			Fat:         food.Fat,
			Protein:     food.Protein,
			Carbs:       food.Carbs,
			CreatedAt:   food.CreatedAt.Time,
			UpdatedAt:   food.UpdatedAt.Time,
		}
	}

	return c.JSON(http.StatusOK, foodItemsResp)
}

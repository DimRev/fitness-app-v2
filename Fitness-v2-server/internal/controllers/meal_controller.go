package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/google/uuid"
	"github.com/labstack/echo"
)

type CreateMealRequest struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
	ImageUrl    *string `json:"image_url"`
	FoodItems   []struct {
		FoodItemID uuid.UUID `json:"food_item_id"`
		Amount     int       `json:"amount"`
	}
}

func CreateMeal(c echo.Context) error {
	createMealReq := CreateMealRequest{}
	if err := c.Bind(&createMealReq); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	user, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached create Meal without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	createMealWithFoodItemsParams := database.CreateMealWithFoodItemsParams{
		Name:        createMealReq.Name,
		Description: sql.NullString{String: *createMealReq.Description, Valid: createMealReq.Description != nil},
		ImageUrl:    sql.NullString{String: *createMealReq.ImageUrl, Valid: createMealReq.ImageUrl != nil},
		UserID:      user.ID,
		Column5:     []uuid.UUID{},
		Column6:     []int32{},
	}

	for _, foodItem := range createMealReq.FoodItems {
		createMealWithFoodItemsParams.Column5 = append(createMealWithFoodItemsParams.Column5, foodItem.FoodItemID)
		createMealWithFoodItemsParams.Column6 = append(createMealWithFoodItemsParams.Column6, int32(foodItem.Amount))
	}

	mealWithFoodItems, err := config.Queries.CreateMealWithFoodItems(c.Request().Context(), createMealWithFoodItemsParams)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to create meal")
	}

	var foodItems []models.FoodItem
	if err := json.Unmarshal(mealWithFoodItems.Foods, &foodItems); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse food items")
	}

	mealWithFoodItemsResp := models.MealWithFoodItems{
		Meal: models.Meal{
			ID:          mealWithFoodItems.MealID,
			Name:        mealWithFoodItems.Name,
			Description: mealWithFoodItems.Description,
			ImageUrl:    mealWithFoodItems.ImageUrl,
			CreatedAt:   mealWithFoodItems.CreatedAt,
			UpdatedAt:   mealWithFoodItems.UpdatedAt,
			UserID:      mealWithFoodItems.UserID,
		},
		FoodItems: foodItems,
	}

	return c.JSON(200, mealWithFoodItemsResp)
}

type GetMealsByUserIDRequest struct {
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

func GetMealsByUserID(c echo.Context) error {
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

	user, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached create Meal without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	getMealsByUserIdParams := database.GetMealsByUserIDParams{
		UserID: user.ID,
		Limit:  limit,
		Offset: offset,
	}

	mealWithSums, err := config.Queries.GetMealsByUserID(c.Request().Context(), getMealsByUserIdParams)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get meals")
	}

	mealsWithNutrition := make([]models.MealWithNutrition, len(mealWithSums))
	for i, mealWithSum := range mealWithSums {
		mealsWithNutrition[i] = models.MealWithNutrition{
			Meal: models.Meal{
				ID:          mealWithSum.ID,
				Name:        mealWithSum.Name,
				Description: mealWithSum.Description,
				ImageUrl:    mealWithSum.ImageUrl,
				CreatedAt:   mealWithSum.CreatedAt,
				UpdatedAt:   mealWithSum.UpdatedAt,
				UserID:      mealWithSum.UserID,
			},
			TotalCalories: mealWithSum.TotalCalories.(float64),
			TotalFat:      mealWithSum.TotalFat.(float64),
			TotalProtein:  mealWithSum.TotalProtein.(float64),
			TotalCarbs:    mealWithSum.TotalCarbs.(float64),
		}
	}

	return c.JSON(http.StatusOK, mealsWithNutrition)
}

func GetMealByID(c echo.Context) error {
	mealID, err := uuid.Parse(c.Param("meal_id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid meal id")
	}

	_, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached create Meal without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	meal, err := config.Queries.GetMealByID(c.Request().Context(), mealID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "failed to get meal")
	}

	respMeal := models.MealWithNutrition{
		Meal: models.Meal{
			ID:          meal.ID,
			Name:        meal.Name,
			Description: meal.Description,
			ImageUrl:    meal.ImageUrl,
			CreatedAt:   meal.CreatedAt,
			UpdatedAt:   meal.UpdatedAt,
			UserID:      meal.UserID,
		},
		TotalCalories: meal.TotalCalories.(float64),
		TotalFat:      meal.TotalFat.(float64),
		TotalProtein:  meal.TotalProtein.(float64),
		TotalCarbs:    meal.TotalCarbs.(float64),
	}

	return c.JSON(http.StatusOK, respMeal)
}

type UpdateMealRequest struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
	ImageUrl    *string `json:"image_url"`
	FoodItems   []struct {
		FoodItemID uuid.UUID `json:"food_item_id"`
		Amount     int       `json:"amount"`
	}
}

func UpdateMeal(c echo.Context) error {
	mealID, err := uuid.Parse(c.Param("meal_id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid meal id")
	}

	_, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached create Meal without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	updateMealReq := UpdateMealRequest{}
	if err := c.Bind(&updateMealReq); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	updateMealWithFoodItemsParams := database.UpdateMealWithFoodItemsParams{
		ID:          mealID,
		Name:        updateMealReq.Name,
		Description: sql.NullString{String: *updateMealReq.Description, Valid: updateMealReq.Description != nil},
		ImageUrl:    sql.NullString{String: *updateMealReq.ImageUrl, Valid: updateMealReq.ImageUrl != nil},
		Column5:     []uuid.UUID{},
		Column6:     []int32{},
	}

	for _, foodItem := range updateMealReq.FoodItems {
		updateMealWithFoodItemsParams.Column5 = append(updateMealWithFoodItemsParams.Column5, foodItem.FoodItemID)
		updateMealWithFoodItemsParams.Column6 = append(updateMealWithFoodItemsParams.Column6, int32(foodItem.Amount))
	}

	mealWithFoodItems, err := config.Queries.UpdateMealWithFoodItems(c.Request().Context(), updateMealWithFoodItemsParams)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to update meal")
	}

	var foodItems []models.FoodItem
	if err := json.Unmarshal(mealWithFoodItems.Foods, &foodItems); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse food items")
	}

	mealWithFoodItemsResp := models.MealWithFoodItems{
		Meal: models.Meal{
			ID:          mealWithFoodItems.MealID,
			Name:        mealWithFoodItems.Name,
			Description: mealWithFoodItems.Description,
			ImageUrl:    mealWithFoodItems.ImageUrl,
			CreatedAt:   mealWithFoodItems.CreatedAt,
			UpdatedAt:   mealWithFoodItems.UpdatedAt,
			UserID:      mealWithFoodItems.UserID,
		},
		FoodItems: foodItems,
	}

	return c.JSON(http.StatusOK, mealWithFoodItemsResp)
}

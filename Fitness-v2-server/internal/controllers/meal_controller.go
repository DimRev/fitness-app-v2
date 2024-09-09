package controllers

import (
	"database/sql"
	"log"
	"math"
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
	} `json:"food_items"`
}

func CreateMeal(c echo.Context) error {
	createMealReq := CreateMealRequest{}
	if err := c.Bind(&createMealReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	user, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached create meal without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	var description sql.NullString
	var imageUrl sql.NullString
	if createMealReq.Description != nil {
		description = sql.NullString{String: *createMealReq.Description, Valid: createMealReq.Description != nil}
	}
	if createMealReq.ImageUrl != nil {
		imageUrl = sql.NullString{String: *createMealReq.ImageUrl, Valid: createMealReq.ImageUrl != nil}
	}

	// Step 1: Insert the meal
	meal, err := config.Queries.InsertMeal(c.Request().Context(), database.InsertMealParams{
		Name:        createMealReq.Name,
		Description: description,
		ImageUrl:    imageUrl,
		UserID:      user.ID,
	})
	if err != nil {
		log.Println("Failed to create meal: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to create meal")
	}

	// Step 2: Insert food items into rel_meal_food
	foodItemIDs := make([]uuid.UUID, 0)
	amounts := make([]int32, 0)
	for _, foodItem := range createMealReq.FoodItems {
		foodItemIDs = append(foodItemIDs, foodItem.FoodItemID)
		amounts = append(amounts, int32(foodItem.Amount))
	}

	err = config.Queries.InsertMealFoodItems(c.Request().Context(), database.InsertMealFoodItemsParams{
		MealID:  meal.ID,
		Column2: foodItemIDs, // FoodItemIDs array
		UserID:  user.ID,
		Column4: amounts, // Amounts array
	})
	if err != nil {
		log.Println("Failed to insert food items for meal: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to add food items to meal")
	}

	// Step 3: Retrieve the meal with the summed food item nutritional values
	mealWithNutrients, err := config.Queries.GetMealByID(c.Request().Context(), meal.ID)
	if err != nil {
		log.Println("Failed to retrieve meal with food items: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to retrieve meal with food items")
	}
	totalCalories, err := strconv.ParseFloat(mealWithNutrients.TotalCalories.(string), 64)
	if err != nil {
		log.Println("Failed to parse total calories: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total calories")
	}
	totalFat, err := strconv.ParseFloat(mealWithNutrients.TotalFat.(string), 64)
	if err != nil {
		log.Println("Failed to parse total fat: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total fat")
	}
	totalProtein, err := strconv.ParseFloat(mealWithNutrients.TotalProtein.(string), 64)
	if err != nil {
		log.Println("Failed to parse total protein: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total protein")
	}
	totalCarbs, err := strconv.ParseFloat(mealWithNutrients.TotalCarbs.(string), 64)
	if err != nil {
		log.Println("Failed to parse total carbs: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total carbs")
	}

	var descriptionResp *string
	if mealWithNutrients.Description.Valid {
		descriptionResp = &mealWithNutrients.Description.String
	}
	var imageUrlResp *string
	if mealWithNutrients.ImageUrl.Valid {
		imageUrlResp = &mealWithNutrients.ImageUrl.String
	}
	// Step 4: Return the response

	respMeal := models.MealWithNutrition{
		Meal: models.Meal{
			ID:          mealWithNutrients.ID,
			Name:        mealWithNutrients.Name,
			Description: descriptionResp,
			ImageUrl:    imageUrlResp,
			CreatedAt:   mealWithNutrients.CreatedAt.Time,
			UpdatedAt:   mealWithNutrients.UpdatedAt.Time,
			UserID:      mealWithNutrients.UserID,
		},
		TotalCalories: totalCalories,
		TotalFat:      totalFat,
		TotalProtein:  totalProtein,
		TotalCarbs:    totalCarbs,
	}

	return c.JSON(http.StatusOK, respMeal)
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

	if err := config.DB.Ping(); err != nil {
		log.Println("Connection to database failed: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to get meals",
		})
	}

	mealsWithNut, err := config.Queries.GetMealsByUserID(c.Request().Context(), getMealsByUserIdParams)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get meals")
	}

	totalRows, err := config.Queries.GetMealsCountByUserID(c.Request().Context(), user.ID)
	if err != nil {
		log.Println("Failed to get meals count: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to get meals count",
		})
	}

	mealsWithNutrition := make([]models.MealWithNutrition, len(mealsWithNut))
	for i, mealWithNut := range mealsWithNut {
		totalCalories, err := strconv.ParseFloat(mealWithNut.TotalCalories.(string), 64)
		if err != nil {
			log.Println("Failed to parse total calories: ", err)
			return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total calories")
		}
		totalFat, err := strconv.ParseFloat(mealWithNut.TotalFat.(string), 64)
		if err != nil {
			log.Println("Failed to parse total fat: ", err)
			return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total fat")
		}
		totalProtein, err := strconv.ParseFloat(mealWithNut.TotalProtein.(string), 64)
		if err != nil {
			log.Println("Failed to parse total protein: ", err)
			return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total protein")
		}
		totalCarbs, err := strconv.ParseFloat(mealWithNut.TotalCarbs.(string), 64)
		if err != nil {
			log.Println("Failed to parse total carbs: ", err)
			return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total carbs")
		}

		var descriptionResp *string
		if mealWithNut.Description.Valid {
			descriptionResp = &mealWithNut.Description.String
		}
		var imageUrlResp *string
		if mealWithNut.ImageUrl.Valid {
			imageUrlResp = &mealWithNut.ImageUrl.String
		}

		mealsWithNutrition[i] = models.MealWithNutrition{
			Meal: models.Meal{
				ID:          mealWithNut.ID,
				Name:        mealWithNut.Name,
				Description: descriptionResp,
				ImageUrl:    imageUrlResp,
				CreatedAt:   mealWithNut.CreatedAt.Time,
				UpdatedAt:   mealWithNut.UpdatedAt.Time,
				UserID:      mealWithNut.UserID,
			},
			TotalCalories: totalCalories,
			TotalFat:      totalFat,
			TotalProtein:  totalProtein,
			TotalCarbs:    totalCarbs,
		}
	}

	respMealsWithNutationTotalPages := models.MealWithNutritionWithPages{
		Meals:      mealsWithNutrition,
		TotalPages: int64(math.Ceil(float64(totalRows) / float64(limit))),
	}

	return c.JSON(http.StatusOK, respMealsWithNutationTotalPages)
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

	mealWithNut, err := config.Queries.GetMealByID(c.Request().Context(), mealID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "failed to get meal")
	}

	totalCalories, err := strconv.ParseFloat(mealWithNut.TotalCalories.(string), 64)
	if err != nil {
		log.Println("Failed to parse total calories: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total calories")
	}
	totalFat, err := strconv.ParseFloat(mealWithNut.TotalFat.(string), 64)
	if err != nil {
		log.Println("Failed to parse total fat: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total fat")
	}
	totalProtein, err := strconv.ParseFloat(mealWithNut.TotalProtein.(string), 64)
	if err != nil {
		log.Println("Failed to parse total protein: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total protein")
	}
	totalCarbs, err := strconv.ParseFloat(mealWithNut.TotalCarbs.(string), 64)
	if err != nil {
		log.Println("Failed to parse total carbs: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to parse total carbs")
	}

	var descriptionResp *string
	if mealWithNut.Description.Valid {
		descriptionResp = &mealWithNut.Description.String
	}
	var imageUrlResp *string
	if mealWithNut.ImageUrl.Valid {
		imageUrlResp = &mealWithNut.ImageUrl.String
	}

	respMeal := models.MealWithNutrition{
		Meal: models.Meal{
			ID:          mealWithNut.ID,
			Name:        mealWithNut.Name,
			Description: descriptionResp,
			ImageUrl:    imageUrlResp,
			CreatedAt:   mealWithNut.CreatedAt.Time,
			UpdatedAt:   mealWithNut.UpdatedAt.Time,
			UserID:      mealWithNut.UserID,
		},
		TotalCalories: totalCalories,
		TotalFat:      totalFat,
		TotalProtein:  totalProtein,
		TotalCarbs:    totalCarbs,
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

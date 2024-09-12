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
	"github.com/DimRev/Fitness-v2-server/internal/utils"
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

	foodItemIDs := make([]uuid.UUID, 0)
	amounts := make([]int32, 0)
	for _, foodItem := range createMealReq.FoodItems {
		foodItemAmountI32, err := utils.SafeParseIntToInt32(foodItem.Amount, 1, math.MaxInt32)
		if err != nil {
			log.Println("Failed to parse food item amount: ", err)
			return echo.NewHTTPError(http.StatusBadRequest, "invalid food item amount")
		}

		foodItemIDs = append(foodItemIDs, foodItem.FoodItemID)
		amounts = append(amounts, foodItemAmountI32)
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
	Limit      int     `json:"limit"`
	Offset     int     `json:"offset"`
	TextFilter *string `json:"text_filter"`
}

func GetMealsByUserID(c echo.Context) error {
	offset := int32(0)
	limit := int32(10)
	textFilter := ""
	if offsetStr := c.QueryParam("offset"); offsetStr != "" {
		convOffset, err := utils.SafeParseStrToInt32(offsetStr, 0, math.MaxInt32)
		if err != nil {
			log.Println("Failed to parse offset: ", err)
			return echo.NewHTTPError(http.StatusBadRequest, "invalid offset")
		}
		offset = int32(convOffset)
	}
	if limitStr := c.QueryParam("limit"); limitStr != "" {
		convLimit, err := utils.SafeParseStrToInt32(limitStr, 1, 100)
		if err != nil {
			log.Println("Failed to parse limit: ", err)
			return echo.NewHTTPError(http.StatusBadRequest, "invalid limit")
		}
		limit = int32(convLimit)
	}
	if textFilterStr := c.QueryParam("text_filter"); textFilterStr != "" {
		textFilter = textFilterStr
	}

	user, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached create Meal without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	if err := config.DB.Ping(); err != nil {
		log.Println("Connection to database failed: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to get meals",
		})
	}

	if textFilter == "" {
		getMealsByUserIdParams := database.GetMealsByUserIDParams{
			UserID: user.ID,
			Limit:  limit,
			Offset: offset,
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
	} else {
		textFilterNullString := sql.NullString{String: textFilter, Valid: true}

		getMealsByUserIDWithTextFilterParams := database.GetMealsByUserIDWithTextFilterParams{
			UserID:  user.ID,
			Limit:   limit,
			Offset:  offset,
			Column2: textFilterNullString,
		}

		mealsWithNut, err := config.Queries.GetMealsByUserIDWithTextFilter(c.Request().Context(), getMealsByUserIDWithTextFilterParams)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "failed to get meals")
		}

		getMealsCountByUserIDWithTextFilter := database.GetMealsCountByUserIDWithTextFilterParams{
			UserID:  user.ID,
			Column2: textFilterNullString,
		}

		totalRows, err := config.Queries.GetMealsCountByUserIDWithTextFilter(c.Request().Context(), getMealsCountByUserIDWithTextFilter)
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

	getFoodItemsByMealIDParams := database.GetFoodItemsByMealIDParams{
		MealID: mealWithNut.ID,
		UserID: mealWithNut.UserID,
	}

	foodItems, err := config.Queries.GetFoodItemsByMealID(c.Request().Context(), getFoodItemsByMealIDParams)
	if err != nil {
		log.Println("Failed to get food items by meal id: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to get food items by meal id",
		})
	}

	respFoodItems := make([]models.FoodItemWithAmount, len(foodItems))
	for i, foodItem := range foodItems {
		var descriptionResp *string
		if foodItem.Description.Valid {
			descriptionResp = &foodItem.Description.String
		}
		var imageUrlResp *string
		if foodItem.ImageUrl.Valid {
			imageUrlResp = &foodItem.ImageUrl.String
		}

		respFoodItems[i] = models.FoodItemWithAmount{
			FoodItem: models.FoodItem{
				ID:          foodItem.ID.UUID,
				Name:        foodItem.Name.String,
				Description: descriptionResp,
				ImageUrl:    imageUrlResp,
				FoodType:    foodItem.FoodType.FoodItemType,
				Calories:    foodItem.Calories.String,
				Fat:         foodItem.Fat.String,
				Protein:     foodItem.Protein.String,
				Carbs:       foodItem.Carbs.String,
				CreatedAt:   foodItem.CreatedAt.Time,
				UpdatedAt:   foodItem.UpdatedAt.Time,
			},
			Amount: int(foodItem.Amount.Int32),
		}
	}

	mealWithNutrition := models.MealWithNutrition{
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

	respMeal := models.MealWithNutritionAndFoodItems{
		Meal:      mealWithNutrition,
		FoodItems: respFoodItems,
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
	} `json:"food_items"`
}

func UpdateMeal(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached update meal without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	updateMealReq := UpdateMealRequest{}
	if err := c.Bind(&updateMealReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	mealId, err := uuid.Parse(c.Param("meal_id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid meal id")
	}

	if err := config.DB.Ping(); err != nil {
		log.Println("Connection to database failed: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to update meal",
		})
	}

	deleteFoodItemsByMealIdParams := database.DeleteFoodItemsByMealIDParams{
		MealID: mealId,
		UserID: user.ID,
	}

	err = config.Queries.DeleteFoodItemsByMealID(c.Request().Context(), deleteFoodItemsByMealIdParams)
	if err != nil {
		log.Println("Failed to delete food items by meal id: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to delete food items by meal id",
		})
	}

	var description sql.NullString
	if updateMealReq.Description != nil {
		description = sql.NullString{String: *updateMealReq.Description, Valid: updateMealReq.Description != nil}
	}
	var imageUrl sql.NullString
	if updateMealReq.ImageUrl != nil {
		imageUrl = sql.NullString{String: *updateMealReq.ImageUrl, Valid: updateMealReq.ImageUrl != nil}
	}

	updateMealParams := database.UpdateMealParams{
		ID:          mealId,
		Name:        updateMealReq.Name,
		Description: description,
		ImageUrl:    imageUrl,
	}

	meal, err := config.Queries.UpdateMeal(c.Request().Context(), updateMealParams)
	if err != nil {
		log.Println("Failed to update meal: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to update meal")
	}

	foodItemIDs := make([]uuid.UUID, 0)
	amounts := make([]int32, 0)
	for _, foodItem := range updateMealReq.FoodItems {
		foodItemAmountI32, err := utils.SafeParseIntToInt32(foodItem.Amount, 1, math.MaxInt32)
		if err != nil {
			log.Println("Failed to parse food item amount: ", err)
			return echo.NewHTTPError(http.StatusBadRequest, "invalid food item amount")
		}

		foodItemIDs = append(foodItemIDs, foodItem.FoodItemID)
		amounts = append(amounts, foodItemAmountI32)
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

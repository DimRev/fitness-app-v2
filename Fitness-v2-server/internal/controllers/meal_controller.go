package controllers

import (
	"database/sql"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"time"

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
		utils.FmtLogMsg(
			"meal_controller.go",
			"CreateMeal",
			fmt.Errorf("failed to bind create meal request: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create meal, malformed request",
		})
	}

	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogMsg(
			"meal_controller.go",
			"CreateMeal",
			fmt.Errorf("reached create meal without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to create meal, unauthorized",
		})
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
		utils.FmtLogMsg(
			"meal_controller.go",
			"CreateMeal",
			fmt.Errorf("failed to create meal: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create meal, trouble with server",
		})
	}

	foodItemIDs := make([]uuid.UUID, 0)
	amounts := make([]int32, 0)
	for _, foodItem := range createMealReq.FoodItems {
		foodItemAmountI32, err := utils.SafeParseIntToInt32(foodItem.Amount, 1, math.MaxInt32)
		if err != nil {
			utils.FmtLogMsg(
				"meal_controller.go",
				"CreateMeal",
				fmt.Errorf("failed to parse food item amount: %s", err),
			)
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to create meal, invalid food item amount",
			})
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
		utils.FmtLogMsg(
			"meal_controller.go",
			"CreateMeal",
			fmt.Errorf("failed to insert food items for meal: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create meal, trouble with server",
		})
	}

	mealWithNutrients, err := config.Queries.GetMealByID(c.Request().Context(), meal.ID)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"CreateMeal",
			fmt.Errorf("failed to retrieve meal with food items: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create meal, trouble with server",
		})
	}
	totalCalories, err := strconv.ParseFloat(mealWithNutrients.TotalCalories.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"CreateMeal",
			fmt.Errorf("failed to parse total calories: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create meal, trouble with server",
		})
	}
	totalFat, err := strconv.ParseFloat(mealWithNutrients.TotalFat.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"CreateMeal",
			fmt.Errorf("failed to parse total fat: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create meal, trouble with server",
		})
	}
	totalProtein, err := strconv.ParseFloat(mealWithNutrients.TotalProtein.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"CreateMeal",
			fmt.Errorf("failed to parse total protein: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create meal, trouble with server",
		})
	}
	totalCarbs, err := strconv.ParseFloat(mealWithNutrients.TotalCarbs.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"CreateMeal",
			fmt.Errorf("failed to parse total carbs: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create meal, trouble with server",
		})
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
			utils.FmtLogMsg(
				"meal_controller.go",
				"GetMealsByUserID",
				fmt.Errorf("failed to parse offset: %s", err),
			)
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to get meals, invalid offset",
			})
		}
		offset = int32(convOffset)
	}
	if limitStr := c.QueryParam("limit"); limitStr != "" {
		convLimit, err := utils.SafeParseStrToInt32(limitStr, 1, 100)
		if err != nil {
			utils.FmtLogMsg(
				"meal_controller.go",
				"GetMealsByUserID",
				fmt.Errorf("failed to parse limit: %s", err),
			)
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to get meals, invalid limit",
			})
		}
		limit = int32(convLimit)
	}
	if textFilterStr := c.QueryParam("text_filter"); textFilterStr != "" {
		textFilter = textFilterStr
	}

	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetMealsByUserID",
			fmt.Errorf("reached get meals by user id without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get meals, unauthorized",
		})
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetMealsByUserID",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get meals, trouble with server",
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
			utils.FmtLogMsg(
				"meal_controller.go",
				"GetMealsByUserID",
				fmt.Errorf("failed to get meals: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get meals, trouble with server",
			})
		}

		totalRows, err := config.Queries.GetMealsCountByUserID(c.Request().Context(), user.ID)
		if err != nil {
			utils.FmtLogMsg(
				"meal_controller.go",
				"GetMealsByUserID",
				fmt.Errorf("failed to get meals count: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get meals, trouble with server",
			})
		}

		mealsWithNutrition := make([]models.MealWithNutrition, len(mealsWithNut))
		for i, mealWithNut := range mealsWithNut {
			totalCalories, err := strconv.ParseFloat(mealWithNut.TotalCalories.(string), 64)
			if err != nil {
				utils.FmtLogMsg(
					"meal_controller.go",
					"GetMealsByUserID",
					fmt.Errorf("failed to parse total calories: %s", err),
				)
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to get meals, trouble with server",
				})
			}
			totalFat, err := strconv.ParseFloat(mealWithNut.TotalFat.(string), 64)
			if err != nil {
				utils.FmtLogMsg(
					"meal_controller.go",
					"GetMealsByUserID",
					fmt.Errorf("failed to parse total fat: %s", err),
				)
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to get meals, trouble with server",
				})
			}
			totalProtein, err := strconv.ParseFloat(mealWithNut.TotalProtein.(string), 64)
			if err != nil {
				utils.FmtLogMsg(
					"meal_controller.go",
					"GetMealsByUserID",
					fmt.Errorf("failed to parse total protein: %s", err),
				)
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to get meals, trouble with server",
				})
			}
			totalCarbs, err := strconv.ParseFloat(mealWithNut.TotalCarbs.(string), 64)
			if err != nil {
				utils.FmtLogMsg(
					"meal_controller.go",
					"GetMealsByUserID",
					fmt.Errorf("failed to parse total carbs: %s", err),
				)
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to get meals, trouble with server",
				})
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
			utils.FmtLogMsg(
				"meal_controller.go",
				"GetMealsByUserID",
				fmt.Errorf("failed to get meals: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get meals, trouble with server",
			})
		}

		getMealsCountByUserIDWithTextFilter := database.GetMealsCountByUserIDWithTextFilterParams{
			UserID:  user.ID,
			Column2: textFilterNullString,
		}

		totalRows, err := config.Queries.GetMealsCountByUserIDWithTextFilter(c.Request().Context(), getMealsCountByUserIDWithTextFilter)
		if err != nil {
			utils.FmtLogMsg(
				"meal_controller.go",
				"GetMealsByUserID",
				fmt.Errorf("failed to get meals count: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get meals, trouble with server",
			})
		}

		mealsWithNutrition := make([]models.MealWithNutrition, len(mealsWithNut))
		for i, mealWithNut := range mealsWithNut {
			totalCalories, err := strconv.ParseFloat(mealWithNut.TotalCalories.(string), 64)
			if err != nil {
				utils.FmtLogMsg(
					"meal_controller.go",
					"GetMealsByUserID",
					fmt.Errorf("failed to parse total calories: %s", err),
				)
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to get meals, trouble with server",
				})
			}
			totalFat, err := strconv.ParseFloat(mealWithNut.TotalFat.(string), 64)
			if err != nil {
				utils.FmtLogMsg(
					"meal_controller.go",
					"GetMealsByUserID",
					fmt.Errorf("failed to parse total fat: %s", err),
				)
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to get meals, trouble with server",
				})
			}
			totalProtein, err := strconv.ParseFloat(mealWithNut.TotalProtein.(string), 64)
			if err != nil {
				utils.FmtLogMsg(
					"meal_controller.go",
					"GetMealsByUserID",
					fmt.Errorf("failed to parse total protein: %s", err),
				)
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to get meals, trouble with server",
				})
			}
			totalCarbs, err := strconv.ParseFloat(mealWithNut.TotalCarbs.(string), 64)
			if err != nil {
				utils.FmtLogMsg(
					"meal_controller.go",
					"GetMealsByUserID",
					fmt.Errorf("failed to parse total carbs: %s", err),
				)
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to get meals, trouble with server",
				})
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
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetMealByID",
			fmt.Errorf("failed to parse meal id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get meal, invalid meal id",
		})
	}

	_, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetMealByID",
			fmt.Errorf("reached get meal by id without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get meal, unauthorized",
		})
	}

	mealWithNut, err := config.Queries.GetMealByID(c.Request().Context(), mealID)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetMealByID",
			fmt.Errorf("failed to get meal: %s", err),
		)
		return echo.NewHTTPError(http.StatusNotFound, map[string]string{
			"message": "Failed to get meal, trouble with server",
		})
	}

	totalCalories, err := strconv.ParseFloat(mealWithNut.TotalCalories.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetMealByID",
			fmt.Errorf("failed to parse total calories: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get meal, trouble with server",
		})
	}
	totalFat, err := strconv.ParseFloat(mealWithNut.TotalFat.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetMealByID",
			fmt.Errorf("failed to parse total fat: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get meal, trouble with server",
		})
	}
	totalProtein, err := strconv.ParseFloat(mealWithNut.TotalProtein.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetMealByID",
			fmt.Errorf("failed to parse total protein: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get meal, trouble with server",
		})
	}
	totalCarbs, err := strconv.ParseFloat(mealWithNut.TotalCarbs.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetMealByID",
			fmt.Errorf("failed to parse total carbs: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get meal, trouble with server",
		})
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
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetMealByID",
			fmt.Errorf("failed to get food items by meal id: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get meal, trouble with server",
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
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("reached update meal without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to update meal, unauthorized",
		})
	}

	updateMealReq := UpdateMealRequest{}
	if err := c.Bind(&updateMealReq); err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("failed to bind update meal request: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update meal, malformed request",
		})
	}

	mealId, err := uuid.Parse(c.Param("meal_id"))
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("failed to parse meal id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update meal, invalid meal id",
		})
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update meal, trouble with server",
		})
	}

	deleteFoodItemsByMealIdParams := database.DeleteFoodItemsByMealIDParams{
		MealID: mealId,
		UserID: user.ID,
	}

	err = config.Queries.DeleteFoodItemsByMealID(c.Request().Context(), deleteFoodItemsByMealIdParams)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("failed to delete food items by meal id: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update meal, trouble with server",
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
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("failed to update meal: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update meal, trouble with server",
		})
	}

	foodItemIDs := make([]uuid.UUID, 0)
	amounts := make([]int32, 0)
	for _, foodItem := range updateMealReq.FoodItems {
		foodItemAmountI32, err := utils.SafeParseIntToInt32(foodItem.Amount, 1, math.MaxInt32)
		if err != nil {
			utils.FmtLogMsg(
				"meal_controller.go",
				"UpdateMeal",
				fmt.Errorf("failed to parse food item amount: %s", err),
			)
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to update meal, invalid food item amount",
			})
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
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("failed to insert food items for meal: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update meal, trouble with server",
		})
	}

	mealWithNutrients, err := config.Queries.GetMealByID(c.Request().Context(), meal.ID)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("failed to retrieve meal with food items: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update meal, trouble with server",
		})
	}
	totalCalories, err := strconv.ParseFloat(mealWithNutrients.TotalCalories.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("failed to parse total calories: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update meal, trouble with server",
		})
	}
	totalFat, err := strconv.ParseFloat(mealWithNutrients.TotalFat.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("failed to parse total fat: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update meal, trouble with server",
		})
	}
	totalProtein, err := strconv.ParseFloat(mealWithNutrients.TotalProtein.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("failed to parse total protein: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update meal, trouble with server",
		})
	}
	totalCarbs, err := strconv.ParseFloat(mealWithNutrients.TotalCarbs.(string), 64)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"UpdateMeal",
			fmt.Errorf("failed to parse total carbs: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update meal, trouble with server",
		})
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

type ConsumeMealRequest struct {
	MealID string `json:"meal_id"`
	Date   string `json:"date"`
}

func ConsumeMeal(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogMsg(
			"meal_controller.go",
			"ConsumeMeal",
			fmt.Errorf("reached consume meal without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to consume meal, unauthorized",
		})
	}

	consumeMealReq := ConsumeMealRequest{}
	if err := c.Bind(&consumeMealReq); err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"ConsumeMeal",
			fmt.Errorf("failed to bind consume meal request: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to consume meal, malformed request",
		})
	}

	mealId, err := uuid.Parse(consumeMealReq.MealID)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"ConsumeMeal",
			fmt.Errorf("failed to parse meal id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to consume meal, invalid meal id",
		})
	}

	date, err := time.Parse("2006-01-02", consumeMealReq.Date)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"ConsumeMeal",
			fmt.Errorf("failed to parse date: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to consume meal, invalid date",
		})
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"ConsumeMeal",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to consume meal, trouble with server",
		})
	}

	consumeMealParams := database.ConsumeMealParams{
		UserID: user.ID,
		MealID: mealId,
		Date:   date,
	}

	consumedMeal, err := config.Queries.ConsumeMeal(c.Request().Context(), consumeMealParams)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"ConsumeMeal",
			fmt.Errorf("failed to consume meal: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to consume meal, trouble with server",
		})
	}

	consumedMealResp := models.ConsumedMeal{
		ID:        consumedMeal.ID.String(),
		UserID:    consumedMeal.UserID.String(),
		MealID:    consumedMeal.MealID.String(),
		Date:      consumedMeal.Date,
		CreatedAt: consumedMeal.CreatedAt,
		UpdatedAt: consumedMeal.UpdatedAt,
	}

	return c.JSON(http.StatusOK, consumedMealResp)
}

func GetConsumedMealsByMealID(c echo.Context) error {
	_, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogMsg(
			"meal_controller.go",
			"ConsumeMeal",
			fmt.Errorf("reached consume meal without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to consume meal, unauthorized",
		})
	}

	mealID, err := uuid.Parse(c.Param("meal_id"))
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetConsumedMealsByMealID",
			fmt.Errorf("failed to parse meal id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get consumed meals, invalid meal id",
		})
	}

	consumedMeals, err := config.Queries.GetConsumedMealsByMealID(c.Request().Context(), mealID)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetConsumedMealsByMealID",
			fmt.Errorf("failed to get consumed meals by meal id: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get consumed meals, trouble with server",
		})
	}

	mealConsumed := make([]models.ConsumedMeal, len(consumedMeals))
	for i, consumedMeal := range consumedMeals {
		mealConsumed[i] = models.ConsumedMeal{
			ID:        consumedMeal.ID.String(),
			UserID:    consumedMeal.UserID.String(),
			MealID:    consumedMeal.MealID.String(),
			Date:      consumedMeal.Date,
			CreatedAt: consumedMeal.CreatedAt,
			UpdatedAt: consumedMeal.UpdatedAt,
		}
	}

	return c.JSON(http.StatusOK, mealConsumed)
}

type GetConsumedMealsByDateRequest struct {
	Date string `json:"date"`
}

func GetConsumedMealsByDate(c echo.Context) error {
	_, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogMsg(
			"meal_controller.go",
			"ConsumeMeal",
			fmt.Errorf("reached consume meal without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to consume meal, unauthorized",
		})
	}

	consumeMealReq := GetConsumedMealsByDateRequest{}
	if err := c.Bind(&consumeMealReq); err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetConsumedMealsByDate",
			fmt.Errorf("failed to bind get consumed meals by date request: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get consumed meals, malformed request",
		})
	}

	date, err := time.Parse("2006-01-02", consumeMealReq.Date)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetConsumedMealsByDate",
			fmt.Errorf("failed to parse date: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get consumed meals, invalid date",
		})
	}

	consumedMeals, err := config.Queries.GetConsumedMealsByDate(c.Request().Context(), date)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"GetConsumedMealsByDate",
			fmt.Errorf("failed to get consumed meals by date: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get consumed meals, trouble with server",
		})
	}

	mealConsumed := make([]models.ConsumedMeal, len(consumedMeals))
	for i, consumedMeal := range consumedMeals {
		mealConsumed[i] = models.ConsumedMeal{
			ID:        consumedMeal.ID.String(),
			UserID:    consumedMeal.UserID.String(),
			MealID:    consumedMeal.MealID.String(),
			Date:      consumedMeal.Date,
			CreatedAt: consumedMeal.CreatedAt,
			UpdatedAt: consumedMeal.UpdatedAt,
		}
	}

	return c.JSON(http.StatusOK, mealConsumed)
}

func RemoveConsumedMeal(c echo.Context) error {
	_, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogMsg(
			"meal_controller.go",
			"ConsumeMeal",
			fmt.Errorf("reached consume meal without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to consume meal, unauthorized",
		})
	}

	mealID, err := uuid.Parse(c.Param("meal_id"))
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"RemoveConsumedMeal",
			fmt.Errorf("failed to parse meal id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to remove consumed meal, invalid meal id",
		})
	}

	err = config.Queries.RemoveConsumedMeal(c.Request().Context(), mealID)
	if err != nil {
		utils.FmtLogMsg(
			"meal_controller.go",
			"RemoveConsumedMeal",
			fmt.Errorf("failed to remove consumed meal: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to remove consumed meal, trouble with server",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Consumed meal removed",
	})
}

package controllers

import (
	"database/sql"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/google/uuid"
	"github.com/jackc/pgconn"
	"github.com/labstack/echo"
)

func GetFoodItems(c echo.Context) error {
	_, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError(
			"food_item_controllers.go",
			"GetFoodItems",
			fmt.Errorf("reached get food items without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get food items, unauthorized",
		})
	}

	offset := int32(0)
	limit := int32(10)

	if offsetStr := c.QueryParam("offset"); offsetStr != "" {
		convOffset, err := utils.SafeParseStrToInt32(offsetStr, 0, math.MaxInt32)
		if err != nil {
			utils.FmtLogError(
				"food_item_controllers.go",
				"GetFoodItems",
				fmt.Errorf("failed to parse offset: %s", err),
			)
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to get food items, invalid offset",
			})
		}
		offset = int32(convOffset)
	}
	if limitStr := c.QueryParam("limit"); limitStr != "" {
		convLimit, err := utils.SafeParseStrToInt32(limitStr, 1, 100)
		if err != nil {
			utils.FmtLogError(
				"food_item_controllers.go",
				"GetFoodItems",
				fmt.Errorf("failed to parse limit: %s", err),
			)
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to get food items, invalid limit",
			})
		}
		limit = int32(convLimit)
	}

	textFilterStr := c.QueryParam("text_filter")
	var textFilter sql.NullString
	if textFilterStr != "" {
		textFilter = sql.NullString{String: textFilterStr, Valid: true}
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"GetFoodItems",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get food items, trouble with server",
		})
	}

	if textFilter.Valid {

		getFoodParams := database.GetFoodsWithFilterParams{
			Limit:   limit,
			Offset:  offset,
			Column3: textFilter,
		}

		foods, err := config.Queries.GetFoodsWithFilter(c.Request().Context(), getFoodParams)
		if err != nil {
			utils.FmtLogError(
				"food_item_controllers.go",
				"GetFoodItems",
				fmt.Errorf("failed to get food items: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get food items, trouble with server",
			})
		}

		foodItems := make([]models.FoodItem, len(foods))
		for i, food := range foods {
			var description *string
			var imageUrl *string
			if food.Description.Valid {
				description = &food.Description.String
			}
			if food.ImageUrl.Valid {
				imageUrl = &food.ImageUrl.String
			}

			foodItems[i] = models.FoodItem{
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

		totalRows, err := config.Queries.GetFoodItemsTotalPages(c.Request().Context())
		if err != nil {
			utils.FmtLogError("food_item_controllers.go", "GetFoodItems", fmt.Errorf("failed to get food items: %s", err))
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get food items, trouble with server",
			})
		}

		totalPages := int64(math.Ceil(float64(totalRows) / float64(limit)))

		respFoodItem := models.FoodItemsWithPages{
			FoodItemsPending: foodItems,
			TotalPages:       totalPages,
			TotalItems:       totalRows,
		}

		return c.JSON(http.StatusOK, respFoodItem)
	} else {
		getFoodParams := database.GetFoodsParams{
			Limit:  limit,
			Offset: offset,
		}

		foods, err := config.Queries.GetFoods(c.Request().Context(), getFoodParams)
		if err != nil {
			utils.FmtLogError("food_item_controllers.go", "GetFoodItems", fmt.Errorf("failed to get food items: %s", err))
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get food items, trouble with server",
			})
		}

		foodItems := make([]models.FoodItem, len(foods))
		for i, food := range foods {
			var description *string
			var imageUrl *string
			if food.Description.Valid {
				description = &food.Description.String
			}
			if food.ImageUrl.Valid {
				imageUrl = &food.ImageUrl.String
			}

			foodItems[i] = models.FoodItem{
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

		totalRows, err := config.Queries.GetFoodItemsTotalPages(c.Request().Context())
		if err != nil {
			utils.FmtLogError("food_item_controllers.go", "GetFoodItems", fmt.Errorf("failed to get food items: %s", err))
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get food items, trouble with server",
			})
		}

		totalPages := int64(math.Ceil(float64(totalRows) / float64(limit)))

		respFoodItem := models.FoodItemsWithPages{
			FoodItemsPending: foodItems,
			TotalPages:       totalPages,
			TotalItems:       totalRows,
		}

		return c.JSON(http.StatusOK, respFoodItem)
	}
}

type CreateFoodItemRequest struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
	ImageUrl    *string `json:"image_url"`
	FoodType    string  `json:"food_type"`
	Calories    string  `json:"calories"`
	Fat         string  `json:"fat"`
	Protein     string  `json:"protein"`
	Carbs       string  `json:"carbs"`
}

func CreateFoodItem(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError(
			"food_item_controllers.go",
			"CreateFoodItem",
			fmt.Errorf("reached create food item without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to create food item, unauthorized",
		})
	}
	if user.Role != database.UserRoleAdmin {
		utils.FmtLogError(
			"food_item_controllers.go",
			"CreateFoodItem",
			fmt.Errorf("reached create food item without admin role"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to create food item, unauthorized",
		})
	}

	createFoodItemReq := CreateFoodItemRequest{}

	if err := c.Bind(&createFoodItemReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create food item, malformed request",
		})
	}

	var description sql.NullString
	if createFoodItemReq.Description != nil {
		description = sql.NullString{String: *createFoodItemReq.Description, Valid: createFoodItemReq.Description != nil}
	}

	var imageUrl sql.NullString
	if createFoodItemReq.ImageUrl != nil {
		imageUrl = sql.NullString{String: *createFoodItemReq.ImageUrl, Valid: createFoodItemReq.ImageUrl != nil}
	}

	foodType := database.FoodItemType(createFoodItemReq.FoodType)
	if err := foodType.Scan(string(createFoodItemReq.FoodType)); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create food item, invalid food type",
		})
	}

	if _, err := strconv.ParseFloat(createFoodItemReq.Calories, 64); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create food item, calories must be a valid number",
		})
	}

	if _, err := strconv.ParseFloat(createFoodItemReq.Fat, 64); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create food item, fat must be a valid number",
		})
	}

	if _, err := strconv.ParseFloat(createFoodItemReq.Protein, 64); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create food item, protein must be a valid number",
		})
	}

	if _, err := strconv.ParseFloat(createFoodItemReq.Carbs, 64); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create food item, carbs must be a valid number",
		})
	}

	createFoodItemParams := database.CreateFoodParams{
		Name:        createFoodItemReq.Name,
		Description: description,
		ImageUrl:    imageUrl,
		FoodType:    foodType,
		Calories:    createFoodItemReq.Calories,
		Fat:         createFoodItemReq.Fat,
		Protein:     createFoodItemReq.Protein,
		Carbs:       createFoodItemReq.Carbs,
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"CreateFoodItem",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create food item, trouble with server",
		})
	}

	foodItem, err := config.Queries.CreateFood(c.Request().Context(), createFoodItemParams)
	if err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"CreateFoodItem",
			fmt.Errorf("failed to create food item: %s", err),
		)
		if pgErr, ok := err.(*pgconn.PgError); ok {
			switch pgErr.Code {
			case "22P02":
				errMsg := strings.Replace(pgErr.Message, "_", " ", -1)
				return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
					"message": fmt.Sprintf("Failed to create food item, %s", errMsg),
				})

			default:
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to create food item, trouble with server",
				})
			}
		} else {
			utils.FmtLogError(
				"food_item_controllers.go",
				"CreateFoodItem",
				fmt.Errorf("non-PostgreSQL error detected: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to create food item, trouble with server",
			})
		}
	}

	var respDescription *string
	if foodItem.Description.Valid {
		respDescription = &foodItem.Description.String
	}
	var respImageUrl *string
	if foodItem.ImageUrl.Valid {
		respImageUrl = &foodItem.ImageUrl.String
	}

	respFoodItem := models.FoodItem{
		ID:          foodItem.ID,
		Name:        foodItem.Name,
		Description: respDescription,
		ImageUrl:    respImageUrl,
		FoodType:    foodItem.FoodType,
		Calories:    foodItem.Calories,
		Fat:         foodItem.Fat,
		Protein:     foodItem.Protein,
		Carbs:       foodItem.Carbs,
		CreatedAt:   foodItem.CreatedAt.Time,
		UpdatedAt:   foodItem.UpdatedAt.Time,
	}

	return c.JSON(http.StatusOK, respFoodItem)
}

func DeleteFoodItem(c echo.Context) error {
	if _, ok := c.Get("user").(database.User); !ok {
		utils.FmtLogError(
			"food_item_controllers.go",
			"DeleteFoodItem",
			fmt.Errorf("reached delete food item without admin role"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to delete food item, unauthorized",
		})
	}

	foodItemId, err := uuid.Parse(c.Param("food_item_id"))
	if err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"DeleteFoodItem",
			fmt.Errorf("failed to parse food item id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to delete food item, malformed request",
		})
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"DeleteFoodItem",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to delete food item, trouble with server",
		})
	}

	foodItem, err := config.Queries.DeleteFoodItem(c.Request().Context(), foodItemId)
	if err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"DeleteFoodItem",
			fmt.Errorf("failed to delete food item: %s", err),
		)
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, map[string]string{
				"message": "Failed to delete food item, food item not found",
			})
		} else {
			utils.FmtLogError(
				"food_item_controllers.go",
				"DeleteFoodItem",
				fmt.Errorf("non-PostgreSQL error detected: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to delete food item, trouble with server",
			})
		}
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": fmt.Sprintf("Successfully deleted food item with id: %s", foodItem.Name),
	})
}

func GetFoodItemByID(c echo.Context) error {
	if user, ok := c.Get("user").(database.User); !ok && user.Role != database.UserRoleAdmin {
		utils.FmtLogError(
			"food_item_controllers.go",
			"GetFoodItemByID",
			fmt.Errorf("reached get food item by id without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get food item by id, unauthorized",
		})
	}

	foodItemID, err := uuid.Parse(c.Param("food_item_id"))
	if err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"GetFoodItemByID",
			fmt.Errorf("failed to parse food item id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get food item by id, malformed request",
		})
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"GetFoodItemByID",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get food item by id, trouble with server",
		})
	}

	foodItem, err := config.Queries.GetFoodItemByID(c.Request().Context(), foodItemID)
	if err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"GetFoodItemByID",
			fmt.Errorf("failed to get food item by id: %s", err),
		)
		return echo.NewHTTPError(http.StatusNotFound, map[string]string{
			"message": "Failed to get food item by id, trouble with server",
		})
	}

	var description *string
	if foodItem.Description.Valid {
		description = &foodItem.Description.String
	}
	var imageUrl *string
	if foodItem.ImageUrl.Valid {
		imageUrl = &foodItem.ImageUrl.String
	}

	foodItemResp := models.FoodItem{
		ID:          foodItem.ID,
		Name:        foodItem.Name,
		Description: description,
		ImageUrl:    imageUrl,
		FoodType:    foodItem.FoodType,
		Calories:    foodItem.Calories,
		Fat:         foodItem.Fat,
		Protein:     foodItem.Protein,
		Carbs:       foodItem.Carbs,
		CreatedAt:   foodItem.CreatedAt.Time,
		UpdatedAt:   foodItem.UpdatedAt.Time,
	}

	return c.JSON(http.StatusOK, foodItemResp)
}

type UpdateFoodItemRequest struct {
	Name        string  `json:"name"`
	Description *string `json:"description,omitempty"`
	ImageUrl    *string `json:"image_url,omitempty"`
	FoodType    string  `json:"food_type"`
	Calories    string  `json:"calories"`
	Fat         string  `json:"fat"`
	Protein     string  `json:"protein"`
	Carbs       string  `json:"carbs"`
}

func UpdateFoodItem(c echo.Context) error {
	if user, ok := c.Get("user").(database.User); !ok && user.Role != database.UserRoleAdmin {
		utils.FmtLogError(
			"food_item_controllers.go",
			"UpdateFoodItem",
			fmt.Errorf("reached update food item without admin role"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to update food item, unauthorized",
		})
	}

	foodItemId, err := uuid.Parse(c.Param("food_item_id"))
	if err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"UpdateFoodItem",
			fmt.Errorf("failed to parse food item id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update food item, malformed request",
		})
	}

	updateFoodItemReq := UpdateFoodItemRequest{}

	if err := c.Bind(&updateFoodItemReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update food item, malformed request",
		})
	}

	var description sql.NullString
	if updateFoodItemReq.Description != nil {
		description = sql.NullString{String: *updateFoodItemReq.Description, Valid: updateFoodItemReq.Description != nil}
	}

	var imageUrl sql.NullString
	if updateFoodItemReq.ImageUrl != nil {
		imageUrl = sql.NullString{String: *updateFoodItemReq.ImageUrl, Valid: updateFoodItemReq.ImageUrl != nil}
	}

	foodType := database.FoodItemType(updateFoodItemReq.FoodType)
	if err := foodType.Scan(string(updateFoodItemReq.FoodType)); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update food item, invalid food type",
		})
	}

	fmt.Printf("Calories: %s\n Fat: %s\n Protein: %s\n Carbs: %s\n",
		updateFoodItemReq.Calories,
		updateFoodItemReq.Fat,
		updateFoodItemReq.Protein,
		updateFoodItemReq.Carbs,
	)

	if _, err := strconv.ParseFloat(updateFoodItemReq.Calories, 64); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update food item, calories must be a valid number",
		})
	}

	if _, err := strconv.ParseFloat(updateFoodItemReq.Fat, 64); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update food item, fat must be a valid number",
		})
	}

	if _, err := strconv.ParseFloat(updateFoodItemReq.Protein, 64); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update food item, protein must be a valid number",
		})
	}

	if _, err := strconv.ParseFloat(updateFoodItemReq.Carbs, 64); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update food item, carbs must be a valid number",
		})
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"UpdateFoodItem",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update food item, trouble with server",
		})
	}

	updateFoodItemParams := database.UpdateFoodItemParams{
		ID:          foodItemId,
		Name:        updateFoodItemReq.Name,
		Description: description,
		ImageUrl:    imageUrl,
		FoodType:    foodType,
		Calories:    updateFoodItemReq.Calories,
		Fat:         updateFoodItemReq.Fat,
		Protein:     updateFoodItemReq.Protein,
		Carbs:       updateFoodItemReq.Carbs,
	}

	updatedFoodItem, err := config.Queries.UpdateFoodItem(c.Request().Context(), updateFoodItemParams)
	if err != nil {
		utils.FmtLogError(
			"food_item_controllers.go",
			"UpdateFoodItem",
			fmt.Errorf("failed to update food item: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update food item, trouble with server",
		})
	}

	var respDescription *string
	if updatedFoodItem.Description.Valid {
		respDescription = &updatedFoodItem.Description.String
	}
	var respImageUrl *string
	if updatedFoodItem.ImageUrl.Valid {
		respImageUrl = &updatedFoodItem.ImageUrl.String
	}

	respFoodItem := models.FoodItem{
		ID:          updatedFoodItem.ID,
		Name:        updatedFoodItem.Name,
		Description: respDescription,
		ImageUrl:    respImageUrl,
		FoodType:    updatedFoodItem.FoodType,
		Calories:    updatedFoodItem.Calories,
		Fat:         updatedFoodItem.Fat,
		Protein:     updatedFoodItem.Protein,
		Carbs:       updatedFoodItem.Carbs,
		CreatedAt:   updatedFoodItem.CreatedAt.Time,
		UpdatedAt:   updatedFoodItem.UpdatedAt.Time,
	}

	return c.JSON(http.StatusOK, respFoodItem)
}

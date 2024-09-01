package controllers

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/labstack/echo"
)

func GetFoodItemsPending(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	limit := int32(10)
	offset := int32(0)
	if limitStr := c.QueryParam("limit"); limitStr != "" {
		convLimit, err := strconv.Atoi(limitStr)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid limit")
		}
		limit = int32(convLimit)
	}
	if offsetStr := c.QueryParam("offset"); offsetStr != "" {
		convOffset, err := strconv.Atoi(offsetStr)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid offset")
		}
		offset = int32(convOffset)
	}

	getFoodItemsPendingParams := database.GetFoodItemsPendingParams{
		UserID: user.ID,
		Limit:  limit,
		Offset: offset,
	}

	foodItemsPending, err := config.Queries.GetFoodItemsPending(c.Request().Context(), getFoodItemsPendingParams)
	if err != nil {
		log.Println("Failed to get food items: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get food items")
	}

	respFoodItemsPending := make([]models.FoodItemsPending, len(foodItemsPending))
	for i, foodItemPending := range foodItemsPending {
		var description *string
		var imageUrl *string
		if foodItemPending.Description.Valid {
			description = &foodItemPending.Description.String
		}
		if foodItemPending.ImageUrl.Valid {
			imageUrl = &foodItemPending.ImageUrl.String
		}

		respFoodItemsPending[i] = models.FoodItemsPending{
			ID:          foodItemPending.ID,
			Name:        foodItemPending.Name,
			Description: description,
			ImageUrl:    imageUrl,
			FoodType:    foodItemPending.FoodType,
			Calories:    foodItemPending.Calories,
			Fat:         foodItemPending.Fat,
			Protein:     foodItemPending.Protein,
			Carbs:       foodItemPending.Carbs,
			CreatedAt:   foodItemPending.CreatedAt.Time,
			UpdatedAt:   foodItemPending.UpdatedAt.Time,
			UserID:      foodItemPending.UserID,
			Likes:       foodItemPending.Likes,
			Liked:       foodItemPending.Liked,
			Author:      foodItemPending.Username.String,
		}
	}

	return c.JSON(http.StatusOK, respFoodItemsPending)
}

func GetFoodItemsPendingByUserID(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	limit := int32(10)
	offset := int32(0)
	if limitStr := c.QueryParam("limit"); limitStr != "" {
		convLimit, err := strconv.Atoi(limitStr)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid limit")
		}
		limit = int32(convLimit)
	}
	if offsetStr := c.QueryParam("offset"); offsetStr != "" {
		convOffset, err := strconv.Atoi(offsetStr)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid offset")
		}
		offset = int32(convOffset)
	}

	getFoodItemsPendingByUserIDParams := database.GetFoodItemsPendingByUserIDParams{
		UserID: user.ID,
		Limit:  limit,
		Offset: offset,
	}

	foodItemsPending, err := config.Queries.GetFoodItemsPendingByUserID(c.Request().Context(), getFoodItemsPendingByUserIDParams)
	if err != nil {
		log.Println("Failed to get food items by user id: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get food items")
	}

	respFoodItemsPending := make([]models.FoodItemsPending, len(foodItemsPending))
	for i, foodItemPending := range foodItemsPending {
		var description *string
		var imageUrl *string
		if foodItemPending.Description.Valid {
			description = &foodItemPending.Description.String
		}
		if foodItemPending.ImageUrl.Valid {
			imageUrl = &foodItemPending.ImageUrl.String
		}

		respFoodItemsPending[i] = models.FoodItemsPending{
			ID:          foodItemPending.ID,
			Name:        foodItemPending.Name,
			Description: description,
			ImageUrl:    imageUrl,
			FoodType:    foodItemPending.FoodType,
			Calories:    foodItemPending.Calories,
			Fat:         foodItemPending.Fat,
			Protein:     foodItemPending.Protein,
			Carbs:       foodItemPending.Carbs,
			CreatedAt:   foodItemPending.CreatedAt.Time,
			UpdatedAt:   foodItemPending.UpdatedAt.Time,
			UserID:      foodItemPending.UserID,
			Likes:       foodItemPending.Likes,
			Liked:       foodItemPending.Liked,
			Author:      foodItemPending.Username.String,
		}
	}

	return c.JSON(http.StatusOK, respFoodItemsPending)
}

type CreateFoodItemPendingRequest struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
	ImageUrl    *string `json:"image_url"`
	FoodType    string  `json:"food_type"`
	Calories    string  `json:"calories"`
	Fat         string  `json:"fat"`
	Protein     string  `json:"protein"`
	Carbs       string  `json:"carbs"`
}

func CreateFoodItemPending(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	createFoodItemPendingReq := CreateFoodItemPendingRequest{}
	if err := c.Bind(&createFoodItemPendingReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	var description sql.NullString
	if createFoodItemPendingReq.Description != nil {
		description = sql.NullString{String: *createFoodItemPendingReq.Description, Valid: createFoodItemPendingReq.Description != nil}
	}

	var imageUrl sql.NullString
	if createFoodItemPendingReq.ImageUrl != nil {
		imageUrl = sql.NullString{String: *createFoodItemPendingReq.ImageUrl, Valid: createFoodItemPendingReq.ImageUrl != nil}
	}

	createFoodItemPendingParams := database.CreateFoodItemPendingParams{
		Name:        createFoodItemPendingReq.Name,
		Description: description,
		ImageUrl:    imageUrl,
		FoodType:    database.FoodItemType(createFoodItemPendingReq.FoodType),
		Calories:    createFoodItemPendingReq.Calories,
		Fat:         createFoodItemPendingReq.Fat,
		Protein:     createFoodItemPendingReq.Protein,
		Carbs:       createFoodItemPendingReq.Carbs,
		UserID:      user.ID,
	}

	if err := config.DB.Ping(); err != nil {
		log.Println("Connection to database failed: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to create food item",
		})
	}

	foodItemPending, err := config.Queries.CreateFoodItemPending(c.Request().Context(), createFoodItemPendingParams)
	if err != nil {
		log.Println("Failed to create food item: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to create food item")
	}

	var respDescription *string
	if foodItemPending.Description.Valid {
		respDescription = &foodItemPending.Description.String
	}
	var respImageUrl *string
	if foodItemPending.ImageUrl.Valid {
		respImageUrl = &foodItemPending.ImageUrl.String
	}

	respFoodItemPending := models.FoodItemsPending{
		ID:          foodItemPending.ID,
		Name:        foodItemPending.Name,
		Description: respDescription,
		ImageUrl:    respImageUrl,
		FoodType:    foodItemPending.FoodType,
		Calories:    foodItemPending.Calories,
		Fat:         foodItemPending.Fat,
		Protein:     foodItemPending.Protein,
		Carbs:       foodItemPending.Carbs,
		CreatedAt:   foodItemPending.CreatedAt.Time,
		UpdatedAt:   foodItemPending.UpdatedAt.Time,
		UserID:      foodItemPending.UserID,
		Likes:       0,
		Liked:       false,
		Author:      user.Username,
	}

	return c.JSON(http.StatusOK, respFoodItemPending)
}

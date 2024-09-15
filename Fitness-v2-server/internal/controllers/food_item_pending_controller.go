package controllers

import (
	"database/sql"
	"fmt"
	"math"
	"net/http"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/google/uuid"
	"github.com/labstack/echo"
)

func GetFoodItemsPending(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"GetFoodItemsPending",
			fmt.Errorf("reached get food items pending without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get food items pending, unauthorized",
		})
	}

	limit := int32(10)
	offset := int32(0)
	textFilter := ""
	if offsetStr := c.QueryParam("offset"); offsetStr != "" {
		convOffset, err := utils.SafeParseStrToInt32(offsetStr, 0, math.MaxInt32)
		if err != nil {
			utils.FmtLogMsg(
				"food_item_pending_controller.go",
				"GetFoodItemsPending",
				fmt.Errorf("failed to parse offset: %s", err),
			)
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to get food items pending, invalid offset",
			})
		}
		offset = int32(convOffset)
	}
	if limitStr := c.QueryParam("limit"); limitStr != "" {
		convLimit, err := utils.SafeParseStrToInt32(limitStr, 1, 100)
		if err != nil {
			utils.FmtLogMsg(
				"food_item_pending_controller.go",
				"GetFoodItemsPending",
				fmt.Errorf("failed to parse limit: %s", err),
			)
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to get food items pending, invalid limit",
			})
		}
		limit = int32(convLimit)
	}
	if textFilterStr := c.QueryParam("text_filter"); textFilterStr != "" {
		textFilter = textFilterStr
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"GetFoodItemsPending",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get food items pending, trouble with server",
		})
	}

	if textFilter == "" {
		getFoodItemsPendingParams := database.GetFoodItemsPendingParams{
			UserID: user.ID,
			Limit:  limit,
			Offset: offset,
		}

		foodItemsPending, err := config.Queries.GetFoodItemsPending(c.Request().Context(), getFoodItemsPendingParams)
		if err != nil {
			utils.FmtLogMsg(
				"food_item_pending_controller.go",
				"GetFoodItemsPending",
				fmt.Errorf("failed to get food items: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get food items pending, trouble with server",
			})
		}

		rowCount, err := config.Queries.GetFoodItemsPendingTotalPages(c.Request().Context())
		if err != nil {
			utils.FmtLogMsg(
				"food_item_pending_controller.go",
				"GetFoodItemsPending",
				fmt.Errorf("failed to get food items total pages: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get food items pending, trouble with server",
			})
		}

		mFoodItemsPending := make([]models.FoodItemsPending, len(foodItemsPending))
		for i, foodItemPending := range foodItemsPending {
			var description *string
			var imageUrl *string
			if foodItemPending.Description.Valid {
				description = &foodItemPending.Description.String
			}
			if foodItemPending.ImageUrl.Valid {
				imageUrl = &foodItemPending.ImageUrl.String
			}

			mFoodItemsPending[i] = models.FoodItemsPending{
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

		totalPages := int64(math.Ceil(float64(rowCount) / float64(limit)))

		respFoodItemsPending := models.FoodItemsPendingWithPages{
			FoodItemsPending: mFoodItemsPending,
			TotalPages:       totalPages,
		}

		return c.JSON(http.StatusOK, respFoodItemsPending)
	} else {
		textFilterNullString := sql.NullString{String: textFilter, Valid: true}

		getFoodItemsPendingParams := database.GetFoodItemsPendingByUserIDWithTextFilterParams{
			UserID:  user.ID,
			Limit:   limit,
			Offset:  offset,
			Column2: textFilterNullString,
		}

		foodItemsPending, err := config.Queries.GetFoodItemsPendingByUserIDWithTextFilter(c.Request().Context(), getFoodItemsPendingParams)
		if err != nil {
			utils.FmtLogMsg(
				"food_item_pending_controller.go",
				"GetFoodItemsPending",
				fmt.Errorf("failed to get food items: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get food items pending, trouble with server",
			})
		}

		rowCount, err := config.Queries.GetFoodItemsPendingTotalPagesWithTextFilter(c.Request().Context(), textFilterNullString)
		if err != nil {
			utils.FmtLogMsg(
				"food_item_pending_controller.go",
				"GetFoodItemsPending",
				fmt.Errorf("failed to get food items total pages: %s", err),
			)
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get food items pending, trouble with server",
			})
		}

		mFoodItemsPending := make([]models.FoodItemsPending, len(foodItemsPending))
		for i, foodItemPending := range foodItemsPending {
			var description *string
			var imageUrl *string
			if foodItemPending.Description.Valid {
				description = &foodItemPending.Description.String
			}
			if foodItemPending.ImageUrl.Valid {
				imageUrl = &foodItemPending.ImageUrl.String
			}

			mFoodItemsPending[i] = models.FoodItemsPending{
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

		totalPages := int64(math.Ceil(float64(rowCount) / float64(limit)))

		respFoodItemsPending := models.FoodItemsPendingWithPages{
			FoodItemsPending: mFoodItemsPending,
			TotalPages:       totalPages,
		}

		return c.JSON(http.StatusOK, respFoodItemsPending)
	}
}

func GetFoodItemsPendingByUserID(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"GetFoodItemsPendingByUserID",
			fmt.Errorf("reached get food items pending by user id without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get food items pending, unauthorized",
		})
	}

	limit := int32(10)
	offset := int32(0)
	if offsetStr := c.QueryParam("offset"); offsetStr != "" {
		convOffset, err := utils.SafeParseStrToInt32(offsetStr, 0, math.MaxInt32)
		if err != nil {
			utils.FmtLogMsg(
				"food_item_pending_controller.go",
				"GetFoodItemsPendingByUserID",
				fmt.Errorf("failed to parse offset: %s", err),
			)
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to get food items pending, invalid offset",
			})
		}
		offset = int32(convOffset)
	}
	if limitStr := c.QueryParam("limit"); limitStr != "" {
		convLimit, err := utils.SafeParseStrToInt32(limitStr, 1, 100)
		if err != nil {
			utils.FmtLogMsg(
				"food_item_pending_controller.go",
				"GetFoodItemsPendingByUserID",
				fmt.Errorf("failed to parse limit: %s", err),
			)
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to get food items pending, invalid limit",
			})
		}
		limit = int32(convLimit)
	}

	getFoodItemsPendingByUserIDParams := database.GetFoodItemsPendingByUserIDParams{
		UserID: user.ID,
		Limit:  limit,
		Offset: offset,
	}

	foodItemsPending, err := config.Queries.GetFoodItemsPendingByUserID(c.Request().Context(), getFoodItemsPendingByUserIDParams)
	if err != nil {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"GetFoodItemsPendingByUserID",
			fmt.Errorf("failed to get food items by user id: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get food items pending, trouble with server",
		})
	}

	rowCount, err := config.Queries.GetFoodItemsPendingByUserTotalPages(c.Request().Context(), user.ID)
	if err != nil {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"GetFoodItemsPendingByUserID",
			fmt.Errorf("failed to get food items by user id total pages: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get food items pending, trouble with server",
		})
	}

	mFoodItemsPending := make([]models.FoodItemsPending, len(foodItemsPending))
	for i, foodItemPending := range foodItemsPending {
		var description *string
		var imageUrl *string
		if foodItemPending.Description.Valid {
			description = &foodItemPending.Description.String
		}
		if foodItemPending.ImageUrl.Valid {
			imageUrl = &foodItemPending.ImageUrl.String
		}

		mFoodItemsPending[i] = models.FoodItemsPending{
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

	totalPages := int64(math.Ceil(float64(rowCount) / float64(limit)))

	respFoodItemsPending := models.FoodItemsPendingWithPages{
		FoodItemsPending: mFoodItemsPending,
		TotalPages:       totalPages,
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
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"CreateFoodItemPending",
			fmt.Errorf("reached create food item pending without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to create food item pending, unauthorized",
		})
	}

	createFoodItemPendingReq := CreateFoodItemPendingRequest{}
	if err := c.Bind(&createFoodItemPendingReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create food item pending, malformed request",
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
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"CreateFoodItemPending",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create food item pending, trouble with server",
		})
	}

	foodItemPending, err := config.Queries.CreateFoodItemPending(c.Request().Context(), createFoodItemPendingParams)
	if err != nil {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"CreateFoodItemPending",
			fmt.Errorf("failed to create food item pending: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create food item pending, trouble with server",
		})
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

func ToggleFoodItemPending(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"ToggleFoodItemPending",
			fmt.Errorf("reached toggle food item pending without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, "Failed to toggle food item pending, unauthorized")
	}

	foodItemPendingID, err := uuid.Parse(c.Param("food_item_pending_id"))
	if err != nil {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"ToggleFoodItemPending",
			fmt.Errorf("failed to parse food item pending id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to toggle food item pending, invalid food item pending id",
		})
	}

	getFoodItemPendingLikeForUserParams := database.GetFoodItemPendingLikeForUserParams{
		UserID:     user.ID,
		FoodItemID: foodItemPendingID,
	}

	_, err = config.Queries.GetFoodItemPendingLikeForUser(
		c.Request().Context(),
		getFoodItemPendingLikeForUserParams,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			likeFoodItemPendingForUserParams := database.LikeFoodItemPendingForUserParams{
				UserID:     user.ID,
				FoodItemID: foodItemPendingID,
			}
			if err := config.Queries.LikeFoodItemPendingForUser(c.Request().Context(), likeFoodItemPendingForUserParams); err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to toggle food item pending, trouble with server",
				})
			}
			return c.JSON(http.StatusOK, map[string]string{
				"message": "Food item pending liked",
			})
		}
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"ToggleFoodItemPending",
			fmt.Errorf("failed to get food item pending like for user: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to toggle food item pending, trouble with server",
		})
	}

	unlikeFoodItemPendingForUserParams := database.UnlikeFoodItemPendingForUserParams{
		UserID:     user.ID,
		FoodItemID: foodItemPendingID,
	}
	if err := config.Queries.UnlikeFoodItemPendingForUser(c.Request().Context(), unlikeFoodItemPendingForUserParams); err != nil {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"ToggleFoodItemPending",
			fmt.Errorf("failed to unlike food item pending: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to toggle food item pending, trouble with server",
		})
	}
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Food item pending unliked",
	})
}

func ApproveFoodItemPending(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok || user.Role != database.UserRoleAdmin {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"ApproveFoodItemPending",
			fmt.Errorf("reached approve food item pending without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to approve food item pending, unauthorized",
		})
	}

	foodItemPendingID, err := uuid.Parse(c.Param("food_item_pending_id"))
	if err != nil {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"ApproveFoodItemPending",
			fmt.Errorf("failed to parse food item pending id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to approve food item pending, invalid food item pending id",
		})
	}

	err = config.Queries.ApproveFoodItemPending(c.Request().Context(), foodItemPendingID)
	if err != nil {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"ApproveFoodItemPending",
			fmt.Errorf("failed to approve food item pending: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to approve food item pending, trouble with server",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Food item pending approved",
	})
}

func RejectFoodItemPending(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok || user.Role != database.UserRoleAdmin {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"RejectFoodItemPending",
			fmt.Errorf("reached reject food item pending without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to reject food item pending, unauthorized",
		})
	}

	foodItemPendingID, err := uuid.Parse(c.Param("food_item_pending_id"))
	if err != nil {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"RejectFoodItemPending",
			fmt.Errorf("failed to parse food item pending id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to reject food item pending, invalid food item pending id",
		})
	}

	err = config.Queries.RejectFoodItemPending(c.Request().Context(), foodItemPendingID)
	if err != nil {
		utils.FmtLogMsg(
			"food_item_pending_controller.go",
			"RejectFoodItemPending",
			fmt.Errorf("failed to reject food item pending: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to reject food item pending, trouble with server",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Food item pending rejected",
	})
}

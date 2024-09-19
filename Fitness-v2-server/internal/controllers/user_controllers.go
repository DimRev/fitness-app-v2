package controllers

import (
	"database/sql"
	"fmt"
	"log"
	"math"
	"net/http"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/services"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/google/uuid"
	"github.com/labstack/echo"
)

func GetUsers(c echo.Context) error {
	offset := int32(0)
	limit := int32(10)
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

	if err := config.DB.Ping(); err != nil {
		log.Println("Connection to database failed: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to get users",
		})
	}

	getUsersParams := database.GetUsersParams{
		Limit:  limit,
		Offset: offset,
	}

	users, err := config.Queries.GetUsers(c.Request().Context(), getUsersParams)
	if err != nil {
		log.Println("Failed to get users: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to get users",
		})
	}

	respUsers := make([]models.User, len(users))
	for i, user := range users {
		var imageUrlResp *string
		if user.ImageUrl.Valid {
			imageUrlResp = &user.ImageUrl.String
		}

		respUsers[i] = models.User{
			ID:        user.ID,
			Email:     user.Email,
			Username:  user.Username,
			ImageUrl:  imageUrlResp,
			CreatedAt: user.CreatedAt.Time,
			UpdatedAt: user.UpdatedAt.Time,
			Role:      user.Role,
		}
	}

	totalRows, err := config.Queries.GetUsersCount(c.Request().Context())
	if err != nil {
		log.Println("Failed to get users count: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to get users count",
		})
	}

	respUsersWithPages := models.UsersWithPages{
		Users:      respUsers,
		TotalPages: int64(math.Ceil(float64(totalRows) / float64(limit))),
	}

	return c.JSON(http.StatusOK, respUsersWithPages)
}

type UpdateUserRequest struct {
	ImageUrl *string `json:"image_url"`
	Username string  `json:"username"`
	Email    string  `json:"email"`
}

func UpdateUser(c echo.Context) error {
	updateUserReq := UpdateUserRequest{}
	if err := c.Bind(&updateUserReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	user, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached create Meal without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	if user.ImageUrl.Valid {
		err := services.RemoveExistingS3Asset(user.ImageUrl.String)
		if err != nil {
			log.Printf("Failed to remove existing S3 asset: %s", err)
		}
	}

	if user.Email != updateUserReq.Email {
		log.Printf("Trying to update user with different email, user: %s, update: %s", user.Email, updateUserReq.Email)
		return echo.NewHTTPError(http.StatusBadRequest, "unauthorized")
	}

	var imageUrl sql.NullString
	if updateUserReq.ImageUrl != nil {
		imageUrl = sql.NullString{String: *updateUserReq.ImageUrl, Valid: true}
	}

	if err := config.DB.Ping(); err != nil {
		log.Println("Connection to database failed: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to update user",
		})
	}

	updateUserParams := database.UpdateUserParams{
		ID:       user.ID,
		ImageUrl: imageUrl,
		Username: updateUserReq.Username,
		Email:    updateUserReq.Email,
	}

	updatedUser, err := config.Queries.UpdateUser(c.Request().Context(), updateUserParams)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to update user")
	}

	var updatedUserImageUrl *string
	if updatedUser.ImageUrl.Valid {
		updatedUserImageUrl = &updatedUser.ImageUrl.String
	}

	respUser := models.AuthUser{
		ID:           updatedUser.ID,
		Email:        updatedUser.Email,
		PasswordHash: updatedUser.PasswordHash,
		Username:     updatedUser.Username,
		ImageUrl:     updatedUserImageUrl,
		CreatedAt:    updatedUser.CreatedAt.Time,
		UpdatedAt:    updatedUser.UpdatedAt.Time,
	}

	return c.JSON(http.StatusOK, respUser)
}

type UpdateUserByAdminRequest struct {
	Username string            `json:"username"`
	Email    string            `json:"email"`
	ImageUrl *string           `json:"image_url"`
	Role     database.UserRole `json:"role"`
}

func UpdateUserByAdmin(c echo.Context) error {
	updateUserReq := UpdateUserByAdminRequest{}
	if err := c.Bind(&updateUserReq); err != nil {
		utils.FmtLogError(
			"user_controller.go",
			"UpdateUserByAdmin",
			fmt.Errorf("failed to bind update user by admin request: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update user by admin, malformed request",
		})
	}

	userToUpdateId, err := uuid.Parse(c.Param("userId"))
	if err != nil {
		utils.FmtLogError(
			"user_controller.go",
			"UpdateUserByAdmin",
			fmt.Errorf("failed to parse user id: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update user by admin, invalid user id",
		})
	}

	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError(
			"user_controller.go",
			"UpdateUserByAdmin",
			fmt.Errorf("reached update user by admin without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to update user by admin, unauthorized",
		})
	}

	if user.ID == userToUpdateId {
		utils.FmtLogError(
			"user_controller.go",
			"UpdateUserByAdmin",
			fmt.Errorf("can not update self"),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to update user by admin, can not update self",
		})
	}

	var imageUrl sql.NullString
	if updateUserReq.ImageUrl != nil {
		imageUrl = sql.NullString{String: *updateUserReq.ImageUrl, Valid: updateUserReq.ImageUrl != nil}
	}

	updateUserParams := database.UpdateUserByAdminParams{
		ID:       userToUpdateId,
		ImageUrl: imageUrl,
		Username: updateUserReq.Username,
		Role:     updateUserReq.Role,
		Email:    updateUserReq.Email,
	}
	updatedUser, err := config.Queries.UpdateUserByAdmin(c.Request().Context(), updateUserParams)
	if err != nil {
		utils.FmtLogError(
			"user_controller.go",
			"UpdateUserByAdmin",
			fmt.Errorf("failed to update user: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to update user by admin, trouble with server",
		})
	}

	var updatedImageUrl *string
	if updatedUser.ImageUrl.Valid {
		updatedImageUrl = &updatedUser.ImageUrl.String
	}

	userResp := models.User{
		ID:           updatedUser.ID,
		Email:        updatedUser.Email,
		PasswordHash: updatedUser.PasswordHash,
		Username:     updatedUser.Username,
		ImageUrl:     updatedImageUrl,
		CreatedAt:    updatedUser.CreatedAt.Time,
		UpdatedAt:    updatedUser.UpdatedAt.Time,
		Role:         updatedUser.Role,
	}

	return c.JSON(http.StatusOK, userResp)
}

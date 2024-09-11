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

func GetUsers(c echo.Context) error {
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
	Username *string `json:"username"`
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

	var imageUrl sql.NullString
	var username string

	if updateUserReq.ImageUrl != nil {
		imageUrl = sql.NullString{String: *updateUserReq.ImageUrl, Valid: true}
	} else {
		imageUrl = user.ImageUrl
	}

	if updateUserReq.Username != nil {
		username = *updateUserReq.Username
	} else {
		username = user.Username
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
		Username: username,
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
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	userToUpdateId, err := uuid.Parse(c.Param("userId"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid user id")
	}

	user, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached update user by admin without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	if user.ID == userToUpdateId {
		return echo.NewHTTPError(http.StatusBadRequest, "Can not update self")
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
		log.Println("Failed to update user: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to update user")
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

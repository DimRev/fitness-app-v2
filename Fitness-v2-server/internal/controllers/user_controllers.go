package controllers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/labstack/echo"
)

type UpdateUserRequest struct {
	ImageUrl *string `json:"image_url"`
	Username *string `json:"username"`
}

func UpdateUser(c echo.Context) error {
	updateUserReq := UpdateUserRequest{}
	if err := c.Bind(&updateUserReq); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
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

	respUser := models.User{
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

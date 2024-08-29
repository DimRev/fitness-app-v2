package controllers

import (
	"log"
	"net/http"
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/services"
	"github.com/labstack/echo"
	"github.com/lib/pq"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c echo.Context) error {
	loginReq := LoginRequest{}
	if err := c.Bind(&loginReq); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	user, err := config.Queries.GetUserByEmail(c.Request().Context(), loginReq.Email)
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "wrong email or password",
		})
	}

	err = services.ComparePassword(loginReq.Password, user.PasswordHash)
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "wrong email or password",
		})
	}

	token := services.CreateJwt(user.ID)
	cookie, err := services.GenerateAndSignCookie(token)
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to create cookie",
		})
	}
	c.SetCookie(cookie)

	var imageUrl *string
	if user.ImageUrl.Valid {
		imageUrl = &user.ImageUrl.String
	}

	respUser := models.User{
		ID:           user.ID,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
		Username:     user.Username,
		ImageUrl:     imageUrl,
		CreatedAt:    user.CreatedAt.Time,
		UpdatedAt:    user.UpdatedAt.Time,
	}

	return c.JSON(http.StatusOK, respUser)
}

func Logout(c echo.Context) error {
	cookie := new(http.Cookie)
	cookie.Name = "jwt"
	cookie.Value = ""
	cookie.HttpOnly = true
	cookie.Expires = time.Now().Add(-time.Hour * 24)
	cookie.Path = "/"
	c.SetCookie(cookie)

	return c.JSON(http.StatusOK, map[string]string{
		"message": "logged out",
	})
}

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(c echo.Context) error {
	registerReq := RegisterRequest{}
	if err := c.Bind(&registerReq); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	hash, err := services.HashPassword(registerReq.Password)
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to create user",
		})
	}

	createUserParams := database.CreateUserParams{
		Email:        registerReq.Email,
		Username:     registerReq.Username,
		PasswordHash: hash,
	}

	user, err := config.Queries.CreateUser(c.Request().Context(), createUserParams)
	if err != nil {
		log.Println(err)
		pgErr := err.(*pq.Error)
		switch pgErr.Code {
		case "23505":
			return c.JSON(http.StatusConflict, map[string]string{
				"message": "email already exists",
			})
		default:
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"message": "failed to create user",
			})
		}
	}

	token := services.CreateJwt(user.ID)
	cookie, err := services.GenerateAndSignCookie(token)
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to create cookie",
		})
	}
	c.SetCookie(cookie)

	var imageUrl *string
	if user.ImageUrl.Valid {
		imageUrl = &user.ImageUrl.String
	}

	respUser := models.User{
		ID:           user.ID,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
		Username:     user.Username,
		ImageUrl:     imageUrl,
		CreatedAt:    user.CreatedAt.Time,
		UpdatedAt:    user.UpdatedAt.Time,
	}
	return c.JSON(http.StatusOK, respUser)
}

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
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c echo.Context) error {
	loginReq := LoginRequest{}
	if err := c.Bind(&loginReq); err != nil {
		c.JSON(400, map[string]string{
			"message": "malformed request",
		})
	}

	user, err := config.Queries.GetUserByEmail(c.Request().Context(), loginReq.Email)
	if err != nil {
		log.Println(err)
		c.JSON(500, map[string]string{
			"message": "wrong email or password",
		})
	}

	err = services.ComparePassword(loginReq.Password, user.PasswordHash)
	if err != nil {
		log.Println(err)
		c.JSON(500, map[string]string{
			"message": "wrong email or password",
		})
	}

	token := services.CreateJwt(user.ID)
	cookie, err := services.GenerateAndSignCookie(token)
	if err != nil {
		log.Println(err)
		c.JSON(500, map[string]string{
			"message": "failed to create cookie",
		})
	}
	c.SetCookie(cookie)

	respUser := models.User{
		ID:           user.ID.String(),
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
		Username:     user.Username,
		ImageUrl:     user.ImageUrl,
		CreatedAt:    user.CreatedAt,
		UpdatedAt:    user.UpdatedAt,
	}

	return c.JSON(200, respUser)
}

func Logout(c echo.Context) error {
	cookie := new(http.Cookie)
	cookie.Name = "jwt"
	cookie.Value = ""
	cookie.HttpOnly = true
	cookie.Expires = time.Now().Add(time.Hour * 24)
	c.SetCookie(cookie)

	return c.JSON(200, map[string]string{
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
		c.JSON(400, map[string]string{
			"message": "malformed request",
		})
	}

	hash, err := services.HashPassword(registerReq.Password)
	if err != nil {
		log.Println(err)
		c.JSON(500, map[string]string{
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
		c.JSON(500, map[string]string{
			"message": "failed to create user",
		})
	}

	token := services.CreateJwt(user.ID)
	cookie, err := services.GenerateAndSignCookie(token)
	if err != nil {
		log.Println(err)
		c.JSON(500, map[string]string{
			"message": "failed to create cookie",
		})
	}
	c.SetCookie(cookie)

	respUser := models.User{
		ID:           user.ID.String(),
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
		Username:     user.Username,
		ImageUrl:     user.ImageUrl,
		CreatedAt:    user.CreatedAt,
		UpdatedAt:    user.UpdatedAt,
	}
	return c.JSON(200, respUser)
}

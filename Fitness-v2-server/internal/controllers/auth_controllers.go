package controllers

import (
	"database/sql"
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
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	if err := config.DB.Ping(); err != nil {
		log.Println("Connection to database failed: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to login",
		})
	}

	user, err := config.Queries.GetUserByEmail(c.Request().Context(), loginReq.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
				"message": "wrong email or password",
			})
		}
		log.Println("Failed to get user by email: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to login")
	}

	err = services.ComparePassword(loginReq.Password, user.PasswordHash)
	if err != nil {
		log.Println("Failed to compare password: ", err)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "wrong email or password",
		})
	}

	sessionToken, err := services.GenerateAndRefresh(c, user.ID)
	if err != nil {
		log.Println("Failed to generate session: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to generate session",
		})
	}

	token := services.CreateJwt(user.ID)
	cookie, err := services.GenerateAndSignCookie(token)
	if err != nil {
		log.Println("Failed to create cookie: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
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

		SessionToken: sessionToken,
	}

	return c.JSON(http.StatusOK, respUser)
}

func Logout(c echo.Context) error {
	sessionToken, ok := c.Get("session_token").(string)
	if !ok {
		log.Printf("Reached logout without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	cookie := new(http.Cookie)
	cookie.Name = "jwt"
	cookie.Value = ""
	cookie.HttpOnly = true
	cookie.Expires = time.Now().Add(-time.Hour * 24)
	cookie.Path = "/"

	if config.ENV == "production" {
		cookie.Secure = true
		cookie.SameSite = http.SameSiteNoneMode
	} else {
		cookie.Secure = false
		cookie.SameSite = http.SameSiteLaxMode
	}

	c.SetCookie(cookie)

	err := services.DeleteSession(c, sessionToken)
	if err != nil {
		log.Println("Failed to delete session: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to delete session",
		})
	}

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
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	hash, err := services.HashPassword(registerReq.Password)
	if err != nil {
		log.Println("Failed to hash password: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to create user",
		})
	}

	createUserParams := database.CreateUserParams{
		Email:        registerReq.Email,
		Username:     registerReq.Username,
		PasswordHash: hash,
	}

	if err := config.DB.Ping(); err != nil {
		log.Println("Connection to database failed: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to create user",
		})
	}

	user, err := config.Queries.CreateUser(c.Request().Context(), createUserParams)
	if err != nil {
		log.Println("Failed to create user: ", err)
		if pgErr, ok := err.(*pq.Error); ok {
			switch pgErr.Code {
			case "23505":
				return echo.NewHTTPError(http.StatusConflict, map[string]string{
					"message": "email already exists",
				})
			default:
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "failed to create user",
				})
			}
		} else {
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "failed to create user",
			})
		}
	}

	sessionToken, err := services.GenerateAndRefresh(c, user.ID)
	if err != nil {
		log.Println("Failed to generate session: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to generate session",
		})
	}

	token := services.CreateJwt(user.ID)
	cookie, err := services.GenerateAndSignCookie(token)
	if err != nil {
		log.Println("Failed to create cookie: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
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

		SessionToken: sessionToken,
	}
	return c.JSON(http.StatusOK, respUser)
}

func LoginFromCookie(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached login from cookie without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

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

type LoginWithSessionRequest struct {
	SessionToken string `json:"session_token"`
}

func LoginWithSession(c echo.Context) error {
	loginWithSessionReq := LoginWithSessionRequest{}
	if err := c.Bind(&loginWithSessionReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	userId, err := services.ValidateSession(c, loginWithSessionReq.SessionToken)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "invalid session token")
	}

	user, err := config.Queries.GetUserByID(c.Request().Context(), userId)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "invalid session token")
	}

	token := services.CreateJwt(user.ID)
	cookie, err := services.GenerateAndSignCookie(token)
	if err != nil {
		log.Println("Failed to create cookie: ", err)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
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

		SessionToken: loginWithSessionReq.SessionToken,
	}

	return c.JSON(http.StatusOK, respUser)
}

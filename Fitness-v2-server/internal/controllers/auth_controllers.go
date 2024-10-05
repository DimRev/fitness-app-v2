package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/services"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
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
			"message": "Failed to login, malformed request",
		})
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogError("auth_controllers.go", "Login", fmt.Errorf("connection to database failed : %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to login, trouble with server",
		})
	}

	user, err := config.Queries.GetUserByEmail(c.Request().Context(), loginReq.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
				"message": "Failed to login, wrong email or password",
			})
		}
		utils.FmtLogError("auth_controllers.go", "Login", fmt.Errorf("failed to get user by email: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to login, trouble with server",
		})
	}

	err = services.ComparePassword(loginReq.Password, user.PasswordHash)
	if err != nil {
		utils.FmtLogError("auth_controllers.go", "Login", fmt.Errorf("failed to compare password: %s", err))
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to login, wrong email or password",
		})
	}

	sessionToken, err := services.GenerateAndRefresh(c, user.ID)
	if err != nil {
		utils.FmtLogError("auth_controllers.go", "Login", fmt.Errorf("failed to generate session: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to login, trouble with session",
		})
	}

	token := services.CreateJwt(user.ID)
	cookie, err := services.GenerateAndSignCookie(token)
	if err != nil {
		utils.FmtLogError("auth_controllers.go", "Login", fmt.Errorf("failed to create cookie: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to login, trouble with cookie",
		})
	}
	c.SetCookie(cookie)

	var imageUrl *string
	if user.ImageUrl.Valid {
		imageUrl = &user.ImageUrl.String
	}

	respUser := models.AuthUser{
		ID:           user.ID,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
		Username:     user.Username,
		ImageUrl:     imageUrl,
		CreatedAt:    user.CreatedAt.Time,
		UpdatedAt:    user.UpdatedAt.Time,

		Role:         user.Role,
		SessionToken: sessionToken,
	}

	return c.JSON(http.StatusOK, respUser)
}

func Logout(c echo.Context) error {
	recCookie, err := c.Cookie("jwt")
	// Delete session upon logging out if a session exists
	if err == nil {
		issuer, err := services.ExtractIssuerFromCookie(recCookie.Value)
		if err == nil {
			user, err := config.Queries.GetUserByID(c.Request().Context(), issuer)
			if err == nil {
				sessionToken, err := services.GenerateSession(c, user.ID)
				if err == nil {
					err := services.DeleteSession(c, sessionToken)
					if err != nil {
						utils.FmtLogError("auth_controllers.go", "Logout", fmt.Errorf("failed to delete session: %s", err))
						return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
							"message": "Failed to logout, trouble with session",
						})
					}
				}
			}
		}
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

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Logged out",
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
			"message": "Failed to register, malformed request",
		})
	}

	hash, err := services.HashPassword(registerReq.Password)
	if err != nil {
		utils.FmtLogError("auth_controllers.go", "Register", fmt.Errorf("failed to hash password: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to register, trouble with server",
		})
	}

	createUserParams := database.CreateUserParams{
		Email:        registerReq.Email,
		Username:     registerReq.Username,
		PasswordHash: hash,
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogError("auth_controllers.go", "Register", fmt.Errorf("connection to database failed : %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to register, trouble with server",
		})
	}

	user, err := config.Queries.CreateUser(c.Request().Context(), createUserParams)
	if err != nil {
		utils.FmtLogError("auth_controllers.go", "Register", fmt.Errorf("failed to create user: %s", err))
		if pgErr, ok := err.(*pq.Error); ok {
			switch pgErr.Code {
			case "23505":
				return echo.NewHTTPError(http.StatusConflict, map[string]string{
					"message": "Failed to register, email already exists",
				})
			default:
				return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
					"message": "Failed to register, trouble with server",
				})
			}
		} else {
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "Failed to register, trouble with server",
			})
		}
	}

	sessionToken, err := services.GenerateAndRefresh(c, user.ID)
	if err != nil {
		utils.FmtLogError("auth_controllers.go", "Register", fmt.Errorf("failed to generate session: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to register, trouble with session",
		})
	}

	token := services.CreateJwt(user.ID)
	cookie, err := services.GenerateAndSignCookie(token)
	if err != nil {
		utils.FmtLogError("auth_controllers.go", "Register", fmt.Errorf("failed to create cookie: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to register, trouble with cookie",
		})
	}
	c.SetCookie(cookie)

	var imageUrl *string
	if user.ImageUrl.Valid {
		imageUrl = &user.ImageUrl.String
	}

	respUser := models.AuthUser{
		ID:           user.ID,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
		Username:     user.Username,
		ImageUrl:     imageUrl,
		CreatedAt:    user.CreatedAt.Time,
		UpdatedAt:    user.UpdatedAt.Time,

		Role:         user.Role,
		SessionToken: sessionToken,
	}
	return c.JSON(http.StatusOK, respUser)
}

func LoginFromCookie(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		utils.FmtLogError("auth_controllers.go", "LoginFromCookie", fmt.Errorf("reached login from cookie without user"))
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to login, unauthorized",
		})
	}

	sessionToken, err := services.GenerateAndRefresh(c, user.ID)
	if err != nil {
		utils.FmtLogError("auth_controllers.go", "LoginFromCookie", fmt.Errorf("failed to generate session: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to login, trouble with session",
		})
	}

	var imageUrl *string
	if user.ImageUrl.Valid {
		imageUrl = &user.ImageUrl.String
	}

	respUser := models.AuthUser{
		ID:           user.ID,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
		Username:     user.Username,
		ImageUrl:     imageUrl,
		CreatedAt:    user.CreatedAt.Time,
		UpdatedAt:    user.UpdatedAt.Time,

		Role:         user.Role,
		SessionToken: sessionToken,
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
			"message": "Failed to login, malformed request",
		})
	}

	userId, err := services.ValidateSession(c, loginWithSessionReq.SessionToken)
	if err != nil {
		utils.FmtLogError("auth_controllers.go", "LoginWithSession", fmt.Errorf("failed to validate session: %s", err))
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to login, invalid session token",
		})
	}

	user, err := config.Queries.GetUserByID(c.Request().Context(), userId)
	if err != nil {
		utils.FmtLogError("auth_controllers.go", "LoginWithSession", fmt.Errorf("failed to get user: %s", err))
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to login, invalid session token",
		})
	}

	token := services.CreateJwt(user.ID)
	cookie, err := services.GenerateAndSignCookie(token)
	if err != nil {
		utils.FmtLogError("auth_controllers.go", "LoginWithSession", fmt.Errorf("failed to create cookie: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to login, failed to create cookie",
		})
	}
	c.SetCookie(cookie)

	var imageUrl *string
	if user.ImageUrl.Valid {
		imageUrl = &user.ImageUrl.String
	}

	respUser := models.AuthUser{
		ID:           user.ID,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
		Username:     user.Username,
		ImageUrl:     imageUrl,
		CreatedAt:    user.CreatedAt.Time,
		UpdatedAt:    user.UpdatedAt.Time,

		Role:         user.Role,
		SessionToken: loginWithSessionReq.SessionToken,
	}

	return c.JSON(http.StatusOK, respUser)
}

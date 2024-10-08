// auth_middleware.go
package middleware

import (
	"net/http"
	"strings"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/services"
	"github.com/labstack/echo"
)

func ProtectedRoute(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cookie, err := c.Cookie("jwt")
		if err != nil {
			if strings.Contains(err.Error(), "named cookie not present") {
				return echo.NewHTTPError(http.StatusUnauthorized, "missing or invalid jwt")
			}
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}

		issuer, err := services.ExtractIssuerFromCookie(cookie.Value)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "invalid jwt token")
		}

		user, err := config.Queries.GetUserByID(c.Request().Context(), issuer)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "invalid jwt token")
		}

		sessionToken, err := services.GenerateAndRefresh(c, user.ID)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
				"message": "failed to generate session",
			})
		}

		c.Set("session_token", sessionToken)
		c.Set("user", user)

		return next(c)
	}
}

// ProtectedRouteWithRoles checks if the user has a role in the given roles array, comes AFTER the ProtectedRoute middleware
func ProtectedRouteWithRoles(next echo.HandlerFunc, roles []database.UserRole) echo.HandlerFunc {
	return func(c echo.Context) error {
		user := c.Get("user")
		if user == nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "user not found in context")
		}

		userDetails, ok := user.(database.User)
		if !ok {
			return echo.NewHTTPError(http.StatusUnauthorized, "invalid user type")
		}

		isUserOfRole := false
		for _, role := range roles {
			if userDetails.Role == role {
				isUserOfRole = true
				break
			}
		}

		if !isUserOfRole {
			return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
		}

		return next(c)
	}
}

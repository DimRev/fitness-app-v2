// auth_middleware.go
package middleware

import (
	"net/http"
	"strings"

	"github.com/DimRev/Fitness-v2-server/internal/config"
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

		c.Set("user", user)

		return next(c)
	}
}
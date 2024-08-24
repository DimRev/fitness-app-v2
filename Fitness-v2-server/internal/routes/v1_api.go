package routes

import "github.com/labstack/echo"

func V1ApiRoutes(e *echo.Echo) {
	v1 := e.Group("/api/v1")

	AuthRoutesV1(v1)
}

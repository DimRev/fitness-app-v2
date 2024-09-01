package routes

import "github.com/labstack/echo"

func V1ApiRoutes(e *echo.Echo) {
	v1 := e.Group("/api/v1")

	AuthRoutesV1(v1)
	MealRoutesV1(v1)
	UserRoutesV1(v1)
	FoodItemPendingRoutesV1(v1)
	FoodItemPendingRoutesV1(v1)
}

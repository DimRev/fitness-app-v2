package routes

import "github.com/labstack/echo"

func V1ApiRoutes(e *echo.Echo) {
	v1 := e.Group("/api/v1")
	{
		AuthRoutesV1(v1)
		MealRoutesV1(v1)
		UserRoutesV1(v1)
		FoodItemRoutesV1(v1)
		FoodItemPendingRoutesV1(v1)
		ChartRoutesV1(v1)
		CalendarRoutesV1(v1)
		UploadRoutesV1(v1)
		MeasurementRoutesV1(v1)
		NotificationRoutesV1(v1)
		SupportTicketRoutesV1(v1)
		CronRoutesV1(v1)
		ScoreRoutesV1(v1)
	}
}

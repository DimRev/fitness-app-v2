package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func CalendarRoutesV1(e *echo.Group) {
	calendar := e.Group("/calendar", middleware.ProtectedRoute)
	{
		calendar.GET("", controllers.GetCalendarDataByDate)
	}
}

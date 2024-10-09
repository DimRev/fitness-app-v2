package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func SupportTicketRoutesV1(e *echo.Group) {
	supportTicket := e.Group("/support_tickets", middleware.ProtectedRoute)
	{
		supportTicket.GET("", middleware.ProtectedRouteWithRoles(
			controllers.GetSupportTickets,
			[]database.UserRole{database.UserRoleAdmin},
		))
		supportTicket.POST("", controllers.CreateSupportTicket)
	}
}

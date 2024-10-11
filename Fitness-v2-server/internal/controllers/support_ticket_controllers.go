package controllers

import (
	"fmt"
	"math"
	"net/http"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/labstack/echo"
)

func GetSupportTickets(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok && user.Role != database.UserRoleAdmin {
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get support tickets, unauthorized",
		})
	}

	offset := int32(0)
	limit := int32(10)

	if offsetStr := c.QueryParam("offset"); offsetStr != "" {
		convOffset, err := utils.SafeParseStrToInt32(offsetStr, 0, math.MaxInt32)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to get support tickets, invalid offset",
			})
		}
		offset = int32(convOffset)
	}

	if limitStr := c.QueryParam("limit"); limitStr != "" {
		convLimit, err := utils.SafeParseStrToInt32(limitStr, 1, 100)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
				"message": "Failed to get support tickets, invalid limit",
			})
		}
		limit = int32(convLimit)
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogError(
			"support_ticket_controllers.go",
			"GetSupportTickets",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get support tickets, trouble with server",
		})
	}

	getSupportTicketsParams := database.GetSupportTicketsParams{
		Limit:  limit,
		Offset: offset,
	}

	supportTickets, err := config.Queries.GetSupportTickets(c.Request().Context(), getSupportTicketsParams)
	if err != nil {
		utils.FmtLogError(
			"support_ticket_controllers.go",
			"GetSupportTickets",
			fmt.Errorf("failed to get support tickets: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get support tickets, trouble with server",
		})
	}

	supportTicketsResp := make([]models.SupportTicket, len(supportTickets))
	for i, supportTicket := range supportTickets {
		supportTicketsResp[i] = models.SupportTicket{
			ID:          supportTicket.ID.String(),
			SupportType: supportTicket.SupportTicketType,
			Title:       supportTicket.Title,
			Description: supportTicket.Description,
			IsClosed:    supportTicket.IsClosed.Bool,

			UpdatedAt: supportTicket.UpdatedAt.Time,
			CreatedAt: supportTicket.CreatedAt.Time,

			Author: user.Email,
		}
	}
	return c.JSON(http.StatusOK, supportTicketsResp)
}

type CreateSupportTicketRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	SupportType string `json:"support_type"`
}

func CreateSupportTicket(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to create support ticket, unauthorized",
		})
	}

	createSupportTickerReq := CreateSupportTicketRequest{}

	if err := c.Bind(&createSupportTickerReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create support ticket, malformed request",
		})
	}

	if err := config.DB.Ping(); err != nil {
		utils.FmtLogError(
			"support_ticket_controllers.go",
			"CreateSupportTicket",
			fmt.Errorf("connection to database failed : %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create support ticket, trouble with server",
		})
	}

	supportTicketType := database.SupportTicketTypes(createSupportTickerReq.SupportType)
	if err := supportTicketType.Scan(string(createSupportTickerReq.SupportType)); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to create support ticket, invalid support type",
		})
	}

	createSupportTicketParams := database.CreateSupportTicketParams{
		Title:             createSupportTickerReq.Title,
		SupportTicketType: supportTicketType,
		Description:       createSupportTickerReq.Description,
		UserID:            user.ID,
	}

	supportTicket, err := config.Queries.CreateSupportTicket(c.Request().Context(), createSupportTicketParams)
	if err != nil {
		utils.FmtLogError(
			"support_ticket_controllers.go",
			"CreateSupportTicket",
			fmt.Errorf("failed to create support ticket: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to create support ticket, trouble with server",
		})
	}

	supportTicketResp := models.SupportTicket{
		ID:          supportTicket.ID.String(),
		Title:       supportTicket.Title,
		Description: supportTicket.Description,
		Author:      user.Email,
		SupportType: supportTicket.SupportTicketType,
		IsClosed:    supportTicket.IsClosed.Bool,
		UpdatedAt:   supportTicket.UpdatedAt.Time,
		CreatedAt:   supportTicket.CreatedAt.Time,
	}

	return c.JSON(http.StatusOK, supportTicketResp)
}

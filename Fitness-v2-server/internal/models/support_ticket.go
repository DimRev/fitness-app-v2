package models

import (
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/database"
)

type SupportTicket struct {
	ID          string                      `json:"id"`
	Title       string                      `json:"title"`
	SupportType database.SupportTicketTypes `json:"support_type"`
	Description string                      `json:"description"`
	IsClosed    bool                        `json:"is_closed"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"-"`

	Author  string  `json:"author"`
	Handler *string `json:"handler,omitempty"`
}

type SupportTicketsWithPages struct {
	SupportTickets []SupportTicket `json:"support_tickets"`
	TotalPages     int64           `json:"total_pages"`
	TotalItems     int64           `json:"total_items"`
}

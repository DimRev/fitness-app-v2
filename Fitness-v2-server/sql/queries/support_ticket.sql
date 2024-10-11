-- name: GetSupportTickets :many
SELECT * FROM support_tickets
LIMIT $1
OFFSET $2;

-- name: CreateSupportTicket :one
INSERT INTO support_tickets (
  support_ticket_type,
  title,
  description,
  owner_id
) 
VALUES (
  $1,
  $2,
  $3,
  $4
)
RETURNING *;

-- name: GetSupportTicketsRowCount :one
SELECT COUNT(*) AS total_rows
FROM support_tickets;

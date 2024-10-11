-- +goose Up
CREATE TYPE support_ticket_types AS ENUM (
  'bug',
  'feature',
  'question'
);

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  support_ticket_type support_ticket_types NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),


  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- +goose Down

DROP TABLE support_tickets;
DROP TYPE support_ticket_types;
-- +goose Up
CREATE TABLE score (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  score INT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  details TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE score;
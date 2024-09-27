-- +goose Up

CREATE TABLE measurements (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  weight NUMERIC(10, 2) NOT NULL,
  height NUMERIC(10, 2) NOT NULL,

  date DATE NOT NULL,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, date)
)

-- +goose Down

DROP TABLE measurements;
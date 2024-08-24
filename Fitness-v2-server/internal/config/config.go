package config

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)

var Queries *database.Queries
var Port string
var JwtSecret string

func New() error {
	err := godotenv.Load()
	if err != nil {
		return err
	}

	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		return fmt.Errorf("DATABASE_URL environment variable not set")
	}

	port := os.Getenv("PORT")
	if port == "" {
		return fmt.Errorf("PORT environment variable not set")
	}
	Port = port

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return fmt.Errorf("JWT_SECRET environment variable not set")
	}
	JwtSecret = jwtSecret

	db, err := sql.Open("postgres", dbUrl)
	if err != nil {
		return fmt.Errorf("error opening database: %w", err)
	}
	defer db.Close()

	Queries = database.New(db)

	return nil
}

package config

import (
	"database/sql"
	"fmt"
	"os"
	"strings"

	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/joho/godotenv"
	"github.com/pressly/goose/v3"

	_ "github.com/jackc/pgx/v4/stdlib"
	// _ "github.com/lib/pq"
)

var (
	Queries   *database.Queries
	Port      string
	JwtSecret string
	DB        *sql.DB
	CORS      []string
)

func New() error {
	// Try to load .env file, but don't fail if it doesn't exist
	_ = godotenv.Load()

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

	corsStr := os.Getenv("CORS")
	if corsStr == "" {
		return fmt.Errorf("CORS environment variable not set")
	}
	CORS = strings.Split(corsStr, ",")

	// Use a separate connection for Goose migration
	// ---------------------------------------------
	gooseDBconn, err := goose.OpenDBWithDriver("postgres", dbUrl)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}
	defer gooseDBconn.Close()

	migrationDir := "sql/schema"
	if err := goose.Up(gooseDBconn, migrationDir); err != nil {
		return fmt.Errorf("failed to run migrations: %v", err)
	}

	// Print the current migration status
	if err := goose.Status(gooseDBconn, migrationDir); err != nil {
		return fmt.Errorf("failed to print migration status: %v", err)
	}
	// ---------------------------------------------

	db, err := sql.Open("postgres", dbUrl)
	if err != nil {
		return fmt.Errorf("error opening database: %w", err)
	}

	// Assign the database connection to the global variable
	DB = db
	Queries = database.New(db)

	return nil
}

// Close will close the database connection gracefully
func Close() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
}

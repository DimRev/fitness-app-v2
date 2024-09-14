package config

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"strings"

	"github.com/DimRev/Fitness-v2-server/internal/database"
	awsConfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/joho/godotenv"
	"github.com/pressly/goose/v3"

	_ "github.com/jackc/pgx/v4/stdlib"
	// _ "github.com/lib/pq"
)

var (
	Queries               *database.Queries
	Port                  string
	JwtSecret             string
	DB                    *sql.DB
	CORS                  []string
	ENV                   string
	AWS_BUCKET_NAME       string
	AWS_BUCKET_REGION     string
	AWS_ACCESS_KEY        string
	AWS_SECRET_ACCESS_KEY string
	S3Client              *s3.Client
)

func New() error {
	// Try to load .env file, but don't fail if it doesn't exist
	_ = godotenv.Load()

	/* -----------------------------------------------------------------------------
	----------------------------- SETTING EVN VARIABLES ----------------------------
	----------------------------------------------------------------------------- */

	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		return fmt.Errorf("DATABASE_URL environment variable not set")
	}

	Port = os.Getenv("PORT")
	if Port == "" {
		return fmt.Errorf("PORT environment variable not set")
	}

	JwtSecret = os.Getenv("JWT_SECRET")
	if JwtSecret == "" {
		return fmt.Errorf("JWT_SECRET environment variable not set")
	}

	corsStr := os.Getenv("CORS")
	if corsStr == "" {
		return fmt.Errorf("CORS environment variable not set")
	}
	CORS = strings.Split(corsStr, ",")

	ENV = os.Getenv("ENV")
	if ENV == "" {
		return fmt.Errorf("ENV environment variable not set")
	}

	AWS_BUCKET_NAME = os.Getenv("AWS_BUCKET_NAME")
	if AWS_BUCKET_NAME == "" {
		return fmt.Errorf("AWS_BUCKET_NAME environment variable not set")
	}

	AWS_BUCKET_REGION = os.Getenv("AWS_BUCKET_REGION")
	if AWS_BUCKET_REGION == "" {
		return fmt.Errorf("AWS_BUCKET_REGION environment variable not set")
	}

	AWS_ACCESS_KEY = os.Getenv("AWS_ACCESS_KEY")
	if AWS_ACCESS_KEY == "" {
		return fmt.Errorf("AWS_ACCESS_KEY environment variable not set")
	}

	AWS_SECRET_ACCESS_KEY = os.Getenv("AWS_SECRET_ACCESS_KEY")
	if AWS_SECRET_ACCESS_KEY == "" {
		return fmt.Errorf("AWS_SECRET_ACCESS_KEY environment variable not set")
	}

	/* -----------------------------------------------------------------------------
	-------------------------- STARTING SERVICE CLIENTS ----------------------------
	----------------------------------------------------------------------------- */

	// -----------------------------------------------------------------------------
	// ------------ SETUP GOOSE TO RUN MIGRATIONS AND CLOSE CONN AFTERWARDS --------
	// -----------------------------------------------------------------------------

	gooseDBconn, err := goose.OpenDBWithDriver("postgres", dbUrl)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}
	defer gooseDBconn.Close()

	migrationDir := "sql/schema"
	if err := goose.Up(gooseDBconn, migrationDir); err != nil {
		return fmt.Errorf("failed to run migrations: %v", err)
	}

	// PRINT CURRENT MIGRATIONS STATUS
	if err := goose.Status(gooseDBconn, migrationDir); err != nil {
		return fmt.Errorf("failed to print migration status: %v", err)
	}
	// -----------------------------------------------------------------------------
	// ---------------------- POSTGRES DATABASE CONNECTION -------------------------
	// -----------------------------------------------------------------------------

	db, err := sql.Open("pgx", dbUrl)
	if err != nil {
		return fmt.Errorf("error opening database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return fmt.Errorf("database ping failed: %v", err)
	}

	DB = db
	Queries = database.New(db)
	// -----------------------------------------------------------------------------
	// ---------------------- AWS S3 BUCKET CONNECTION -----------------------------
	// -----------------------------------------------------------------------------

	cfg, err := awsConfig.LoadDefaultConfig(
		context.TODO(),
		awsConfig.WithRegion(AWS_BUCKET_REGION),
		awsConfig.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, ""),
		),
	)
	if err != nil {
		return fmt.Errorf("error loading AWS config: %w", err)
	}

	S3Client = s3.NewFromConfig(cfg)
	resp, err := S3Client.ListObjectsV2(context.TODO(), &s3.ListObjectsV2Input{
		Bucket: &AWS_BUCKET_NAME,
	})
	if err != nil {
		return fmt.Errorf("unable to list items in bucket %q, %v", AWS_BUCKET_NAME, err)
	}
	fmt.Printf("Connection to AWS S3 Bucket %q established(Bucket has %d items)\n", AWS_BUCKET_NAME, len(resp.Contents))

	return nil
}

// SETUP CLEANUP FUNCTION TO CLOSE CONNS
func Close() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
}

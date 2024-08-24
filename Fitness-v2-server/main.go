package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	e := echo.New()

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatalf("PORT environment variable not set")
	}

	e.GET("/", func(c echo.Context) error {
		return c.String(200, "Hello, World!")
	})

	e.Logger.Fatal(e.Start(":" + port))
}

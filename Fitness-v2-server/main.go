package main

import (
	"log"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/routes"
	"github.com/labstack/echo"
)

func main() {
	if err := config.New(); err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := config.Close(); err != nil {
			log.Println("Error closing database connection:", err)
		}
	}()

	e := echo.New()

	routes.V1ApiRoutes(e)

	e.GET("/", func(c echo.Context) error {
		return c.String(200, "Hello, World!")
	})

	e.Logger.Fatal(e.Start(":" + config.Port))
}

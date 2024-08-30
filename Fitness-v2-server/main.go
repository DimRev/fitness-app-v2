package main

import (
	"log"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/routes"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
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
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     config.CORS,
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowCredentials: true,
		AllowMethods: []string{
			echo.GET,
			echo.PUT,
			echo.POST,
			echo.DELETE,
		},
	}))

	log.Printf("Server settings\nCors: %v\nAllowHeaders: %v\nAllowCredentials: %v\nAllowMethods: %v\n",
		config.CORS,
		[]string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		true,
		[]string{echo.GET, echo.PUT, echo.POST, echo.DELETE})

	routes.V1ApiRoutes(e)

	e.GET("/", func(c echo.Context) error {
		return c.String(200, "Hello, World!")
	})
	e.Logger.Fatal(e.Start(":" + config.Port))
}

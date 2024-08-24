package handlers

import "github.com/labstack/echo"

func Login(c echo.Context) error {
	return c.String(200, "Login")
}

func Logout(c echo.Context) error {
	return c.String(200, "Logout")
}

func Register(c echo.Context) error {
	return c.String(200, "Register")
}

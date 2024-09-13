package controllers

import (
	"net/http"

	"github.com/labstack/echo"
)

type UploadRequest struct {
	FileName string `json:"file_name"`
	FileType string `json:"file_type"`
	FileSize int    `json:"file_size"`
}

func GenerateSignedUrl(c echo.Context) error {
	uploadReq := UploadRequest{}
	if err := c.Bind(&uploadReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	return c.JSON(http.StatusOK, uploadReq)
}

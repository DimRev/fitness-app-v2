package controllers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
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

	presignedClient := s3.NewPresignClient(config.S3Client)

	objKey := "fitness-app-v2/" + uploadReq.FileName
	req, err := presignedClient.PresignPutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(config.AWS_BUCKET_NAME),
		Key:    aws.String(objKey),
	}, s3.WithPresignExpires(time.Minute))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to generate presigned url",
		})
	}

	fmt.Printf("Presigned URL: %s\n", req.URL)

	return c.JSON(http.StatusOK, uploadReq)
}

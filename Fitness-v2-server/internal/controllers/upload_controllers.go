package controllers

import (
	"context"
	"log"
	"net/http"
	"path/filepath"
	"slices"
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
	"github.com/labstack/echo"
)

type GetPresignedUrlAvatarRequestBody struct {
	FileName string `json:"file_name"`
	FileType string `json:"file_type"`
	FileSize int    `json:"file_size"`
	CheckSum string `json:"check_sum"`
}

func GetPresignedUrlAvatar(c echo.Context) error {
	_, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached create Meal without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	getPresignedUrlAvatarReqBody := GetPresignedUrlAvatarRequestBody{}
	if err := c.Bind(&getPresignedUrlAvatarReqBody); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	allowedFileTypes := []string{"image/jpeg", "image/png", "image/webp"}
	maxFileSize := 1024 * 1024 * 2 // 2 MB

	if !slices.Contains(allowedFileTypes, getPresignedUrlAvatarReqBody.FileType) {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "invalid file type",
		})
	}

	if getPresignedUrlAvatarReqBody.FileSize > maxFileSize {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "file size exceeds maximum allowed size",
		})
	}

	presignedClient := s3.NewPresignClient(config.S3Client)

	randomUUID := uuid.New().String()
	fileExtension := filepath.Ext(getPresignedUrlAvatarReqBody.FileName)
	objKey := "avatar/" + randomUUID + fileExtension

	req, err := presignedClient.PresignPutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:         aws.String(config.AWS_BUCKET_NAME),
		Key:            aws.String(objKey),
		ContentType:    aws.String(getPresignedUrlAvatarReqBody.FileType),
		ContentLength:  aws.Int64(int64(getPresignedUrlAvatarReqBody.FileSize)),
		ChecksumSHA256: aws.String(getPresignedUrlAvatarReqBody.CheckSum),
	}, s3.WithPresignExpires(time.Minute))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to generate presigned url",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"presigned_url": req.URL,
	})
}

type GetPresignedUrlFoodImageRequestBody struct {
	FileName string `json:"file_name"`
	FileType string `json:"file_type"`
	FileSize int    `json:"file_size"`
	CheckSum string `json:"check_sum"`
}

func GetPresignedUrlFoodImage(c echo.Context) error {
	_, ok := c.Get("user").(database.User)
	if !ok {
		log.Printf("Reached create Meal without user")
		return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	uploadReq := GetPresignedUrlFoodImageRequestBody{}
	if err := c.Bind(&uploadReq); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "malformed request",
		})
	}

	allowedFileTypes := []string{"image/jpeg", "image/png", "image/webp"}
	maxFileSize := 1024 * 1024 * 2 // 2 MB

	if !slices.Contains(allowedFileTypes, uploadReq.FileType) {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "invalid file type",
		})
	}

	if uploadReq.FileSize > maxFileSize {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "file size exceeds maximum allowed size",
		})
	}

	presignedClient := s3.NewPresignClient(config.S3Client)

	randomUUID := uuid.New().String()
	fileExtension := filepath.Ext(uploadReq.FileName)
	objKey := "food_image/" + randomUUID + fileExtension

	req, err := presignedClient.PresignPutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:         aws.String(config.AWS_BUCKET_NAME),
		Key:            aws.String(objKey),
		ContentType:    aws.String(uploadReq.FileType),
		ContentLength:  aws.Int64(int64(uploadReq.FileSize)),
		ChecksumSHA256: aws.String(uploadReq.CheckSum),
	}, s3.WithPresignExpires(time.Minute))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "failed to generate presigned url",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"presigned_url": req.URL,
	})
}

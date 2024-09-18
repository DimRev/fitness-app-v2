package controllers

import (
	"context"
	"fmt"
	"net/http"
	"path/filepath"
	"slices"
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
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
		utils.FmtLogError(
			"upload_controller.go",
			"GetPresignedUrlAvatar",
			fmt.Errorf("reached get presigned url avatar without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get presigned url avatar, unauthorized",
		})
	}

	getPresignedUrlAvatarReqBody := GetPresignedUrlAvatarRequestBody{}
	if err := c.Bind(&getPresignedUrlAvatarReqBody); err != nil {
		utils.FmtLogError(
			"upload_controller.go",
			"GetPresignedUrlAvatar",
			fmt.Errorf("failed to bind get presigned url avatar request: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get presigned url avatar, malformed request",
		})
	}

	allowedFileTypes := []string{"image/jpeg", "image/png", "image/webp"}
	maxFileSize := 1024 * 1024 * 2 // 2 MB

	if !slices.Contains(allowedFileTypes, getPresignedUrlAvatarReqBody.FileType) {
		utils.FmtLogError(
			"upload_controller.go",
			"GetPresignedUrlAvatar",
			fmt.Errorf("invalid file type: %s", getPresignedUrlAvatarReqBody.FileType),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get presigned url avatar, invalid file type",
		})
	}

	if getPresignedUrlAvatarReqBody.FileSize > maxFileSize {
		utils.FmtLogError(
			"upload_controller.go",
			"GetPresignedUrlAvatar",
			fmt.Errorf("file size exceeds maximum allowed size: %d", getPresignedUrlAvatarReqBody.FileSize),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get presigned url avatar, file size exceeds maximum allowed size",
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
		utils.FmtLogError(
			"upload_controller.go",
			"GetPresignedUrlAvatar",
			fmt.Errorf("failed to generate presigned url: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get presigned url avatar, trouble with server",
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
		utils.FmtLogError(
			"upload_controller.go",
			"GetPresignedUrlFoodImage",
			fmt.Errorf("reached get presigned url food image without user"),
		)
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get presigned url food image, unauthorized",
		})
	}

	uploadReq := GetPresignedUrlFoodImageRequestBody{}
	if err := c.Bind(&uploadReq); err != nil {
		utils.FmtLogError(
			"upload_controller.go",
			"GetPresignedUrlFoodImage",
			fmt.Errorf("failed to bind get presigned url food image request: %s", err),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get presigned url food image, malformed request",
		})
	}

	allowedFileTypes := []string{"image/jpeg", "image/png", "image/webp"}
	maxFileSize := 1024 * 1024 * 2 // 2 MB

	if !slices.Contains(allowedFileTypes, uploadReq.FileType) {
		utils.FmtLogError(
			"upload_controller.go",
			"GetPresignedUrlFoodImage",
			fmt.Errorf("invalid file type: %s", uploadReq.FileType),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get presigned url food image, invalid file type",
		})
	}

	if uploadReq.FileSize > maxFileSize {
		utils.FmtLogError(
			"upload_controller.go",
			"GetPresignedUrlFoodImage",
			fmt.Errorf("file size exceeds maximum allowed size: %d", uploadReq.FileSize),
		)
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Failed to get presigned url food image, file size exceeds maximum allowed size",
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
		utils.FmtLogError(
			"upload_controller.go",
			"GetPresignedUrlFoodImage",
			fmt.Errorf("failed to generate presigned url: %s", err),
		)
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get presigned url food image, trouble with server",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"presigned_url": req.URL,
	})
}

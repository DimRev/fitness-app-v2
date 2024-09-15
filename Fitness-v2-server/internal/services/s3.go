package services

import (
	"context"
	"fmt"
	"net/url"
	"strings"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func RemoveExistingS3Asset(au string) error {
	url, err := url.Parse(au)
	if err != nil {
		return fmt.Errorf("failed to parse image url[%s]: %s", au, err)
	}

	splitPath := strings.SplitN(url.Path, "/", 2)
	if len(splitPath) < 2 {
		return fmt.Errorf("could not extract object key from url")
	}
	objectKey := splitPath[1]

	deleteInput := &s3.DeleteObjectInput{
		Bucket: aws.String(config.AWS_BUCKET_NAME),
		Key:    aws.String(objectKey),
	}

	_, err = config.S3Client.DeleteObject(context.TODO(), deleteInput)
	if err != nil {
		return fmt.Errorf("failed to delete object: %v", err)
	}

	return nil
}

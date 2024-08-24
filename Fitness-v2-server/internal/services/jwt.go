package services

import (
	"fmt"
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/golang-jwt/jwt"
)

func CreateJwt(userId string) *jwt.Token {
	return jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    userId,
		ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
	})
}

func ExtractIssuerFromCookie(cookie string) (string, error) {
	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.JwtSecret), nil
	})
	if err != nil {
		return "", fmt.Errorf("error parsing token: %w", err)
	}
	claims := token.Claims.(*jwt.StandardClaims)
	return claims.Issuer, nil
}

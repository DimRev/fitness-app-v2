package services

import (
	"fmt"
	"net/http"
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

func GenerateAndSignCookie(token *jwt.Token) (*http.Cookie, error) {
	tokenString, err := token.SignedString([]byte(config.JwtSecret))
	if err != nil {
		return nil, fmt.Errorf("error signing token: %w", err)
	}

	cookie := new(http.Cookie)
	cookie.Name = "jwt"
	cookie.Value = tokenString
	cookie.HttpOnly = true
	cookie.Expires = time.Now().Add(time.Hour * 24)

	return cookie, nil
}

func ExtractIssuerFromCookie(cookie string) (string, error) {
	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.JwtSecret), nil
	})
	if err != nil {
		return "", fmt.Errorf("error parsing token: %w", err)
	}
	claims := token.Claims.(*jwt.StandardClaims)
	if claims.ExpiresAt < time.Now().Unix() {
		return "", fmt.Errorf("token expired")
	}
	return claims.Issuer, nil
}

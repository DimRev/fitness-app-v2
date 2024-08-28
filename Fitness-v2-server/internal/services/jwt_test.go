package services

import (
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

func TestCreateJwt(t *testing.T) {
	tests := []struct {
		name        string
		userId      uuid.UUID
		expectedErr error
		expected    *jwt.Token
	}{
		{
			name:   "Valid token",
			userId: uuid.MustParse("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
			expected: jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
				Issuer:    "f47ac10b-58cc-4372-a567-0e02b2c3d479",
				ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
			}),
			expectedErr: nil,
		},
	}

	for i, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			token := CreateJwt(tc.userId)
			if token == nil {
				t.Errorf("Test %v - FAILED  |\n Unexpected nil token\n", i)
				return
			}
			compereToken(t, token, tc.expected)
		})
	}
}

func TestExtractIssuerFromCookie(t *testing.T) {
	tests := []struct {
		name        string
		cookie      *http.Cookie
		expectedErr error
		expected    uuid.UUID
	}{
		{
			name:        "correct cookie",
			cookie:      generateCookie("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
			expected:    uuid.MustParse("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
			expectedErr: nil,
		},
		{
			name:        "expired cookie",
			cookie:      generateExpiredCookie("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
			expected:    uuid.MustParse("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
			expectedErr: fmt.Errorf("error parsing token: token is expired by 168h0m0s"),
		},
	}

	for i, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			issuer, err := ExtractIssuerFromCookie(tc.cookie.Value)
			if err != nil {
				if tc.expectedErr != nil {
					expectedErrStr := tc.expectedErr.Error()
					actualErrStr := err.Error()
					if expectedErrStr != actualErrStr {
						t.Errorf("Test %v - FAILED  |\n Unexpected error extracting issuer from cookie - expected: %v, actual: %v\n", i, expectedErrStr, actualErrStr)
					}
					return
				}
			}
			if issuer != tc.expected {
				t.Errorf("Test %v - FAILED  |\n Unexpected issuer in token - expected: %v, actual: %v\n", i, tc.expected, issuer)
			}
		})
	}
}

func TestGenerateAndSignCookie(t *testing.T) {
	tests := []struct {
		name        string
		issuer      uuid.UUID
		expectedErr error
		expected    *http.Cookie
	}{
		{
			name:        "correct token",
			issuer:      uuid.MustParse("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
			expected:    generateCookie("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
			expectedErr: nil,
		},
	}

	for i, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			token := CreateJwt(tc.issuer)
			cookie, err := GenerateAndSignCookie(token)
			if err != nil {
				if tc.expectedErr != nil {
					expectedErrStr := tc.expectedErr.Error()
					actualErrStr := err.Error()
					if expectedErrStr != actualErrStr {
						t.Errorf("Test %v - FAILED  |\n Unexpected error signing cookie - expected: %v, actual: %v\n",
							i, expectedErrStr, actualErrStr)
					}
					return
				}
			}
			if cookie == nil {
				t.Errorf("Test %v - FAILED  |\n Unexpected nil cookie\n", i)
				return
			}
			compereCookie(t, cookie, tc.expected)
		})
	}
}

func compereToken(t *testing.T, actual *jwt.Token, expected *jwt.Token) {
	actualClaims := actual.Claims.(jwt.StandardClaims)
	expectedClaims := expected.Claims.(jwt.StandardClaims)
	if actualClaims.Issuer != expectedClaims.Issuer {
		t.Errorf("Test - FAILED  |\n Unexpected issuer in token - expected: %v, actual: %v\n",
			expectedClaims.Issuer, actualClaims.Issuer)
	}
	if actualClaims.ExpiresAt != expectedClaims.ExpiresAt {
		t.Errorf("Test - FAILED  |\n Unexpected expiration time in token - expected: %v, actual: %v\n",
			expectedClaims.ExpiresAt, actualClaims.ExpiresAt)
	}
}

func generateCookie(issuer string) *http.Cookie {
	// Create the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    issuer,
		ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
	})

	// Sign the token
	tokenString, err := token.SignedString([]byte(config.JwtSecret))
	if err != nil {
		panic(fmt.Sprintf("Error signing token: %v", err))
	}

	// Create the cookie
	cookie := new(http.Cookie)
	cookie.Name = "jwt"
	cookie.Value = tokenString
	cookie.HttpOnly = true
	cookie.Expires = time.Now().Add(time.Hour * 24)

	return cookie
}

func generateExpiredCookie(issuer string) *http.Cookie {
	// Create the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    issuer,
		ExpiresAt: time.Now().Add(time.Hour * 24 * -7).Unix(),
	})

	// Sign the token
	tokenString, err := token.SignedString([]byte(config.JwtSecret))
	if err != nil {
		panic(fmt.Sprintf("Error signing token: %v", err))
	}

	// Create the cookie
	cookie := new(http.Cookie)
	cookie.Name = "jwt"
	cookie.Value = tokenString
	cookie.HttpOnly = true
	cookie.Expires = time.Now().Add(time.Hour * 24)

	return cookie

}

func compereCookie(t *testing.T, actual *http.Cookie, expected *http.Cookie) {
	if actual.Name != expected.Name {
		t.Errorf("Test - FAILED  |\n Unexpected name in cookie - expected: %v, actual: %v\n",
			expected.Name, actual.Name)
	}
	if actual.Value != expected.Value {
		t.Errorf("Test - FAILED  |\n Unexpected value in cookie - expected: %v, actual: %v\n",
			expected.Value, actual.Value)
	}
	if actual.HttpOnly != expected.HttpOnly {
		t.Errorf("Test - FAILED  |\n Unexpected HttpOnly in cookie - expected: %v, actual: %v\n",
			expected.HttpOnly, actual.HttpOnly)
	}
	if actual.Expires.Unix() != expected.Expires.Unix() {
		t.Errorf("Test - FAILED  |\n Unexpected expiration time in cookie - expected: %v, actual: %v\n",
			expected.Expires, actual.Expires)
	}
}

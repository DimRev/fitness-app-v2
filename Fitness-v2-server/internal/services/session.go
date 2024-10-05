package services

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/google/uuid"
	"github.com/labstack/echo"
)

func GenerateSession(c echo.Context, userId uuid.UUID) (string, error) {
	// Collect request data
	ipAddress := c.RealIP()
	userAgent := c.Request().UserAgent()

	if ipAddress == "" || userAgent == "" {
		return "", fmt.Errorf("unable to collect request data")
	}

	// Generate session token
	tokenData := strings.Join([]string{
		userId.String(),
		ipAddress,
		userAgent,
	}, ":")

	hash := sha256.New()
	hash.Write([]byte(tokenData))
	sessionToken := hex.EncodeToString(hash.Sum(nil))

	return sessionToken, nil
}

// GenerateAndRefresh generates a session token and session data based on the user's request and user ID
func GenerateAndRefresh(c echo.Context, userId uuid.UUID) (string, error) {
	// Collect request data
	ipAddress := c.RealIP()
	userAgent := c.Request().UserAgent()

	if ipAddress == "" || userAgent == "" {
		return "", fmt.Errorf("unable to collect request data")
	}

	// Prepare session data
	sessionData := map[string]interface{}{
		"user_id":    userId.String(),
		"ip_address": ipAddress,
		"user_agent": userAgent,
	}

	// Generate session token
	tokenData := strings.Join([]string{
		userId.String(),
		ipAddress,
		userAgent,
	}, ":")

	hash := sha256.New()
	hash.Write([]byte(tokenData))
	sessionToken := hex.EncodeToString(hash.Sum(nil))

	if err := config.DB.Ping(); err != nil {
		return "", fmt.Errorf("failed to ping database: %v", err)
	}

	_, err := config.Queries.GetSessionByToken(c.Request().Context(), sessionToken)
	if err != nil {
		if err == sql.ErrNoRows {
			// Incase there is no session with this session_token, create a new one
			sessionDataJson, err := json.Marshal(sessionData)
			if err != nil {
				return "", fmt.Errorf("failed to marshal session data: %v", err)
			}

			createSessionParams := database.CreateSessionParams{
				UserID:       userId,
				SessionToken: sessionToken,
				SessionData:  sessionDataJson,
			}

			_, err = config.Queries.CreateSession(c.Request().Context(), createSessionParams)
			if err != nil {
				return "", fmt.Errorf("failed to create session: %v", err)
			}
		} else {
			return "", fmt.Errorf("failed to get session: %v", err)
		}
	}

	_, err = config.Queries.RefreshSession(c.Request().Context(), sessionToken)
	if err != nil {
		return "", fmt.Errorf("failed to refresh session: %v", err)
	}

	return sessionToken, nil
}

func ValidateSession(c echo.Context, sessionToken string) (uuid.UUID, error) {
	// Collect request data
	ipAddress := c.RealIP()
	userAgent := c.Request().UserAgent()

	if ipAddress == "" || userAgent == "" {
		return uuid.UUID{}, fmt.Errorf("unable to collect request data")
	}

	if err := config.DB.Ping(); err != nil {
		return uuid.UUID{}, fmt.Errorf("failed to ping database: %v", err)
	}

	session, err := config.Queries.GetSessionByToken(c.Request().Context(), sessionToken)
	if err != nil {
		return uuid.UUID{}, err
	}

	expiresAt := session.ExpiresAt.Time
	if expiresAt.Before(time.Now()) {
		err := config.Queries.DeleteSession(c.Request().Context(), sessionToken)
		if err != nil {
			return uuid.UUID{}, fmt.Errorf("failed to delete session: %v", err)
		}
		return uuid.UUID{}, fmt.Errorf("session expired")
	}

	var sessionData struct {
		UserID    uuid.UUID `json:"user_id"`
		IPAddress string    `json:"ip_address"`
		UserAgent string    `json:"user_agent"`
	}
	if err := json.Unmarshal(session.SessionData, &sessionData); err != nil {
		return uuid.UUID{}, fmt.Errorf("failed to unmarshal session data: %v", err)
	}

	if sessionData.IPAddress != ipAddress || sessionData.UserAgent != userAgent {
		return uuid.UUID{}, fmt.Errorf("invalid session token")
	}

	updatedSession, err := config.Queries.RefreshSession(c.Request().Context(), sessionToken)
	if err != nil {
		return uuid.UUID{}, err
	}

	return updatedSession.UserID, nil
}

func DeleteSession(c echo.Context, sessionToken string) error {
	if err := config.DB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %v", err)
	}

	err := config.Queries.DeleteSession(c.Request().Context(), sessionToken)
	if err != nil {
		return fmt.Errorf("failed to delete session: %v", err)
	}

	return nil
}

package controllers

import (
	"fmt"
	"net/http"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/labstack/echo"
)

func GetScoreByUserID(c echo.Context) error {
	user, ok := c.Get("user").(database.User)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, map[string]string{
			"message": "Failed to get score, unauthorized",
		})
	}

	var totalScoreResp int
	var pendingScoreResp int
	var approvedScoreResp int

	TotalScore, err := config.Queries.GetTotalScoreSumByUserID(c.Request().Context(), user.ID)
	if err != nil {
		utils.FmtLogError("score_controllers.go", "GetScoreByUserID", fmt.Errorf("failed to get score: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get score, trouble with server",
		})
	}

	PendingScore, err := config.Queries.GetPendingScoreSumByUserID(c.Request().Context(), user.ID)
	if err != nil {
		utils.FmtLogError("score_controllers.go", "GetScoreByUserID", fmt.Errorf("failed to get score: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get score, trouble with server",
		})
	}

	ApprovedScore, err := config.Queries.GetApprovedScoreSumByUserID(c.Request().Context(), user.ID)
	if err != nil {
		utils.FmtLogError("score_controllers.go", "GetScoreByUserID", fmt.Errorf("failed to get score: %s", err))
		return echo.NewHTTPError(http.StatusInternalServerError, map[string]string{
			"message": "Failed to get score, trouble with server",
		})
	}

	pendingScoreResp = int(PendingScore)
	totalScoreResp = int(TotalScore)
	approvedScoreResp = int(ApprovedScore)

	scoreResp := models.Score{
		TotalScore:    totalScoreResp,
		PendingScore:  pendingScoreResp,
		ApprovedScore: approvedScoreResp,
	}

	return c.JSON(http.StatusOK, scoreResp)
}

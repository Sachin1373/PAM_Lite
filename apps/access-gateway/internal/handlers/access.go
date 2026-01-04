package handlers

import (
	"net/http"

	"github.com/Sachin1373/PAM_Lite/access-gateway/internal/config"
	"github.com/Sachin1373/PAM_Lite/access-gateway/internal/session"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

type sessionData struct {
}

func AccessHandler(c echo.Context, cfg *config.Config) error {
	//Extract the token from params
	token := c.QueryParam("token")

	if token == "" {
		log.Warn().Msg("missing token in request")

		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "token is required",
		})
	}

	// Log the token received
	log.Info().
		Str("token", token).
		Str("path", c.Path()).
		Str("client_ip", c.RealIP()).
		Msg("token received from request")

	sessionResp, err := session.ValidateToken(token, cfg)

	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid or expired session"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"status":        "ok",
		"user_id":       sessionResp.UserID,
		"tenant_id":     sessionResp.TenantID,
		"application":   sessionResp.ApplicationID,
		"access_id":     sessionResp.AccessRequestID,
		"target_url":    sessionResp.TargetURL,
		"expires_at":    sessionResp.ExpiresAt,
		"is_active":     sessionResp.IsActive,
		"last_accessed": sessionResp.LastAccessed,
		"auth_config": map[string]string{
			"username":  sessionResp.AuthConfig.Username,
			"password":  sessionResp.AuthConfig.Password,
			"auth_type": sessionResp.AuthConfig.AuthType,
		},
	})
}

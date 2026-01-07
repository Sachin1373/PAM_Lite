package handlers

import (
	"net/http"

	"github.com/Sachin1373/PAM_Lite/access-gateway/internal/config"
	"github.com/Sachin1373/PAM_Lite/access-gateway/internal/proxy"
	"github.com/Sachin1373/PAM_Lite/access-gateway/internal/session"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

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

	proxyCtx := &proxy.ProxyContext{
		TargetURL: sessionResp.TargetURL,
		ExpiresAt: sessionResp.ExpiresAt,
		AuthConfig: proxy.AuthConfig{
			AuthType: sessionResp.AuthConfig.AuthType,
			Username: sessionResp.AuthConfig.Username,
			Password: sessionResp.AuthConfig.Password,
		},
	}

	return proxy.ReverseProxy(c, proxyCtx)
}

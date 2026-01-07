package proxy

import (
	"encoding/base64"
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

type AuthConfig struct {
	AuthType string
	Username string
	Password string
}

type ProxyContext struct {
	TargetURL  string
	AuthConfig AuthConfig
	ExpiresAt  time.Time
}

func ReverseProxy(c echo.Context, ctx *ProxyContext) error {
	// 1. Enforce Session Expiry

	if time.Now().After(ctx.ExpiresAt) {
		log.Warn().
			Time("expires_at", ctx.ExpiresAt).
			Msg("session expired during proxy request")
		return echo.NewHTTPError(http.StatusUnauthorized, "session expired")
	}

	// 2. Parse target URL
	target, err := url.Parse(ctx.TargetURL)
	if err != nil {
		log.Error().Err(err).Msg("invalid target URL")
		return echo.NewHTTPError(http.StatusInternalServerError, "invalid target")
	}

	// 3. Create reverse proxy
	proxy := httputil.NewSingleHostReverseProxy(target)

	// 4. Modify outgoing request
	proxy.Director = func(req *http.Request) {
		req.URL.Scheme = target.Scheme
		req.URL.Host = target.Host

		// Strip "/access-gateway/access" from path
		prefix := "/access-gateway/access"
		path := c.Request().URL.Path
		if len(path) >= len(prefix) && path[:len(prefix)] == prefix {
			path = path[len(prefix):]
		}

		req.URL.Path = singleJoiningSlash(target.Path, path)

		q := req.URL.Query()
		q.Del("token")
		req.URL.RawQuery = q.Encode()

		injectAuth(req, ctx.AuthConfig)

		req.Header.Set("X-Forwarded-Host", c.Request().Host)
		req.Header.Set("X-Forwarded-For", c.RealIP())
	}

	log.Info().
		Str("target", ctx.TargetURL).
		Msg("proxying request")

	// 5. Serve the proxied request
	proxy.ServeHTTP(c.Response(), c.Request())
	return nil
}

func injectAuth(req *http.Request, auth AuthConfig) {
	switch auth.AuthType {
	case "basic":
		credentials := auth.Username + ":" + auth.Password
		encoded := base64.StdEncoding.EncodeToString([]byte(credentials))
		req.Header.Set("Authorization", "Basic "+encoded)

		log.Info().
			Str("auth_type", "basic").
			Msg("basic auth injected")

	default:
		log.Warn().
			Str("auth_type", auth.AuthType).
			Msg("unsupported auth type")
	}
}

func singleJoiningSlash(a, b string) string {
	switch {
	case a == "" && b == "":
		return ""
	case a == "":
		return b
	case b == "":
		return a
	case a[len(a)-1] == '/' && b[0] == '/':
		return a + b[1:]
	case a[len(a)-1] != '/' && b[0] != '/':
		return a + "/" + b
	}
	return a + b
}

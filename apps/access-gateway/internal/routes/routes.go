package routes

import (
	"github.com/Sachin1373/PAM_Lite/access-gateway/internal/config"
	"github.com/Sachin1373/PAM_Lite/access-gateway/internal/handlers"

	"github.com/labstack/echo/v4"
)

func RegisterRoutes(e *echo.Echo, cfg *config.Config) {

	// Base namespace for this service
	gateway := e.Group("/access-gateway")

	// Access routes
	gateway.GET("/access", func(c echo.Context) error {
		return handlers.AccessHandler(c, cfg)
	})

	// (future)
	// gateway.GET("/health", handlers.HealthHandler)
	// gateway.GET("/metrics", handlers.MetricsHandler)
}

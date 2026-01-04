package main

import (
	"github.com/Sachin1373/PAM_Lite/access-gateway/internal/config"
	"github.com/Sachin1373/PAM_Lite/access-gateway/internal/observability"
	"github.com/Sachin1373/PAM_Lite/access-gateway/internal/routes"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/rs/zerolog/log"
)

func main() {
	// Load Config
	cfg, err := config.Load()

	if err != nil {
		panic("failed to load config: " + err.Error())
	}

	// Init Logger (global)
	observability.InitLogger(
		"access-gateway",
		cfg.Environment,
		cfg.LogLevel,
	)

	log.Info().Msg("access-gateway starting")

	// Echo setup
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.RequestID())

	// Routes
	routes.RegisterRoutes(e, cfg)

	log.Info().
		Str("port", cfg.GatewayPort).
		Msg("server listening")

	e.Logger.Fatal(e.Start(":" + cfg.GatewayPort))

}

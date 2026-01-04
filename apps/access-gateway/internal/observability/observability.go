package observability

import (
	"os"
	"strings"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func InitLogger(serviceName, env, level string) {
	// Zerolog uses UTC by default (good for distributed systems)
	zerolog.TimeFieldFormat = time.RFC3339

	// Convert string level → zerolog level
	logLevel, err := zerolog.ParseLevel(strings.ToLower(level))
	if err != nil {
		logLevel = zerolog.InfoLevel
	}

	// Configure global logger
	log.Logger = zerolog.New(os.Stdout).
		Level(logLevel).
		With().
		Timestamp().
		Str("service", serviceName).
		Str("env", env).
		Logger()
}

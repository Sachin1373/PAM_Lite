package config

import (
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	GatewayPort string
	Environment string

	// Node API
	NodeAPIBaseURL      string
	NodeAPITimeout      time.Duration
	SessionValidatePath string
	SessionTokenParam   string

	// Logging
	LogLevel string

	// Observability flags
	MetricsEnabled bool
	TracingEnabled bool
	HealthEnabled  bool
}

func Load() (*Config, error) {
	_ = godotenv.Load()
	cfg := &Config{}
	// fmt.Println("configs :", cfg)
	// Gateway
	cfg.GatewayPort = os.Getenv("GATEWAY_PORT")
	cfg.Environment = os.Getenv("GATEWAY_ENV")

	// Node API
	cfg.NodeAPIBaseURL = os.Getenv("NODE_API_BASE_URL")
	cfg.SessionValidatePath = os.Getenv("SESSION_VALIDATE_PATH")
	cfg.SessionTokenParam = os.Getenv("SESSION_TOKEN_PARAM")

	// Logging
	cfg.LogLevel = os.Getenv("LOG_LEVEL")

	// Timeouts
	nodeTimeout := os.Getenv("NODE_API_TIMEOUT")
	if nodeTimeout == "" {
		nodeTimeout = "5s" // safe default
	}

	timeout, err := time.ParseDuration(nodeTimeout)
	if err != nil {
		return nil, errors.New("invalid NODE_API_TIMEOUT")
	}
	cfg.NodeAPITimeout = timeout

	// Observability flags
	cfg.MetricsEnabled = getBoolEnv("METRICS_ENABLED", false)
	cfg.TracingEnabled = getBoolEnv("TRACING_ENABLED", false)
	cfg.HealthEnabled = getBoolEnv("HEALTH_ENABLED", true)

	// Validation
	if err := cfg.validate(); err != nil {
		return nil, err
	}

	return cfg, nil

}

func (c *Config) validate() error {
	if c.GatewayPort == "" {
		return errors.New("GATEWAY_PORT is required")
	}

	if c.NodeAPIBaseURL == "" {
		return errors.New("NODE_API_BASE_URL is required")
	}

	if c.SessionValidatePath == "" {
		return errors.New("SESSION_VALIDATE_PATH is required")
	}

	if c.SessionTokenParam == "" {
		return errors.New("SESSION_TOKEN_PARAM is required")
	}

	if c.LogLevel == "" {
		return errors.New("LOG_LEVEL is required")
	}

	return nil
}

func getBoolEnv(key string, defaultVal bool) bool {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}

	parsed, err := strconv.ParseBool(val)
	if err != nil {
		return defaultVal
	}

	return parsed
}

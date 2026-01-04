package session

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Sachin1373/PAM_Lite/access-gateway/internal/config"
	"github.com/labstack/gommon/log"
)

type NodeSessionResponse struct {
	ID              string     `json:"id"`
	TenantID        string     `json:"tenant_id"`
	UserID          string     `json:"user_id"`
	ApplicationID   string     `json:"application_id"`
	AccessRequestID string     `json:"access_request_id"`
	Status          string     `json:"status"`
	StartTime       time.Time  `json:"start_time"`
	ExpiresAt       time.Time  `json:"expires_at"`
	Token           string     `json:"token"`
	IsActive        bool       `json:"is_active"`
	TargetURL       string     `json:"target_url"`
	LastAccessed    *time.Time `json:"last_accessed"` // nullable
	AuthConfig      struct {
		Password string `json:"password"`
		Username string `json:"username"`
		AuthType string `json:"auth_type"`
	} `json:"auth_config"`
}

type NodeValidateResponse struct {
	Status  string              `json:"status"`
	Session NodeSessionResponse `json:"session"`
}

func ValidateToken(token string, cfg *config.Config) (*NodeSessionResponse, error) {
	url := fmt.Sprintf("%s/session/validate?token=%s", cfg.NodeAPIBaseURL, token)

	log.Infof("calling node session validation API: url=%s", url)

	client := &http.Client{Timeout: cfg.NodeAPITimeout}
	req, err := http.NewRequest(http.MethodPost, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("session validation failed with status %d", resp.StatusCode)
	}

	var result NodeValidateResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	// Optional: check if token is active and not expired
	if !result.Session.IsActive || time.Now().After(result.Session.ExpiresAt) {
		return nil, fmt.Errorf("token is inactive or expired")
	}

	return &result.Session, nil
}

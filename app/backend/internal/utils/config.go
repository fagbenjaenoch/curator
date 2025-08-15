package utils

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	AllowedOrigins string
	ServiceName    string
	BaseRoute      string
}

func LoadConfig() *Config {
	_ = godotenv.Load()

	cfg := &Config{
		Port:           getEnv("PORT", "3000"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "*"),
		ServiceName:    getEnv("SERVICE_NAME", "curator-backend"),
		BaseRoute:      "/api/v1/",
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return fallback
}

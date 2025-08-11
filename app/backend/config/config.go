package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	AllowedOrigins string
	ServiceName    string
}

func Load() *Config {
	_ = godotenv.Load()

	cfg := &Config{
		Port:           getEnv("PORT", "3000"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "*"),
		ServiceName:    getEnv("SERVICE_NAME", "curator-backend"),
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return fallback
}

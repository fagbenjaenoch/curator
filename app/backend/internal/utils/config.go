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
	Youtube        YoutubeConfig
}

type YoutubeConfig struct {
	ApiKey string
}

func LoadConfig() *Config {
	_ = godotenv.Load()

	cfg := &Config{
		Port:           GetEnv("PORT", "3000"),
		AllowedOrigins: GetEnv("ALLOWED_ORIGINS", "*"),
		ServiceName:    "curator-backend",
		BaseRoute:      "/api/v1/",
		Youtube: YoutubeConfig{
			ApiKey: GetEnv("YT_API_KEY", ""),
		},
	}

	return cfg
}

func GetEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return fallback
}

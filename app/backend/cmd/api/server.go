package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/fagbenjaenoch/curator/app/backend/config"
	"github.com/fagbenjaenoch/curator/app/backend/middleware"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	otelChi "github.com/riandyrn/otelchi"
)

type Response struct {
	Message string `json:"message"`
}

func New(cfg *config.Config) *http.Server {
	r := chi.NewRouter()
	logger := config.NewLogger(cfg.ServiceName, true)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{cfg.AllowedOrigins},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	r.Use(otelChi.Middleware(cfg.ServiceName))
	r.Use(middleware.LoggingMiddleware(logger))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		response := Response{
			Message: "Hello world",
		}
		json.NewEncoder(w).Encode(response)
	})

	return &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
}

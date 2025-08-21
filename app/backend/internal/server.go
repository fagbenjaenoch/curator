package server

import (
	"net/http"
	"time"

	"github.com/fagbenjaenoch/curator/app/backend/internal/handler"
	"github.com/fagbenjaenoch/curator/app/backend/internal/middleware"
	"github.com/fagbenjaenoch/curator/app/backend/internal/utils"
	"github.com/go-chi/chi"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func New(cfg *utils.Config) *http.Server {
	r := chi.NewRouter()
	logger := utils.NewLogger(cfg.ServiceName, false)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{cfg.AllowedOrigins},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// TODO: Implement Observability
	// r.Use(otelChi.Middleware(cfg.ServiceName))
	r.Use(middleware.LoggingMiddleware(logger))
	r.Use(chiMiddleware.Recoverer)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		utils.WriteJson(w, http.StatusOK, struct {
			Message string `json:"message"`
		}{
			Message: "Hello world",
		})
	})

	r.Mount(cfg.BaseRoute, handler.RegisterApiRoues())

	return &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
}

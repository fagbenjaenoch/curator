package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/fagbenjaenoch/curator/app/backend/config"
	"github.com/fagbenjaenoch/curator/app/backend/middleware"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	otelChi "github.com/riandyrn/otelchi"
)

func main() {
	cfg := config.Load()
	srv := New(cfg)
	logger := config.Logger()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		logger.Info().Msg(fmt.Sprintf("Server running on port %s", cfg.Port))
		if err := srv.ListenAndServe(); err != nil && err.Error() != "http: Server closed" {
			logger.Error().Msg(fmt.Sprintf("Couldn't start server: %v", err))
		}
	}()

	<-ctx.Done()
	logger.Warn().Msg("Received shutdown signal")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Fatal().Msg(fmt.Sprintf("Server forced shutdown: %v", err))
	}

	logger.Info().Msg("Server exited gracefully")
	os.Exit(0)
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

	return &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
}

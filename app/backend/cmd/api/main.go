package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	server "github.com/fagbenjaenoch/curator/app/backend/internal"
	"github.com/fagbenjaenoch/curator/app/backend/internal/config"
)

func main() {
	cfg := config.Load()
	srv := server.New(cfg)
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
	logger.Info().Msg("Received shutdown signal")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Fatal().Msg(fmt.Sprintf("Server forced shutdown: %v", err))
	}

	logger.Info().Msg("Server exited gracefully")
	os.Exit(0)
}

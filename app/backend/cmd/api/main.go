package api

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	server "github.com/fagbenjaenoch/curator/app/backend/internal"
	"github.com/fagbenjaenoch/curator/app/backend/internal/utils"
	"github.com/rs/zerolog/log"
)

func Run() {
	cfg := utils.LoadConfig()
	srv := server.New(cfg)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		log.Info().Msg(fmt.Sprintf("Server running on port %s", cfg.Port))
		if err := srv.ListenAndServe(); err != nil && err.Error() != "http: Server closed" {
			log.Error().Msg(fmt.Sprintf("Couldn't start server: %v", err))
		}
	}()

	<-ctx.Done()
	log.Info().Msg("Received shutdown signal")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatal().Msg(fmt.Sprintf("Server forced shutdown: %v", err))
	}

	log.Info().Msg("Server exited gracefully")
	os.Exit(0)
}

package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/fagbenjaenoch/curator/app/backend/config"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
)

func main() {
	cfg := config.Load()
	srv := New(cfg)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		log.Printf("Server running on port %s", cfg.Port)
		if err:= srv.ListenAndServe(); err != nil &&  err.Error() != "http: Server Closed" {
			log.Fatalf("Couldn't start server: %v", err)
		}
	}()

	<- ctx.Done()
	log.Println("Received shutdown signal")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10 * time.Second)
	defer cancel()
	
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("Server forced shutdown: %v", err)
	}

	log.Println("Server exited gracefully")
	os.Exit(0)
}

func New(cfg *config.Config) *http.Server {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{cfg.AllowedOrigins},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge: 300,
	}))

	return &http.Server{
		Addr: ":" + cfg.Port,
		Handler: r,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout: 60 * time.Second,
	}
}
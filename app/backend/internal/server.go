package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/fagbenjaenoch/curator/app/backend/internal/config"
	"github.com/fagbenjaenoch/curator/app/backend/internal/middleware"
	"github.com/go-chi/chi"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"rsc.io/pdf"
)

const MAX_UPLOAD_SIZE int64 = 20 * 1024 * 1024

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
	// TODO: Implement Observability
	// r.Use(otelChi.Middleware(cfg.ServiceName))
	r.Use(middleware.LoggingMiddleware(logger))
	r.Use(chiMiddleware.Recoverer)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		response := Response{
			Message: "Hello world",
		}
		json.NewEncoder(w).Encode(response)
	})

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
		}{
			Message: "alive!",
		})
	})

	r.Post("/api/v1/upload", func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, MAX_UPLOAD_SIZE)

		if err := r.ParseMultipartForm(MAX_UPLOAD_SIZE); err != nil {
			http.Error(w, "File is too big", http.StatusBadRequest)
			return
		}

		files := r.MultipartForm.File["files"]

		for _, fileHeader := range files {
			file, err := fileHeader.Open()
			if err != nil {
				http.Error(w, "could not open file", http.StatusBadRequest)
				return
			}
			defer file.Close()

			buff := make([]byte, 512)
			_, err = file.Read(buff)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			r, err := pdf.NewReader(bytes.NewReader(buff), int64(len(buff)))
			if err != nil {
				logger.Fatal().Msg(fmt.Sprintf("failed to read pdf: %v", err))
			}

			// Loop through pages and print text
			numPages := r.NumPage()
			for i := 1; i <= numPages; i++ {
				page := r.Page(i)
				if page.V.IsNull() {
					continue
				}

				content := page.Content()
				text := ""
				for _, t := range content.Text {
					text += t.S
				}

				fmt.Printf("Page %d:\n%s\n", i, text)
			}
		}

		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
			Success bool   `json:"success"`
		}{
			Message: "file uploaded successfully",
			Success: true,
		})
	})

	return &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
}

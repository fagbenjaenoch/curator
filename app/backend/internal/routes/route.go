package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	service "github.com/fagbenjaenoch/curator/app/backend/internal/services"
	"github.com/go-chi/chi"
	"github.com/rs/zerolog/log"
)

const MAX_UPLOAD_SIZE int64 = 5 * 1024 * 1024

func RegisterApiRoues() chi.Router {
	r := chi.NewRouter()

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		log.Debug().Msg("health was called")
		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
		}{
			Message: "alive!",
		})
	})

	r.Post("/upload", func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, MAX_UPLOAD_SIZE)

		if err := r.ParseMultipartForm(MAX_UPLOAD_SIZE); err != nil {
			http.Error(w, "File is too large", http.StatusBadRequest)
			return
		}

		documentParser := service.NewParser()
		parsingService := service.NewParsingService(documentParser)

		files := r.MultipartForm.File["files"]
		result, err := parsingService.Parse(files)
		if err != nil {
			errMsg := "could not parse file"
			log.Fatal().Err(fmt.Errorf("%s: %s", errMsg, err))
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(struct {
				Message string `json:"message"`
				Success bool   `json:"success"`
			}{
				Message: errMsg,
				Success: false,
			})
		}
		log.Info().Msg("parsed document successfully")

		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
			Success bool   `json:"success"`
			Data    string `json:"data"`
		}{
			Message: "file parsed successfully",
			Success: true,
			Data:    result,
		})
	})

	return r
}

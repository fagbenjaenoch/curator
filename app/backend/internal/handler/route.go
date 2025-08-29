package handler

import (
	"fmt"
	"net/http"

	service "github.com/fagbenjaenoch/curator/app/backend/internal/services"
	"github.com/fagbenjaenoch/curator/app/backend/internal/utils"
	"github.com/go-chi/chi"
	"github.com/rs/zerolog/log"
)

const MAX_UPLOAD_SIZE int64 = 5 * 1024 * 1024

func RegisterApiRoues() chi.Router {
	r := chi.NewRouter()

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		utils.WriteJson(w, http.StatusOK, struct {
			Message string `json:"message"`
		}{
			Message: "alive",
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
		result, err := parsingService.ParseAndRank(files)
		if err != nil {
			errMsg := "could not parse file"
			log.Error().Err(fmt.Errorf("%s: %s", errMsg, err)).Msg("")

			res := utils.BuildErrorResponse(errMsg, err)
			utils.WriteJson(w, http.StatusInternalServerError, res)
			return
		}

		res := utils.BuildSuccessResponse("file parsed successfully", result)
		utils.WriteJson(w, http.StatusOK, res)
	})

	return r
}

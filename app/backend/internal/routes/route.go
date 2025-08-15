package routes

import (
	"encoding/json"
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

		files := r.MultipartForm.File["files"]

		var parserService service.DocumentParser = service.NewParser()

		for _, fileHeader := range files {
			file, err := fileHeader.Open()
			if err != nil {
				log.Error().Msg(fmt.Sprintf("Could not open file header: %s", err))
			}

			fileType, _ := utils.DetectMimePDFDocDocx(file)
			if _, ok := utils.AllowedTypes[fileType]; !ok {
				errMsg := "could not parse file"
				log.Fatal().Err(fmt.Errorf("%s is not supported", fileType))

				w.WriteHeader(http.StatusUnsupportedMediaType)
				json.NewEncoder(w).Encode(struct {
					Message string `json:"message"`
					Success bool   `json:"success"`
				}{
					Message: errMsg,
					Success: false,
				})
				return
			}

			var (
				parsedDocument string
				parsingError   error
			)
			switch fileType {
			case utils.PDFType:
				parsedDocument, parsingError = parserService.ParsePDF(file)
			case utils.DocType:
				parsedDocument, parsingError = parserService.ParseDOCX(file)
			case utils.DocType:
				parsedDocument, parsingError = parserService.ParseDoc(file)
			}

			if parsingError != nil {
				return
			}

			fmt.Println(parsedDocument)

			log.Info().Msg("parsed document successfully")
		}

		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
			Success bool   `json:"success"`
		}{
			Message: "file parsed successfully",
			Success: true,
		})
	})

	return r
}

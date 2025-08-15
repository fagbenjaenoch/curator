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

const MAX_UPLOAD_SIZE int64 = 20 * 1024 * 1024

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

		uploadService := service.NewParser()

		for _, fileHeader := range files {
			file, err := fileHeader.Open()
			if err != nil {
				log.Error().Msg(fmt.Sprintf("Could not open file header: %s", err))
			}
			uploadService.ParsePDF(file)

			fileType, _ := utils.DetectFileType(file)
			log.Debug().Msg(fileType)
		}
		// for _, fileHeader := range files {
		// 	file, err := fileHeader.Open()
		// 	if err != nil {
		// 		http.Error(w, "could not open file", http.StatusBadRequest)
		// 		return
		// 	}
		// 	defer file.Close()

		// 	buff := make([]byte, 512)
		// 	_, err = file.Read(buff)
		// 	if err != nil {
		// 		http.Error(w, err.Error(), http.StatusBadRequest)
		// 		return
		// 	}

		// 	r, err := pdf.NewReader(bytes.NewReader(buff), int64(len(buff)))
		// 	if err != nil {
		// 		// logger.Fatal().Msg(fmt.Sprintf("failed to read pdf: %v", err))
		// 	}

		// 	// Loop through pages and print text
		// 	numPages := r.NumPage()
		// 	for i := 1; i <= numPages; i++ {
		// 		page := r.Page(i)
		// 		if page.V.IsNull() {
		// 			continue
		// 		}

		// 		content := page.Content()
		// 		text := ""
		// 		for _, t := range content.Text {
		// 			text += t.S
		// 		}

		// 		fmt.Printf("Page %d:\n%s\n", i, text)
		// 	}
		// }

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

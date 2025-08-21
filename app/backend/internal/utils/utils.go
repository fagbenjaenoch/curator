package utils

import (
	"archive/zip"
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"strings"
)

var (
	PDFType  = "application/pdf"
	DocType  = "application/msword"
	DocxType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)

var AllowedTypes = map[string]bool{
	PDFType:  true,
	DocType:  true,
	DocxType: true,
}

// DetectMimePDFDocDocx returns the correct MIME type for PDF, DOC, and DOCX
func DetectMimePDFDocDocx(file multipart.File) (string, error) {
	// Read first 512 bytes for HTTP sniffing
	head := make([]byte, 512)
	_, _ = file.Read(head)
	file.Seek(0, 0)

	mimeType := http.DetectContentType(head)

	// PDF
	if strings.HasPrefix(mimeType, "application/pdf") {
		return "application/pdf", nil
	}

	// DOCX check (ZIP with word/ folder)
	if mimeType == "application/zip" {
		data, err := io.ReadAll(file)
		if err != nil {
			return "", err
		}
		file.Seek(0, 0)

		r, err := zip.NewReader(bytes.NewReader(data), int64(len(data)))
		if err != nil {
			return "", err
		}

		for _, f := range r.File {
			if strings.HasPrefix(f.Name, "word/") {
				return "application/vnd.openxmlformats-officedocument.wordprocessingml.document", nil
			}
		}
	}

	// DOC binary format check (OLE header)
	if len(head) >= 8 &&
		head[0] == 0xD0 && head[1] == 0xCF && head[2] == 0x11 && head[3] == 0xE0 {
		return "application/msword", nil
	}

	return mimeType, nil // fallback
}

type Response struct {
	Message string `json:"message"`
	Status  string `json:"status"`
	Payload any    `json:"payload"`
	Error   error  `json:"error"`
}

// returns success response struct
func BuildSuccessResponse(m string, body any) Response {
	return Response{
		Message: m,
		Status:  "success",
		Payload: body,
		Error:   nil,
	}
}

// returns error response struct
func BuildErrorResponse(m string, err error) Response {
	return Response{
		Message: m,
		Status:  "failure",
		Payload: nil,
		Error:   err,
	}
}

// sends response to client
func WriteJson(w http.ResponseWriter, status int, r any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	err := json.NewEncoder(w).Encode(r)
	if err != nil {
		http.Error(w, `{"error": "failed to encode response"}`, http.StatusInternalServerError)
	}
}

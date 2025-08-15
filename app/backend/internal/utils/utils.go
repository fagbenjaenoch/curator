package utils

import (
	"io"
	"mime/multipart"
	"net/http"
)

var AllowedTypes = map[string]bool{
	"application/pdf":    true,
	"application/msword": true,
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
}

func DetectFileType(file multipart.File) (string, error) {
	buff := make([]byte, 512)
	_, err := file.Read(buff)
	if err != nil && err != io.EOF {
		return "", err
	}
	file.Seek(0, io.SeekStart)
	return http.DetectContentType(buff), nil
}

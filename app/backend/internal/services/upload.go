package services

import (
	"mime/multipart"

	"github.com/fagbenjaenoch/curator/app/backend/internal/config"
	"github.com/rs/zerolog"
)

var logger zerolog.Logger = config.Logger()

type Parser interface {
	ParsePDF(files []*multipart.FileHeader) error
}

type ParserService struct{}

func NewParser() *ParserService {
	return &ParserService{}
}

func (us *ParserService) ParsePDF(files []*multipart.FileHeader) error {
	logger.Info().Msg("ParsePDF was called")
	return nil
}

func (us *ParserService) ParseDOCX(files []*multipart.FileHeader) error {
	logger.Info().Msg("ParseDOCX was called")
	return nil
}

func (us *ParserService) ParseMarkdown(files []*multipart.FileHeader) error {
	logger.Info().Msg("ParseMarkdown was called")
	return nil
}

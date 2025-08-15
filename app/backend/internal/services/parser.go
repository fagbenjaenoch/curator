package services

import (
	"mime/multipart"

	"github.com/rs/zerolog/log"
)

type DocumentParser interface {
	ParsePDF(file *multipart.FileHeader) error
	ParseDOCX(file *multipart.FileHeader) error
	ParseMarkdown(file *multipart.FileHeader) error
}

type ParserService struct{}

func NewParser() *ParserService {
	return &ParserService{}
}

func (ps *ParserService) ParsePDF(file *multipart.FileHeader) error {
	log.Info().Msg("ParsePDF was called")
	return nil
}

func (ps *ParserService) ParseDOCX(file *multipart.FileHeader) error {
	log.Info().Msg("ParseDOCX was called")
	return nil
}

func (ps *ParserService) ParseMarkdown(file *multipart.FileHeader) error {
	log.Info().Msg("ParseMarkdown was called")
	return nil
}

package service

import (
	"mime/multipart"

	"github.com/rs/zerolog/log"
)

type DocumentParser interface {
	ParsePDF(file multipart.File) error
	ParseDOCX(file multipart.File) error
	ParseMarkdown(file multipart.File) error
}

type ParserService struct{}

func NewParser() *ParserService {
	return &ParserService{}
}

func (ps *ParserService) ParsePDF(file multipart.File) error {
	log.Info().Msg("ParsePDF was called")
	return nil
}

func (ps *ParserService) ParseDOCX(file multipart.File) error {
	log.Info().Msg("ParseDOCX was called")
	return nil
}

func (ps *ParserService) ParseMarkdown(file multipart.File) error {
	log.Info().Msg("ParseMarkdown was called")
	return nil
}

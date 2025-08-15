package utils

import (
	"mime/multipart"
	"strings"

	"baliance.com/gooxml/document"
	"github.com/rs/zerolog/log"

	"rsc.io/pdf"
)

type ParserService struct{}

func NewParser() ParserService {
	return ParserService{}
}

func (ps ParserService) ParsePDF(file multipart.File) (string, error) {
	log.Info().Msg("ParsePDF was called")
	r, err := pdf.NewReader(file, fileSize(file))
	if err != nil {
		return "", err
	}

	var allText strings.Builder
	numPages := r.NumPage()
	for i := 1; i <= numPages; i++ {
		p := r.Page(i)
		content := p.Content()
		for _, txt := range content.Text {
			allText.WriteString(txt.S)
			allText.WriteString(" ")
		}
		allText.WriteString("\n\n")
	}
	return allText.String(), nil
}

func (ps ParserService) ParseDOCX(file multipart.File) (string, error) {
	log.Info().Msg("ParseDOCX was called")
	doc, err := document.Read(file, int64(fileSize(file)))
	if err != nil {
		return "", err
	}

	var sb strings.Builder
	for _, para := range doc.Paragraphs() {
		for _, run := range para.Runs() {
			sb.WriteString(run.Text())
		}
		sb.WriteString("\n")
	}
	return sb.String(), nil
}

func (ps ParserService) ParseDoc(file multipart.File) (string, error) {
	log.Info().Msg("ParseMarkdown was called")
	return "", nil
}

func fileSize(file multipart.File) int64 {
	if seeker, ok := file.(interface {
		Seek(int64, int) (int64, error)
	}); ok {
		pos, _ := seeker.Seek(0, 2) // go to end
		seeker.Seek(0, 0)           // back to start
		return pos
	}
	return 0
}

package service

import (
	"fmt"
	"mime/multipart"
	"strings"

	"baliance.com/gooxml/document"
	"github.com/fagbenjaenoch/curator/app/backend/internal/utils"
	"github.com/rs/zerolog/log"
	"rsc.io/pdf"
)

type DocumentParser interface {
	ParsePDF(file multipart.File) (string, error)
	ParseDOCX(file multipart.File) (string, error)
	ParseDoc(file multipart.File) (string, error)
}

type ParserService struct {
	parser DocumentParser
}

func NewParsingService(dp DocumentParser) *ParserService {
	return &ParserService{
		parser: dp,
	}
}

func (ps *ParserService) Parse(files []*multipart.FileHeader) (string, error) {
	var result string
	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			return "", err
		}

		fileType, _ := utils.DetectMimePDFDocDocx(file)
		fmt.Println(fileType)
		if _, ok := utils.AllowedTypes[fileType]; !ok {
			return "", fmt.Errorf("%s is not supported", fileType)
		}

		var (
			parsedDocument string
			parsingError   error
		)

		switch fileType {
		case utils.PDFType:
			parsedDocument, parsingError = ps.parser.ParsePDF(file)
		case utils.DocxType:
			parsedDocument, parsingError = ps.parser.ParseDOCX(file)
		case utils.DocType:
			parsedDocument, parsingError = ps.parser.ParseDoc(file)
		}

		if parsingError != nil {
			return "", parsingError
		}

		result += parsedDocument
	}
	utils.RankText(result)
	return result, nil
}

type Parser struct{}

func NewParser() Parser {
	return Parser{}
}

func (p Parser) ParsePDF(file multipart.File) (string, error) {
	log.Info().Msg("ParsePDF was called")
	r, err := pdf.NewReader(file, fileSize(file))
	if err != nil {
		return "", err
	}

	var result strings.Builder
	numPages := r.NumPage()
	for i := 1; i <= numPages; i++ {
		p := r.Page(i)

		if p.V.IsNull() {
			continue
		}

		content := p.Content()
		var prevX, prevY float64
		for _, txt := range content.Text {
			if prevY != 0 && prevY-txt.Y > 5 {
				result.WriteString("\n")
			}

			if prevX != 0 && (txt.X-prevX) > (txt.FontSize*0.7) {
				// fmt.Println(txt.X - prevX)
				// fmt.Println(txt.FontSize * 0.8)
				result.WriteString(" ")
			}

			result.WriteString(txt.S)
			prevX, prevY = txt.X, txt.Y
		}

		result.WriteString("\n\n")
	}
	fmt.Println(result.String())
	return result.String(), nil
}

func (p Parser) ParseDOCX(file multipart.File) (string, error) {
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

func (p Parser) ParseDoc(file multipart.File) (string, error) {
	log.Info().Msg("ParseDoc was called")
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

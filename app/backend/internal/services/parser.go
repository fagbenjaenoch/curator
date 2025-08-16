package service

import (
	"fmt"
	"mime/multipart"

	"github.com/fagbenjaenoch/curator/app/backend/internal/utils"
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

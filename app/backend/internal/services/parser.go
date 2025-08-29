package services

import (
	"fmt"
	"math"
	"mime/multipart"
	"sort"
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

type ParsingService struct {
	parser DocumentParser
}

func NewParsingService(dp DocumentParser) *ParsingService {
	return &ParsingService{
		parser: dp,
	}
}

func (ps *ParsingService) ParseAndRank(files []*multipart.FileHeader) (string, error) {
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

	rankedPhrases := utils.RankText(result)
	return rankedPhrases, nil
}

type Parser struct{}

func NewParser() Parser {
	return Parser{}
}

type Glyph struct {
	Char  string
	X, Y  float64
	Width float64
}

func (p Parser) ParsePDF(file multipart.File) (words string, err error) {
	r, err := pdf.NewReader(file, fileSize(file))
	if err != nil {
		return "", err
	}

	var result []string
	numPages := r.NumPage()
	for i := 1; i <= numPages; i++ {
		p := r.Page(i)

		if p.V.IsNull() {
			continue
		}

		var glyphs []Glyph
		content := p.Content()
		for _, txt := range content.Text {
			glyphs = append(glyphs, Glyph{
				Char:  txt.S,
				X:     txt.X,
				Y:     txt.Y,
				Width: txt.W,
			})
		}

		sort.Slice(glyphs, func(i, j int) bool {
			if math.Abs(glyphs[i].Y-glyphs[j].Y) > 2.0 {
				return glyphs[i].Y > glyphs[j].Y
			}
			return glyphs[i].X < glyphs[j].X
		})

		wordsArray := groupIntoWords(glyphs)
		result = append(result, wordsArray...)
	}

	words = strings.Join(result, " ")
	return words, err
}

func (p Parser) ParseDOCX(file multipart.File) (string, error) {
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

const spaceTolerance = 0.1

func groupIntoWords(glyphs []Glyph) []string {
	var words []string
	var currentWord string
	var prev Glyph

	for i, g := range glyphs {
		if i > 0 {
			gap := g.X - (prev.X + prev.Width)
			if gap > spaceTolerance*prev.Width {
				if currentWord != "" {
					words = append(words, currentWord)
				}
				currentWord = ""
			}
		}
		currentWord += g.Char
		prev = g
	}

	if currentWord != "" {
		words = append(words, currentWord)
	}

	return words
}

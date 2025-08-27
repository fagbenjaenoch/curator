package utils

import (
	"fmt"
	"strings"

	textrank "github.com/DavidBelicza/TextRank/v2"
	"github.com/rs/zerolog/log"
)

func RankText(rawText string) (string, error) {
	tr := textrank.NewTextRank()

	rule := textrank.NewDefaultRule()

	language := textrank.NewDefaultLanguage()

	algo := textrank.NewDefaultAlgorithm()

	tr.Populate(rawText, language, rule)

	tr.Ranking(algo)

	// rankedPhrases := textrank.FindPhrases(tr)

	var result strings.Builder
	sentences := textrank.FindSentencesByRelationWeight(tr, 5)
	for _, sentence := range sentences {
		result.WriteString(sentence.Value)
	}

	// for _, phrase := range rankedPhrases {
	// 	fmt.Println(phrase.Right)
	// }

	log.Debug().Msg("text rank was called")
	log.Debug().Msg(fmt.Sprintf("Ranked sentences: %v", result.String()))
	return result.String(), nil
}

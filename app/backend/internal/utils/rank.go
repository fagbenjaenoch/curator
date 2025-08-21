package utils

import (
	"fmt"

	textrank "github.com/DavidBelicza/TextRank/v2"
	"github.com/rs/zerolog/log"
)

func RankText(rawText string) (string, error) {
	log.Debug().Msg("text rank was called")
	tr := textrank.NewTextRank()

	rule := textrank.NewDefaultRule()

	language := textrank.NewDefaultLanguage()

	algo := textrank.NewDefaultAlgorithm()

	tr.Populate(rawText, language, rule)

	tr.Ranking(algo)

	rankedPhrases := textrank.FindPhrases(tr)

	sentences := textrank.FindSentencesByRelationWeight(tr, 5)

	log.Debug().Msg(fmt.Sprintf("Ranked sentences: %v", sentences))

	for _, phrase := range rankedPhrases {
		fmt.Println(phrase.Right)
	}

	return "", nil
}

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

	rankedPhrases := textrank.FindPhrases(tr)

	var uniquePhrases []string
	seen := make(map[string]struct{})

	for _, el := range rankedPhrases {
		if _, ok := seen[el.Right]; !ok {
			seen[el.Right] = struct{}{}
			uniquePhrases = append(uniquePhrases, el.Right)
		}
	}

	var result strings.Builder
	// sentences := textrank.FindSentencesByRelationWeight(tr, 2)

	top := 10
	for i := 0; i < top; i++ {
		result.WriteString(uniquePhrases[i])
		if i < top-1 {
			result.WriteString(" ")
		}
	}

	// for _, phrase := range rankedPhrases {
	// 	fmt.Println(phrase.Right)
	// }

	log.Debug().Msg("text rank was called")
	log.Debug().Msg(fmt.Sprintf("Ranked sentences: %v", result.String()))
	return result.String(), nil
}

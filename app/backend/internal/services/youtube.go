package services

import (
	"context"
	"fmt"

	"github.com/fagbenjaenoch/curator/app/backend/internal/utils"
	"github.com/rs/zerolog/log"
	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
)

type SearchItem struct {
	Title string `json:"title"`
}

func YoutubeSearch(query string) []SearchItem {
	service, err := youtube.NewService(context.Background(), option.WithAPIKey(utils.GetEnv("YT_API_KEY", "")))
	if err != nil {
		log.Error().Err(fmt.Errorf("could not initialize youtube search api"))
		return nil
	}

	call := service.Search.List([]string{"snippet"}).Q(query).Type("video").MaxResults(10)

	response, err := call.Do()
	if err != nil {
		log.Error().Err(fmt.Errorf("error searching for youtube videos")).Msg("")
		return nil
	}

	var result []SearchItem
	for _, item := range response.Items {
		videoTitle := SearchItem{
			Title: item.Snippet.Title,
		}
		result = append(result, videoTitle)
	}

	return result
}

package utils

import (
	"os"
	"time"

	"github.com/rs/zerolog"
)

var (
	Logger      zerolog.Logger
	initialized bool
)

func NewLogger(serviceName string, pretty bool) zerolog.Logger {
	zerolog.TimeFieldFormat = time.RFC3339

	if pretty {
		Logger = zerolog.New(zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339}).
			With().
			Timestamp().
			Str("service", serviceName).
			Logger()
	} else {
		Logger = zerolog.New(os.Stdout).
			With().
			Timestamp().
			Str("service", serviceName).
			Logger()
	}

	initialized = true
	return Logger
}

// func Logger() zerolog.Logger {
// 	if !initialized {
// 		panic("logger not initialized — call config.NewLogger() first")
// 	}
// 	return logger
// }

package config

import (
	"os"
	"time"

	"github.com/rs/zerolog"
)

var logger zerolog.Logger

func NewLogger(serviceName string, pretty bool) zerolog.Logger {
	zerolog.TimeFieldFormat = time.RFC3339

	if pretty {
		logger = zerolog.New(zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339}).
			With().
			Timestamp().
			Str("service", serviceName).
			Logger()
	} else {
		logger = zerolog.New(os.Stdout).
			With().
			Timestamp().
			Str("service", serviceName).
			Logger()
	}

	return logger
}

func Logger() zerolog.Logger {
	return logger
}

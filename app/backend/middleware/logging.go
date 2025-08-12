package middleware

import (
	"net/http"
	"time"

	"github.com/rs/zerolog"
)

type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

func LoggingMiddleware(logger zerolog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			// spanCtx := trace.SpanContextFromContext(r.Context())
			// traceID := spanCtx.TraceID().String()
			// spanID := spanCtx.SpanID().String()

			lrw := &loggingResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}
			next.ServeHTTP(lrw, r)

			logger.Info().
				// Str("trace_id", traceID).
				// Str("span_id", spanID).
				Str("method", r.Method).
				Str("url", r.URL.String()).
				Str("remote_ip", r.RemoteAddr).
				Str("user_agent", r.UserAgent()).
				Int("status", lrw.statusCode).
				Dur("latency", time.Since(start)).
				Msg("request handled")
		})
	}
}

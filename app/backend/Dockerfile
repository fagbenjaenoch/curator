# --------- BASE STAGE --------- 
FROM golang:1.25-alpine AS base

WORKDIR /app

# Copy go.mod and go.sum first to leverage Docker's build cache
COPY go.mod ./
COPY go.sum ./

# Mount a cache and download dependencies
RUN --mount=type=cache,target=/go/pkg/mod go mod download

# --------- BUILDER STAGE --------- 

FROM base AS builder
# Copy the rest of the application source code
COPY . .

# --------- BUILD STAGE ---------

# Build the Go application
# CGO_ENABLED=0 is important for static linking, making the binary self-contained
# -a -installsuffix cgo reduces the image size
# -ldflags "-s -w" removes debug information and symbol table, further reducing size
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags "-s -w" -o /app/main .

# --------- PRODUCTION STAGE --------- 

# Stage 2: Final Image
# Use a minimal base image like scratch or alpine for the final executable
FROM alpine:latest AS prod

# Set a non-root user for security (optional but recommended)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/main .

# Expose the port your application listens on (e.g., for a web server)
EXPOSE 8080

# Command to run the application
CMD ["./main"]

# --------- DEV STAGE --------- 
FROM base AS dev

RUN go install github.com/cosmtrek/air@latest

COPY . .

CMD ["air"]
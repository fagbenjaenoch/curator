# ---------- BASE STAGE ----------
FROM oven/bun:1.2.18 AS base

WORKDIR /app

# Copy manifests
COPY package.json bun.lock* ./

# Install ALL deps (including dev) for building
RUN bun install


# ---------- BUILDER STAGE ----------
FROM base AS builder

# Copy rest of code
COPY . .

# Run build
RUN bun run build

# ---------- PRODUCTION STAGE ----------
FROM builder AS prod

WORKDIR /app

# Copy only what we need for runtime
COPY package.json bun.lock* ./
RUN bun install --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 4173

CMD ["bun", "run", "start"]

# ---------- DEV STAGE ----------
FROM base AS dev

COPY . .

EXPOSE 5173

CMD ["bun", "run", "dev"]

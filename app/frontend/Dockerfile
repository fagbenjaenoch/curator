# ---------- Build stage ----------
FROM oven/bun:1.2.18 as builder

WORKDIR /app

# Copy manifests
COPY package.json bun.lock* ./

# Install ALL deps (including dev) for building
RUN bun install

# Copy rest of code
COPY . .

# Run build
RUN bun run build

# ---------- Runtime stage ----------
FROM oven/bun:1.2.18

WORKDIR /app

# Copy only what we need for runtime
COPY package.json bun.lock* ./
RUN bun install --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["bun", "run", "start"]

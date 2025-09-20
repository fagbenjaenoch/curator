# Stage 1: Build the React application
FROM oven/bun:1.1 as builder

COPY . /app
WORKDIR /app

# Copy package.json, pnpm-lock.yaml, and pnpm-workspace.yaml (if using monorepo)
COPY package.json ./
# COPY pnpm-lock.yaml ./
# If you have a monorepo, also copy pnpm-workspace.yaml
# COPY pnpm-workspace.yaml 

# Install dependencies
RUN bun install --production

# Copy the rest of the application code
COPY . .

# Build the React application
RUN bun build

# Stage 2: Serve the built application with a lightweight web server
FROM nginx:alpine

# Copy the built application from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port Nginx listens on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
# ==============================================================================
# Stage 1: Build Stage
# Compiles frontend assets with Vite into production-ready static bundles
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm install --legacy-peer-deps

# Copy application source code
COPY . .

# Build frontend static bundle into /app/dist
RUN npm run build

# ==============================================================================
# Stage 2: Production Runtime Stage
# Lightweight, hardened Alpine image serving both frontend and Cashfree backend
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies only
COPY package*.json ./
RUN npm install --legacy-peer-deps --omit=dev && npm cache clean --force

# Copy compiled frontend from builder
COPY --from=builder /app/dist ./dist

# Copy backend server code and configuration
COPY --from=builder /app/server ./server
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/metadata.json ./metadata.json

# Install curl for container health check
RUN apk add --no-cache curl

# Ensure runtime directory exists and node user has write permissions for orders.json
RUN mkdir -p /app/server/data && chown -R node:node /app

# Run as non-root unprivileged node user
USER node

# Expose server port (Cloud Run / Heroku / ECS dynamically map this via $PORT)
EXPOSE 5000

# Health check endpoint verification
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1

# Start the fullstack application
CMD ["npm", "start"]

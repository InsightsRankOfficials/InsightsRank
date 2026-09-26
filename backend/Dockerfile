# Multi-stage Dockerfile for NestJS Authentication & API Engine

# STAGE 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client and Build compiled JavaScript
RUN npx prisma generate
RUN npm run build

# STAGE 2: Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install openssl for Prisma compatibility
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose default application port
EXPOSE 3000

# Set environment defaults
ENV PORT=3000
ENV HOST=0.0.0.0

# Start command: run production migrations and start NestJS
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]

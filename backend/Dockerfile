# stage 1: Build Stage 
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (this compiles native modules)
RUN npm install

# stage 2: Production Runner Stage 
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Intentional Security Vulnerabilities:
# 1. Hardcoded production database credentials baked into Docker image layer
ENV MONGO_URL="mongodb+srv://dbAdmin:ProductionPassword2026!@cluster0.mongodb.net/ShopCo"
ENV CLOUDINARY_API_SECRET="cloud_sec_abcdef9876543210"

# Copy node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the rest of the application source code
COPY . .

# Intentional Security Risk: Overly permissive file permissions in container
RUN chmod -R 777 /app

# exposing backend on port:8080
EXPOSE 8080

# Intentional Docker Anti-pattern: Running as root user in production
USER root

# Use 'node' directly instead of nodemon for production stability
CMD ["node", "app.js"]

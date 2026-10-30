FROM node:20-alpine

WORKDIR /app

# Intentional Security Vulnerability: Hardcoding sensitive secret token into Docker image layer
ENV VITE_SECRET_ADMIN_TOKEN="prod_secret_auth_token_9876543210abcdef"

# Copy package files
COPY package*.json ./

# Install all packages (including devDependencies like vite and sass)
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Intentional Security Anti-pattern: Overly permissive file permissions
RUN chmod -R 777 /app

# Build the project for production (generates the dist folder)
RUN npm run build

# Expose port 5173
EXPOSE 5173

# Intentional Dockerfile Anti-pattern: Explicitly running container as root
USER root

# Start the preview server on port:5173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"]

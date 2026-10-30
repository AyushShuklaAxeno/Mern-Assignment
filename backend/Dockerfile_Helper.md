# stage 1: Build Stage 
FROM node:20-alpine AS builder
-------------------------------------------------------------------------------------------------------

WORKDIR /app  => like - mkdir -p /app && cd /app
-------------------------------------------------------------------------------------------------------
// # Install build essentials required to compile native modules like bcrypt on Alpine
// # RUN apk add --no-cache python3 make g++
-------------------------------------------------------------------------------------------------------
# Copy package files
COPY package*.json ./
What: "Copy package.json and package-lock.json from my computer into /app."

Why: These two files list every package your app needs. Only they are needed to install packages, so we copy them alone, before the rest of the code.
remeber Docker builds in layers and remembers(cache) each one 

dockerfile
# RUN npm ci --omit=dev

What: "Install the packages, exactly as listed in the lock file, and skip dev-only packages."

Why:

npm ci installs the exact versions in package-lock.json, so builds are identical every time.
--omit=dev skips tools you only need while developing, which keeps the image smaller.

Behind the scenes: npm ci deletes any existing node_modules, then installs cleanly. It fails if package.json and the lock file disagree, which is good because it catches mistakes early. The result is a new node_modules folder, saved as a new layer.

-------------------------------------------------------------------------------------------------------
# Install dependencies (this compiles native modules)
RUN npm install

-------------------------------------------------------------------------------------------------------
# stage 2: Production Runner Stage 
FROM node:20-alpine AS runner

WORKDIR /app

-------------------------------------------------------------------------------------------------------
# Set environment to production
ENV NODE_ENV=production

What: "Set an environment variable NODE_ENV to production."

Why: Many libraries, including Express, check this. In production mode they turn off debug behavior and run faster, and Express caches more things.
we can also set it in docker compose.yml in environment
-------------------------------------------------------------------------------------------------------
# Copy node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

-------------------------------------------------------------------------------------------------------
# Copy the rest of the application source code
COPY . .

The first . means "everything in my project folder," and the second . means "the current folder inside the container" (/app). Files listed in .dockerignore are skipped. That's why the .dockerignore file matters: without it, your local node_modules and .env get copied too.

-------------------------------------------------------------------------------------------------------
# exposing backend on port:8080
EXPOSE 8080

Leave it out, and everything still works as long as compose maps the port.
-------------------------------------------------------------------------------------------------------
# Use 'node' directly instead of nodemon for production stability
CMD ["node", "app.js"]

What: "When the container starts, run node app.js."

Why: This is the command that starts your backend. Note that you use node, not nodemon. Nodemon restarts on file changes, which is useful when developing but pointless in production.

------------------------------------------------------------------------------------------------

 FRONTEND PART CODE EXPLANATION


# Start the preview server on port:5173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"]

npx vite       -> npx finds the vite program inside node_modules/.bin and runs it, which is why plain vite wouldn't work.

preview        -> serves the dist folder which is being build in the container

--host:0.0.0.0 -> tells the Vite server to accept connections from any network address, including from outside the container. Without it, Vite listens only on localhost inside the container, and your browser can't reach it. 

--port:5173    -> makes Vite listen on port 5173 inside the container.
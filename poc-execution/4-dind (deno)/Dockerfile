# Specify the Docker base image to extend from (docker dind).
FROM docker:20.10-dind

# Define the container's working directory where the application code will be copied and commands will be executed.
WORKDIR /app

# Install curl (CLI utility) to install node.js and pnpm.
RUN apk add curl
RUN apk add --no-cache nodejs
RUN curl -L https://unpkg.com/@pnpm/self-installer | node

# Install application's dependencies and copy source files.
# The order of instructions does matter to leverage Docker's caching mechanism! 
# Updating an above layer automatically invalidate the cache of layers below!
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install
COPY tsconfig.json ./
COPY src src

# Indicate the port on which the application will listen for requests.
# Informative purpose only!
# Rhe actual port mapping is done at runtime using either the `-p 3000:3000` flag with the `docker run` command, or the `ports` section in a Docker Compose file.
EXPOSE 3000

# Define the default command to run when the container starts (starts Docker Daemon and run application's development server).
CMD ["sh", "-c", "dockerd & pnpm dev"]
# CMD ["sh", "-c", "dockerd-entrypoint.sh dockerd & pnpm dev"]

# Specify the Docker base image to extend from (docker client).
FROM docker:28.2-cli

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

# Indicate a mount point for the Docker socket inside the container (DooD scenario => allows the container to communicate with the host's Docker daemon).
# Informative purpose only!
# The actual mapping of the socket is done at runtime using either the `-v /var/run/docker.sock:/var/run/docker.sock` flag with the `docker run` command, or the `volumes` section in a Docker Compose file.
VOLUME /var/run/docker.sock

# Indicate the port on which the application will listen for requests.
# Informative purpose only!
# Rhe actual port mapping is done at runtime using either the `-p 3000:3000` flag with the `docker run` command, or the `ports` section in a Docker Compose file.
EXPOSE 3001

# Define the default command to run when the container starts (run application's development server).
CMD ["pnpm", "dev"]
# 🚧 CodeExecution MicroService (DooD)

Welcome to CodeExecution MicroService!\

This project used a containerized API based on `docker-cli` image with host socket bind mounting. Each request starts a `deno` based Docker container to execute some code snippet.

## 🚧 Get Started

### Run the application: using Docker

1. Build the image:

```sh
docker build -t api .
```

2. Run the container:

```sh
docker run -it \
  --name api \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -p 3000:3000 \
  api
```

### Run the application: using Docker Compose

Build the image and run the container:

```sh
docker compose up --build
```

### Send incoming requests

API endpoint: `localhost:3000/api/execute`

Example of body request:

```json
{
  "code": "console.log('hello!')",
  "language": "typescript"
}
```

> **Note:**
> Docker-out-of-Docker (DooD) pattern re-uses the host-level Docker engine.
>
> Need to bind mount the host socket to the container (so the container can access the host's docker daemon) using the flag: `-v /var/run/docker.sock:/var/run/docker.sock`
>
> **Pros**:
>
> - reuses host's Docker engine
> - saves disk space
> - expedite build actions (shared image-cache)
>
> **Cons**:
>
> - direct access to the host Docker engine! The command `docker rm -f $(docker ps -aq)` can remove all the containers from the host!
> - breaks FS sharing (bind-mounting) capabilities -- containerized apps and Docker engine operate in different contexts
>   **insecure option** for shared/public environments!

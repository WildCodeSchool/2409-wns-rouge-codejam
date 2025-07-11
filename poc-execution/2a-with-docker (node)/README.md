# 🚧 CodeExecution MicroService (DooD)

Welcome to CodeExecution MicroService!

This project used a non-containerized API. Each request starts a `node` based Docker container to execute some code snippet.

## 🚧 Get Started

### Run the application: using Docker

Start the application development server on `localhost:3000`:

```sh
pnpm run dev
```

### Send incoming requests

API endpoint: `localhost:3000/api/execute`

Example of body request:

```json
{
  "script": "console.log('hello!')",
  "language": "typescript"
}
```

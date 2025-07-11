import express from 'express'

import appRouter from './router'
import { prePullDockerImage } from './utils/docker'

const app = express()
const PORT = process.env.PORT || '3000'

// Application-level middleware
app.use(express.json())

// Routing
app.use('/', appRouter)

async function startServer(): Promise<void> {
  try {
    // Pre-pull the Node Docker image
    await prePullDockerImage('node:23-alpine3.21')

    // Start the express server
    app.listen(Number(PORT), (error: unknown) => {
      if (error) {
        throw new Error('Error starting server: ' + error)
      }
      console.log(`Server is running on http://localhost:${PORT}...`)
    })
  } catch (error: unknown) {
    console.error('Error starting server:', error)
  }
}

void startServer()

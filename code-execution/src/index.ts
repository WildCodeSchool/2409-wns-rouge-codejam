import chalk from 'chalk'
import express from 'express'
import appRouter from './router'
import { prePullDockerImage } from './utils/docker'

const app = express()

// Application-level middleware
app.use(express.json())

// Routing
app.use('/', appRouter)

async function startServer(): Promise<void> {
  try {
    // Pre-pull the Deno Docker image
    await prePullDockerImage('denoland/deno:2.3.1')

    // Start the express server
    app.listen(3001, (error) => {
      if (error) {
        throw new Error('Error starting server: ' + error)
      }
      console.log(chalk.blue('Server is running on http://localhost:3001...'))
    })
  } catch (error: unknown) {
    console.error(chalk.red('Error starting server:'), error)
  }
}

void startServer()

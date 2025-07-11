import chalk from 'chalk'
import express from 'express'
import appRouter from './router'
import { prePullDockerImage } from './utils/docker'

const port = process.env.PORT || 3001
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
    app.listen(port, (error) => {
      if (error) {
        throw new Error('Error starting server: ' + error)
      }
      console.log(
        chalk.blue(`Server is running on http://localhost:${port}...`),
      )
    })
  } catch (error) {
    console.error(chalk.red('Error starting server:'), error)
  }
}

void startServer()

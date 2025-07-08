import chalk from 'chalk'
import * as fs from 'node:fs'
import path from 'node:path'
import { sh } from './sh'
import { isErrorWithStatus, ShResult } from '../types'

const HOST_DIR = './src/'
const DOCKER_DIR = '/tmp/'

/**
 * Check if a Docker container is started
 * @param containerName name of the Docker container
 * @returns
 */
export async function checkIfContainerStarted(
  containerName: string,
): Promise<boolean> {
  const { result: containerId } = await sh(
    `docker ps -q -f name=${containerName}`,
  )
  return containerId !== ''
}

/**
 * Delete a log file from host
 * @param logFileName name of the log file to be deleted from host
 */
export async function deleteLogFile(logFileName: string): Promise<void> {
  const logFilePath = path.join(HOST_DIR, logFileName)
  if (fs.existsSync(logFilePath)) {
    console.log(chalk.yellow(`Deleting log file ${logFilePath}...`))
    fs.rmSync(logFilePath, { force: true })
    console.log(chalk.green('Log file deleted!'))
  }
}

/**
 * Execute JS code in a Docker container
 * @param script the JS code to be executed
 * @param containerName the name of the Docker container
 * @param fileName the name of the script file to be created in the container
 * @param logFileName the name of the log file to be created in the container
 * @returns
 */
export async function executeJSInDockerContainer(
  script: string,
  containerName: string,
  fileName: string,
  logFileName: string,
): Promise<ShResult> {
  const filePath = path.join(HOST_DIR, fileName)
  const logFilePath = path.join(HOST_DIR, logFileName)
  const dockerFilePath = path.join(DOCKER_DIR, fileName)
  const dockerLogFilePath = path.join(DOCKER_DIR, logFileName)

  // Create a temporary file to store the script and copy it to the container
  console.log(chalk.yellow('Creating script file...'))
  fs.writeFileSync(HOST_DIR + fileName, script)
  await sh(`docker cp ${filePath} ${containerName}:${dockerFilePath}`)

  // Remove temp file from host
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { force: true })
  }
  console.log(chalk.green('✅Script file created!'))

  // !TODO: vérifier si le script peut agir sur la machine hote...
  /* 
    Run script in Deno container and log output to a temporary file. 
    This allows to retrieve script output data even if the script times out.
  */
  console.log(chalk.yellow('Executing script...'))

  let output: ShResult

  // !TODO: refactor using centralized error handling... (Should we consider an user error as a server error ?)
  try {
    output = await sh(
      `docker exec ${containerName} sh -c "deno ${dockerFilePath} >> ${dockerLogFilePath}"`,
    )
  } catch (err) {
    if (isErrorWithStatus(err)) {
      return err
    } else {
      throw err
    }
  }
  console.log(chalk.green('✅Script executed!'))

  // Copy log file from container to host
  console.log(chalk.yellow('Copying log file...'))
  await sh(`docker cp ${containerName}:${dockerLogFilePath} ${logFilePath}`)
  console.log(chalk.green('✅Log file copied!'))

  // Read execution result from log file
  const outputData = fs.readFileSync(logFilePath, 'utf-8')

  return {
    status: output.status,
    result: outputData,
  }
}

/**
 * Pre-pull the Deno Docker image (if not already pulled)
 * @param image the Docker image to be pulled
 */
export async function prePullDockerImage(image: string): Promise<void> {
  const shResult = await sh(`docker images -q ${image}`)
  const imageAlreadyExist =
    shResult.status === 'success' && shResult.result !== ''
  if (!imageAlreadyExist) {
    console.log(chalk.yellow(`Pulling Docker image ${image}...`))
    await sh(`docker pull ${image}`)
    console.log(chalk.green('✅Docker image pulled!'))
  }
}

/**
 * Stop and remove a Docker container
 * @param containerName name of the Docker container
 */
export async function removeDockerContainer(
  containerName: string,
): Promise<void> {
  const isContainerStarted = await checkIfContainerStarted(containerName)
  if (isContainerStarted) {
    console.log(chalk.yellow(`Stopping container ${containerName}...`))
    await sh(`docker stop ${containerName}`)
    console.log(chalk.green('✅Container stopped!'))
    console.log(chalk.yellow(`Removing container ${containerName}...`))
    await sh(`docker rm ${containerName}`)
    console.log(chalk.green('✅Container removed!'))
  }
}

/**
 * Start a Docker container
 * @param containerName name of the Docker container
 */
export async function runDockerContainer(
  containerName = 'deno',
): Promise<void> {
  console.log(chalk.yellow(`Starting container ${containerName}...`))
  // Running the container in detached mode allows to await for the `sh`, making sure the container is started, and avoid raising an error when stopping the container running the `sleep infinity` script
  await sh(
    `docker run -d --name ${containerName} denoland/deno:2.3.1 /bin/bash -c 'sleep infinity';`,
  )

  const isContainerStarted = await checkIfContainerStarted(containerName)
  if (!isContainerStarted) {
    throw new Error('Oops! Something went wrong... Please try again later.')
  }
  console.log(chalk.green(`✅Container started!`))
}

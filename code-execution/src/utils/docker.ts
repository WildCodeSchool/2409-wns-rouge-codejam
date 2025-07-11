import chalk from 'chalk'
import * as fs from 'node:fs'
import path from 'node:path'
import { sh } from './sh'
import { ExecutionStatus, isErrorWithStatus, ShResult } from '../types'
import {
  DOCKER_DIR,
  DOCKER_LOG_FILEPATH,
  DOCKER_CODE_FILEPATH,
  HOST_DIR,
} from '../config'

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
 * Copy the file to be executed to a docker container
 * @param fileName the name of the file to be copied
 * @param containerName the name of the Docker container
 * @returns
 */
export async function copyFileToDockerContainer(
  fileName: string,
  containerName: string,
): Promise<void> {
  try {
    const filePath = path.join(HOST_DIR, fileName)

    // Copy the temporary file to the container
    const copyResult = await sh(
      `docker cp ${filePath} ${containerName}:${DOCKER_CODE_FILEPATH}`,
    )

    if (copyResult.status !== ExecutionStatus.SUCCESS) {
      throw new Error('An error has occured while copying the script file.')
    }

    console.log(chalk.green('✅Script file created!'))
  } catch (err) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error('An unknown error has occured.')
  }
}

/**
 * Copy the execution log file from a docker container to the host
 * @param logFilePath the destination path (on the host)
 * @param containerName the name of the Docker container
 * @returns
 */
export async function copyFileFromDockerContainer(
  logFilePath: string,
  containerName: string,
): Promise<void> {
  try {
    // Copy log file from container to host
    console.log(chalk.yellow('Copying log file...'))
    const copyResult = await sh(
      `docker cp ${containerName}:${DOCKER_LOG_FILEPATH} ${logFilePath}`,
    )

    if (copyResult.status !== ExecutionStatus.SUCCESS) {
      throw new Error('An error has occured while copying the log file.')
    }

    console.log(chalk.green('✅Log file copied!'))
  } catch (err) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error('An unknown error has occured.')
  }
}

/**
 * Execute JS file in a Docker container
 * @param containerName the name of the Docker container
 * @returns
 */
export async function executeJSFileInDockerContainer(
  containerName: string,
): Promise<ShResult> {
  console.log(chalk.yellow('Executing script...'))
  const output = await sh(
    `docker exec ${containerName} sh -c "deno ${DOCKER_CODE_FILEPATH} >> ${DOCKER_LOG_FILEPATH}"`,
  )

  return output
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

import * as fs from 'node:fs'

import { sh } from './sh'
import { isErrorWithStatus, ShResult } from '../types'

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
 * Copy a file from a Docker container to host
 * @param containerName name of the Docker container
 * @param sourcePath path of the Docker container's source file to be copied
 * @param destinationPath path where the file will be copied in the host
 */
export async function copyFileFromContainer(
  containerName: string,
  sourcePath: string,
  destinationPath: string,
): Promise<void> {
  console.log('Copying log file to host...')
  await sh(`docker cp ${containerName}:${sourcePath} ${destinationPath} `)
  console.log('✅Log file copied!')
}

/**
 * Copy a file to a Docker container then delete the temporary file from host
 * @param containerName name of the Docker container
 * @param sourcePath path of the source file to be copied
 * @param destinationPath path where the file will be copied in the container
 */
export async function copyFileToContainer(
  containerName: string,
  sourcePath: string,
  destinationPath: string,
): Promise<void> {
  console.log(`Copying script file to container ${containerName}...`)
  await sh(`docker cp ${sourcePath} ${containerName}:${destinationPath}`)
  if (fs.existsSync(sourcePath)) {
    fs.rmSync(sourcePath, { force: true })
  }
  console.log('✅Script file copied!')
}

/**
 * Delete a log file from host
 * @param logFilePath name of the log file to be deleted from host
 */
export async function deleteLogFile(logFilePath: string): Promise<void> {
  if (fs.existsSync(logFilePath)) {
    console.log(`Deleting log file ${logFilePath}...`)
    fs.rmSync(logFilePath, { force: true })
    console.log('✅Log file deleted!')
  }
}

/**
 * Execute JS or TS code in a Docker container based on Deno image, and log output to a temporary file. This allows to retrieve script output data even if the script times out.
 * @param script the JS code to be executed
 * @param containerName the name of the Docker container
 * @param fileName the name of the script file to be created in the container
 * @param logFileName the name of the log file to be created in the container
 * @returns
 */
export async function executeJSInDockerContainer(
  containerName: string,
  scriptFilePath: string,
  logFilePath: string,
): Promise<ShResult> {
  // !TODO: vérifier si le script peut agir sur la machine hote...
  // !TODO: refactor using centralized error handling... (Should we consider an user error as a server error ?)

  console.log('Executing script...')
  try {
    const output: ShResult = await sh(
      `docker exec ${containerName} sh -c "deno ${scriptFilePath} >> ${logFilePath}"`,
      1500,
    )
    console.log('✅Script executed!')
    return output
  } catch (err) {
    if (isErrorWithStatus(err)) {
      console.log('✅Script executed!')
      return err
    } else {
      throw err
    }
  }
}

/**
 * Read execution result from log file and prepare a response object
 * @param logFilePath path of the log file to be read
 * @returns an object containing the status and the result read from the log file
 */
export function makeResponseFromLogFile(
  output: ShResult,
  logFilePath: string,
): ShResult {
  const outputData = fs.readFileSync(logFilePath, 'utf-8')
  return {
    status: output.status,
    result: outputData,
  }
}

/**
 * Pre-pull the Docker image (if not already pulled)
 * @param image the Docker image to be pulled
 */
export async function prePullDockerImage(image: string): Promise<void> {
  const shResult = await sh(`docker images -q ${image}`)
  const imageAlreadyExist =
    shResult.status === 'success' && shResult.result !== ''
  if (!imageAlreadyExist) {
    console.log(`Pulling Docker image ${image}...`)
    await sh(`docker pull ${image}`, 30000)
    console.log('✅Docker image pulled!')
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
    console.log(`Stopping container ${containerName}...`)
    await sh(`docker stop ${containerName}`, 30000)
    console.log('✅Container stopped!')
    console.log(`Removing container ${containerName}...`)
    await sh(`docker rm ${containerName}`, 30000)
    console.log('✅Container removed!')
  }
}

/**
 * Start a Docker container
 * @param containerName name of the Docker container
 */
export async function runDockerContainer(
  containerName = 'deno',
): Promise<void> {
  console.log(`Starting container ${containerName}...`)
  // Running the container in detached mode allows to await for the `sh`, making sure the container is started, and avoid raising an error when stopping the container running the `sleep infinity` script
  await sh(
    `docker run -d --name ${containerName} denoland/deno:2.3.1 sh -c 'sleep infinity';`,
  )

  const isContainerStarted = await checkIfContainerStarted(containerName)
  if (!isContainerStarted) {
    throw new Error('Oops! Something went wrong... Please try again later.')
  }
  console.log(`✅Container started!`)
}

/**
 * Create a temporary file to store the script and copy it to the container
 * @param code the code to be written to the file
 * @param filePath the path where the file will be created
 */
export function writeCodeToFile(code: string, filePath: string): void {
  console.log('Creating script file...')
  fs.writeFileSync(filePath, code)
  console.log('✅Script file created!')
}

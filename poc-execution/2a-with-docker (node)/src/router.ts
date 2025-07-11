import express from 'express'
import path from 'node:path'

import { ExecuteSchema } from './schema/executeSchema'
import { ShResult } from './types'
import {
  copyFileFromContainer,
  copyFileToContainer,
  deleteLogFile,
  executeJSInDockerContainer,
  makeResponseFromLogFile,
  removeDockerContainer,
  runDockerContainer,
  writeCodeToFile,
} from './utils/docker'
import { getFileExtension } from './utils/getFileExtension'
import { validateData } from './utils/validate'

const router = express.Router()

router.post('/api/execute', validateData(ExecuteSchema), async (req, res) => {
  const HOST_DIR = './src/'
  const DOCKER_DIR = '/tmp/'

  const { code, language } = req.body

  // !TODO: add execution ID to container name...
  const randomUUID = crypto.randomUUID()
  const containerName = `node-${randomUUID}`
  const logFileName = `logs-${randomUUID}.txt`
  const hostLogFilePath = path.join(HOST_DIR, logFileName)
  const dockerLogFilePath = path.join(DOCKER_DIR, logFileName)

  try {
    const fileName = `script-${randomUUID}.${getFileExtension(language)}`
    const hostFilePath = path.join(HOST_DIR, fileName)
    const dockerFilePath = path.join(DOCKER_DIR, fileName)

    // Start Node container
    await runDockerContainer(containerName)

    /**
     * 🛡️ Using a script file instead of inline code execution prevents shell injection attacks.
     */

    // Create a temporary file on the host to store the script
    writeCodeToFile(code, hostFilePath)

    // Copy the script file from host to the Docker container
    await copyFileToContainer(containerName, hostFilePath, dockerFilePath)

    // Run script in Node container and log output to a temporary file
    const output: ShResult = await executeJSInDockerContainer(
      containerName,
      dockerFilePath,
      dockerLogFilePath,
    )

    // Copy log file from container to host
    await copyFileFromContainer(
      containerName,
      dockerLogFilePath,
      hostLogFilePath,
    )

    // Read execution result from log file and prepare a response object
    const response = makeResponseFromLogFile(output, hostLogFilePath)

    res.send(response)
  } catch (error: unknown) {
    // !TODO: handle "language not supported" error... should not be a 500 error...
    // !TODO: dead code to be removed...
    // function isErrorWithStatus(error: unknown): error is ShResult {
    //   return (
    //     typeof error === "object" &&
    //     error !== null &&
    //     "status" in error &&
    //     "result" in error
    //   )
    // }
    // if (isErrorWithStatus(error)) {
    //   return res.status(200).send({
    //     message: error.result,
    //   })
    // }
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error has occurred'
    res.status(500).send({
      message: errorMessage,
    })
  } finally {
    // Stop and remove the container
    await removeDockerContainer(containerName)

    // Delete log file from host
    await deleteLogFile(hostLogFilePath)
  }
})

export default router

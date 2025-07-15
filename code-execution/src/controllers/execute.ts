import chalk from 'chalk'
import {
  copyFileFromDockerContainer,
  copyFileToDockerContainer,
  deleteLogFile,
  executeJSFileInDockerContainer,
  removeDockerContainer,
  runDockerContainer,
} from '../utils/docker'
import { getFileExtension } from '../utils/getFileExtension'
import { Request, Response } from 'express'
import * as fs from 'node:fs'
import { HOST_DIR } from '../config'
import path from 'node:path'
import { isErrorWithStatus } from '../types'

export async function execute(req: Request, res: Response): Promise<void> {
  // !TODO: add execution ID to container name...
  const randomUUID = crypto.randomUUID()
  const containerName = `deno-${randomUUID}`
  const logFileName = `logs-${randomUUID}.txt`
  const logFilePath = path.join(HOST_DIR, logFileName)

  try {
    const code = req.body.code
    const language = req.body.language
    const fileName = `code-${randomUUID}.${getFileExtension(language)}`
    const filePath = path.join(HOST_DIR, fileName)

    await runDockerContainer(containerName)

    // Create a temporary file to store the code and copy it to the container
    console.log(chalk.yellow('Creating code file...'))
    fs.writeFileSync(filePath, code)

    await copyFileToDockerContainer(fileName, containerName)

    // Remove temp file from host
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { force: true })
    }

    try {
      const output = await executeJSFileInDockerContainer(containerName)
      // Read execution result from log file
      await copyFileFromDockerContainer(logFilePath, containerName)
      const outputData = fs.readFileSync(logFilePath, 'utf-8')
      const response = {
        status: output.status,
        result: outputData,
      }
      res.send(response)
    } catch (err) {
      // !TODO: refactor using centralized error handling... (Should we consider an user error as a server error ?)
      if (isErrorWithStatus(err)) {
        res.send(err)
      } else {
        throw err
      }
    }
  } catch (error) {
    // !TODO: handle 'language not supported' error... should not be a 500 error...
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error has occurred.'
    res.status(500).send({
      message: errorMessage,
    })
  } finally {
    // Stop and remove the container
    await removeDockerContainer(containerName)

    // Delete log file from host
    await deleteLogFile(logFileName)
  }
}

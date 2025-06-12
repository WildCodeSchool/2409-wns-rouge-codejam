import express from 'express'
import { ExecuteSchema } from './schema/executeSchema'
import { getFileExtension } from './utils/getFileExtension'
import {
  deleteLogFile,
  executeJSInDockerContainer,
  removeDockerContainer,
  runDockerContainer,
} from './utils/docker'
import { validateData } from './utils/validate'

const router = express.Router()

router.post('/api/execute', validateData(ExecuteSchema), async (req, res) => {
  // !TODO: add execution ID to container name...
  const randomUUID = crypto.randomUUID()
  const containerName = `deno-${randomUUID}`
  const logFileName = `logs-${randomUUID}.txt`
  try {
    // Start Deno container
    await runDockerContainer(containerName)

    const fileName = `script-${randomUUID}.${getFileExtension(
      req.body.language,
    )}`

    // Run script in Deno container
    const output = await executeJSInDockerContainer(
      req.body.script,
      containerName,
      fileName,
      logFileName,
    )
    res.send(output)
  } catch (error: unknown) {
    // !TODO: handle 'language not supported' error... should not be a 500 error...
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
    await deleteLogFile(logFileName)
  }
})

export default router

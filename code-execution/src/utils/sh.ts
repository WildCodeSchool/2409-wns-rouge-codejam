import chalk from 'chalk'
import { exec } from 'node:child_process'
import { formatStdError } from './format'
import { ExecutionStatus, ShResult } from '../types'

/**
 * Execute a shell command and return the result
 * @param cmd command to be executed
 * @param timeoutInMs timeout in milliseconds
 * @returns
 */
export function sh(cmd: string, timeoutInMs = 30000): Promise<ShResult> {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: timeoutInMs }, (error, stdout, stderr) => {
      if (stderr) {
        console.log(chalk.red(`❌Execution failed!`))
        return reject({
          status: ExecutionStatus.ERROR,
          // Does not work :
          result: formatStdError(stderr),
          // result: stderr,
        })
      }
      if (error) {
        if (error.killed) {
          console.log(chalk.red('⌛️Execution timeout!'))
          return resolve({
            status: ExecutionStatus.TIMEOUT,
            result: stdout,
          })
        }
        console.log(chalk.red('❌Execution failed!'))
        return reject(new Error(JSON.stringify(error)))
      }
      resolve({
        status: ExecutionStatus.SUCCESS,
        result: stdout,
      })
    })
  })
}

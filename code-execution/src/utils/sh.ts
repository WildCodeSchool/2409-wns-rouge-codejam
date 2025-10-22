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
      if (error) {
        if (error.code === 124) {
          console.log(chalk.red('⌛️Execution timeout!'))
          return reject({
            status: ExecutionStatus.TIMEOUT,
            result: 'RangeError: Potential infinite loop detected.',
          })
        }
        console.log(chalk.red(`❌Execution failed!`))
        return reject({
          status: ExecutionStatus.ERROR,
          result: formatStdError(stderr || error.message),
        })
      }
      console.log(chalk.red('✅Execution succeeded!'))
      resolve({ status: ExecutionStatus.SUCCESS, result: stdout })
    })
  })
}

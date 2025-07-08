import chalk from 'chalk'
import { exec } from 'node:child_process'
import { formatStdError } from './format'
import { ShResult } from '../types'

/**
 * Execute a shell command and return the result
 * @param cmd command to be executed
 * @param timeoutInMs timeout in milliseconds
 * @returns
 */
export function sh(cmd: string, timeoutInMs = 30000): Promise<ShResult> {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: timeoutInMs }, (error, stdout, stderr) => {
      const cleanStderr = stderr.trim()

      if (error) {
        if (error.killed) {
          console.log(chalk.red('⌛️Execution timeout!'))
          return resolve({
            status: 'timeout',
            result: stdout,
          })
        }
        // Always reject on real execution errors (e.g. type errors)
        return reject({
          status: 'error',
          result: formatStdError(cleanStderr || error.message),
        })
      }

      // Only log stderr if needed (for debugging), but don’t reject on it
      if (cleanStderr && !/^Check file:\/\//.test(cleanStderr)) {
        console.warn('⚠️ Non-critical stderr:', cleanStderr)
      }

      // Return successful result even if benign stderr exists
      return resolve({
        status: 'success',
        result: stdout,
      })
    })
  })
}

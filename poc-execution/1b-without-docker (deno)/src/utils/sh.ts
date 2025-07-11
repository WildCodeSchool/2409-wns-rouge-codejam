import { exec } from 'node:child_process'
import { ShResult } from '../types'

export function sh(cmd: string, timeoutInMs = 10000): Promise<ShResult> {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: timeoutInMs }, (error, stdout, stderr) => {
      console.log(`Executing script:${cmd}...`)
      if (stderr) {
        console.log('❌Execution failed!', error)
        return resolve({
          status: 'error',
          result: JSON.stringify(stderr),
        })
      }
      if (error) {
        console.log('❌Execution failed!')
        const reason = error.killed
          ? 'Timeout limit exceeded'
          : JSON.stringify(error)
        return reject(new Error(reason))
      }
      console.log('✅Execution succeeded!')
      resolve({
        status: 'success',
        result: stdout,
      })
    })
  })
}

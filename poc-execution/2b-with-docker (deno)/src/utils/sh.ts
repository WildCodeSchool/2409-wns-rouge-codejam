import { exec } from "node:child_process"
import { formatStdError } from "./format"
import { ShResult } from "../types"

/**
 * Execute a shell command and return the result
 * @param cmd command to be executed
 * @param timeoutInMs timeout in milliseconds
 * @returns
 */
export function sh(cmd: string, timeoutInMs = 2000): Promise<ShResult> {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: timeoutInMs }, (error, stdout, stderr) => {
      // !TODO: understand what kind of error is triggered (docker command vs execution error)...
      if (stderr) {
        console.log("❌Execution failed!")
        return reject({
          status: "error",
          result: formatStdError(stderr),
        })
      }
      // !TODO: not working...
      if (error) {
        if (error.killed) {
          console.log("⌛️Execution timeout!")
          return resolve({
            status: "timeout",
            result: stdout,
          })
        }
        console.log("❌Execution failed!")
        return reject(new Error(JSON.stringify(error)))
      }
      resolve({
        status: "success",
        result: stdout,
      })
    })
  })
}

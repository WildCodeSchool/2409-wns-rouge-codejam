import chalk from "chalk"
import { exec } from "node:child_process"
import { formatStdError } from "./format"
import { ShResult } from "../types"

export function sh(cmd: string, timeoutInMs = 10000): Promise<ShResult> {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: timeoutInMs }, (error, stdout, stderr) => {
      console.log(chalk.yellow("Executing script..."))
      if (stderr) {
        console.log(chalk.red("❌Execution failed!"))
        return resolve({
          status: "error",
          result: formatStdError(stderr),
        })
      }
      if (error) {
        console.log(chalk.red("❌Execution failed!"))
        const reason = error.killed
          ? "Timeout limit exceeded"
          : JSON.stringify(error)
        return reject(new Error(reason))
      }
      console.log(chalk.green("✅Execution succeeded!"))
      resolve({
        status: "success",
        result: stdout,
      })
    })
  })
}

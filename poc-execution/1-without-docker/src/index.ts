import chalk from "chalk"
import express from "express"
import * as fs from "node:fs"
import { sh } from "./utils/sh"

const app = express()
const FILENAME = "script.js"
const FILE_PATH = "./src/" + FILENAME

app.use(express.json())

app.get("/api", (_req, res) => {
  res.send("Hello World")
})

app.post("/api/execute", async (req, res) => {
  try {
    if (!req.body?.script) {
      throw new Error("Script is required")
    }
    const script = req.body.script

    // Créer et écrire le script dans le fichier temporaire
    console.log(chalk.yellow("Creating script file..."))
    fs.writeFileSync("./src/script.js", script)
    console.log(chalk.green("✅Script file created!"))

    // Exécuter le script
    const output = await sh(`node ${FILE_PATH}`)

    // Renvoyer le résultat d'exécution
    res.send(output)
  } catch (error: unknown) {
    let errorMessage =
      error instanceof Error ? error.message : "An unknown error has occurred"
    res.status(500).send({
      message: errorMessage,
    })
  } finally {
    // Supprimer le fichier temporaire
    if (fs.existsSync(FILE_PATH)) {
      console.log(chalk.yellow("Deleting script file..."))
      fs.rmSync(FILE_PATH, { force: true })
      console.log(chalk.green("✅Script file deleted!"))
    }
  }
})

app.listen(3000, (error) => {
  if (error) {
    console.error(chalk.red("Error starting server:"), error)
  }
  console.log(chalk.blue("Server is running on http://localhost:3000..."))
})

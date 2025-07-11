import express from "express"
import * as fs from "node:fs"

import { sh } from "./utils/sh"

const app = express()
const FILENAME = "script.js"
const FILE_PATH = "./src/" + FILENAME

app.use(express.json())

app.post("/api/execute", async (req, res) => {
  try {
    if (!req.body?.script) {
      throw new Error("Script is required")
    }
    const script = req.body.script

    // Créer et écrire le script dans le fichier temporaire
    console.log("Creating script file...")
    fs.writeFileSync("./src/script.js", script)
    console.log("✅Script file created!")

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
      console.log("Deleting script file...")
      fs.rmSync(FILE_PATH, { force: true })
      console.log("✅Script file deleted!")
    }
  }
})

app.listen(3000, (error) => {
  if (error) {
    console.error("Error starting server:", error)
  }
  console.log("Server is running on http://localhost:3000...")
})

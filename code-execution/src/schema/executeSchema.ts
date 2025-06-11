import { z } from "zod"
import { Language } from "../types"

export const ExecuteSchema = z.object({
  script: z.string().trim().min(1, "Script is required"),
  language: z.nativeEnum(Language),
})

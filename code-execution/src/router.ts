import express from 'express'
import { validateData } from './utils/validate'
import { execute } from './controllers/execute'

const router = express.Router()

router.post(
  '/execute',
  (req, res, next) => {
    validateData(req, res, next)
  },
  (req, res) => execute(req, res),
)

export default router

import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/index.js'
import { requestLogger } from './middleware/requestLogger.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

const origins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: origins }))
app.use(express.json())
app.use(requestLogger)

app.use('/api', apiRoutes)

app.use(notFound)
app.use(errorHandler)

export default app

import express from 'express'

import { checkDatabaseConnection } from './db/pool.js'

const app = express()

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' })
})

app.get('/health/db', async (_request, response) => {
  try {
    await checkDatabaseConnection()
    response.status(200).json({ status: 'ok', database: 'connected' })
  } catch {
    response.status(503).json({ status: 'error', database: 'disconnected' })
  }
})

export default app

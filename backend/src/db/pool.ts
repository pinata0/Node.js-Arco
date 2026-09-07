import { Pool } from 'pg'

import { env } from '../config/env.js'

export const pool = new Pool({
  host: env.dbHost,
  port: env.dbPort,
  database: env.dbName,
  user: env.dbUser,
  password: env.dbPassword,
})

export async function checkDatabaseConnection(): Promise<void> {
  await pool.query('SELECT 1')
}

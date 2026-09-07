import dotenv from 'dotenv'

dotenv.config()

function required(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function port(name: string): number {
  const value = Number.parseInt(required(name), 10)

  if (Number.isNaN(value)) {
    throw new Error(`Environment variable ${name} must be a number`)
  }

  return value
}

export const env = {
  port: port('PORT'),
  dbHost: required('DB_HOST'),
  dbPort: port('DB_PORT'),
  dbName: required('DB_NAME'),
  dbUser: required('DB_USER'),
  dbPassword: required('DB_PASSWORD'),
}

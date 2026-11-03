import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { appendFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const logDir = process.env.LOG_DIR || join(__dirname, '..', 'logs')

function logExternalQuery(label, detail) {
  try {
    mkdirSync(logDir, { recursive: true })
    const line = `[${new Date().toISOString()}] NEON ${label} ${detail}\n`
    appendFileSync(join(logDir, 'external-api.log'), line)
  } catch {
    // Never break requests because logging failed
  }
}

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'test') {
  throw new Error('Missing DATABASE_URL in .env')
}

const rawSql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : async () => {
      throw new Error('DATABASE_URL is not configured')
    }

/** Tagged template wrapper that also writes external DB call logs to a file */
export async function sql(strings, ...values) {
  logExternalQuery('QUERY', strings.join('?').replace(/\s+/g, ' ').trim().slice(0, 200))
  try {
    const result = await rawSql(strings, ...values)
    logExternalQuery('OK', `rows=${Array.isArray(result) ? result.length : 'n/a'}`)
    return result
  } catch (error) {
    logExternalQuery('ERROR', error.message || 'unknown')
    throw error
  }
}

import 'dotenv/config'
import { sql } from './config/db.js'

async function setup() {
  await sql`
    CREATE TABLE IF NOT EXISTS experiences (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      author_name TEXT NOT NULL,
      place TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      tag TEXT NOT NULL,
      body TEXT NOT NULL,
      author_user_id INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  console.log('✅ experiences table is ready on Neon')
}

setup().catch((error) => {
  console.error('❌ setup experiences failed:', error)
  process.exit(1)
})

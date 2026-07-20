import 'dotenv/config'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, 'data')
const databaseUrl = String(process.env.DATABASE_URL || '').trim()
let pool = null
let databaseReady = null
let databaseDisabledReason = ''

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value))
}

function sslOptions() {
  const requested = String(process.env.PGSSL || 'auto').toLowerCase()
  if (requested === 'require') return { rejectUnauthorized: false }
  if (requested === 'disable') return false
  if (!databaseUrl) return undefined

  try {
    const parsed = new URL(databaseUrl)
    const mode = String(parsed.searchParams.get('sslmode') || '').toLowerCase()
    if (mode === 'require' || mode === 'verify-ca' || mode === 'verify-full') {
      return { rejectUnauthorized: false }
    }
    if (mode === 'disable') return false
    const host = parsed.hostname.toLowerCase()
    const internal = host.endsWith('.railway.internal') || host === 'localhost' || host === '127.0.0.1'
    return internal ? false : { rejectUnauthorized: false }
  } catch {
    return undefined
  }
}

function createPool() {
  if (!databaseUrl || databaseDisabledReason) return null
  const options = {
    connectionString: databaseUrl,
    max: Math.max(1, Math.min(Number(process.env.PG_POOL_MAX || 5), 20)),
    connectionTimeoutMillis: Math.max(3000, Number(process.env.PG_CONNECT_TIMEOUT || 10000)),
    idleTimeoutMillis: 30000,
  }
  const ssl = sslOptions()
  if (ssl !== undefined) options.ssl = ssl
  return new pg.Pool(options)
}

async function ensureDatabase() {
  if (!databaseUrl || databaseDisabledReason) return null
  if (!pool) pool = createPool()
  if (!databaseReady) {
    databaseReady = pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio_data (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
  }
  await databaseReady
  return pool
}

function disableDatabase(error) {
  databaseDisabledReason = String(error?.message || error || 'PostgreSQL ulanmagan').slice(0, 300)
  databaseReady = null
  console.warn(`PostgreSQL vaqtincha ishlamadi. JSON zaxira saqlashga o‘tildi: ${databaseDisabledReason}`)
}

function localFile(key) {
  return path.join(dataDir, `${key}.json`)
}

async function readLocal(key, fallback) {
  try {
    return JSON.parse(await readFile(localFile(key), 'utf8'))
  } catch {
    return clone(fallback)
  }
}

async function writeLocal(key, value) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(localFile(key), `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

export async function readJson(key, fallback) {
  if (!databaseUrl || databaseDisabledReason) return readLocal(key, fallback)
  try {
    const db = await ensureDatabase()
    const result = await db.query('SELECT value FROM portfolio_data WHERE key = $1', [key])
    if (result.rowCount) return result.rows[0].value

    const local = await readLocal(key, fallback)
    await db.query(
      `INSERT INTO portfolio_data(key, value) VALUES($1, $2::jsonb)
       ON CONFLICT (key) DO NOTHING`,
      [key, JSON.stringify(local)],
    )
    return local
  } catch (error) {
    disableDatabase(error)
    return readLocal(key, fallback)
  }
}

export async function writeJson(key, value) {
  if (!databaseUrl || databaseDisabledReason) return writeLocal(key, value)
  try {
    const db = await ensureDatabase()
    await db.query(
      `INSERT INTO portfolio_data(key, value, updated_at)
       VALUES($1, $2::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [key, JSON.stringify(value)],
    )
  } catch (error) {
    disableDatabase(error)
    await writeLocal(key, value)
  }
}

export function persistenceInfo() {
  if (databaseUrl && !databaseDisabledReason) return { type: 'postgresql' }
  if (databaseUrl && databaseDisabledReason) return { type: 'json-fallback', reason: databaseDisabledReason }
  return { type: 'json', dataDir }
}

export async function closePersistence() {
  if (pool) {
    try { await pool.end() } catch {}
  }
}

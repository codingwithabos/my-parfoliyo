import 'dotenv/config'
import crypto from 'node:crypto'
import { getAdminRecord } from './adminStore.js'

const configuredSecret = String(process.env.ADMIN_SECRET || '')
const runtimeSecret = configuredSecret.length >= 32 ? configuredSecret : crypto.randomBytes(48).toString('base64url')
export const secretWasGenerated = configuredSecret.length < 32
const b64 = (value) => Buffer.from(value).toString('base64url')
export function createToken(username, version = 1) {
  const payload = b64(JSON.stringify({ username, version, exp: Date.now() + 12 * 60 * 60 * 1000 }))
  const sig = crypto.createHmac('sha256', runtimeSecret).update(payload).digest('base64url')
  return `${payload}.${sig}`
}
export function verifyToken(token) {
  try {
    const [payload, sig] = String(token || '').split('.')
    if (!payload || !sig) return null
    const expected = crypto.createHmac('sha256', runtimeSecret).update(payload).digest(), actual = Buffer.from(sig, 'base64url')
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (!data.exp || data.exp < Date.now()) return null
    return data
  } catch { return null }
}
export async function requireAdmin(req, res, next) {
  try {
    const raw = req.headers.authorization?.replace(/^Bearer\s+/i, '')
    const session = verifyToken(raw)
    if (!session) return res.status(401).json({ ok: false, message: 'Admin sessiyasi tugagan.' })
    const record = await getAdminRecord()
    if (session.username !== record.username || Number(session.version || 1) !== Number(record.version || 1)) return res.status(401).json({ ok: false, message: 'Sessiya bekor qilingan. Qayta kiring.' })
    req.admin = session
    next()
  } catch (error) { next(error) }
}

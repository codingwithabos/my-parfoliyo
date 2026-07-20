import 'dotenv/config'
import crypto from 'node:crypto'
import { promisify } from 'node:util'
import { readJson, writeJson } from './persistence.js'

const scrypt = promisify(crypto.scrypt)
let queue = Promise.resolve(), activityQueue = Promise.resolve()
const defaults = () => ({
  username: String(process.env.ADMIN_USERNAME || 'admin'),
  passwordHash: '', salt: '', version: 1, failedAttempts: 0,
  lockUntil: 0, lastLoginAt: null, passwordChangedAt: null,
})
async function readAdmin() { return { ...defaults(), ...(await readJson('admin', {})) } }
const saveAdmin = (data) => writeJson('admin', data)
async function hash(password, salt = crypto.randomBytes(16).toString('hex')) {
  const buffer = await scrypt(password, salt, 64)
  return { salt, passwordHash: Buffer.from(buffer).toString('hex') }
}
async function verify(password, record) {
  if (!record.passwordHash || !record.salt) return false
  const candidate = await hash(password, record.salt)
  const first = Buffer.from(candidate.passwordHash, 'hex'), second = Buffer.from(record.passwordHash, 'hex')
  return first.length === second.length && crypto.timingSafeEqual(first, second)
}
export async function initializeAdmin() {
  const record = await readAdmin()
  if (record.passwordHash && record.salt) return { generatedPassword: null, username: record.username }
  const configured = String(process.env.ADMIN_PASSWORD || '')
  const generatedPassword = configured.length >= 12 ? null : crypto.randomBytes(12).toString('base64url')
  const initialPassword = generatedPassword || configured
  const hashed = await hash(initialPassword)
  Object.assign(record, hashed, {
    username: String(process.env.ADMIN_USERNAME || record.username || 'admin'),
    passwordChangedAt: new Date().toISOString(), version: Number(record.version || 1),
  })
  await saveAdmin(record)
  return { generatedPassword, username: record.username }
}
export const getAdminRecord = () => readAdmin()
export function authenticateAdmin(username, password) {
  queue = queue.catch(() => {}).then(async () => {
    const record = await readAdmin()
    const ok = String(username) === record.username && await verify(String(password), record)
    if (!ok) {
      record.failedAttempts = Math.min(Number(record.failedAttempts || 0) + 1, 9999)
      await saveAdmin(record)
      return { ok: false, locked: false, waitSeconds: 0 }
    }
    record.failedAttempts = 0; record.lockUntil = 0; record.lastLoginAt = new Date().toISOString(); await saveAdmin(record)
    return { ok: true, username: record.username, version: record.version }
  })
  return queue
}
export function changeAdminPassword(username, currentPassword, newPassword) {
  queue = queue.catch(() => {}).then(async () => {
    const record = await readAdmin()
    if (String(username) !== record.username || !(await verify(String(currentPassword), record))) return { ok: false, message: 'Joriy parol noto‘g‘ri.' }
    if (String(newPassword).length < 12) return { ok: false, message: 'Yangi parol kamida 12 ta belgidan iborat bo‘lsin.' }
    const hashed = await hash(String(newPassword))
    Object.assign(record, hashed, { version: Number(record.version || 1) + 1, passwordChangedAt: new Date().toISOString(), failedAttempts: 0, lockUntil: 0 })
    await saveAdmin(record); return { ok: true }
  })
  return queue
}
export async function securitySummary() {
  const r = await readAdmin()
  return { username: r.username, lastLoginAt: r.lastLoginAt, passwordChangedAt: r.passwordChangedAt, failedAttempts: r.failedAttempts, locked: false, lockUntil: null, sessionHours: 12, passwordCustomized: Boolean(r.passwordHash) }
}
async function readActivity() { const data = await readJson('activity', []); return Array.isArray(data) ? data : [] }
export function logActivity(action, details = {}, admin = 'admin') {
  activityQueue = activityQueue.catch(() => {}).then(async () => {
    const list = await readActivity(); list.push({ id: crypto.randomUUID(), action, details, admin, createdAt: new Date().toISOString() })
    await writeJson('activity', list.slice(-500))
  })
  return activityQueue
}
export async function listActivity(limit = 50) { return (await readActivity()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, Math.min(Number(limit) || 50, 200)) }

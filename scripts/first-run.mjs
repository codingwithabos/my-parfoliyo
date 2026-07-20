import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env')
const examplePath = path.join(root, '.env.example')
const loginPath = path.join(root, 'ADMIN_LOGIN.txt')
const adminPath = path.join(root, 'server', 'data', 'admin.json')

function parse(text) {
  const map = new Map()
  for (const line of String(text).split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) map.set(m[1], m[2])
  }
  return map
}
function setEnv(text, key, value) {
  const line = `${key}=${value}`
  const re = new RegExp(`^${key}=.*$`, 'm')
  return re.test(text) ? text.replace(re, line) : `${text.trimEnd()}\n${line}\n`
}

let raw = fs.existsSync(envPath)
  ? fs.readFileSync(envPath, 'utf8')
  : fs.readFileSync(examplePath, 'utf8')
let env = parse(raw)

const username = (env.get('ADMIN_USERNAME') || 'admin').trim() || 'admin'
let password = (env.get('ADMIN_PASSWORD') || '').trim()
let secret = (env.get('ADMIN_SECRET') || '').trim()

if (password.length < 12) password = `Abbos-${crypto.randomBytes(8).toString('hex')}!`
if (secret.length < 32) secret = crypto.randomBytes(48).toString('hex')

raw = setEnv(raw, 'PORT', (env.get('PORT') || '3001').trim() || '3001')
raw = setEnv(raw, 'NODE_ENV', 'production')
raw = setEnv(raw, 'FRONTEND_URLS', 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3001,http://127.0.0.1:3001')
raw = setEnv(raw, 'SITE_URL', (env.get('SITE_URL') || 'http://localhost:3001').trim() || 'http://localhost:3001')
raw = setEnv(raw, 'ADMIN_USERNAME', username)
raw = setEnv(raw, 'ADMIN_PASSWORD', password)
raw = setEnv(raw, 'ADMIN_SECRET', secret)


fs.writeFileSync(envPath, raw, 'utf8')
fs.mkdirSync(path.dirname(adminPath), { recursive: true })
if (!fs.existsSync(adminPath)) fs.writeFileSync(adminPath, '{}\n', 'utf8')
fs.writeFileSync(loginPath, `ADMIN PANEL\r\nLogin: ${username}\r\nParol: ${password}\r\nManzil: http://localhost:3001/admin\r\n`, 'utf8')

console.log('Admin va server sozlamalari tayyor.')
console.log('Telegram bot olib tashlangan. Xabarlar Netlify Forms yoki lokal admin panel orqali qabul qilinadi.')

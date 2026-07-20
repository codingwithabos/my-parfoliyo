import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import crypto from 'node:crypto'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { addMessage, deleteMessage, getMessage, listMessages, messageStats, updateMessage } from './store.js'
import { createToken, requireAdmin, secretWasGenerated } from './auth.js'
import { createItem, deleteItem, getContent, updateItem, updateProfile } from './cmsStore.js'
import { addVisit, visitorStats } from './analyticsStore.js'
import { authenticateAdmin, changeAdminPassword, initializeAdmin, listActivity, logActivity, securitySummary } from './adminStore.js'
import { closePersistence, persistenceInfo } from './persistence.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')
const app = express()
const port = Number(process.env.PORT || 3001)
const production = process.env.NODE_ENV === 'production'
const rateBuckets = new Map()
const recent = new Map()

app.disable('x-powered-by')
app.set('trust proxy', Number(process.env.TRUST_PROXY ?? (production ? 1 : 0)))
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false, strictTransportSecurity: production ? undefined : false }))

const allowedOrigins = String(process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',').map((value) => value.trim()).filter(Boolean)

function originAllowed(origin, requestHost) {
  if (!origin) return true
  try {
    const parsed = new URL(origin)
    if (parsed.host === requestHost) return true
    if (allowedOrigins.includes(origin)) return true
    if (['localhost', '127.0.0.1'].includes(parsed.hostname)) return true
    return parsed.hostname.endsWith('.up.railway.app') || parsed.hostname.endsWith('.netlify.app')
  } catch {
    return false
  }
}

app.use((req, res, next) => cors({
  origin: (origin, callback) => callback(null, originAllowed(origin, req.get('host'))),
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})(req, res, next))
app.use(express.json({ limit: '1mb' }))

const clean = (value, max = 1200) => String(value ?? '').replace(/<[^>]*>/g, '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max)
const deep = (value, depth = 0) => {
  if (depth > 6) return null
  if (typeof value === 'string') return clean(value, 6000)
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => deep(item, depth + 1))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).slice(0, 100).map(([key, item]) => [clean(key, 100), deep(item, depth + 1)]))
  return value
}
function validate(body = {}) {
  const data = { name: clean(body.name, 80), phone: clean(body.phone, 24), telegram: clean(body.telegram, 33), email: clean(body.email, 120).toLowerCase(), subject: clean(body.subject, 160), message: clean(body.message, 1200), company: clean(body.company, 100) }
  const errors = {}, phoneDigits = data.phone.replace(/\D/g, '')
  if (data.company) errors.spam = 'Spam'
  if (data.name.length < 2) errors.name = 'Ism bo‘sh.'
  if (phoneDigits.length !== 12 || !phoneDigits.startsWith('998')) errors.phone = 'Telefon to‘liq emas.'
  if (data.telegram && !/^@[A-Za-z0-9_]{5,32}$/.test(data.telegram)) errors.telegram = 'Telegram noto‘g‘ri.'
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Email noto‘g‘ri.'
  if (data.message.length < 5) errors.message = 'Xabar juda qisqa.'
  return { data, errors }
}
function limited(scope, ip, max, windowMs) {
  const now = Date.now(), key = `${scope}:${ip}`, current = rateBuckets.get(key)
  if (!current || now - current.start > windowMs) { rateBuckets.set(key, { start: now, count: 1 }); return false }
  if (current.count >= max) return true
  current.count += 1; return false
}
function duplicate(data) {
  const key = crypto.createHash('sha256').update(`${data.phone}|${data.subject}|${data.message}`).digest('hex'), now = Date.now(), old = recent.get(key)
  if (old && now - old < 60000) return true
  recent.set(key, now); return false
}
const cleanupTimer = setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateBuckets) if (now - value.start > 30 * 60 * 1000) rateBuckets.delete(key)
  for (const [key, time] of recent) if (now - time > 60000) recent.delete(key)
}, 5 * 60 * 1000)
cleanupTimer.unref()

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'portfolio-backend', persistence: persistenceInfo().type }))
app.get('/api/content', async (req, res, next) => { try { res.setHeader('Cache-Control', 'no-store'); res.json({ ok: true, content: await getContent() }) } catch (error) { next(error) } })
app.post('/api/analytics/visit', async (req, res, next) => { try { if (limited('analytics', req.ip, 120, 60 * 60 * 1000)) return res.status(429).json({ ok: false, message: 'Juda ko‘p so‘rov.' }); await addVisit({ path: clean(req.body?.path, 300) || '/', device: ['mobile', 'tablet', 'desktop'].includes(req.body?.device) ? req.body.device : 'desktop', referrer: clean(req.body?.referrer, 300) }); res.status(201).json({ ok: true }) } catch (error) { next(error) } })
app.post('/api/contact', async (req, res, next) => {
  try {
    if (limited('contact', req.ip, 6, 15 * 60 * 1000)) return res.status(429).json({ ok: false, message: 'Juda ko‘p so‘rov. Keyinroq urinib ko‘ring.' })
    const { data, errors } = validate(req.body)
    if (Object.keys(errors).length) return res.status(400).json({ ok: false, message: 'Forma ma’lumotlarini tekshiring.', errors })
    if (duplicate(data)) return res.status(409).json({ ok: false, message: 'Bu xabar yaqinda yuborilgan.' })
    const message = { id: crypto.randomUUID(), ...data, status: 'unread', important: false, createdAt: new Date().toISOString() }
    delete message.company
    await addMessage(message)
    res.status(201).json({ ok: true, message: 'Xabar faqat admin panelda saqlandi.', orderId: message.id })
  } catch (error) { next(error) }
})

app.post('/api/admin/login', async (req, res, next) => {
  try {
    if (limited('admin-login', req.ip, 10, 15 * 60 * 1000)) return res.status(429).json({ ok: false, message: 'Juda ko‘p login urinishlari. Keyinroq urinib ko‘ring.' })
    const result = await authenticateAdmin(clean(req.body?.username, 80), String(req.body?.password || '').slice(0, 256))
    if (!result.ok) return res.status(result.locked ? 423 : 401).json({ ok: false, message: result.locked ? `Login vaqtincha bloklangan.${result.waitSeconds ? ` ${result.waitSeconds} soniya kuting.` : ''}` : 'Login yoki parol noto‘g‘ri.' })
    await logActivity('admin_login', { ip: req.ip }, result.username)
    res.json({ ok: true, token: createToken(result.username, result.version) })
  } catch (error) { next(error) }
})
app.get('/api/admin/dashboard', requireAdmin, async (req, res, next) => { try { const [messages, visitors, content] = await Promise.all([messageStats(), visitorStats(), getContent()]); res.json({ ok: true, dashboard: { messages, visitors, content: { projects: content.projects.length, services: content.services.length, skills: content.skills.length, experience: content.experience.length } } }) } catch (error) { next(error) } })
app.get('/api/admin/messages', requireAdmin, async (req, res, next) => { try { res.json({ ok: true, messages: await listMessages() }) } catch (error) { next(error) } })
app.patch('/api/admin/messages/:id', requireAdmin, async (req, res, next) => {
  try {
    const statuses = new Set(['unread', 'read', 'replied', 'in_progress', 'completed', 'spam']), patch = {}
    if (statuses.has(req.body?.status)) patch.status = req.body.status
    if (typeof req.body?.important === 'boolean') patch.important = req.body.important
    if (typeof req.body?.note === 'string') patch.note = clean(req.body.note, 500)
    const previous = await getMessage(req.params.id)
    if (!previous) return res.status(404).json({ ok: false, message: 'Xabar topilmadi.' })
    const message = await updateMessage(req.params.id, patch)
    await logActivity('message_updated', { id: req.params.id, patch }, req.admin.username)
    res.json({ ok: true, message })
  } catch (error) { next(error) }
})
app.delete('/api/admin/messages/:id', requireAdmin, async (req, res, next) => { try { const ok = await deleteMessage(req.params.id); if (ok) await logActivity('message_deleted', { id: req.params.id }, req.admin.username); res.status(ok ? 200 : 404).json({ ok, message: ok ? 'O‘chirildi.' : 'Topilmadi.' }) } catch (error) { next(error) } })
app.get('/api/admin/content', requireAdmin, async (req, res, next) => { try { res.json({ ok: true, content: await getContent() }) } catch (error) { next(error) } })
app.post('/api/admin/content/:collection', requireAdmin, async (req, res) => { try { const item = await createItem(req.params.collection, deep(req.body)); await logActivity('content_created', { collection: req.params.collection, id: item.id }, req.admin.username); res.status(201).json({ ok: true, item }) } catch (error) { res.status(400).json({ ok: false, message: error.message }) } })
app.patch('/api/admin/content/:collection/:id', requireAdmin, async (req, res) => { try { const item = await updateItem(req.params.collection, req.params.id, deep(req.body)); if (!item) return res.status(404).json({ ok: false, message: 'Ma’lumot topilmadi.' }); await logActivity('content_updated', { collection: req.params.collection, id: req.params.id }, req.admin.username); res.json({ ok: true, item }) } catch (error) { res.status(400).json({ ok: false, message: error.message }) } })
app.delete('/api/admin/content/:collection/:id', requireAdmin, async (req, res) => { try { const ok = await deleteItem(req.params.collection, req.params.id); if (ok) await logActivity('content_deleted', { collection: req.params.collection, id: req.params.id }, req.admin.username); res.status(ok ? 200 : 404).json({ ok, message: ok ? 'O‘chirildi.' : 'Topilmadi.' }) } catch (error) { res.status(400).json({ ok: false, message: error.message }) } })
app.patch('/api/admin/profile', requireAdmin, async (req, res, next) => { try { const profile = await updateProfile(deep(req.body)); await logActivity('profile_updated', {}, req.admin.username); res.json({ ok: true, profile }) } catch (error) { next(error) } })
app.get('/api/admin/security', requireAdmin, async (req, res, next) => { try { res.json({ ok: true, security: await securitySummary() }) } catch (error) { next(error) } })
app.post('/api/admin/security/change-password', requireAdmin, async (req, res, next) => { try { const result = await changeAdminPassword(req.admin.username, String(req.body?.currentPassword || '').slice(0, 256), String(req.body?.newPassword || '').slice(0, 256)); if (!result.ok) return res.status(400).json(result); await logActivity('password_changed', {}, req.admin.username); res.json({ ok: true, message: 'Parol o‘zgartirildi. Qayta login qiling.' }) } catch (error) { next(error) } })
app.get('/api/admin/activity', requireAdmin, async (req, res, next) => { try { res.json({ ok: true, activity: await listActivity(req.query.limit) }) } catch (error) { next(error) } })
const excelSafe = (value) => /^[=+@-]/.test(String(value ?? '').trimStart()) ? `'${value}` : value
const xml = (value) => String(excelSafe(value) ?? '').replace(/[<>&"']/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[character]))
app.get('/api/admin/export', requireAdmin, async (req, res, next) => {
  try {
    const items = await listMessages(), headers = ['Status', 'Muhim', 'Ism', 'Telefon', 'Telegram', 'Email', 'Mavzu', 'Xabar', 'Vaqt']
    const rows = [headers, ...items.map((message) => [message.status, message.important ? 'Ha' : 'Yo‘q', message.name, message.phone, message.telegram, message.email, message.subject, message.message, message.createdAt])]
      .map((row) => `<Row>${row.map((cell) => `<Cell><Data ss:Type="String">${xml(cell)}</Data></Cell>`).join('')}</Row>`).join('')
    const book = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Messages"><Table>${rows}</Table></Worksheet></Workbook>`
    res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="portfolio_messages.xls"')
    res.send(book)
  } catch (error) { next(error) }
})

app.use('/api', (req, res) => res.status(404).json({ ok: false, message: 'API manzili topilmadi.' }))
app.use(express.static(dist, {
  index: false,
  etag: true,
  maxAge: production ? '1y' : 0,
  immutable: production,
  setHeaders: (res, filePath) => {
    if (!filePath.includes(`${path.sep}assets${path.sep}`)) {
      res.setHeader('Cache-Control', production ? 'public, max-age=3600' : 'no-store')
    }
  },
}))
app.get('*', (req, res, next) => {
  const indexFile = path.join(dist, 'index.html')
  if (!existsSync(indexFile)) return res.status(503).json({ ok: false, message: 'Frontend build topilmadi. npm run build buyrug‘ini bajaring.' })
  // Har yangi Railway deployda yangi index darhol ochilsin, eski portfolio brauzer keshida qolmasin.
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.sendFile(indexFile, (error) => { if (error) next(error) })
})
app.use((error, req, res, next) => {
  console.error(error.stack || error.message)
  if (res.headersSent) return next(error)
  res.status(500).json({ ok: false, message: 'Server xatosi.' })
})

async function start() {
  const admin = await initializeAdmin()
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Backend: http://localhost:${port}`)
    console.log(`Storage: ${persistenceInfo().type}`)
    console.log(`Frontend build: ${existsSync(path.join(dist, 'index.html')) ? 'ready' : 'missing'}`)
    if (secretWasGenerated) console.warn('ADMIN_SECRET topilmadi: vaqtinchalik xavfsiz secret yaratildi. Production uchun .env ga ADMIN_SECRET kiriting.')
    if (admin.generatedPassword) {
      console.warn('ADMIN_PASSWORD topilmadi yoki juda qisqa. Bir martalik admin ma’lumoti:')
      console.warn(`Login: ${admin.username}`)
      console.warn(`Parol: ${admin.generatedPassword}`)
    }
  })
  const shutdown = async () => { server.close(); await closePersistence(); process.exit(0) }
  process.once('SIGINT', shutdown); process.once('SIGTERM', shutdown)
}
start().catch((error) => { console.error('Server ishga tushmadi:', error.stack || error.message); process.exit(1) })

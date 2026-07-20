import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const indexFile = path.join(root, 'dist', 'index.html')

if (!existsSync(indexFile)) {
  console.warn('Frontend build topilmadi. Railway uchun avtomatik build boshlanmoqda...')
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  })
  if (result.status !== 0 || !existsSync(indexFile)) {
    console.error('Frontend build yaratilmadi. Deploy to‘xtatildi.')
    process.exit(result.status || 1)
  }
}

await import('../server/server.js')

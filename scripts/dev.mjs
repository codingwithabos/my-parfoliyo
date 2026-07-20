import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const rootDir = path.resolve(path.dirname(__filename), '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const vitePath = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js')

function installDependencies() {
  console.log('')
  console.log('Vite yoki kerakli paketlar topilmadi.')
  console.log('Paketlar avtomatik o‘rnatilmoqda...')
  console.log('')

  const install = spawnSync(
    npmCommand,
    ['install', '--include=dev', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org/'],
    {
      cwd: rootDir,
      stdio: 'inherit',
      shell: false,
    },
  )

  if (install.status !== 0) {
    console.error('')
    console.error('npm install muvaffaqiyatsiz tugadi.')
    console.error('PowerShell’da quyidagini ishlating:')
    console.error('npm cache clean --force')
    console.error('npm install --include=dev')
    process.exit(1)
  }
}

if (!existsSync(vitePath)) {
  installDependencies()
}

if (!existsSync(vitePath)) {
  console.error('Vite o‘rnatilmadi. node_modules papkasini o‘chirib qayta urinib ko‘ring.')
  process.exit(1)
}

const processes = [
  spawn(process.execPath, ['server/server.js'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, PORT: process.env.PORT || '3001' },
  }),
  spawn(process.execPath, [vitePath, '--host', '0.0.0.0'], {
    cwd: rootDir,
    stdio: 'inherit',
  }),
]

let shuttingDown = false

function stopAll(exitCode = 0) {
  if (shuttingDown) return
  shuttingDown = true

  for (const child of processes) {
    if (!child.killed) {
      child.kill()
    }
  }

  windowExit(exitCode)
}

function windowExit(code) {
  setTimeout(() => process.exit(code), 100)
}

for (const child of processes) {
  child.on('error', (error) => {
    console.error('Jarayonni ishga tushirishda xatolik:', error.message)
    stopAll(1)
  })

  child.on('exit', (code) => {
    if (!shuttingDown && code && code !== 0) {
      stopAll(code)
    }
  })
}

process.on('SIGINT', () => stopAll(0))
process.on('SIGTERM', () => stopAll(0))

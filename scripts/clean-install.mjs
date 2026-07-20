import { rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
rmSync(path.join(rootDir, 'node_modules'), { recursive: true, force: true })
const install = spawnSync(npmCommand, ['ci', '--include=dev'], { cwd: rootDir, stdio: 'inherit', shell: false })
process.exit(install.status || 0)

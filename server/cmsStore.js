import crypto from 'node:crypto'
import { readJson, writeJson } from './persistence.js'

const collections = new Set(['projects', 'services', 'skills', 'experience'])
const fallback = {
  profile: {},
  projects: [],
  services: [],
  skills: [],
  experience: [],
}
let queue = Promise.resolve()

async function readContent() {
  const data = await readJson('content', fallback)
  return {
    profile: data?.profile || {},
    projects: Array.isArray(data?.projects) ? data.projects : [],
    services: Array.isArray(data?.services) ? data.services : [],
    skills: Array.isArray(data?.skills) ? data.skills : [],
    experience: Array.isArray(data?.experience) ? data.experience : [],
  }
}

const saveContent = (content) => writeJson('content', content)

function ensureCollection(name) {
  if (!collections.has(name)) throw new Error('Noto‘g‘ri kontent turi.')
}

export const getContent = () => readContent()

export function updateProfile(patch) {
  queue = queue.catch(() => {}).then(async () => {
    const content = await readContent()
    content.profile = {
      ...content.profile,
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    await saveContent(content)
    return content.profile
  })
  return queue
}

export function createItem(collection, item) {
  ensureCollection(collection)
  queue = queue.catch(() => {}).then(async () => {
    const content = await readContent()
    const id = String(item.id || item.slug || crypto.randomUUID())
    if (content[collection].some((current) => String(current.id) === id)) {
      throw new Error('Bu ID bilan ma’lumot mavjud.')
    }
    const created = {
      ...item,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    content[collection].push(created)
    await saveContent(content)
    return created
  })
  return queue
}

export function updateItem(collection, id, patch) {
  ensureCollection(collection)
  queue = queue.catch(() => {}).then(async () => {
    const content = await readContent()
    const index = content[collection].findIndex((item) => String(item.id) === String(id))
    if (index < 0) return null
    content[collection][index] = {
      ...content[collection][index],
      ...patch,
      id: content[collection][index].id,
      updatedAt: new Date().toISOString(),
    }
    await saveContent(content)
    return content[collection][index]
  })
  return queue
}

export function deleteItem(collection, id) {
  ensureCollection(collection)
  queue = queue.catch(() => {}).then(async () => {
    const content = await readContent()
    const next = content[collection].filter((item) => String(item.id) !== String(id))
    const changed = next.length !== content[collection].length
    if (changed) {
      content[collection] = next
      await saveContent(content)
    }
    return changed
  })
  return queue
}

import { readJson, writeJson } from './persistence.js'

let queue = Promise.resolve()
const key = 'messages'
const readAll = async () => {
  const data = await readJson(key, [])
  return Array.isArray(data) ? data : []
}
const saveAll = (items) => writeJson(key, items)

export async function listMessages() {
  return (await readAll()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
export function addMessage(message) {
  queue = queue.catch(() => {}).then(async () => { const items = await readAll(); items.push(message); await saveAll(items) })
  return queue
}
export function updateMessage(id, patch) {
  queue = queue.catch(() => {}).then(async () => {
    const items = await readAll(), index = items.findIndex((item) => item.id === id)
    if (index < 0) return null
    items[index] = { ...items[index], ...patch, updatedAt: new Date().toISOString() }
    await saveAll(items)
    return items[index]
  })
  return queue
}
export function deleteMessage(id) {
  queue = queue.catch(() => {}).then(async () => {
    const items = await readAll(), next = items.filter((item) => item.id !== id)
    const changed = next.length !== items.length
    if (changed) await saveAll(next)
    return changed
  })
  return queue
}
export async function getMessage(id) { return (await readAll()).find((item) => item.id === id) || null }
export async function messageStats() {
  const items = await readAll(), now = Date.now(), day = 86400000, statuses = {}
  for (const item of items) statuses[item.status || 'unread'] = (statuses[item.status || 'unread'] || 0) + 1
  return {
    total: items.length,
    unread: items.filter((item) => (item.status || 'unread') === 'unread').length,
    important: items.filter((item) => item.important).length,
    today: items.filter((item) => now - new Date(item.createdAt).getTime() < day).length,
    week: items.filter((item) => now - new Date(item.createdAt).getTime() < 7 * day).length,
    month: items.filter((item) => now - new Date(item.createdAt).getTime() < 30 * day).length,
    statuses,
  }
}

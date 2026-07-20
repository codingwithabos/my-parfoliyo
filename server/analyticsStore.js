import { readJson, writeJson } from './persistence.js'
let queue = Promise.resolve()
const key = 'analytics'
const readAll = async () => { const data = await readJson(key, []); return Array.isArray(data) ? data : [] }
const saveAll = (items) => writeJson(key, items.slice(-5000))
export function addVisit(visit) {
  queue = queue.catch(() => {}).then(async () => { const items = await readAll(); items.push({ ...visit, createdAt: new Date().toISOString() }); await saveAll(items) })
  return queue
}
export async function visitorStats() {
  const items = await readAll(), now = Date.now(), day = 86400000
  const daily = Array.from({ length: 7 }, (_, index) => {
    const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - (6 - index))
    const end = new Date(start.getTime() + day)
    return { date: start.toISOString().slice(0, 10), count: items.filter((event) => { const time = new Date(event.createdAt).getTime(); return time >= start.getTime() && time < end.getTime() }).length }
  })
  return {
    total: items.length,
    today: items.filter((event) => now - new Date(event.createdAt).getTime() < day).length,
    week: items.filter((event) => now - new Date(event.createdAt).getTime() < 7 * day).length,
    month: items.filter((event) => now - new Date(event.createdAt).getTime() < 30 * day).length,
    devices: {
      desktop: items.filter((event) => event.device === 'desktop').length,
      tablet: items.filter((event) => event.device === 'tablet').length,
      mobile: items.filter((event) => event.device === 'mobile').length,
    }, daily,
  }
}

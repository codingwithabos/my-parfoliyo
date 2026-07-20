import 'dotenv/config'
import { readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const siteUrl = String(process.env.SITE_URL || process.env.VITE_SITE_URL || '').trim().replace(/\/+$/, '')
const content = JSON.parse(await readFile(path.join(root, 'server', 'data', 'content.json'), 'utf8'))
const robots = ['User-agent: *', 'Allow: /']
if (siteUrl) robots.push(`Sitemap: ${siteUrl}/sitemap.xml`)
await writeFile(path.join(publicDir, 'robots.txt'), `${robots.join('\n')}\n`)
const sitemapPath = path.join(publicDir, 'sitemap.xml')
if (siteUrl) {
  const paths = ['/', ...(content.blogPosts || []).filter((item) => item.published !== false).map((item) => `/blog/${item.slug}`), ...(content.projects || []).filter((item) => item.active !== false).map((item) => `/project/${item.slug}`)]
  const urls = [...new Set(paths)].map((pathname) => `<url><loc>${siteUrl}${pathname}</loc></url>`).join('')
  await writeFile(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`)
} else {
  await rm(sitemapPath, { force: true })
}

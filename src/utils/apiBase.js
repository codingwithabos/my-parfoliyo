const configuredBase = String(
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '',
).trim().replace(/\/+$/, '')

export const apiBase = configuredBase
export const hasRemoteApi = () => Boolean(configuredBase)

export function apiUrl(path = '') {
  const normalizedPath = String(path || '').startsWith('/') ? String(path) : `/${path}`
  return configuredBase ? `${configuredBase}${normalizedPath}` : normalizedPath
}

export function apiConnectionMessage() {
  const host = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : ''
  if (host.endsWith('.netlify.app') && !configuredBase) {
    return 'Admin backend ulanmagan. Netlify Environment Variables bo‘limida VITE_API_URL ga Railway domenini kiriting va saytni qayta deploy qiling.'
  }
  return configuredBase
    ? `Admin serverga ulanib bo‘lmadi: ${configuredBase}`
    : 'Admin serverga ulanib bo‘lmadi. Backend ishlayotganini tekshiring.'
}

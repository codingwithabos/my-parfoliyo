import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import fallbackContent from '../../server/data/content.json'
import { apiUrl } from '../utils/apiBase.js'

const fallback = {
  ...fallbackContent,
  profile: {
    ...fallbackContent.profile,
    imageUrl: fallbackContent.profile.imageUrl || '',
    available: fallbackContent.profile.available !== false,
  },
}

const collections = ['projects', 'services', 'skills', 'experience']
const Context = createContext({ content: fallback, loading: false, refresh: async () => {} })

function mergeContent(remote) {
  const safe = remote && typeof remote === 'object' ? remote : {}
  const merged = {
    ...fallback,
    ...safe,
    profile: {
      ...fallback.profile,
      ...(safe.profile && typeof safe.profile === 'object' ? safe.profile : {}),
    },
  }

  for (const collection of collections) {
    merged[collection] = Array.isArray(safe[collection]) && safe[collection].length
      ? safe[collection]
      : fallback[collection]
  }

  return merged
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(fallback)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const response = await fetch(apiUrl('/api/content'), {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      const contentType = response.headers.get('content-type') || ''
      if (!response.ok || !contentType.includes('application/json')) throw new Error('Content API mavjud emas')
      const data = await response.json()
      setContent(mergeContent(data.content))
    } catch {
      // API vaqtincha ishlamasa ham portfolio doim tayyor lokal kontent bilan ko‘rinadi.
      setContent((current) => mergeContent(current))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])
  const value = useMemo(() => ({ content, loading, refresh }), [content, loading])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useContent = () => useContext(Context)

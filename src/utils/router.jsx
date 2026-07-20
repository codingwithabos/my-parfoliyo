import { useEffect, useState } from 'react'

export function scrollToSection(hash, behavior = 'smooth') {
  if (!hash?.startsWith('#')) return false

  const section = document.querySelector(hash)
  if (!section) return false

  const navbarHeight =
    document.querySelector('.navbar')?.getBoundingClientRect().height || 76

  const top =
    section.getBoundingClientRect().top +
    window.scrollY -
    navbarHeight -
    18

  window.scrollTo({
    top: Math.max(0, top),
    behavior,
  })

  return true
}

export function navigate(path) {
  const url = new URL(path, window.location.href)
  const nextPath = `${url.pathname}${url.search}${url.hash}`

  window.history.pushState({}, '', nextPath)
  window.dispatchEvent(new PopStateEvent('popstate'))

  window.requestAnimationFrame(() => {
    if (url.hash && url.pathname === window.location.pathname) {
      scrollToSection(url.hash)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleChange = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handleChange)
    return () => window.removeEventListener('popstate', handleChange)
  }, [])

  return path
}

export function InternalLink({
  href,
  children,
  onClick,
  target,
  ...props
}) {
  const handleClick = (event) => {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      target === '_blank' ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return
    }

    event.preventDefault()

    if (href.startsWith('#')) {
      scrollToSection(href)
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}${window.location.search}${href}`,
      )
      return
    }

    navigate(href)
  }

  return (
    <a
      href={href}
      target={target}
      {...props}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}

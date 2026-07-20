import { useEffect, useRef, useState } from 'react'

export function useInViewOnce(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsVisible(true)
      observer.unobserve(entry.target)
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px', ...options })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

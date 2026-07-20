import { useEffect, useState } from 'react'

const SHOW_AFTER = 80

export default function ScrollTop() {
  const [visible, setVisible] = useState(() => window.scrollY > SHOW_AFTER)

  useEffect(() => {
    let frame = null

    const updateVisibility = () => {
      if (frame) return

      frame = window.requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER)
        frame = null
      })
    }

    window.addEventListener('scroll', updateVisibility, { passive: true })
    updateVisibility()

    return () => {
      window.removeEventListener('scroll', updateVisibility)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const goToTop = (event) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    } catch {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }

  return (
    <button
      className={`scroll-top scroll-top--terminal ${visible ? 'visible' : ''}`}
      type="button"
      aria-label="Sahifa yuqorisiga qaytish"
      title="Yuqoriga qaytish"
      onClick={goToTop}
    >
      <span>./top</span>
      <i aria-hidden="true">↑</i>
    </button>
  )
}

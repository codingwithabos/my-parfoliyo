import { useRef } from 'react'

export default function MagneticLink({ className = '', children, onClick, ...props }) {
  const ref = useRef(null)

  const handleMove = (event) => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const element = ref.current
    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    element.style.transform = `translate3d(${x * 0.13}px, ${y * 0.18}px, 0)`
  }

  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate3d(0, 0, 0)'
  }

  const handleClick = (event) => {
    const element = ref.current
    const rect = element.getBoundingClientRect()
    const ripple = document.createElement('span')
    const size = Math.max(rect.width, rect.height) * 1.4
    ripple.className = 'button-ripple'
    ripple.style.width = `${size}px`
    ripple.style.height = `${size}px`
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`
    element.querySelector('.button-ripple')?.remove()
    element.appendChild(ripple)
    window.setTimeout(() => ripple.remove(), 700)
    onClick?.(event)
  }

  return (
    <a
      {...props}
      ref={ref}
      className={`${className} magnetic-element`.trim()}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onBlur={reset}
      onClick={handleClick}
    >
      <span className="magnetic-element__content">{children}</span>
    </a>
  )
}

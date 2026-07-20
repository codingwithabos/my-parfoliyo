import { useEffect, useState } from 'react'

const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}#$%&*'

export function useScramble(text, enabled = true, duration = 950) {
  const [output, setOutput] = useState(enabled ? '' : text)

  useEffect(() => {
    if (!enabled) {
      setOutput(text)
      return undefined
    }

    const start = performance.now()
    let frame = 0

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const revealed = Math.floor(text.length * progress)
      const value = text
        .split('')
        .map((character, index) => {
          if (character === ' ') return ' '
          if (index < revealed) return character
          return glyphs[Math.floor(Math.random() * glyphs.length)]
        })
        .join('')

      setOutput(value)
      if (progress < 1) frame = requestAnimationFrame(animate)
      else setOutput(text)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [text, enabled, duration])

  return output
}

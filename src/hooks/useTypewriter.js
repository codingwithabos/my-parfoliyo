import { useEffect, useState } from 'react'

export function useTypewriter(text, speed = 90, enabled = true) {
  const [output, setOutput] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined

    setOutput('')
    setDone(false)
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setOutput(text.slice(0, index))
      if (index >= text.length) {
        window.clearInterval(timer)
        setDone(true)
      }
    }, speed)

    return () => window.clearInterval(timer)
  }, [text, speed, enabled])

  return { output, done }
}

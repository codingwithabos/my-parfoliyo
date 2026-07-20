import { useEffect, useMemo, useState } from 'react'

const pause = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

export default function BootTerminalIntro({ onComplete }) {
  const script = useMemo(
    () => [
      { kind: 'command', text: './portfolio-start.sh', delay: 13 },
      { kind: 'output', text: '[1/5] Tizim tekshirilmoqda...', delay: 7 },
      { kind: 'success', text: 'OK  Node.js va server tayyor', delay: 6 },
      { kind: 'output', text: '[2/5] Sodiqjonov Abbos profili yuklanmoqda...', delay: 7 },
      { kind: 'success', text: 'OK  Profil ma’lumotlari yuklandi', delay: 6 },
      { kind: 'output', text: '[3/5] Ko‘nikmalar va tajriba olinmoqda...', delay: 7 },
      { kind: 'success', text: 'OK  React • Node.js • Backend', delay: 6 },
      { kind: 'output', text: '[4/5] Loyihalar tayyorlanmoqda...', delay: 7 },
      { kind: 'success', text: 'OK  Portfolio loyihalari tayyor', delay: 6 },
      { kind: 'output', text: '[5/5] Interfeys ishga tushirilmoqda...', delay: 7 },
      { kind: 'ready', text: 'PORTFOLIO MUVAFFAQIYATLI OCHILDI', delay: 10 },
    ],
    [],
  )

  const [lines, setLines] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [currentKind, setCurrentKind] = useState('command')
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    document.body.classList.add('boot-intro-active')

    const run = async () => {
      await pause(100)

      for (const line of script) {
        if (cancelled) return
        setCurrentKind(line.kind)
        setCurrentText('')

        for (let index = 0; index < line.text.length; index += 1) {
          if (cancelled) return
          setCurrentText(line.text.slice(0, index + 1))
          await pause(line.delay)
        }

        await pause(line.kind === 'command' ? 105 : 52)
        if (cancelled) return
        setLines((previous) => [...previous, line])
        setCurrentText('')
      }

      await pause(170)
      if (cancelled) return
      setLeaving(true)
      await pause(300)
      if (cancelled) return
      document.body.classList.remove('boot-intro-active')
      onComplete?.()
    }

    run()

    const skip = () => {
      if (cancelled) return
      cancelled = true
      setLeaving(true)
      window.setTimeout(() => {
        document.body.classList.remove('boot-intro-active')
        onComplete?.()
      }, 220)
    }

    const onKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === 'Escape' || event.key === ' ') skip()
    }

    window.addEventListener('keydown', onKeyDown)

    // Brauzer animatsiyani to‘xtatib qo‘ysa ham portfolio yopiq qolib ketmaydi.
    const fallbackTimer = window.setTimeout(() => {
      if (cancelled) return
      cancelled = true
      document.body.classList.remove('boot-intro-active')
      onComplete?.()
    }, 5000)

    return () => {
      cancelled = true
      document.body.classList.remove('boot-intro-active')
      window.clearTimeout(fallbackTimer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onComplete, script])

  return (
    <div className={`boot-terminal ${leaving ? 'boot-terminal--leaving' : ''}`} role="status" aria-live="polite">
      <div className="boot-terminal__noise" aria-hidden="true" />
      <div className="boot-terminal__screen">
        <div className="boot-terminal__header">
          <span className="boot-terminal__dot boot-terminal__dot--red" />
          <span className="boot-terminal__dot boot-terminal__dot--yellow" />
          <span className="boot-terminal__dot boot-terminal__dot--green" />
          <span className="boot-terminal__title">abbos@portfolio:~</span>
        </div>

        <div className="boot-terminal__content">
          <div className="boot-terminal__welcome">SODIQJONOV ABBOS PORTFOLIO TERMINAL</div>
          <div className="boot-terminal__muted">Tizimga xush kelibsiz. Portfolio yuklanmoqda...</div>

          <div className="boot-terminal__lines">
            {lines.map((line, index) => (
              <div className={`boot-terminal__line boot-terminal__line--${line.kind}`} key={`${line.text}-${index}`}>
                {line.kind === 'command' && <span className="boot-terminal__prompt">abbos@dev:~$ </span>}
                {line.kind === 'success' && <span className="boot-terminal__check">✓ </span>}
                {line.kind === 'ready' && <span className="boot-terminal__check">➜ </span>}
                <span>{line.text}</span>
              </div>
            ))}

            {currentText && (
              <div className={`boot-terminal__line boot-terminal__line--${currentKind}`}>
                {currentKind === 'command' && <span className="boot-terminal__prompt">abbos@dev:~$ </span>}
                {currentKind === 'success' && <span className="boot-terminal__check">✓ </span>}
                {currentKind === 'ready' && <span className="boot-terminal__check">➜ </span>}
                <span>{currentText}</span>
                <span className="boot-terminal__cursor" aria-hidden="true">█</span>
              </div>
            )}
          </div>
        </div>

        <button className="boot-terminal__skip" type="button" onClick={() => {
          setLeaving(true)
          window.setTimeout(() => {
            document.body.classList.remove('boot-intro-active')
            onComplete?.()
          }, 220)
        }}>
          O‘tkazib yuborish — Enter
        </button>
      </div>
    </div>
  )
}

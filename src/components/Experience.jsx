import { useInViewOnce } from '../hooks/useInViewOnce.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useContent } from '../context/ContentContext.jsx'
import { localize } from '../utils/localize.js'
import TerminalWindow from './TerminalWindow.jsx'

export default function Experience() {
  const [ref, visible] = useInViewOnce({ threshold: 0.12 })
  const { t, language } = useLanguage()
  const { content } = useContent()
  const items = (content.experience || []).filter((item) => item.active !== false)

  return (
    <section className="section" id="experience" ref={ref}>
      <div className="container">
        <TerminalWindow title="~/portfolio/experience.log" className={`reveal ${visible ? 'visible' : ''}`}>
          <div className="terminal-body">
            <span className="section-label">{t('experience.label')}</span>
            <h2 className="section-title">{t('experience.title')}</h2>
            <p className="section-subtitle">{t('experience.subtitle')}</p>
            <div className="experience-timeline">
              {items.map((item, index) => (
                <article
                  className={`experience-item reveal ${visible ? 'visible' : ''}`}
                  style={{ transitionDelay: `${index * 130}ms` }}
                  key={item.id || `${item.year}-${index}`}
                >
                  <span className="experience-year">{item.year}</span>
                  <div>
                    <h3>{localize(item.title, language)}</h3>
                    <p>{localize(item.text, language)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </TerminalWindow>
      </div>
    </section>
  )
}

import { useInViewOnce } from '../hooks/useInViewOnce.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useContent } from '../context/ContentContext.jsx'
import TerminalWindow from './TerminalWindow.jsx'

export default function Skills() {
  const [ref, visible] = useInViewOnce({ threshold: 0.14 })
  const { t } = useLanguage()
  const { content } = useContent()
  const items = (content.skills || []).filter((item) => item.active !== false)

  return (
    <section className="section" id="skills" ref={ref}>
      <div className="container">
        <TerminalWindow title="~/portfolio/skills.js" className={`reveal ${visible ? 'visible' : ''}`}>
          <div className="terminal-body">
            <div className="section-command">
              <span>$</span> npm run skills <i>{visible ? '✓ loaded' : '...'}</i>
            </div>
            <span className="section-label">{t('skills.label')}</span>
            <h2 className="section-title">{t('skills.title')}</h2>
            <p className="section-subtitle">{t('skills.subtitle')}</p>
            <div className="skills-grid">
              {items.map((skill, categoryIndex) => (
                <article className="skill-card" key={skill.id || skill.title}>
                  <span className="skill-index">{skill.index}</span>
                  <h3>{skill.title}</h3>
                  <ul className="skill-list skill-list--progress">
                    {(skill.items || []).map((item, itemIndex) => (
                      <li key={item.name}>
                        <div className="skill-row">
                          <span>{item.name}</span>
                          <strong>{visible ? item.level : 0}%</strong>
                        </div>
                        <div className="skill-track">
                          <span
                            className="skill-fill"
                            style={{
                              width: visible ? `${item.level}%` : '0%',
                              transitionDelay: `${categoryIndex * 100 + itemIndex * 80}ms`,
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </TerminalWindow>
      </div>
    </section>
  )
}

import { useTypewriter } from '../hooks/useTypewriter.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useContent } from '../context/ContentContext.jsx'
import TerminalWindow from './TerminalWindow.jsx'
import MagneticLink from './MagneticLink.jsx'
import fallbackImage from '../assets/profile-abbos.webp'

const heroCopy = {
  uz: {
    stack: 'ASOSIY STACK',
    delivery: 'Productionga chiqarilgan',
    projects: '30+ loyiha',
    systems: 'CRM · Admin · API',
    codeTitle: 'developer.profile.js',
    focus: 'business automation',
    location: 'Tashkent, UZ',
    response: '< 24 soat',
  },
  ru: {
    stack: 'ОСНОВНОЙ STACK',
    delivery: 'Запущено в production',
    projects: '30+ проектов',
    systems: 'CRM · Admin · API',
    codeTitle: 'developer.profile.js',
    focus: 'business automation',
    location: 'Tashkent, UZ',
    response: '< 24 часов',
  },
  en: {
    stack: 'CORE STACK',
    delivery: 'Shipped to production',
    projects: '30+ projects',
    systems: 'CRM · Admin · API',
    codeTitle: 'developer.profile.js',
    focus: 'business automation',
    location: 'Tashkent, UZ',
    response: '< 24 hours',
  },
}

export default function Hero() {
  const { t, language } = useLanguage()
  const { content } = useContent()
  const { output, done } = useTypewriter('whoami --full-stack', 76, true)
  const profile = content.profile || {}
  const copy = heroCopy[language] || heroCopy.uz
  const fullName = profile.fullName || 'Sodiqjonov Abbos'
  const role = language === 'uz' ? (profile.role || t('hero.role')) : t('hero.role')

  return (
    <section className="hero" id="home">
      <div className="container">
        <TerminalWindow title="~/portfolio/home" className="hero-window">
          <div className="terminal-body hero-content hero-content--pro">
            <div className="hero-main-column">
              <div className="terminal-command hero-command">
                <span className="prompt">$ </span>
                {output}
                <span className="cursor">▊</span>
              </div>

              <div className={`hero-reveal ${done ? 'visible' : ''}`}>
                <div className="hero-kicker">
                  <span className="hero-kicker__pulse" />
                  {profile.available === false ? 'currently_unavailable' : t('hero.available')}
                </div>

                <h1 className="hero-name hero-name--static">
                  <span>{profile.lastName || 'Sodiqjonov'}</span>
                  <span>{profile.firstName || 'Abbos'}</span>
                  <small>{role}</small>
                </h1>

                <p className="hero-description">
                  <span className="comment">//</span>{' '}
                  {language === 'uz'
                    ? (profile.headline || t('hero.description'))
                    : t('hero.description')}
                </p>

                <div className="hero-stack-block">
                  <span className="hero-stack-label">{copy.stack}</span>
                  <div className="hero-stack-list">
                    {['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Git'].map((item) => (
                      <code key={item}>{item}</code>
                    ))}
                  </div>
                </div>

                <div className="hero-actions">
                  <MagneticLink className="terminal-button" href="#projects">
                    {t('hero.projects')}
                  </MagneticLink>
                  <MagneticLink className="terminal-button secondary" href="#contact">
                    {t('hero.contact')}
                  </MagneticLink>
                  <a
                    className="terminal-button secondary"
                    href="/cv/Sodiqjonov_Abbos_CV.pdf"
                    download
                  >
                    {t('hero.cv')}
                  </a>
                </div>

                <div className="hero-delivery-grid" aria-label="Portfolio summary">
                  <article>
                    <strong>30+</strong>
                    <span>{copy.delivery}</span>
                  </article>
                  <article>
                    <strong>100%</strong>
                    <span>Responsive UI</span>
                  </article>
                  <article>
                    <strong>24/7</strong>
                    <span>Deploy monitoring</span>
                  </article>
                </div>
              </div>
            </div>

            <aside className="hero-profile-card hero-profile-card--pro">
              <div className="hero-profile-frame">
                <img
                  src={profile.imageUrl || fallbackImage}
                  alt={fullName}
                  loading="eager"
                />
                <span className="hero-profile-scan" />
                <div className="hero-profile-status">
                  <i />
                  <span>{profile.available === false ? 'not_available' : 'available_for_projects'}</span>
                </div>
              </div>

              <div className="hero-code-console">
                <div className="hero-code-console__head">
                  <span>{copy.codeTitle}</span>
                  <i>● ● ●</i>
                </div>
                <pre aria-label="Developer profile code"><code><span className="code-keyword">const</span> developer = {'{'}
  name: <span className="code-string">'{fullName}'</span>,
  role: <span className="code-string">'{role}'</span>,
  focus: <span className="code-string">'{copy.focus}'</span>,
  location: <span className="code-string">'{copy.location}'</span>,
  response: <span className="code-string">'{copy.response}'</span>,
  available: <span className="code-boolean">true</span>
{'}'}</code></pre>
              </div>

              <div className="hero-profile-meta hero-profile-meta--pro">
                <div>
                  <strong>{copy.projects}</strong>
                  <span>{copy.systems}</span>
                </div>
                <a href="#contact">contact() ↗</a>
              </div>
            </aside>
          </div>
        </TerminalWindow>
      </div>
    </section>
  )
}

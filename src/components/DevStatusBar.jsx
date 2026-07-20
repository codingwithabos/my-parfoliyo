import { useLanguage } from '../context/LanguageContext.jsx'

const copy = {
  uz: {
    status: 'TIZIM ONLINE',
    build: 'PRODUCTION BUILD',
    ready: 'YANGI LOYIHALARGA TAYYOR',
  },
  ru: {
    status: 'СИСТЕМА ONLINE',
    build: 'PRODUCTION BUILD',
    ready: 'ГОТОВ К НОВЫМ ПРОЕКТАМ',
  },
  en: {
    status: 'SYSTEM ONLINE',
    build: 'PRODUCTION BUILD',
    ready: 'READY FOR NEW PROJECTS',
  },
}

export default function DevStatusBar() {
  const { language } = useLanguage()
  const text = copy[language] || copy.uz

  return (
    <div className="dev-status-shell" aria-label="Developer status">
      <div className="container dev-status-bar">
        <span className="dev-status-item dev-status-item--online">
          <i aria-hidden="true" />
          {text.status}
        </span>
        <span className="dev-status-separator" aria-hidden="true">/</span>
        <span className="dev-status-item">React 18</span>
        <span className="dev-status-item">Node.js</span>
        <span className="dev-status-item">PostgreSQL</span>
        <span className="dev-status-item">REST API</span>
        <span className="dev-status-item dev-status-item--build">{text.build}</span>
        <span className="dev-status-item dev-status-item--ready">{text.ready}</span>
      </div>
    </div>
  )
}

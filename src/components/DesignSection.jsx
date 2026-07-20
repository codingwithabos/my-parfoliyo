import { useTheme } from '../context/ThemeContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

const labels = {
  uz: {
    sectionLabel: 'UI / THEME',
    title: 'Dizaynni tanlang',
    subtitle: 'Variantni bosing — sayt shu zahoti o‘zgaradi.',
    selected: 'Tanlangan',
    try: 'Bosib ko‘ring',
    items: { classic: 'Klassik', dashboard: 'Dashboard', glass: 'Glass', light: 'Yorug‘', terminal: 'Terminal' },
  },
  ru: {
    sectionLabel: 'UI / ТЕМА',
    title: 'Выберите дизайн',
    subtitle: 'Нажмите вариант — сайт изменится сразу.',
    selected: 'Выбрано',
    try: 'Нажмите',
    items: { classic: 'Классика', dashboard: 'Dashboard', glass: 'Glass', light: 'Светлый', terminal: 'Терминал' },
  },
  en: {
    sectionLabel: 'UI / THEME',
    title: 'Choose a design',
    subtitle: 'Click a variant and the website changes instantly.',
    selected: 'Selected',
    try: 'Click to preview',
    items: { classic: 'Classic', dashboard: 'Dashboard', glass: 'Glass', light: 'Light', terminal: 'Terminal' },
  },
}

const previewImages = {
  classic: '/assets/themes/classic.svg',
  dashboard: '/assets/themes/dashboard.svg',
  glass: '/assets/themes/glass.svg',
  light: '/assets/themes/light.svg',
  terminal: '/assets/themes/terminal.svg',
}

export default function DesignSection() {
  const { design, setDesign } = useTheme()
  const { language } = useLanguage()
  const copy = labels[language] || labels.uz

  return (
    <section className="section design-section" id="design">
      <div className="container">
        <div className="design-showcase">
          <div className="design-showcase-copy">
            <span className="section-label">{copy.sectionLabel}</span>
            <h2>{copy.title}</h2>
            <p>{copy.subtitle}</p>
          </div>

          <div className="design-showcase-grid" role="list" aria-label={copy.title}>
            {Object.entries(copy.items).map(([value, label]) => {
              const isActive = design === value
              return (
                <button
                  key={value}
                  type="button"
                  className={`public-design-card ${isActive ? 'active' : ''}`}
                  onClick={() => setDesign(value)}
                  aria-pressed={isActive}
                  aria-label={`${label} — ${isActive ? copy.selected : copy.try}`}
                  role="listitem"
                >
                  <span className="public-design-preview-image-wrap">
                    <img
                      src={previewImages[value]}
                      alt=""
                      className="public-design-preview-image"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="public-design-preview-shine" aria-hidden="true" />
                    {isActive && <span className="public-design-selected-badge" aria-hidden="true">✓</span>}
                  </span>
                  <span className="public-design-card-copy">
                    <strong>{label}</strong>
                    <small className={isActive ? 'is-selected' : ''}>
                      {isActive ? `✓ ${copy.selected}` : copy.try}
                    </small>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

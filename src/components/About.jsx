import { useEffect, useMemo, useState } from 'react'
import { stats } from '../data/portfolioData.js'
import { useInViewOnce } from '../hooks/useInViewOnce.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useContent } from '../context/ContentContext.jsx'
import TerminalWindow from './TerminalWindow.jsx'
import fallbackImage from '../assets/profile-abbos.webp'

function Counter({ target, suffix, active }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    let frame
    const tick = (now) => {
      const progress = Math.min((now - start) / 1300, 1)
      setValue(Math.round(target * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target])
  return <span className="stat-number">{value}{suffix}</span>
}

const copy = {
  uz: {
    eyebrow: 'MEN HAQIMDA',
    title: 'G‘oyani ishlaydigan raqamli mahsulotga aylantiraman',
    intro: 'Frontend, backend va avtomatizatsiyani birlashtirib, tez, tushunarli va boshqarish oson bo‘lgan tizimlar yarataman.',
    points: [
      ['To‘liq yechim', 'React yoki Vue interfeysi, Node.js API va ma’lumotlar bazasi bir tizimda.'],
      ['Biznesga mos', 'CRM, admin panel, avtomatik bildirishnomalar va hisobotlar real ish jarayoniga moslanadi.'],
      ['Ishonchli natija', 'Responsive dizayn, validatsiya, xavfsizlik va deploy bosqichigacha yakuniy yechim.'],
    ],
    stack: 'Asosiy texnologiyalar',
    available: 'Yangi loyihalar uchun ochiq',
    stats: ['Yakunlangan loyihalar', 'Yillik tajriba', 'API integratsiyalari', 'Mobilga mos dizayn'],
  },
  ru: {
    eyebrow: 'ОБО МНЕ',
    title: 'Превращаю идею в работающий цифровой продукт',
    intro: 'Объединяю frontend, backend и автоматизацию, создавая быстрые, понятные и удобные системы.',
    points: [
      ['Полное решение', 'Интерфейс React или Vue, Node.js API и база данных в одной системе.'],
      ['Для бизнеса', 'CRM, админ-панели, автоматические уведомления и отчёты под реальные процессы.'],
      ['Надёжный результат', 'Адаптивность, валидация, безопасность и готовый deploy.'],
    ],
    stack: 'Основные технологии',
    available: 'Открыт для новых проектов',
    stats: ['Завершённых проектов', 'Лет опыта', 'API-интеграций', 'Адаптивный дизайн'],
  },
  en: {
    eyebrow: 'ABOUT ME',
    title: 'I turn ideas into working digital products',
    intro: 'I combine frontend, backend and automation to build fast, clear and easy-to-manage systems.',
    points: [
      ['Complete solution', 'React or Vue interface, Node.js API and database in one system.'],
      ['Business focused', 'CRM, admin panels, automated notifications and reports shaped around real workflows.'],
      ['Reliable delivery', 'Responsive design, validation, security and deployment-ready output.'],
    ],
    stack: 'Core technologies',
    available: 'Available for new projects',
    stats: ['Completed projects', 'Years of experience', 'API integrations', 'Responsive design'],
  },
}

export default function About() {
  const [ref, visible] = useInViewOnce({ threshold: 0.15 })
  const { language } = useLanguage()
  const { content } = useContent()
  const profile = content.profile || {}
  const text = copy[language] || copy.uz
  const name = profile.fullName || 'Sodiqjonov Abbos'
  const role = language === 'uz' ? (profile.role || 'Full-Stack dasturchi') : 'Full-Stack Developer'
  const intro = language === 'uz' && profile.aboutBody1 ? `${profile.aboutBody1} ${profile.aboutBody2 || ''}`.trim() : text.intro
  const statItems = useMemo(() => stats.map((item, index) => ({ ...item, label: text.stats[index] })), [text])

  return (
    <section className="section" id="about" ref={ref}>
      <div className="container">
        <TerminalWindow title="~/portfolio/about.md" className={`reveal from-left ${visible ? 'visible' : ''}`}>
          <div className="terminal-body about-v2">
            <div className="about-v2__header">
              <div>
                <span className="section-label">{text.eyebrow}</span>
                <h2 className="section-title">{language === 'uz' ? (profile.aboutTitle || text.title) : text.title}</h2>
              </div>
              <span className="about-v2__available"><i />{text.available}</span>
            </div>

            <div className="about-v2__grid">
              <aside className="about-v2__profile">
                <div className="about-v2__photo"><img src={profile.imageUrl || fallbackImage} alt={name} loading="lazy" /></div>
                <strong>{name}</strong>
                <span>{role}</span>
                <div className="about-v2__location">Tashkent, Uzbekistan · UTC+5</div>
              </aside>

              <div className="about-v2__content">
                <p className="about-v2__lead">{intro}</p>
                <div className="about-v2__points">
                  {text.points.map(([title, body], index) => (
                    <article key={title}>
                      <span>0{index + 1}</span>
                      <div><h3>{title}</h3><p>{body}</p></div>
                    </article>
                  ))}
                </div>
                <div className="about-v2__stack">
                  <small>{text.stack}</small>
                  <div>{['React', 'Vue.js', 'Node.js', 'Express', 'PostgreSQL', 'Git / GitHub'].map((item) => <code key={item}>{item}</code>)}</div>
                </div>
              </div>
            </div>

            <div className="stats-grid stats-grid--wide about-v2__stats">
              {statItems.map((item) => (
                <article className="stat-card stat-card--about" key={item.label}>
                  <span className="stat-card__icon" aria-hidden="true">{item.icon}</span>
                  <Counter target={item.value} suffix={item.suffix} active={visible}/>
                  <span className="stat-label">{item.label}</span>
                </article>
              ))}
            </div>
          </div>
        </TerminalWindow>
      </div>
    </section>
  )
}

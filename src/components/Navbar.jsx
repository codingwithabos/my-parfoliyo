import { useEffect, useState } from 'react'
import { contactInfo, navItems } from '../data/portfolioData.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import profilePhoto from '../assets/profile-abbos.webp'
import ControlPanel from './ControlPanel.jsx'

const NAVBAR_OFFSET = 92

const drawerCopy = {
  uz: {
    primary: 'Asosiy menyu',
    portfolio: 'Portfolio',
    settings: 'Ko‘rinish sozlamalari',
    role: 'React & Backend dasturchi',
    close: 'Menyuni yopish',
    management: 'Boshqaruv',
    admin: 'Admin panel',
    adminHint: 'Xabarlar va kontent',
  },
  ru: {
    primary: 'Главное меню',
    portfolio: 'Портфолио',
    settings: 'Настройки вида',
    role: 'React & Backend разработчик',
    close: 'Закрыть меню',
    management: 'Управление',
    admin: 'Админ-панель',
    adminHint: 'Сообщения и контент',
  },
  en: {
    primary: 'Main menu',
    portfolio: 'Portfolio',
    settings: 'Appearance settings',
    role: 'React & Backend developer',
    close: 'Close menu',
    management: 'Management',
    admin: 'Admin panel',
    adminHint: 'Messages and content',
  },
}

function MenuIcon({ name }) {
  const paths = {
    home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></>,
    design: <><path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/><path d="M12 20h8"/></>,
    about: <><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
    skills: <><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20V7"/></>,
    services: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/><path d="M10 12v2h4v-2"/></>,
    experience: <><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/></>,
    projects: <><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v8A3.5 3.5 0 0 1 17.5 20h-11A3.5 3.5 0 0 1 3 16.5v-10Z"/><path d="m10 11-2 2 2 2"/><path d="m14 11 2 2-2 2"/></>,
    contact: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 9h8"/><path d="M8 13h5"/></>,
    admin: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/></>,
  }

  return (
    <svg className="drawer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.home}
    </svg>
  )
}


function CloseIcon() {
  return (
    <svg className="drawer-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
    </svg>
  )
}

function MenuToggleIcon({ open }) {
  return (
    <svg
      className={`menu-toggle-svg ${open ? 'is-open' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <g className="menu-toggle-hamburger">
        <path d="M4 6.5h16" />
        <path d="M4 12h16" />
        <path d="M4 17.5h16" />
      </g>
      <g className="menu-toggle-x">
        <path d="M5 5l14 14" />
        <path d="M19 5L5 19" />
      </g>
    </svg>
  )
}

function scrollToPortfolioSection(targetId) {
  const cleanId = String(targetId || '').replace(/^#/, '')
  const element = document.getElementById(cleanId)

  if (!element) return false

  const top = element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET

  try {
    window.scrollTo({
      top: Math.max(0, top),
      left: 0,
      behavior: 'smooth',
    })
  } catch {
    document.documentElement.scrollTop = Math.max(0, top)
    document.body.scrollTop = Math.max(0, top)
  }

  try {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${window.location.search}#${cleanId}`,
    )
  } catch {
    // file:// rejimida history ishlamasa ham scroll ishlaydi.
  }

  return true
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('#home')
  const { t, language } = useLanguage()
  const copy = drawerCopy[language] || drawerCopy.uz
  const primaryItems = navItems.slice(0, 5)
  const portfolioItems = navItems.slice(5)

  useEffect(() => {
    const handleWindowChange = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)

      setScrolled(window.scrollY > 12)
      setProgress(Math.min((window.scrollY / max) * 100, 100))

      if (window.innerWidth > 1000) setMenuOpen(false)
    }

    handleWindowChange()
    window.addEventListener('scroll', handleWindowChange, { passive: true })
    window.addEventListener('resize', handleWindowChange)

    return () => {
      window.removeEventListener('scroll', handleWindowChange)
      window.removeEventListener('resize', handleWindowChange)
    }
  }, [])

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.replace(/^#/, '')))
      .filter(Boolean)

    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0]

        if (visibleEntry) setActive(`#${visibleEntry.target.id}`)
      },
      {
        threshold: [0.12, 0.3, 0.55],
        rootMargin: `-${NAVBAR_OFFSET}px 0px -48% 0px`,
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const timer = window.setTimeout(() => scrollToPortfolioSection(hash), 100)
    return () => window.clearTimeout(timer)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const openAdmin = () => {
    closeMenu()
    window.location.assign('/admin')
  }

  const openSection = (target) => {
    closeMenu()
    const found = scrollToPortfolioSection(target)

    if (!found && window.location.protocol !== 'file:') {
      window.location.assign(`/${target}`)
    }
  }

  const renderItem = (item) => (
    <button
      key={item.href}
      className={`nav-link nav-section-button ${active === item.href ? 'active' : ''}`}
      type="button"
      data-scroll-target={item.href.replace(/^#/, '')}
      onClick={() => openSection(item.href)}
    >
      <span className="drawer-nav-icon-wrap"><MenuIcon name={item.key} /></span>
      <span className="drawer-nav-label">{t(`nav.${item.key}`)}</span>
      <span className="drawer-nav-chevron" aria-hidden="true">›</span>
    </button>
  )

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <button
          className="logo logo-button"
          type="button"
          onClick={() => openSection('#home')}
          aria-label="Bosh sahifaga qaytish"
        >
          <span className="logo-mark">&lt;/&gt;</span>
          <span className="logo-text">abbos<span>.dev</span></span>
        </button>

        {menuOpen && (
          <button
            className="mobile-menu-backdrop open"
            type="button"
            aria-label={copy.close}
            onClick={closeMenu}
          />
        )}

        <nav
          id="main-navigation"
          className={`nav-links ${menuOpen ? 'open' : ''}`}
          aria-label="Asosiy navigatsiya"
        >
          <div className="drawer-profile">
            <span className="drawer-profile__photo"><img src={profilePhoto} alt="Sodiqjonov Abbos" /></span>
            <span className="drawer-profile__copy">
              <strong>Sodiqjonov Abbos</strong>
              <small>{contactInfo.telegram || copy.role}</small>
            </span>
            <button className="drawer-close" type="button" aria-label={copy.close} title={copy.close} onClick={closeMenu}><CloseIcon /></button>
          </div>

          <div className="drawer-section-title">{copy.primary}</div>
          <div className="drawer-nav-group">{primaryItems.map(renderItem)}</div>

          <div className="drawer-section-title drawer-section-title--spaced">{copy.portfolio}</div>
          <div className="drawer-nav-group">{portfolioItems.map(renderItem)}</div>

          <div className="drawer-settings">
            <span className="drawer-settings__label">{copy.settings}</span>
            <ControlPanel />
          </div>

          <div className="drawer-section-title drawer-section-title--spaced">{copy.management}</div>
          <button className="drawer-admin-link" type="button" onClick={openAdmin}>
            <span className="drawer-nav-icon-wrap"><MenuIcon name="admin" /></span>
            <span className="drawer-admin-link__copy"><strong>{copy.admin}</strong><small>{copy.adminHint}</small></span>
            <span className="drawer-nav-chevron" aria-hidden="true">›</span>
          </button>

          <div className="drawer-brand">
            <span className="drawer-brand__mark">&lt;/&gt;</span>
            <span><strong>ABBOS.DEV</strong><small>portfolio control center</small></span>
          </div>
        </nav>

        <a className="nav-admin-shortcut" href="/admin" aria-label={copy.admin} title={copy.admin}>
          <MenuIcon name="admin" />
          <span>{copy.admin}</span>
        </a>

        <button
          className={`menu-button ${menuOpen ? 'open' : ''}`}
          type="button"
          aria-label={menuOpen ? copy.close : 'Menyuni ochish'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <MenuToggleIcon open={menuOpen} />
        </button>
      </div>

      <span className="navbar-progress" style={{ transform: `scaleX(${progress / 100})` }} />
    </header>
  )
}

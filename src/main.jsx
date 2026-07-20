import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ContentProvider } from './context/ContentContext.jsx'
import './styles.css'

document.addEventListener(
  'click',
  (event) => {
    const button = event.target.closest('[data-scroll-target]')
    if (!button) return

    const section = document.getElementById(button.dataset.scrollTarget)
    if (!section) return

    event.preventDefault()
    const navbarHeight = document.querySelector('.navbar')?.getBoundingClientRect().height || 76
    const top = section.getBoundingClientRect().top + window.scrollY - navbarHeight - 16
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  },
  true,
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <ContentProvider>
          <App />
        </ContentProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)

import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import DesignSection from './components/DesignSection.jsx'
import Skills from './components/Skills.jsx'
import Services from './components/Services.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ScrollTop from './components/ScrollTop.jsx'
import ProjectDetailPage from './pages/ProjectDetailPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { usePath } from './utils/router.jsx'
import AnalyticsTracker from './components/AnalyticsTracker.jsx'
import BootTerminalIntro from './components/BootTerminalIntro.jsx'

function Home() {
  const [introComplete, setIntroComplete] = useState(false)
  const completeIntro = useCallback(() => setIntroComplete(true), [])

  return (
    <>
      {!introComplete && <BootTerminalIntro onComplete={completeIntro} />}
      <div className="portfolio-stage portfolio-stage--visible">
        <AnalyticsTracker />
        <Navbar />
        <div className="site-shell site-shell--ready">
          <main>
            <Hero />
            <DesignSection />
            <About />
            <Skills />
            <Services />
            <Experience />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </div>
        <ScrollTop />
      </div>
    </>
  )
}

function PublicPage({ children }) {
  return (
    <>
      <Navbar />
      <div className="site-shell site-shell--ready">
        {children}
        <Footer />
      </div>
      <ScrollTop />
    </>
  )
}

export default function App() {
  const path = usePath()
  const normalizedPath = path.length > 1 ? path.replace(/\/+$/, '') : path

  useEffect(() => {
    document.title = normalizedPath === '/admin'
      ? 'Admin | Sodiqjonov Abbos'
      : path.startsWith('/project/')
        ? 'Loyiha | Sodiqjonov Abbos'
        : 'Sodiqjonov Abbos | React va Backend Dasturchi'
  }, [normalizedPath])

  if (normalizedPath === '/admin') return <AdminPage />
  if (normalizedPath.startsWith('/project/')) {
    return (
      <PublicPage>
        <ProjectDetailPage slug={normalizedPath.split('/')[2]} />
      </PublicPage>
    )
  }
  if (normalizedPath.startsWith('/demo/')) {
    return (
      <PublicPage>
        <ProjectDetailPage slug={normalizedPath.split('/')[2]} demo />
      </PublicPage>
    )
  }

  return <Home />
}

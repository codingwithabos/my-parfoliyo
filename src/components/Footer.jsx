import { useContent } from '../context/ContentContext.jsx'
import { InternalLink } from '../utils/router.jsx'

export default function Footer() {
  const { content } = useContent()
  const profile = content.profile || {}

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} {profile.fullName || 'Sodiqjonov Abbos'}.</span>
        <div className="footer-actions">
          <InternalLink className="footer-admin-link" href="/admin">🔒 Admin panel</InternalLink>
          <a
            className="footer-telegram"
            href={profile.telegramUrl || 'https://t.me/sodiqjonv_abbos'}
            target="_blank"
            rel="noreferrer"
          >
            Telegram: <code>{profile.telegram || '@sodiqjonv_abbos'}</code> ↗
          </a>
        </div>
      </div>
    </footer>
  )
}

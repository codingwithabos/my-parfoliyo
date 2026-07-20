import { useEffect, useState } from 'react'
import { useInViewOnce } from '../hooks/useInViewOnce.js'
import { useTypewriter } from '../hooks/useTypewriter.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import TerminalWindow from './TerminalWindow.jsx'
import { useContent } from '../context/ContentContext.jsx'
import { apiUrl, hasRemoteApi } from '../utils/apiBase.js'

const initial = {
  name: '',
  phone: '+998 ',
  telegram: '@',
  email: '',
  subject: '',
  message: '',
  company: '',
}

const digits = (value) => value.replace(/\D/g, '')

function phoneFormat(value) {
  let phoneDigits = digits(value)

  if (phoneDigits.startsWith('998')) {
    phoneDigits = phoneDigits.slice(3)
  }

  phoneDigits = phoneDigits.slice(0, 9)

  const parts = [
    phoneDigits.slice(0, 2),
    phoneDigits.slice(2, 5),
    phoneDigits.slice(5, 7),
    phoneDigits.slice(7, 9),
  ].filter(Boolean)

  return `+998${parts.length ? ` ${parts.join(' ')}` : ' '}`
}

function telegramFormat(value) {
  const username = String(value)
    .replace(/\s/g, '')
    .replace(/[^a-zA-Z0-9_@]/g, '')
    .replace(/^@+/, '')

  return `@${username.slice(0, 32)}`
}

function validate(form, t) {
  const errors = {}

  if (form.name.trim().length < 2) {
    errors.name = t('contact.errors.name')
  }

  if (digits(form.phone).length !== 12) {
    errors.phone = t('contact.errors.phone')
  }

  if (form.telegram !== '@' && !/^@[a-zA-Z0-9_]{5,32}$/.test(form.telegram)) {
    errors.telegram = t('contact.errors.telegram')
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('contact.errors.email')
  }

  if (form.message.trim().length < 5) {
    errors.message = t('contact.errors.message')
  }

  return errors
}

function withTimeout(timeout = 25000) {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeout)

  return {
    signal: controller.signal,
    clear: () => window.clearTimeout(timer),
  }
}

function isNetlifyHost() {
  const host = window.location.hostname.toLowerCase()
  return host === 'netlify.app' || host.endsWith('.netlify.app')
}

function backendUnavailable(error) {
  return error?.code === 'BACKEND_UNAVAILABLE'
}

async function submitToBackend(values, t) {
  const request = withTimeout()

  try {
    const response = await fetch(apiUrl('/api/contact'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      signal: request.signal,
    })

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const error = new Error(t('contact.error'))
      error.code = 'BACKEND_UNAVAILABLE'
      throw error
    }

    const data = await response.json()
    if (!response.ok) {
      const error = new Error(data?.message || t('contact.error'))
      if (response.status === 404 || response.status === 405 || response.status >= 500) {
        error.code = 'BACKEND_UNAVAILABLE'
      }
      throw error
    }

    return true
  } finally {
    request.clear()
  }
}

async function submitToNetlify(values, t, language) {
  const request = withTimeout()
  const payload = new URLSearchParams({
    'form-name': 'portfolio-contact',
    ...values,
    submittedAt: new Date().toISOString(),
    language,
    page: window.location.href,
  })

  try {
    const response = await fetch('/forms.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/html,application/xhtml+xml',
      },
      body: payload.toString(),
      credentials: 'same-origin',
      redirect: 'follow',
      signal: request.signal,
    })

    if (!response.ok) {
      if (response.status === 404 || response.status === 405) {
        throw new Error(t('contact.netlifyNotReady'))
      }

      if (response.status === 429) {
        throw new Error(t('contact.tooMany'))
      }

      throw new Error(`${t('contact.error')} (${response.status})`)
    }

    return true
  } finally {
    request.clear()
  }
}

export default function Contact() {
  const { content } = useContent()
  const contactInfo = content.profile || {}
  const [ref, visible] = useInViewOnce({ threshold: 0.15 })
  const { output } = useTypewriter('contact --secure-channel', 68, visible)
  const { t, language } = useLanguage()

  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!status || status.type === 'success') return undefined

    const timer = window.setTimeout(() => setStatus(null), 7000)
    return () => window.clearTimeout(timer)
  }, [status])

  const change = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: name === 'phone'
        ? phoneFormat(value)
        : name === 'telegram'
          ? telegramFormat(value)
          : value,
    }))

    setErrors((current) => ({ ...current, [name]: '' }))
    setStatus(null)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (loading) return

    const formErrors = validate(form, t)
    setErrors(formErrors)

    if (Object.keys(formErrors).length) {
      setStatus({ type: 'error', text: t('contact.errors.form') })
      return
    }

    setLoading(true)
    setStatus(null)

    const values = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      telegram: form.telegram === '@' ? '' : form.telegram.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      company: form.company.trim(),
    }

    try {
      if (isNetlifyHost() && !hasRemoteApi()) {
        await submitToNetlify(values, t, language)
      } else {
        try {
          // Railway, localhost va custom domenlarda xabar to‘g‘ridan-to‘g‘ri admin backendiga saqlanadi.
          await submitToBackend(values, t)
        } catch (error) {
          // Custom domen Netlify’da bo‘lsa backend topilmaganda Netlify Forms zaxira yo‘li ishlaydi.
          if (!backendUnavailable(error)) throw error
          await submitToNetlify(values, t, language)
        }
      }

      setStatus({ type: 'success', text: t('contact.success') })
      setForm(initial)
      setErrors({})
    } catch (error) {
      const message = error?.name === 'AbortError'
        ? t('contact.timeout')
        : error?.message || t('contact.error')

      setStatus({ type: 'error', text: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section" id="contact" ref={ref}>
      <div className="container">
        <TerminalWindow
          title="~/portfolio/contact.sh"
          className={`contact-window reveal ${visible ? 'visible' : ''}`}
        >
          <div className="terminal-body">
            <div className="contact-body contact-body--form contact-body--pro">
              <div className="contact-copy">
                <div className="contact-command">
                  <span className="prompt">$ </span>
                  {output}
                  <span className="cursor">▊</span>
                </div>

                <span className="section-label">{t('contact.label')}</span>
                <h2>{t('contact.title')}</h2>
                <p>{t('contact.subtitle')}</p>

                <div className="contact-secure-card">
                  <span className="contact-secure-card__icon" aria-hidden="true">✓</span>
                  <div>
                    <strong>{t('contact.secureTitle')}</strong>
                    <small>{t('contact.secureText')}</small>
                  </div>
                  <code>HTTPS</code>
                </div>

                <a
                  className="telegram-direct"
                  href={contactInfo.telegramUrl || 'https://t.me/sodiqjonv_abbos'}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="telegram-direct__icon">➤</span>
                  <span>
                    <small>Telegram</small>
                    <strong>{contactInfo.telegram || '@sodiqjonv_abbos'}</strong>
                  </span>
                  <i>↗</i>
                </a>

                <div className="contact-quick-actions">
                  {contactInfo.phone && (
                    <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>
                      <span>☎</span>{t('contact.call')}
                    </a>
                  )}
                  {contactInfo.email && (
                    <a href={`mailto:${contactInfo.email}`}>
                      <span>✉</span>{t('contact.writeEmail')}
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => document.querySelector('#contact input[name="name"]')?.focus()}
                  >
                    <span>↳</span>{t('contact.sendRequest')}
                  </button>
                </div>

                <div className="contact-information-list">
                  {contactInfo.telegramUrl && (
                    <a href={contactInfo.telegramUrl} target="_blank" rel="noreferrer">
                      <span>Telegram</span><strong>{contactInfo.telegram}</strong>
                    </a>
                  )}
                  {contactInfo.phone && (
                    <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>
                      <span>{t('contact.phone')}</span><strong>{contactInfo.phone}</strong>
                    </a>
                  )}
                  {contactInfo.email && (
                    <a href={`mailto:${contactInfo.email}`}>
                      <span>{t('contact.email')}</span><strong>{contactInfo.email}</strong>
                    </a>
                  )}
                  {contactInfo.workHours && (
                    <div><span>{t('contact.workHours')}</span><strong>{contactInfo.workHours}</strong></div>
                  )}
                  {contactInfo.responseTime && (
                    <div>
                      <span>{t('contact.responseTime')}</span>
                      <strong>{language === 'uz' ? contactInfo.responseTime : t('contact.responseValue')}</strong>
                    </div>
                  )}
                </div>
              </div>

              <form
                className="portfolio-contact-form portfolio-contact-form--pro"
                name="portfolio-contact"
                method="POST"
                action="/forms.html"
                data-netlify="true"
                netlify-honeypot="company"
                onSubmit={submit}
                noValidate
              >
                <input type="hidden" name="form-name" value="portfolio-contact" />
                <input type="hidden" name="source" value="portfolio-website" />

                <div className="contact-form-head">
                  <div>
                    <span>REQUEST_PAYLOAD</span>
                    <strong>{t('contact.formTitle')}</strong>
                  </div>
                  <code>POST /contact</code>
                </div>

                <div className="form-grid">
                  <label className="form-field">
                    <span>{t('contact.name')} *</span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={change}
                      maxLength="80"
                      autoComplete="name"
                      placeholder={t('contact.name')}
                      aria-invalid={Boolean(errors.name)}
                      required
                    />
                    {errors.name && <small>{errors.name}</small>}
                  </label>

                  <label className="form-field">
                    <span>{t('contact.phone')} *</span>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={change}
                      maxLength="17"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.phone)}
                      required
                    />
                    {errors.phone && <small>{errors.phone}</small>}
                  </label>

                  <label className="form-field">
                    <span>{t('contact.telegram')}</span>
                    <input
                      name="telegram"
                      value={form.telegram}
                      onChange={change}
                      maxLength="33"
                      autoCapitalize="none"
                      spellCheck="false"
                      aria-invalid={Boolean(errors.telegram)}
                    />
                    {errors.telegram && <small>{errors.telegram}</small>}
                  </label>

                  <label className="form-field">
                    <span>{t('contact.email')}</span>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={change}
                      maxLength="120"
                      autoComplete="email"
                      placeholder="name@example.com"
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && <small>{errors.email}</small>}
                  </label>

                  <label className="form-field form-field--full">
                    <span>{t('contact.subject')}</span>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={change}
                      maxLength="160"
                      placeholder={t('contact.subjectPlaceholder')}
                    />
                  </label>

                  <label className="form-field form-field--full">
                    <span>{t('contact.message')} *</span>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={change}
                      rows="6"
                      maxLength="1200"
                      placeholder={t('contact.messagePlaceholder')}
                      aria-invalid={Boolean(errors.message)}
                      required
                    />
                    <div className="form-field__meta">
                      {errors.message ? <small>{errors.message}</small> : <span />}
                      <em>{form.message.length}/1200</em>
                    </div>
                  </label>

                  <div className="form-honeypot" aria-hidden="true">
                    <label>
                      Company
                      <input
                        name="company"
                        value={form.company}
                        onChange={change}
                        tabIndex="-1"
                        autoComplete="off"
                      />
                    </label>
                  </div>
                </div>

                {status && (
                  <div
                    className={`form-status form-status--${status.type} form-status--detailed`}
                    role="status"
                    aria-live="polite"
                  >
                    <span className="form-status__icon">{status.type === 'success' ? '✓' : '!'}</span>
                    <div>
                      <strong>
                        {status.type === 'success'
                          ? t('contact.successTitle')
                          : t('contact.errorTitle')}
                      </strong>
                      <p>{status.text}</p>
                    </div>
                  </div>
                )}

                <button className="form-submit form-submit--pro" type="submit" disabled={loading}>
                  <span>{loading ? t('contact.sending') : `$ ${t('contact.send')}`}</span>
                  <i>{loading ? '···' : '↗'}</i>
                </button>

                <div className="contact-form-foot">
                  <span><i /> {t('contact.adminOnly')}</span>
                  <code>status: {loading ? 'sending' : 'ready'}</code>
                </div>
              </form>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { InternalLink } from '../utils/router.jsx'
import { slugify } from '../utils/slugify.js'
import { apiBase, apiConnectionMessage, apiUrl } from '../utils/apiBase.js'

const designOptions = [
  ['classic', 'Klassik'], ['dashboard', 'Dashboard'], ['glass', 'Glass'], ['light', 'Yorug‘'], ['terminal', 'Terminal'],
]
const themeOptions = [
  ['green', 'Yashil'], ['blue', 'Ko‘k'], ['purple', 'Binafsha'], ['red', 'Qizil'], ['cyan', 'Moviy'], ['gold', 'Oltin'],
]

async function api(path, options = {}) {
  const token = sessionStorage.getItem('admin-token')
  let response
  try {
    response = await fetch(apiUrl(path), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    })
  } catch {
    throw new Error(apiConnectionMessage())
  }
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json().catch(() => ({})) : {}
  if (response.status === 401) sessionStorage.removeItem('admin-token')
  if (!response.ok) throw new Error(data.message || (response.status === 404 ? apiConnectionMessage() : 'API xatosi'))
  return data
}

const tabs = [
  ['dashboard', 'Dashboard'],
  ['messages', 'Xabarlar'],
  ['projects', 'Loyihalar'],
  ['services', 'Xizmatlar'],
  ['skills', 'Ko‘nikmalar'],
  ['experience', 'Tajriba'],
  ['profile', 'Profil'],
  ['design', 'Dizayn'],
  ['security', 'Xavfsizlik'],
]

const empty = {
  projects: {
    name: '', slug: '', type: '', description: '', stack: '', features: '',
    image: '/assets/projects/educrm.svg', github: '', live: '',
    date: String(new Date().getFullYear()), challenge: '', solution: '',
    role: '', result: '', active: true,
  },
  services: { title: '', text: '', command: '', active: true },
  skills: {
    index: '01 / category', title: '', itemsText: 'JavaScript|90\nReact|85', active: true,
  },
  experience: {
    year: String(new Date().getFullYear()), title: '', text: '', active: true,
  },
}

function Field({ label, name, value, onChange, type = 'text', area = false, placeholder = '' }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {area ? (
        <textarea name={name} value={value ?? ''} onChange={onChange} rows="4" placeholder={placeholder} />
      ) : (
        <input name={name} type={type} value={value ?? ''} onChange={onChange} placeholder={placeholder} />
      )}
    </label>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} />
      <span />
      <b>{label}</b>
    </label>
  )
}

function Stat({ label, value, hint }) {
  return (
    <article className="admin-stat-card">
      <span>{label}</span>
      <strong>{value || 0}</strong>
      {hint && <small>{hint}</small>}
    </article>
  )
}

function Modal({ editor, setEditor, onSave, saving }) {
  if (!editor) return null

  const item = editor.item
  const collection = editor.collection
  const set = (name, value) => setEditor((current) => ({
    ...current,
    item: { ...current.item, [name]: value },
  }))
  const change = (event) => set(event.target.name, event.target.value)

  return (
    <div className="admin-modal-backdrop" onMouseDown={() => setEditor(null)}>
      <section className="admin-modal" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <small>content_editor</small>
            <h2>{editor.mode === 'create' ? 'Yangi qo‘shish' : 'Tahrirlash'}</h2>
          </div>
          <button type="button" onClick={() => setEditor(null)}>×</button>
        </header>

        <div className="admin-modal-body">
          <div className="admin-form-grid">
            {collection === 'projects' && (
              <>
                <Field label="Loyiha nomi" name="name" value={item.name} onChange={change} />
                <Field label="Slug" name="slug" value={item.slug} onChange={change} />
                <Field label="Loyiha turi" name="type" value={item.type} onChange={change} />
                <Field label="Sana" name="date" value={item.date} onChange={change} />
                <Field label="Rasm URL" name="image" value={item.image} onChange={change} />
                <Field label="GitHub link (ixtiyoriy)" name="github" value={item.github} onChange={change} />
                <Field label="Demo link (ixtiyoriy)" name="live" value={item.live} onChange={change} />
                <Field label="Texnologiyalar (vergul bilan)" name="stack" value={item.stack} onChange={change} />
                <Field label="Funksiyalar (vergul bilan)" name="features" value={item.features} onChange={change} />
                <Field label="Qisqacha ma’lumot" name="description" value={item.description} onChange={change} area />
                <Field label="Muammo" name="challenge" value={item.challenge} onChange={change} area />
                <Field label="Yechim" name="solution" value={item.solution} onChange={change} area />
                <Field label="Mening vazifam" name="role" value={item.role} onChange={change} area />
                <Field label="Natija" name="result" value={item.result} onChange={change} area />
                <Toggle checked={item.active} onChange={(value) => set('active', value)} label="Portfolio’da ko‘rsatish" />
              </>
            )}

            {collection === 'services' && (
              <>
                <Field label="Xizmat nomi" name="title" value={item.title} onChange={change} />
                <Field label="Qisqa kod yozuvi" name="command" value={item.command} onChange={change} />
                <Field label="Tavsif" name="text" value={item.text} onChange={change} area />
                <Toggle checked={item.active} onChange={(value) => set('active', value)} label="Portfolio’da ko‘rsatish" />
              </>
            )}

            {collection === 'skills' && (
              <>
                <Field label="Tartib yozuvi" name="index" value={item.index} onChange={change} placeholder="01 / frontend" />
                <Field label="Bo‘lim nomi" name="title" value={item.title} onChange={change} />
                <Field
                  label="Ko‘nikmalar — har qator: nom|foiz"
                  name="itemsText"
                  value={item.itemsText}
                  onChange={change}
                  area
                  placeholder={'JavaScript|90\nReact|85'}
                />
                <Toggle checked={item.active} onChange={(value) => set('active', value)} label="Portfolio’da ko‘rsatish" />
              </>
            )}

            {collection === 'experience' && (
              <>
                <Field label="Yil" name="year" value={item.year} onChange={change} />
                <Field label="Tajriba nomi" name="title" value={item.title} onChange={change} />
                <Field label="Tavsif" name="text" value={item.text} onChange={change} area />
                <Toggle checked={item.active} onChange={(value) => set('active', value)} label="Portfolio’da ko‘rsatish" />
              </>
            )}
          </div>
        </div>

        <footer>
          <button className="admin-button secondary" type="button" onClick={() => setEditor(null)}>Bekor qilish</button>
          <button className="admin-button" type="button" disabled={saving} onClick={onSave}>
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </footer>
      </section>
    </div>
  )
}

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin-token') || '')
  const [login, setLogin] = useState({ username: 'admin', password: '' })
  const [tab, setTab] = useState('dashboard')
  const [dashboard, setDashboard] = useState(null)
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState({
    profile: {}, projects: [], services: [], skills: [], experience: [],
  })
  const [security, setSecurity] = useState(null)
  const [activity, setActivity] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [editor, setEditor] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const logout = () => {
    sessionStorage.removeItem('admin-token')
    setToken('')
  }

  const flash = (text) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 3000)
  }

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [dashboardData, messageData, contentData, securityData, activityData] = await Promise.all([
        api('/api/admin/dashboard'),
        api('/api/admin/messages'),
        api('/api/admin/content'),
        api('/api/admin/security'),
        api('/api/admin/activity?limit=50'),
      ])
      setDashboard(dashboardData.dashboard)
      setMessages(messageData.messages)
      setContent(contentData.content)
      setSecurity(securityData.security)
      setActivity(activityData.activity)
    } catch (loadError) {
      setError(loadError.message)
      if (/sessiya/i.test(loadError.message)) logout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) load()
  }, [token])

  const doLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(login),
      })
      sessionStorage.setItem('admin-token', data.token)
      setToken(data.token)
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setLoading(false)
    }
  }

  const patchMessage = async (id, patch) => {
    try {
      await api(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      })
      flash('Xabar holati saqlandi.')
      await load()
    } catch (messageError) {
      setError(messageError.message)
    }
  }

  const removeMessage = async (id) => {
    if (!window.confirm('Xabar o‘chirilsinmi?')) return
    await api(`/api/admin/messages/${id}`, { method: 'DELETE' })
    flash('Xabar o‘chirildi.')
    await load()
  }

  const visibleMessages = useMemo(
    () => messages.filter((message) => {
      const statusMatches = filter === 'all' || message.status === filter || (filter === 'important' && message.important)
      const searchMatches = !search || [message.name, message.phone, message.telegram, message.email, message.subject, message.message]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
      return statusMatches && searchMatches
    }),
    [messages, filter, search],
  )

  const uz = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return value || ''
    return value.uz ?? value.en ?? value.ru ?? Object.values(value)[0] ?? ''
  }

  const localized = (original, field, value) => {
    const old = original?.[field]
    if (old && typeof old === 'object' && !Array.isArray(old)) return { ...old, uz: value }
    return { uz: value, ru: value, en: value }
  }

  const openCreate = (collection) => {
    setEditor({ collection, mode: 'create', item: { ...empty[collection] } })
  }

  const openEdit = (collection, item) => {
    let editable = { ...item }
    if (collection === 'projects') {
      editable = {
        ...editable,
        name: uz(editable.name),
        type: uz(editable.type),
        description: uz(editable.description),
        challenge: uz(editable.challenge),
        solution: uz(editable.solution),
        role: uz(editable.role),
        result: uz(editable.result),
        stack: (editable.stack || []).join(', '),
        features: (editable.features || []).join(', '),
      }
    }
    if (collection === 'services') {
      editable = { ...editable, title: uz(editable.title), text: uz(editable.text) }
    }
    if (collection === 'skills') {
      editable = {
        ...editable,
        itemsText: (editable.items || []).map((skill) => `${skill.name}|${skill.level}`).join('\n'),
      }
    }
    if (collection === 'experience') {
      editable = { ...editable, title: uz(editable.title), text: uz(editable.text) }
    }
    setEditor({ collection, mode: 'edit', item: editable })
  }

  const buildPayload = () => {
    const { collection, item } = editor
    const original = (content[collection] || []).find((current) => String(current.id) === String(item.id))

    if (collection === 'projects') {
      const slug = item.slug || slugify(item.name) || `project-${Date.now()}`
      return {
        ...item,
        id: item.id || slug,
        slug,
        name: localized(original, 'name', item.name),
        type: localized(original, 'type', item.type),
        description: localized(original, 'description', item.description),
        challenge: localized(original, 'challenge', item.challenge),
        solution: localized(original, 'solution', item.solution),
        role: localized(original, 'role', item.role),
        result: localized(original, 'result', item.result),
        file: item.file || `${item.name}.jsx`,
        secondTab: item.secondTab || 'server/api.js',
        stack: String(item.stack || '').split(',').map((value) => value.trim()).filter(Boolean),
        features: String(item.features || '').split(',').map((value) => value.trim()).filter(Boolean),
      }
    }

    if (collection === 'services') {
      const id = item.id || slugify(item.title) || `service-${Date.now()}`
      return {
        ...item,
        id,
        title: localized(original, 'title', item.title),
        text: localized(original, 'text', item.text),
        number: item.number || String((content.services || []).length + 1).padStart(2, '0'),
      }
    }

    if (collection === 'skills') {
      const id = item.id || slugify(item.title) || `skill-${Date.now()}`
      const items = String(item.itemsText || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [name, levelText] = line.split('|')
          return {
            name: String(name || '').trim(),
            level: Math.max(0, Math.min(100, Number(levelText) || 0)),
          }
        })
        .filter((skill) => skill.name)
      return { ...item, id, items }
    }

    const id = item.id || slugify(`${item.year}-${item.title}`) || `experience-${Date.now()}`
    return {
      ...item,
      id,
      title: localized(original, 'title', item.title),
      text: localized(original, 'text', item.text),
    }
  }

  const saveEditor = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = buildPayload()
      const path = editor.mode === 'create'
        ? `/api/admin/content/${editor.collection}`
        : `/api/admin/content/${editor.collection}/${encodeURIComponent(editor.item.id)}`
      await api(path, {
        method: editor.mode === 'create' ? 'POST' : 'PATCH',
        body: JSON.stringify(payload),
      })
      setEditor(null)
      flash('Ma’lumot saqlandi.')
      await load()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const removeContent = async (collection, id) => {
    if (!window.confirm('Ma’lumot o‘chirilsinmi?')) return
    await api(`/api/admin/content/${collection}/${encodeURIComponent(id)}`, { method: 'DELETE' })
    flash('Ma’lumot o‘chirildi.')
    await load()
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await api('/api/admin/profile', {
        method: 'PATCH',
        body: JSON.stringify(content.profile),
      })
      flash('Profil saqlandi.')
      await load()
    } catch (profileError) {
      setError(profileError.message)
    } finally {
      setSaving(false)
    }
  }

  const saveDesign = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api('/api/admin/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          design: content.profile?.design || 'classic',
          theme: content.profile?.theme || 'green',
        }),
      })
      flash('Sayt dizayni saqlandi. Bosh sahifani yangilang.')
      await load()
    } catch (designError) {
      setError(designError.message)
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (event) => {
    event.preventDefault()
    if (password.newPassword !== password.confirmPassword) {
      setError('Yangi parollar bir xil emas.')
      return
    }
    setSaving(true)
    try {
      const data = await api('/api/admin/security/change-password', {
        method: 'POST',
        body: JSON.stringify(password),
      })
      window.alert(data.message)
      logout()
    } catch (passwordError) {
      setError(passwordError.message)
    } finally {
      setSaving(false)
    }
  }

  const downloadExport = async () => {
    try {
      const currentToken = sessionStorage.getItem('admin-token')
      const response = await fetch(apiUrl('/api/admin/export'), {
        headers: { Authorization: `Bearer ${currentToken}` },
      })
      if (response.status === 401) {
        logout()
        throw new Error('Sessiya tugagan.')
      }
      if (!response.ok) throw new Error('Excel yuklanmadi.')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'portfolio_messages.xls'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (exportError) {
      setError(exportError.message)
    }
  }

  if (!token) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={doLogin}>
          <InternalLink className="back-link" href="/">← portfolio</InternalLink>
          <span>secure_admin_portal</span>
          <h1>Admin panel</h1>
          <p>Portfolio ma’lumotlari va mijoz xabarlarini boshqarish.</p>
          {apiBase && <div className="admin-api-badge"><span>API</span><code>{apiBase}</code></div>}
          <Field label="Login" name="username" value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} />
          <Field label="Parol" name="password" type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} />
          {error && <div className="admin-alert error">{error}</div>}
          <button className="admin-button full" disabled={loading}>
            {loading ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>
        </form>
      </main>
    )
  }

  const max = Math.max(1, ...(dashboard?.visitors?.daily || []).map((item) => item.count))
  const managedCollections = ['projects', 'services', 'skills', 'experience']

  const cardText = (collection, item) => {
    if (collection === 'projects') return { small: uz(item.type), title: uz(item.name), text: uz(item.description) }
    if (collection === 'services') return { small: item.command, title: uz(item.title), text: uz(item.text) }
    if (collection === 'skills') return {
      small: item.index,
      title: item.title,
      text: (item.items || []).map((skill) => `${skill.name} — ${skill.level}%`).join(', '),
    }
    return { small: item.year, title: uz(item.title), text: uz(item.text) }
  }

  return (
    <main className="admin-cms">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>&lt;/&gt;</span>
          <div><strong>abbos.dev</strong><small>admin_cms</small></div>
        </div>
        <nav>
          {tabs.map(([key, label]) => (
            <button className={tab === key ? 'active' : ''} onClick={() => setTab(key)} key={key}>
              <i />{label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <InternalLink href="/">← Portfolio</InternalLink>
          <button onClick={logout}>Chiqish</button>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-header">
          <div><small>~/admin/{tab}</small><h1>{tabs.find(([key]) => key === tab)?.[1]}</h1></div>
          <div>
            <button className="admin-icon-button" onClick={load} disabled={loading}>↻</button>
            <span className="admin-online"><i /> online</span>
          </div>
        </header>

        {error && <div className="admin-alert error">{error}</div>}
        {notice && <div className="admin-alert success">{notice}</div>}

        {tab === 'dashboard' && dashboard && (
          <>
            <div className="admin-stat-grid">
              <Stat label="Bugungi tashrif" value={dashboard.visitors.today} hint={`Jami: ${dashboard.visitors.total}`} />
              <Stat label="Yangi xabar" value={dashboard.messages.unread} hint={`Bugun: ${dashboard.messages.today}`} />
              <Stat label="Loyihalar" value={dashboard.content.projects} />
              <Stat label="Xizmatlar" value={dashboard.content.services} />
              <Stat label="Ko‘nikma bo‘limlari" value={dashboard.content.skills} />
              <Stat label="Tajriba bosqichlari" value={dashboard.content.experience} />
            </div>
            <div className="admin-dashboard-grid">
              <article className="admin-panel">
                <header><div><small>analytics</small><h2>7 kunlik tashriflar</h2></div></header>
                <div className="admin-chart">
                  {dashboard.visitors.daily.map((item) => (
                    <div key={item.date}>
                      <strong>{item.count}</strong>
                      <i style={{ height: `${16 + (item.count / max) * 150}px` }} />
                      <span>{item.date.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="admin-panel">
                <header><div><small>devices</small><h2>Qurilmalar</h2></div></header>
                <div className="admin-device-list">
                  {Object.entries(dashboard.visitors.devices).map(([key, value]) => (
                    <div key={key}><span>{key}</span><strong>{value}</strong></div>
                  ))}
                </div>
              </article>
              <article className="admin-panel admin-panel-wide">
                <header><div><small>recent_activity</small><h2>Oxirgi harakatlar</h2></div></header>
                <div className="admin-activity-list">
                  {activity.slice(0, 8).map((item) => (
                    <div key={item.id}><i /><span><strong>{item.action}</strong><small>{new Date(item.createdAt).toLocaleString()}</small></span></div>
                  ))}
                </div>
              </article>
            </div>
          </>
        )}

        {tab === 'messages' && (
          <article className="admin-panel">
            <header className="admin-list-header">
              <div><small>contact_messages</small><h2>Mijoz xabarlari</h2></div>
              <button type="button" className="admin-button secondary" onClick={downloadExport}>Excel ↓</button>
            </header>
            <div className="admin-filter-bar">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Qidirish..." />
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">Barchasi</option>
                <option value="unread">Yangi</option>
                <option value="read">O‘qildi</option>
                <option value="replied">Javob berildi</option>
                <option value="in_progress">Ish boshlandi</option>
                <option value="completed">Yakunlandi</option>
                <option value="spam">Spam</option>
                <option value="important">Muhim</option>
              </select>
            </div>
            <div className="admin-message-list">
              {visibleMessages.map((message) => (
                <article className={`admin-message-card ${message.important ? 'important' : ''}`} key={message.id}>
                  <header>
                    <div><strong>{message.name}</strong><span>{new Date(message.createdAt).toLocaleString()}</span></div>
                    <button className="admin-star" onClick={() => patchMessage(message.id, { important: !message.important })}>
                      {message.important ? '★' : '☆'}
                    </button>
                  </header>
                  <div className="admin-message-contact">
                    <a href={`tel:${message.phone}`}>{message.phone}</a>
                    {message.telegram && <a href={`https://t.me/${message.telegram.replace('@', '')}`} target="_blank" rel="noreferrer">{message.telegram}</a>}
                    {message.email && <a href={`mailto:${message.email}`}>{message.email}</a>}
                  </div>
                  {message.subject && (
                    <h3 className="admin-message-subject">
                      {message.subject}
                    </h3>
                  )}
                  <p>{message.message}</p>
                  <footer>
                    <select value={message.status || 'unread'} onChange={(event) => patchMessage(message.id, { status: event.target.value })}>
                      <option value="unread">Yangi</option>
                      <option value="read">O‘qildi</option>
                      <option value="replied">Javob berildi</option>
                      <option value="in_progress">Ish boshlandi</option>
                      <option value="completed">Yakunlandi</option>
                      <option value="spam">Spam</option>
                    </select>
                    <button className="admin-danger-button" onClick={() => removeMessage(message.id)}>O‘chirish</button>
                  </footer>
                </article>
              ))}
            </div>
          </article>
        )}

        {managedCollections.includes(tab) && (
          <article className="admin-panel">
            <header className="admin-list-header">
              <div><small>content_management</small><h2>{tabs.find(([key]) => key === tab)?.[1]}</h2></div>
              <button className="admin-button" onClick={() => openCreate(tab)}>+ Yangi qo‘shish</button>
            </header>
            <div className="admin-content-grid">
              {(content[tab] || []).map((item) => {
                const card = cardText(tab, item)
                return (
                  <article className="admin-content-card" key={item.id}>
                    <div><small>{card.small}</small><h3>{card.title}</h3><p>{card.text}</p></div>
                    <footer>
                      <span className={item.active === false ? 'inactive' : 'active'}>{item.active === false ? 'Yashirin' : 'Aktiv'}</span>
                      <button onClick={() => openEdit(tab, item)}>Tahrirlash</button>
                      <button className="danger" onClick={() => removeContent(tab, item.id)}>O‘chirish</button>
                    </footer>
                  </article>
                )
              })}
            </div>
          </article>
        )}

        {tab === 'profile' && (
          <form className="admin-panel admin-profile-form" onSubmit={saveProfile}>
            <header><div><small>portfolio_profile</small><h2>Profil sozlamalari</h2></div></header>
            <div className="admin-form-grid">
              {[
                ['Ism-familiya', 'fullName'], ['Ism', 'firstName'], ['Familiya', 'lastName'],
                ['Yo‘nalish', 'role'], ['Telegram', 'telegram'], ['Telegram link', 'telegramUrl'],
                ['Telefon', 'phone'], ['Email', 'email'], ['Ish vaqti', 'workHours'],
                ['Javob vaqti', 'responseTime'], ['Rasm URL', 'imageUrl'],
              ].map(([label, name]) => (
                <Field
                  label={label}
                  name={name}
                  value={content.profile?.[name]}
                  onChange={(event) => setContent((current) => ({
                    ...current,
                    profile: { ...current.profile, [name]: event.target.value },
                  }))}
                  key={name}
                />
              ))}
              <Field label="Bosh sahifa matni" name="headline" value={content.profile?.headline} onChange={(event) => setContent((current) => ({ ...current, profile: { ...current.profile, headline: event.target.value } }))} area />
              <Field label="Men haqimda sarlavha" name="aboutTitle" value={content.profile?.aboutTitle} onChange={(event) => setContent((current) => ({ ...current, profile: { ...current.profile, aboutTitle: event.target.value } }))} area />
              <Field label="Men haqimda — 1" name="aboutBody1" value={content.profile?.aboutBody1} onChange={(event) => setContent((current) => ({ ...current, profile: { ...current.profile, aboutBody1: event.target.value } }))} area />
              <Field label="Men haqimda — 2" name="aboutBody2" value={content.profile?.aboutBody2} onChange={(event) => setContent((current) => ({ ...current, profile: { ...current.profile, aboutBody2: event.target.value } }))} area />
            </div>
            <Toggle checked={content.profile?.available} label="Yangi loyihalar uchun ochiq" onChange={(value) => setContent((current) => ({ ...current, profile: { ...current.profile, available: value } }))} />
            <button className="admin-button" disabled={saving}>{saving ? 'Saqlanmoqda...' : 'Profilni saqlash'}</button>
          </form>
        )}

        {tab === 'design' && (
          <form className="admin-panel admin-design-form" onSubmit={saveDesign}>
            <header>
              <div><small>website_appearance</small><h2>Dizayn va rang</h2></div>
            </header>
            <p className="admin-design-help">Bu sozlama barcha tashrif buyuruvchilar uchun sayt ko‘rinishini o‘zgartiradi. Ommaviy sahifada dizayn almashtirish tugmasi ko‘rinmaydi.</p>
            <div className="admin-design-grid">
              {designOptions.map(([value, label]) => (
                <button
                  className={`admin-design-card ${content.profile?.design === value ? 'active' : ''}`}
                  type="button"
                  key={value}
                  onClick={() => setContent((current) => ({ ...current, profile: { ...current.profile, design: value } }))}
                >
                  <span className="admin-design-preview"><img src={`/assets/themes/${value}.svg`} alt="" loading="lazy" /></span>
                  <strong>{label}</strong>
                  <small>{value === 'dashboard' ? 'Chap menyuli panel' : value === 'glass' ? 'Ko‘k-binafsha shisha' : value === 'light' ? 'Oq professional' : value === 'terminal' ? 'Keskin terminal' : 'Asosiy portfolio'}</small>
                </button>
              ))}
            </div>
            <h3 className="admin-design-subtitle">Asosiy rang</h3>
            <div className="admin-color-grid">
              {themeOptions.map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={`admin-color-choice admin-color-choice--${value} ${content.profile?.theme === value ? 'active' : ''}`}
                  onClick={() => setContent((current) => ({ ...current, profile: { ...current.profile, theme: value } }))}
                >
                  <span />{label}
                </button>
              ))}
            </div>
            <button className="admin-button" disabled={saving}>{saving ? 'Saqlanmoqda...' : 'Dizaynni saqlash'}</button>
          </form>
        )}

        {tab === 'security' && (
          <div className="admin-security-grid">
            <form className="admin-panel" onSubmit={changePassword}>
              <header><div><small>password_security</small><h2>Parolni o‘zgartirish</h2></div></header>
              <Field label="Joriy parol" name="currentPassword" type="password" value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} />
              <Field label="Yangi parol" name="newPassword" type="password" value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} />
              <Field label="Yangi parolni takrorlang" name="confirmPassword" type="password" value={password.confirmPassword} onChange={(event) => setPassword({ ...password, confirmPassword: event.target.value })} />
              <button className="admin-button" disabled={saving}>Parolni o‘zgartirish</button>
            </form>
            <article className="admin-panel">
              <header><div><small>security_status</small><h2>Xavfsizlik holati</h2></div></header>
              <div className="admin-security-list">
                <div><span>Admin login</span><strong>{security?.username}</strong></div>
                <div><span>Sessiya</span><strong>{security?.sessionHours} soat</strong></div>
                <div><span>Oxirgi login</span><strong>{security?.lastLoginAt ? new Date(security.lastLoginAt).toLocaleString() : 'Hali yo‘q'}</strong></div>
                <div><span>Maxsus parol</span><strong>{security?.passwordCustomized ? 'O‘rnatilgan' : '.env paroli'}</strong></div>
                <div><span>Login blokirovkasi</span><strong>{security?.locked ? 'Bloklangan' : 'Aktiv emas'}</strong></div>
              </div>
              <p className="admin-security-note">Ko‘p login urinishlari vaqtincha cheklanadi. Parol o‘zgarsa eski sessiyalar bekor qilinadi.</p>
            </article>
            <article className="admin-panel admin-panel-wide">
              <header><div><small>audit_log</small><h2>Admin harakatlari</h2></div></header>
              <div className="admin-audit-table">
                {activity.map((item) => (
                  <div key={item.id}><span>{item.action}</span><small>{item.admin}</small><time>{new Date(item.createdAt).toLocaleString()}</time></div>
                ))}
              </div>
            </article>
          </div>
        )}
      </section>

      <Modal editor={editor} setEditor={setEditor} onSave={saveEditor} saving={saving} />
    </main>
  )
}

import { useLanguage } from '../context/LanguageContext.jsx'
import { useTheme, themes } from '../context/ThemeContext.jsx'

const colors={green:'#39ff88',blue:'#6fc8ff',purple:'#c69cff',red:'#ff7a7a',cyan:'#20e7e7',gold:'#f3bd57'}

export default function ControlPanel() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  return (
    <div className="control-panel" aria-label="Portfolio settings" onClick={(event) => event.stopPropagation()}>
      <label className="control-language">
        <span>{t('language')}</span>
        <select value={language} aria-label={t('language')} onChange={(event) => setLanguage(event.target.value)}>
          <option value="uz">UZ</option><option value="ru">RU</option><option value="en">EN</option>
        </select>
      </label>
      <div className="theme-dots" aria-label={t('theme')}>
        {themes.map((item)=><button key={item} type="button" className={`theme-dot theme-dot--${item} ${theme===item?'active':''}`} style={{background:colors[item]}} aria-label={`${t('theme')}: ${item}`} onClick={()=>setTheme(item)} />)}
      </div>
    </div>
  )
}

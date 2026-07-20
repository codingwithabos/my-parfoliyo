export function localize(value, language = 'uz') {
  if (value == null) return ''
  if (Array.isArray(value)) return value
  if (typeof value !== 'object') return value
  return value[language] ?? value.uz ?? value.en ?? value.ru ?? Object.values(value).find((item) => item != null) ?? ''
}

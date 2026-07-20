const map = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'x',ц:'ts',ч:'ch',ш:'sh',щ:'sh',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
  қ:'q',ғ:'g',ҳ:'h',ў:'o',ң:'n',ә:'a',ө:'o',ү:'u',і:'i',
}
export function slugify(value) {
  const normalized = String(value || '').trim().toLowerCase().replace(/[ʻʼ’‘`']/g, '')
  const transliterated = [...normalized].map((char) => map[char] ?? char).join('')
  return transliterated.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100)
}

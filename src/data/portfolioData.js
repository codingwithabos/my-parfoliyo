export const navItems=[
  {key:'home',href:'#home'},
  {key:'design',href:'#design'},
  {key:'about',href:'#about'},
  {key:'skills',href:'#skills'},
  {key:'services',href:'#services'},
  {key:'experience',href:'#experience'},
  {key:'projects',href:'#projects'},
  {key:'contact',href:'#contact'},
]
export const stats=[
  {value:30,suffix:'+',label:'completed_projects',icon:'◫'},
  {value:3,suffix:'+',label:'fullstack_experience',icon:'⌁'},
  {value:20,suffix:'+',label:'api_integrations',icon:'⛓'},
  {value:100,suffix:'%',label:'responsive_design',icon:'▣'},
]
export const skills=[
 {index:'01 / frontend',title:'Frontend',items:[{name:'HTML / CSS / SCSS',level:95},{name:'JavaScript',level:91},{name:'React / Vite',level:90},{name:'Vue.js',level:84}]},
 {index:'02 / backend',title:'Backend',items:[{name:'Node.js',level:88},{name:'Express.js',level:87},{name:'REST API',level:92},{name:'JWT / Security',level:83}]},
 {index:'03 / database',title:'Database & Integrations',items:[{name:'PostgreSQL',level:85},{name:'MongoDB',level:82},{name:'Webhooks / Integrations',level:91},{name:'Axios / Fetch',level:90}]},
 {index:'04 / tools',title:'Tools & Deployment',items:[{name:'Git / GitHub',level:90},{name:'Netlify / Vercel',level:87},{name:'Railway / Render',level:86},{name:'PWA / SEO',level:82}]},
]

export const services=[
 {
  key:'react',
  number:'01',
  title:{uz:'React web-sayt yaratish',ru:'Разработка React-сайтов',en:'React website development'},
  text:{uz:'Tez, responsive va komponentlarga ajratilgan zamonaviy React web-saytlar.',ru:'Быстрые и адаптивные React-сайты с компонентной архитектурой.',en:'Fast, responsive React websites with component architecture.'},
  command:'npm create vite@latest'
 },
 {
  key:'admin',
  number:'02',
  title:{uz:'Admin panel yaratish',ru:'Разработка админ-панели',en:'Admin panel development'},
  text:{uz:'Login, rollar, statistika, jadval, filter va boshqaruv funksiyalari.',ru:'Авторизация, роли, статистика, таблицы, фильтры и управление.',en:'Authentication, roles, analytics, tables, filters and management.'},
  command:'role_based_access = true'
 },
 {
  key:'node',
  number:'03',
  title:{uz:'Node.js backend',ru:'Node.js backend',en:'Node.js backend'},
  text:{uz:'Xavfsiz, tartibli va kengaytiriladigan Express.js serverlar.',ru:'Безопасные и масштабируемые серверы на Express.js.',en:'Secure, structured and scalable Express.js servers.'},
  command:'node server.js'
 },
 {
  key:'api',
  number:'04',
  title:{uz:'REST API',ru:'REST API',en:'REST API'},
  text:{uz:'Frontend, mobil ilova va tashqi servislar uchun toza API endpointlar.',ru:'Чистые API endpoint-ы для frontend, mobile и внешних сервисов.',en:'Clean API endpoints for frontend, mobile and external services.'},
  command:'POST /api/resource'
 },
 {
  key:'crm',
  number:'05',
  title:{uz:'CRM tizimi',ru:'CRM-система',en:'CRM system'},
  text:{uz:'Mijozlar, sotuvlar, operatorlar, filiallar va hisobotlarni boshqarish.',ru:'Управление клиентами, продажами, операторами, филиалами и отчётами.',en:'Manage clients, sales, operators, branches and reports.'},
  command:'crm.status = online'
 },
 {
  key:'deploy',
  number:'06',
  title:{uz:'Saytni hostingga joylash',ru:'Размещение на хостинге',en:'Website deployment'},
  text:{uz:'Frontendni Netlify/Vercel, backendni Railway/Renderga joylash.',ru:'Frontend на Netlify/Vercel, backend на Railway/Render.',en:'Frontend on Netlify/Vercel and backend on Railway/Render.'},
  command:'npm run deploy'
 },
 {
  key:'fix',
  number:'07',
  title:{uz:'Xatolarni tuzatish',ru:'Исправление ошибок',en:'Bug fixing'},
  text:{uz:'Frontend, backend, API, deploy va responsive xatolarini aniqlash.',ru:'Исправление ошибок frontend, backend, API, deploy и responsive.',en:'Frontend, backend, API, deployment and responsive troubleshooting.'},
  command:'debug --fix-all'
 },
]

export const experience=[
 {year:'2024',title:{uz:'HTML, CSS va JavaScript',ru:'HTML, CSS и JavaScript',en:'HTML, CSS and JavaScript'},text:{uz:'Responsive landing page, portfolio va interaktiv web sahifalar yaratishni boshladim.',ru:'Начал создавать адаптивные лендинги, портфолио и интерактивные веб-страницы.',en:'Started building responsive landing pages, portfolios and interactive web pages.'}},
 {year:'2025',title:{uz:'React va Vue.js',ru:'React и Vue.js',en:'React and Vue.js'},text:{uz:'Komponentli arxitektura, state management, API integratsiyasi va dashboardlar ustida ishladim.',ru:'Работал с компонентной архитектурой, управлением состоянием, API-интеграциями и панелями.',en:'Worked with component architecture, state management, API integration and dashboards.'}},
 {year:'2025',title:{uz:'Node.js va Express',ru:'Node.js и Express',en:'Node.js and Express'},text:{uz:'REST API, authentication, validation va ma’lumotlar bazasi bilan ishlaydigan backendlar yaratdim.',ru:'Создавал backend с REST API, аутентификацией, валидацией и базами данных.',en:'Built backends with REST APIs, authentication, validation and databases.'}},
 {year:'2026',title:{uz:'CRM va biznes avtomatizatsiyasi',ru:'CRM и автоматизация бизнеса',en:'CRM and business automation'},text:{uz:'Ta’lim CRM, operator tizimlari, test platformalari va boshqaruv panellarini productionga chiqardim.',ru:'Запустил в production образовательные CRM, операторские системы, тестовые платформы и панели управления.',en:'Deployed education CRMs, operator systems, testing platforms and management dashboards to production.'}},
]
export const projects=[
 {id:1,slug:'educrm',file:'EduCRM.jsx',secondTab:'server/api.js',name:'EduCRM',type:'Full-Stack Education CRM',description:'O‘quvchilar, operatorlar, sotuvlar va hisobotlarni boshqarish tizimi',features:['Role system','Dashboard','Excel reports','Real-time alerts'],stack:['React','Express','PostgreSQL'],image:'/assets/projects/educrm.svg',github:'',live:'https://azizacademyoperators.netlify.app/login',date:'2026',challenge:'Ko‘p filial va operatorlar ma’lumotini bitta tizimda boshqarish.',solution:'Role-based dashboard, REST API, hisobotlar va real-time bildirishnomalar yaratildi.',role:'React interfeys, Express API, rollar tizimi, Excel hisobotlari va bildirishnoma integratsiyasini ishlab chiqdim.',result:'Operatorlar va filiallar bitta tizimda ishlay boshladi, hisobot olish va sotuvlarni kuzatish avtomatlashtirildi.'},
 {id:2,slug:'shopflow',file:'ShopFlow.jsx',secondTab:'server/orders.js',name:'ShopFlow',type:'Full-Stack E-commerce',description:'Mahsulot katalogi, savat, buyurtma va admin boshqaruviga ega platforma',features:['Product filter','Cart','Orders','Admin panel'],stack:['React','Node.js','MongoDB'],image:'/assets/projects/shopflow.svg',github:'',live:'/demo/shopflow',date:'2026',challenge:'Mobil qurilmada ham tez ishlaydigan savdo jarayonini yaratish.',solution:'Optimallashtirilgan katalog, savat va buyurtma API ishlab chiqildi.',role:'Mahsulot interfeysi, savat state management, buyurtma API va admin boshqaruvini yaratdim.',result:'Mobil xarid jarayoni soddalashdi, mahsulot qidirish va buyurtma berish tezlashdi.'},
 {id:3,slug:'devchat',file:'DevChat.jsx',secondTab:'socket.gateway.js',name:'DevChat',type:'Real-Time Messenger',description:'JWT himoyasi va WebSocket asosidagi real vaqt chat ilovasi',features:['Live messages','JWT auth','Online status','File sharing'],stack:['React','Socket.IO','Express'],image:'/assets/projects/devchat.svg',github:'',live:'/demo/devchat',date:'2025',challenge:'Xabarlarni real vaqtda xavfsiz yetkazish.',solution:'Socket ulanishlari, token tekshiruvi va online holat tizimi yaratildi.',role:'React chat interfeysi, Socket.IO ulanishlari, JWT himoyasi va online statusni ishlab chiqdim.',result:'Xabarlar real vaqtda yetkazildi, foydalanuvchi holati va xavfsiz ulanish ta’minlandi.'},
 {id:4,slug:'taskmanager',file:'TaskManager.jsx',secondTab:'server/tasks.js',name:'TaskManager',type:'Team Task Platform',description:'Vazifalar, jamoalar, statuslar va statistikani boshqarish tizimi',features:['CRUD','Roles','Analytics','Notifications'],stack:['React','Node.js','REST API'],image:'/assets/projects/taskmanager.svg',github:'',live:'/demo/taskmanager',date:'2025',challenge:'Jamoa vazifalarini aniq kuzatish.',solution:'Status workflow, filterlar, statistika va bildirishnomalar qo‘shildi.',role:'Vazifa CRUD, rollar, filterlar, dashboard statistika va notification tizimini yaratdim.',result:'Jamoa vazifalari aniq kuzatildi, bajarilish holati va muddat nazorati yaxshilandi.'},
]
export const contactInfo={
 telegram:'@sodiqjonv_abbos',
 telegramUrl:'https://t.me/sodiqjonv_abbos',
 phone:'',
 email:'',
 workHours:'09:00–21:00',
 responseTime:'24 soat ichida',
}
export const socials=[
 {label:'Telegram',value:'@sodiqjonv_abbos',href:'https://t.me/sodiqjonv_abbos',icon:'telegram'},
]

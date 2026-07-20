import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const translations = {
  uz: {
    nav:{home:'home',design:'dizayn',about:'about',skills:'skills',services:'services',experience:'tajriba',projects:'projects',contact:'contact'},
    hero:{available:'available_for_projects = true',role:'React va Backend Dasturchi',description:'React yordamida zamonaviy interfeyslar, Node.js va Express orqali xavfsiz REST API, CRM va boshqaruv tizimlarini yarataman.',projects:'portfolio --view',contact:'contact --init',telegram:'telegram --open',cv:'cv --download'},
    about:{label:'about_me',title:'Frontend va backendni bitta ishlaydigan tizimga birlashtiraman.',body1:'React va Vue yordamida responsive, tez va qulay interfeyslar yarataman.',body2:'Node.js, Express, REST API, authentication va ma’lumotlar bazasi bilan to‘liq backend ishlab chiqaman.',photo:'Bu joyga o‘z rasmingizni qo‘yishingiz mumkin.'},
    skills:{label:'react_backend_stack',title:'Interfeysdan server va ma’lumotlar bazasigacha.',subtitle:'Ko‘nikmalar progress animatsiyasi bilan ko‘rsatiladi.'},
    services:{label:'services',title:'Siz uchun yaratadigan IT xizmatlarim.',subtitle:'Frontenddan hostinggacha bo‘lgan to‘liq xizmatlar.'},
    workflow:{title:'Loyihani g‘oyadan tayyor mahsulotgacha olib borish jarayoni.',subtitle:'Talablar, dizayn, frontend, backend, test va hosting bosqichma-bosqich bajariladi.'},
    experience:{label:'experience_timeline',title:'Dasturlash yo‘lim va tajribam.',subtitle:'Har bir bosqich yangi bilim va amaliy loyihalar bilan mustahkamlangan.'},
    projects:{label:'selected_projects',title:'To‘liq ishlaydigan loyihalarim.',subtitle:'Har bir loyiha uchun alohida batafsil sahifa va ishlatilgan texnologiyalar ko‘rsatiladi.',details:'batafsil ko‘rish'},
    github:{label:'github_integration',title:'GitHub faoliyati.',subtitle:'Username sozlansa, so‘nggi repozitoriyalar GitHub API orqali avtomatik yuklanadi.',fallback:'GitHub username .env ichida sozlanmagan. Hozir mahalliy loyihalar ko‘rsatilmoqda.'},
    certificates:{label:'certificates',title:'Sertifikatlar va natijalar.',subtitle:'Sertifikatni bosib katta ko‘rinishda oching.',view:'sertifikatni ko‘rish'},
    testimonials:{label:'client_feedback',title:'Mijozlar fikri.',subtitle:'Hamkorlik jarayoni va natija haqida fikrlar.'},
    blog:{label:'developer_blog',title:'Foydali maqolalar.',subtitle:'React, backend, API va deploy bo‘yicha amaliy qo‘llanmalar.',read:'maqolani o‘qish'},
    project:{problem:'Muammo',solution:'Yechim',role:'Mening vazifam',result:'Natija',technologies:'Texnologiyalar'},
    article:{step:'qadam'},
    testimonial:{client:'Mijoz ismi',project:'Loyiha nomi',feedback:'Qisqa fikr',result:'Natija'},
    contact:{label:'contact',title:'Loyihangiz haqida yozing.',subtitle:'Forma orqali yuborilgan xabar faqat adminga yetkaziladi.',name:'Ism',phone:'Telefon',email:'Email',subject:'Mavzu',subjectPlaceholder:'Masalan: yangi sayt yoki CRM loyihasi',service:'Xizmat turi',telegram:'Telegram username',message:'Xabar',workHours:'Ish vaqti',responseTime:'Javob berish vaqti',responseValue:'24 soat ichida',call:'Telefon qilish',writeEmail:'Email yozish',sendRequest:'Murojaat yuborish',errors:{name:'Ismni kiriting.',phone:'+998 dan keyin 9 ta raqam kiriting.',telegram:'@username formatida yozing.',email:'Email noto‘g‘ri.',message:'Xabar kamida 5 ta belgi.',form:'Formadagi xatolarni to‘g‘rilang.'},send:'xabarni yuborish',sending:'yuborilmoqda...',success:'Xabaringiz muvaffaqiyatli yuborildi. Sodiqjonov Abbos tez orada siz bilan bog‘lanadi.',successTitle:'Xabar qabul qilindi',errorTitle:'Yuborishda xatolik',error:'Xabar yuborilmadi. Forma xizmatini tekshirib, qayta urinib ko‘ring.',timeout:'So‘rov vaqti tugadi. Bir ozdan keyin qayta yuboring.',netlifyNotReady:'Netlify Forms hali yoqilmagan yoki forma aniqlanmagan. Netlify’da Forms detection’ni yoqing va saytni qayta deploy qiling.',tooMany:'Juda ko‘p xabar yuborildi. Bir oz kutib qayta urinib ko‘ring.',secureTitle:'Xavfsiz murojaat kanali',secureText:'Xabar faqat administrator ko‘rishi uchun yuboriladi.',formTitle:'Loyiha ma’lumotlarini kiriting',messagePlaceholder:'Loyihangiz, vazifa va kerakli natijani yozing...',adminOnly:'Faqat administratorga yuboriladi'},
    theme:'Rang',language:'Til',install:'Ilovani o‘rnatish',back:'orqaga',notFound:'Ma’lumot topilmadi.'
  },
  ru: {
    nav:{home:'главная',design:'дизайн',about:'обо_мне',skills:'навыки',services:'услуги',experience:'опыт',projects:'проекты',contact:'контакты'},
    hero:{available:'available_for_projects = true',role:'React и Backend разработчик',description:'Создаю современные интерфейсы на React, безопасные REST API, CRM и системы управления на Node.js и Express.',projects:'portfolio --view',contact:'contact --init',telegram:'telegram --open',cv:'cv --download'},
    about:{label:'about_me',title:'Объединяю frontend и backend в единую рабочую систему.',body1:'Создаю быстрые и адаптивные интерфейсы на React и Vue.',body2:'Разрабатываю backend на Node.js, Express, REST API, authentication и базах данных.',photo:'Здесь можно разместить вашу фотографию.'},
    skills:{label:'react_backend_stack',title:'От интерфейса до сервера и базы данных.',subtitle:'Навыки показаны с анимированным прогрессом.'},
    services:{label:'services',title:'IT-услуги для вашего проекта.',subtitle:'Полный цикл от frontend до deployment.'},
    workflow:{title:'Путь от идеи до готового продукта.',subtitle:'Требования, дизайн, frontend, backend, тестирование и hosting выполняются поэтапно.'},
    experience:{label:'experience_timeline',title:'Мой путь в программировании.',subtitle:'Каждый этап закреплён практическими проектами.'},
    projects:{label:'selected_projects',title:'Полноценные проекты.',subtitle:'У каждого проекта есть отдельная страница и список использованных технологий.',details:'подробнее'},
    github:{label:'github_integration',title:'Активность GitHub.',subtitle:'После настройки username репозитории загружаются через GitHub API.',fallback:'GitHub username не настроен. Показаны локальные проекты.'},
    certificates:{label:'certificates',title:'Сертификаты.',subtitle:'Нажмите, чтобы открыть сертификат.',view:'открыть сертификат'},
    testimonials:{label:'client_feedback',title:'Отзывы клиентов.',subtitle:'Отзывы о процессе и результате.'},
    blog:{label:'developer_blog',title:'Полезные статьи.',subtitle:'React, backend, API и deployment.',read:'читать статью'},
    project:{problem:'Проблема',solution:'Решение',role:'Моя роль',result:'Результат',technologies:'Технологии'},
    article:{step:'шаг'},
    testimonial:{client:'Клиент',project:'Проект',feedback:'Отзыв',result:'Результат'},
    contact:{label:'contact',title:'Расскажите о проекте.',subtitle:'Сообщение отправляется только администратору.',name:'Имя',phone:'Телефон',email:'Email',subject:'Тема',subjectPlaceholder:'Например: новый сайт или CRM-проект',service:'Тип услуги',telegram:'Telegram username',message:'Сообщение',workHours:'Рабочее время',responseTime:'Время ответа',responseValue:'В течение 24 часов',call:'Позвонить',writeEmail:'Написать email',sendRequest:'Отправить обращение',errors:{name:'Введите имя.',phone:'Введите 9 цифр после +998.',telegram:'Введите в формате @username.',email:'Неверный email.',message:'Сообщение должно содержать минимум 5 символов.',form:'Исправьте ошибки в форме.'},send:'отправить сообщение',sending:'отправка...',success:'Сообщение успешно отправлено. Содикжонов Аббос скоро свяжется с вами.',successTitle:'Сообщение принято',errorTitle:'Ошибка отправки',error:'Не удалось отправить сообщение. Проверьте настройку формы и попробуйте снова.',timeout:'Время ожидания истекло. Повторите отправку немного позже.',netlifyNotReady:'Netlify Forms не включён или форма не обнаружена. Включите Forms detection и повторно разверните сайт.',tooMany:'Отправлено слишком много сообщений. Подождите и попробуйте снова.',secureTitle:'Безопасный канал связи',secureText:'Сообщение отправляется только администратору.',formTitle:'Введите данные проекта',messagePlaceholder:'Опишите проект, задачу и желаемый результат...',adminOnly:'Отправляется только администратору'},
    theme:'Цвет',language:'Язык',install:'Установить приложение',back:'назад',notFound:'Данные не найдены.'
  },
  en: {
    nav:{home:'home',design:'design',about:'about',skills:'skills',services:'services',experience:'experience',projects:'projects',contact:'contact'},
    hero:{available:'available_for_projects = true',role:'React & Backend Developer',description:'I build modern React interfaces, secure REST APIs, CRM and management systems with Node.js and Express.',projects:'portfolio --view',contact:'contact --init',telegram:'telegram --open',cv:'cv --download'},
    about:{label:'about_me',title:'I connect frontend and backend into one reliable system.',body1:'I create fast, responsive interfaces with React and Vue.',body2:'I develop backend systems with Node.js, Express, REST APIs, authentication and databases.',photo:'You can place your photo here.'},
    skills:{label:'react_backend_stack',title:'From interface to server and database.',subtitle:'Skills are shown with animated progress.'},
    services:{label:'services',title:'IT services for your project.',subtitle:'A complete workflow from frontend to deployment.'},
    workflow:{title:'From idea to a finished product.',subtitle:'Requirements, design, frontend, backend, testing and hosting are completed step by step.'},
    experience:{label:'experience_timeline',title:'My development journey.',subtitle:'Every stage is strengthened by practical projects.'},
    projects:{label:'selected_projects',title:'Complete working projects.',subtitle:'Each project has a separate details page and a list of technologies used.',details:'view details'},
    github:{label:'github_integration',title:'GitHub activity.',subtitle:'When a username is configured, repositories load through the GitHub API.',fallback:'GitHub username is not configured. Local projects are shown.'},
    certificates:{label:'certificates',title:'Certificates and achievements.',subtitle:'Click a certificate to view it.',view:'view certificate'},
    testimonials:{label:'client_feedback',title:'Client feedback.',subtitle:'Feedback about collaboration and results.'},
    blog:{label:'developer_blog',title:'Useful articles.',subtitle:'Practical guides about React, backend, APIs and deployment.',read:'read article'},
    project:{problem:'Problem',solution:'Solution',role:'My role',result:'Result',technologies:'Technologies'},
    article:{step:'step'},
    testimonial:{client:'Client',project:'Project',feedback:'Feedback',result:'Result'},
    contact:{label:'contact',title:'Tell me about your project.',subtitle:'The message is delivered only to the administrator.',name:'Name',phone:'Phone',email:'Email',subject:'Subject',subjectPlaceholder:'For example: a new website or CRM project',service:'Service',telegram:'Telegram username',message:'Message',workHours:'Working hours',responseTime:'Response time',responseValue:'Within 24 hours',call:'Call',writeEmail:'Write email',sendRequest:'Send request',errors:{name:'Enter your name.',phone:'Enter 9 digits after +998.',telegram:'Use the @username format.',email:'Invalid email.',message:'Message must contain at least 5 characters.',form:'Please fix the form errors.'},send:'send message',sending:'sending...',success:'Your message was sent successfully. Sodiqjonov Abbos will contact you soon.',successTitle:'Message received',errorTitle:'Sending failed',error:'The message could not be sent. Check the form service and try again.',timeout:'The request timed out. Please try again shortly.',netlifyNotReady:'Netlify Forms is not enabled or the form was not detected. Enable form detection and redeploy the site.',tooMany:'Too many messages were sent. Wait a moment and try again.',secureTitle:'Secure contact channel',secureText:'The message is delivered only to the administrator.',formTitle:'Enter project details',messagePlaceholder:'Describe your project, task and expected result...',adminOnly:'Delivered only to the administrator'},
    theme:'Theme',language:'Language',install:'Install app',back:'back',notFound:'Data not found.'
  }
}

const LanguageContext=createContext(null)
export function LanguageProvider({children}){
  const [language,setLanguageState]=useState(()=>{const saved=localStorage.getItem('portfolio-language');return ['uz','ru','en'].includes(saved)?saved:'uz'})
  useEffect(()=>{document.documentElement.lang=language},[language])
  const setLanguage=(value)=>{if(!['uz','ru','en'].includes(value))return;setLanguageState(value);localStorage.setItem('portfolio-language',value)}
  const t=(path)=>path.split('.').reduce((value,key)=>value?.[key],translations[language])??path
  const value=useMemo(()=>({language,setLanguage,t}),[language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
export function useLanguage(){return useContext(LanguageContext)}

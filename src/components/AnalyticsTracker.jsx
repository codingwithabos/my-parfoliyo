import { apiUrl } from '../utils/apiBase.js'
import { useEffect } from 'react'
export default function AnalyticsTracker(){useEffect(()=>{const key=`visit:${new Date().toISOString().slice(0,10)}`;if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1');const w=window.innerWidth,device=w<700?'mobile':w<1100?'tablet':'desktop';fetch(apiUrl('/api/analytics/visit'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:location.pathname,device,referrer:document.referrer}),keepalive:true}).catch(()=>{})},[]);return null}

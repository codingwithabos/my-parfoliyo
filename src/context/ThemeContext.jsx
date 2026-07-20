import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext=createContext(null)
export const themes=['green','blue','purple','red','cyan','gold']
export const designs=['classic','dashboard','glass','light','terminal']

const valid=(value,list,fallback)=>list.includes(value)?value:fallback

export function ThemeProvider({children}){
  const [theme,setThemeState]=useState(()=>valid(localStorage.getItem('portfolio-theme'),themes,'green'))
  const [design,setDesignState]=useState(()=>valid(localStorage.getItem('portfolio-design'),designs,'classic'))

  useEffect(()=>{
    if(localStorage.getItem('portfolio-theme') || localStorage.getItem('portfolio-design')) return
    let alive=true
    fetch('/api/content').then(r=>r.ok?r.json():null).then(data=>{
      if(!alive||!data?.content?.profile)return
      setThemeState(valid(data.content.profile.theme,themes,'green'))
      setDesignState(valid(data.content.profile.design,designs,'classic'))
    }).catch(()=>{})
    return()=>{alive=false}
  },[])

  const setTheme=(value)=>{const next=valid(value,themes,'green');setThemeState(next);localStorage.setItem('portfolio-theme',next)}
  const setDesign=(value)=>{const next=valid(value,designs,'classic');setDesignState(next);localStorage.setItem('portfolio-design',next)}

  useEffect(()=>{document.documentElement.dataset.theme=theme},[theme])
  useEffect(()=>{document.documentElement.dataset.design=design},[design])

  const value=useMemo(()=>({theme,design,setTheme,setDesign,themes,designs}),[theme,design])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
export function useTheme(){return useContext(ThemeContext)}

import { CSSProperties } from "vue"

export function setTheme(name: string) {
    const htmlDOM = document.getElementsByTagName("html")[0]
    htmlDOM.className = name
}

export const getProperty = (el:HTMLElement,name:string) => {
  return getComputedStyle(el).getPropertyValue(name)
}

export const setProperty = (el:HTMLElement,name:string,value:string) => {
  el.style.setProperty(name,value)
}
import {App} from 'vue'
import menu from './src/menu'
import menuItem from "./src/menu-item.vue"
import  {componentInstall}    from "aries-ui/libs"

export const AriMenu =  componentInstall(menu,{
    menuItem
})
export default  AriMenu

export const AriMenuItem = componentInstall(menuItem)


export * from "./src/menu"
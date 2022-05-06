import {App} from 'vue'
import menu from './src/menu'
import  {componentInstall}    from "../../../libs"


export const AqrMenu =  componentInstall(menu)

export default  AqrMenu


export * from "./src/menu"
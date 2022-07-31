import {App} from 'vue'
import scroll from './src/scroll.vue'
import  {componentInstall}    from "../../libs/utils"

export const AriScroll =  componentInstall(scroll)

export default  AriScroll

export * from "./src/scroll"

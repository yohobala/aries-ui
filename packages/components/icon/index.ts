import {App} from 'vue'
import icon from './src/icon.vue'

import  {componentInstall}    from "../../libs/utils"

export const AriIcon =  componentInstall(icon)

export default AriIcon

export * from "./src/icon"
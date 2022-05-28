import {App} from 'vue'
import icon from './src/icon.vue'

import  {componentInstall}    from "aries-ui/libs"

export const AriIcon =  componentInstall(icon)

export default AriIcon

export * from "./src/icon"
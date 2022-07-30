import {App} from 'vue'
import toast from "./src/toast.vue"
import  {componentInstall}    from "../../libs/utils"



export const AriToastVue = componentInstall(toast)

export default AriToastVue

export * from "./src/toast"

export * from "./src"
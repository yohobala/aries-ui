import {App} from 'vue'
import  {componentInstall} from "../../libs/utils"
import Switch from "./src/switch.vue"

export const AriSwitch = componentInstall(Switch, {
})

export default AriSwitch


export * from "./src/type"
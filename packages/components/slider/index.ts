import {App} from 'vue'
import  {componentInstall}    from "../../libs/utils"
import slider from "./src/slider.vue"


export const AriSilder = componentInstall(slider,{
})

export default AriSilder

export * from "./src/type"

import { App } from 'vue'
import { componentInstall } from "../../libs/utils"
import drop from "./src/drop.vue"
import dropItem from "./src/drop-item.vue"

export const AriDrop = componentInstall(drop, {
    dropItem
})

export default AriDrop

export const AriDropItem = componentInstall(dropItem)


export * from "./src/type"
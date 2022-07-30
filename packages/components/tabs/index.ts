import {App} from 'vue'
import tabs from "./src/tabs"
import tabsItem from "./src/tabs-item.vue"
import  {componentInstall}    from "../../libs/utils"

export const AriTabs = componentInstall(tabs,{
    tabsItem
})

export default AriTabs

export const AriTabsItem = componentInstall(tabsItem)


export * from "./src/tabs"
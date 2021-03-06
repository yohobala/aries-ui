import {App} from 'vue'
import  {componentInstall}    from "../../libs/utils"

import leaflet from "./src/leaflet.vue"
import leafletLocation from "./src/components/location/location.vue"
import leafletControl from "./src/components/layerControl/layerControl.vue"
import leafletButton from "./src/components/button/button.vue"


export const AriLeaflet = componentInstall(leaflet,{
    leafletLocation,
    leafletControl,
    leafletButton
})

export default AriLeaflet

export const AriLeafletLocation = componentInstall(leafletLocation)
export const AriLeafletControl = componentInstall(leafletControl)
export const AriLeafletButton = componentInstall(leafletButton)

export * from "./src/leaflet"
export * from "./src/components"

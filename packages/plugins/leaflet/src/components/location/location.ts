// import {bulidStyleProps} from "../../../libs/utils"
import { PropType } from "vue"
import { _locationProps } from "../../_props"
import { buttonProps } from "../button/button"


export const locationProps = {
    ...{
        locationIcon: {
            type: Object as PropType<L.DivIconOptions>,
            default: function () {
                return {
                    className: "my-div-icon",
                    html: `<div class="aries icon-location-fill loactionIcon"></div>`,
                    iconSize: [40, 60],
                }
            }
        },
        showLoaction: {
            type: Boolean,
            default: true
        },
    },
    ..._locationProps,
    ...buttonProps
}

export const locationEmits = {
    click: (e: Ari.Leaflet.LocationInf) => {
        return true
    },
}
import { Prop, PropType } from "vue"
import { guid } from "../../../libs/utils";
import { _locationProps } from "./_props";
import { buttonProps } from "./components/button/button";

export const leafletProps = {
    layers: {
        type: Array as PropType<Ari.Leaflet.LeafletLayer[]>,
        default: function () {
            return []
        }
    },
    zoom: {
        type: Number,
        default: 15
    },
    center: {
        type: [Array, Object] as PropType<L.LatLngExpression>,
        default: function () {
            return null
        }
    },
    showLoaction: {
        type: Boolean,
        default: true
    },
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
    ..._locationProps,
    ...buttonProps
}
export const leafletEmits = [
    'mapClick',
    'zoomChange',
    'draw',
    'drawStart'
]


export const leafletID = guid()
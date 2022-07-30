import { PropType } from "vue"

export const _locationProps = {
    /**
     * role = AriLeafletLocation的class
    **/
    locationClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    locationStyle: {
        type: Object as PropType<{ [key: string]: string }>,
        default: function () {
            return {}
        }
    },
    containerClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    containerStyle: {
        type: Object as PropType<{ [key: string]: string }>,
        default: function () {
            return {}
        }
    }
}

export const _controlProps = {
}
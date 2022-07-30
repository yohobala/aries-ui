import { PropType } from "vue"

export const buttonProps = {
    iconName: {
        type: String,
        default: ""
    },
    animationTime: {
        type: Number,
        default: 1000
    },
    iconClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    iconStyle: {
        type: Object as PropType<{ [key: string]: string }>,
        default: function () {
            return {}
        }
    },
}

export const buttonEmits = ['click']
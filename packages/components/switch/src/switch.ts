import { PropType } from "vue"
import {buildProps } from "../../../libs/utils"
export const switchProps = buildProps({
    modelValue: {
        type: [Boolean, String, Number],
        default: false,
    },
    value: {
        type: [Boolean, String, Number],
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    inlinePrompt: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    beforeChange: {
        type: Function as PropType<() => Promise<boolean> | boolean>,
    },
    activeValue: {
        type: [Boolean, String, Number],
        default: true,
    },
    inactiveValue: {
        type: [Boolean, String, Number],
        default: false,
    },
    activeIcon: {
        type: String,
        default: '',
    },
    inactiveIcon: {
        type: String,
        default: '',
    },
    activeText: {
        type: String,
        default: '',
    },
    inactiveText: {
        type: String,
        default: '',
    },
} as const)

import { UPDATE_MODEL_EVENT } from "../../../constants"

export const sliderButtonProps = {
    modelValue: {
        type: Number,
        default: 0,
    },
    vertical: {
        type: Boolean,
        default: false,
    },
    tooltipClass: {
        type: String,
        default: '',
    },
}

export const sliderButtonEmits = [UPDATE_MODEL_EVENT]
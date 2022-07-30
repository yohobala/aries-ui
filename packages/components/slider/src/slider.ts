import { CHANGE_EVENT, INPUT_EVENT, UPDATE_MODEL_EVENT } from "../../../constants";
import { PropType } from "vue";
import { Marks } from "./type";

export const silderProps = {
    modelValue: {
        type: [Number, Array] as PropType<number | number[]>,
        default: 0,
    },
    vertical: {
        type: Boolean,
        default: false
    },
    range: {
        type: Boolean,
        default: false,
    },
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 100,
    },

    height: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    formatTooltip: {
        type: Function as PropType<(val: number) => number | string>,
        default: undefined,
    },
    showTooltip: {
        type: Boolean,
        default: true,
    },
    showStops: {
        type: Boolean,
        default: false,
    },
    step: {
        type: Number,
        default: 1,
    },
    marks: Object as PropType<Marks>,
}

export const sliderEmits = [UPDATE_MODEL_EVENT, CHANGE_EVENT, INPUT_EVENT]
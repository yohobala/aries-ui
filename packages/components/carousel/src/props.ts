import { PropType } from "vue"

export const _carouselProps = {
    carouselClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    carouselStyle: {
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
    },
    indicatorsClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    indicatorsStyle: {
        type: Object as PropType<{ [key: string]: string }>,
        default: function () {
            return {}
        }
    },
    indicatorClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    indicatorStyle: {
        type: Object as PropType<{ [key: string]: string }>,
        default: function () {
            return {}
        }
    },
}


export const _carouselItemProps = {
    carouselItemClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    carouselItemStyle: {
        type: Object as PropType<{ [key: string]: string }>,
        default: function () {
            return {}
        }
    },
}
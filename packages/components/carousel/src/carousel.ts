import { ExtractPropTypes } from "vue"

export const carouselProps = {
    direction: {
        type: String,
        default: 'horizontal',
        validator(val: string) {
            return ['horizontal', 'vertical'].includes(val)
        },
    },
    type: {
        type: String,
        default: '',
        validator(val: string) {
            return ['', 'card','showcase'].includes(val)
        },
    },
    trigger: {
        type: String,
        default: 'hover',
        validator(val: string) {
            return ['hover', 'click'].includes(val)
        },
    },
    arrow: {
        type: String,
        default: 'hover',
        validator(val: string) {
            return ['always', 'hover', 'none'].includes(val)
        },
    },
    loop: {
        type: Boolean,
        default: true,
    },
    indicatorPosition: {
        type: String,
        default: ""
    },
    indicatorType: {
        type: String,
        default: 'circle',
        validator(val: string) {
            return ['circle', 'square'].includes(val)
        },
    },
    initialIndex: {
        type: Number,
        default: 0,
    },
    pauseOnHover: {
        type: Boolean,
        default: true,
    },
    intervalTime: {
        type: Number,
        default: 5000,
    },
    autoplay: {
        type: Boolean,
        default: true
    },
}

export const carouselProvideKey = "rootCarousel"
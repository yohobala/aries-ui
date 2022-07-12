import { _carouselItemProps } from "./props";

export const carouselItemProps = {
    ...{
        label: {
            type: [String, Number],
            default: '',
        },
        showcaseInterval: {
            type: Number,
            default: 12
        }
    },
    ..._carouselItemProps
}
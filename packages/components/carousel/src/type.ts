import { ExtractPropTypes, Ref } from "vue";
import { carouselProps } from "./carousel";
import { carouselItemProps } from "./carousel-item";

export type CarouselProps = ExtractPropTypes<typeof carouselProps>

export type CarouselItemProps = ExtractPropTypes<typeof carouselItemProps>

export interface CarouselProvide {
    root: Ref<HTMLElement | undefined>,
    props: CarouselProps,
    isCardType: Ref<boolean>,
    isVertical: Ref<boolean>,
    isShowcase: Ref<boolean>,
    items: Array<CarouselItemContext>,
    loop: boolean,
    addItem: (item: CarouselItemContext) => void
}

export interface CarouselItemContext {
    props: CarouselItemProps,
    translateItem: (index: number, activeIndex: number, oldIndex?: number) => void
}
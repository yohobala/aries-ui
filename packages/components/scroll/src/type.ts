import { ExtractPropTypes,Ref } from "vue"
import { scrollEmits, scrollProps } from "./scroll"

export namespace Scroll {
    export type ScrollProps = ExtractPropTypes<typeof scrollProps>
    export type ScrollEmits = typeof scrollEmits
    export type ScrollResult = {
        initY: number,
        translateY: number,
        initX: number,
        translateX: number,
        moveX: number,
        moveY: number,
        direction: string,
        e: MouseEvent | TouchEvent | null,
    }
}
export type ScrollProps = Scroll.ScrollProps
export type ScrollEmits = Scroll.ScrollEmits
export type ScrollResult = Scroll.ScrollResult

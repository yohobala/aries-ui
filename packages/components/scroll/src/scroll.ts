import { ExtractPropTypes } from "vue"

export type scrollResult = {
    initY: number,
    translateY: number,
    initX: number,
    translateX: number,
    moveX: number,
    moveY: number,
    direction: string,
    e: object | null,
}

export type point = {
    x: number,
    y: number
}

export const scrollProps = {
    scorll: {
        type: Boolean,
        default: true,
    },
    //下拉的fps，一秒多少帧
    downFps: {
        type: Number,
        default: 40
    },
    result: {
        type: Object,
        default: function () {
            return {
                initY: 0,
                translateY: 0,
                initX: 0,
                translateX: 0,
                moveX: 0,
                moveY: 0,
                direction: "",
                e: null,
            } as scrollResult
        }
    },
    stop: {
        type: Boolean,
        default: false,
    }
} as const

export type ScrollProps = ExtractPropTypes<typeof scrollProps>

export const scrollEmits = {
    start: (result: scrollResult) => true,
    move: (result: scrollResult) => true,
    end: (result: scrollResult) => true,
    toLeft: (e: any) => true,
    toRight: (e: any) => true,
    toUp: (e: any) => true,
    toDown: (e: any) => true,
}
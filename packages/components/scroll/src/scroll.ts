import { DIRECTION} from "../../../constants"
import { ExtractPropTypes } from "vue"

export const scrollProps = {
    scorll: {
        type: Boolean,
        default: true,
    },
    //下拉的fps，一秒多少帧
    downFps: {
        type: Number,
        default: 240
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
            } as Ari.Scroll.ScrollResult
        }
    },
    stop: {
        type: Boolean,
        default: false,
    }
} as const


export const scrollEmits = [DIRECTION.left,DIRECTION.right,DIRECTION.up,DIRECTION.down,"start",'move','end']
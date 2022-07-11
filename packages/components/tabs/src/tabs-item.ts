import { ExtractPropTypes } from "vue"
import { _itemProps } from "./props"

export const tabsItemProps ={
    ...{
        disabled :{
            type: Boolean,
            default: false
        },
        index:{
            type: [Number,String],
            default: ""
        },
        label:{
            type: String,
            default: ""
        },
    },
    ..._itemProps
} 


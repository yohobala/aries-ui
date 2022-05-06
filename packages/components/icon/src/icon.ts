
export const iconProps = {
    size: {
        type: [Number, String],
        default: 10
    },
    color: {
        type: String,
        default: "#FFFFFF"
    },
    //图标
    name: {
        type: [String, Array],
        default: function () {
            return ""
        }
    },
    //class
    iconClass: {
        type: [String, Array],
        default: function () {
            return ""
        }
    },
    iconStyle: {
        type: Object,
        default: function(){
            return {fontSize: "12px"}
        }
    },
} as const


export const iconEmits = {

}
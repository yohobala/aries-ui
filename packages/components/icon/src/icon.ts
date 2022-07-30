
export const iconProps = {
    size: {
        type: [Number, String],
        default: 0
    },
    color: {
        type: String,
        default: "#FFFFFF"
    },
    //图标
    iconName: {
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
            return {}
        }
    },
}


export const iconEmits = {

}
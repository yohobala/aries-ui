export const toastProps = {
  id: {
    type: String,
    default: "toast_"
  },
  toastStyle: {
    type: Object,
    default: function () {
      return {};
    },
  },
  IconViewStyle: {
    type: Object,
    default: function () {
      return {};
    },
  },
  IconActStyle: {
    type: Object,
    default: function () {
      return {};
    },
  },
  iconStyle: {
    type: Object,
    default: function () {
      return {};
    },
  },
  iconIsAct: {
    type: Boolean,
    default: true,
  },
  iconName: {
    type: String,
    default: "",
  },

  contentViewStyle: {
    type: Object,
    default: function () {
      return {};
    },
  },
  textStyle: {
    type: Object,
    default: function () {
      return {};
    },
  },
  text: {
    type: String,
    default: "提示",
  },
  close:{
    type: Boolean,
    default: false,
  },
  autoClose:{
    type: Boolean,
    default: true
  },
  duration:{
    type: Number,
    default: 1000
  },
  type:{
    type:String,
    default: "message"
  }
}
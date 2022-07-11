import { PropType } from "vue"

export const _tabsProps = {
    tabsClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    tabsStyle: {
        type: Object,
        default: function () {
            return {}
        }
    },
    wrapperClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    wrapperStyle: {
        type: Object,
        default: function () {
            return {}
        }
    },
    barClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    barStyle: {
        type: Object,
        default: function () {
            return {}
        }
    }
}

export const _barProps = {
    barClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    barStyle: {
        type: Object,
        default: function () {
            return {}
        }
    },
}

export const _itemProps = {
    itemClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    itemStyle: {
        type: Object,
        default: function () {
            return {}
        }
    },
    itemActiveClass: {
        type: Array as PropType<string[]>,
        default: function () {
            return []
        }
    },
    itemActiveStyle: {
        type: Object,
        default: function () {
            return {}
        }
    }
}
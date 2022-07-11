import { ref, defineComponent, readonly, h, provide, ExtractPropTypes, reactive, computed, watch, onMounted, } from "vue";
import type { VNode } from "vue"
import { TabsProvide } from "./types";
import { _tabsProps } from "./props"
import { cssName, isUndefined, guid } from "aries-ui/libs";
import { onClickOutside } from "@vueuse/core";
import tabsBar from "./tabs-bar.vue"
const COMPONENT_NAME = "AriTabs";
//props
export const tabsProps = {
    ...{
        defaultIndex: {
            type: [String, Number],
            default: ""
        },
        barWidth: {
            type: Number,
            default: 20
        },
        barDuration: {
            type: Number,
            default: 5
        }
    },
    ..._tabsProps
}

//emits
export const tabsEmits = [
    'update:key'
]

export default defineComponent({
    name: COMPONENT_NAME,
    props: tabsProps,
    emits: tabsEmits,

    setup(props, { emit, slots }) {
        //定义样式的根名称
        const cn = cssName("tabs");
        //定义了类型为HTMLUListElement的ref对象
        const tabs = ref<HTMLUListElement>()
        //定义activeIndex 用于确定当前活动菜单项
        const activeIndex = ref<TabsProvide['activeIndex']>(props.defaultIndex)
        //props中的值
        const tabsStyle = reactive(props.tabsStyle)
        const wrapperStyle = reactive(props.wrapperStyle)
        const barWidth = ref(props.barWidth)
        //如果slots.default()有值则赋予slot
        const slot = slots.default?.() ?? []
        //标签页宽度
        let itemWidth = ref(0);
        //滚动条离左边的默认宽度
        let barInitLeft = ref(0)
        //
        let barLeft = ref(0)
        const tabsID = guid()

        //method
        const handleTabsItemClick: TabsProvide['handleTabsItemClick'] = (tabsItem) => {
            activeIndex.value = tabsItem.index
        }
        const getDomOffsetLeft = (index: number | string): number => {
            const dom = document.getElementById(tabsID + index?.toString())
            return (dom as HTMLElement).offsetLeft
        }
        const updateBarLeft = (): void => {
            let itemIndex = 0

            if (activeIndex.value === "") {
                const index = slot[0].props?.index
                barLeft.value = getDomOffsetLeft(index)
            }
            else {

            }
            slot.map((item, index) => {
                if (item.props?.index === activeIndex.value) {
                    itemIndex = index
                    barLeft.value = getDomOffsetLeft(activeIndex.value)//itemWidth.value * itemIndex
                }
            })
        }

        //初始化宽度
        const initWidth = () => {
            const childrens = slots.default?.() ?? []
            if (childrens.length > 0) {
                let maxLength = 0
                childrens.map((children) => {
                    const label = children.props?.label ?? ""
                    const labelLength = label.length
                    maxLength = maxLength > labelLength ? maxLength : labelLength
                })
                // document.documentElement 是全局变量时
                const el = document.documentElement
                // 获取 css 变量
                const fontsize = parseFloat(getComputedStyle(el).getPropertyValue(`--ari-font-size-base`).replace('px', ''))

                itemWidth.value = fontsize * maxLength + 2
                barInitLeft.value = Math.abs(itemWidth.value - barWidth.value) / 2
            }
        }

        //
        onMounted(() => {
            updateBarLeft()
            initWidth()
        })

        //watch
        watch(activeIndex, () => {
            updateBarLeft()
        })



        //provide
        provide<TabsProvide>("rootTabs", reactive({
            props,
            activeIndex,
            itemWidth,
            barInitLeft,
            barLeft,
            tabsID,
            handleTabsItemClick,
        }))
        return () => {

            const vMoreSlots: VNode[] = []


            const vWrapper: VNode = h('div',
                {
                    class: {
                        [cn.e('wrapper')]: true,
                        [cn.e('scroll')]: true,
                        ...props.wrapperClass,
                    },
                    id: guid(),
                    style: wrapperStyle,
                    role: "AriTabsWrapper"
                }, [...slot, ...vMoreSlots, h(tabsBar, {
                    barWidth: props.barWidth,
                    barClass: props.barClass,
                    barStyle: props.barStyle
                })])

            return h("div", {
                class: {
                    [cn.b()]: true,
                    ...props.tabsClass,
                },
                style: tabsStyle,
                id: tabsID,
                role: COMPONENT_NAME
            }, vWrapper)
        }
    }
})
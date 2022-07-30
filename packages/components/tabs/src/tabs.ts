import { ref, defineComponent, readonly, h, provide, ExtractPropTypes, reactive, computed, watch, onMounted, RendererNode, RendererElement, VNodeArrayChildren, } from "vue";
import type { VNode } from "vue"
import { TabsProvide } from "./types";
import { _tabsProps } from "./props"
import { useCss } from "../../../libs/hooks";
import { isUndefined, guid, throwError } from "../../../libs/utils";
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
        const cn = useCss("tabs");
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
        const usefulSlots = reactive<any[]>([])
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
            if (activeIndex.value === "") {
                if (usefulSlots.length > 0) {
                    const firstSlot = usefulSlots[0]
                    const index: number | string = firstSlot.props.index
                    activeIndex.value = index
                    barLeft.value = getDomOffsetLeft(index)
                }
            }
            else {
                if (usefulSlots.length > 0) {
                    usefulSlots.map((item, index) => {
                        if (item.props?.index === activeIndex.value) {
                            setBarLeft(activeIndex.value)
                        }
                    })
                }
            }

        }
        const setBarLeft = (index: number | string) => {
            barLeft.value = getDomOffsetLeft(index)//itemWidth.value * itemIndex
        }
        //初始化宽度
        const initWidth = () => {
            if (usefulSlots.length > 0) {
                let maxLength = 0
                usefulSlots.map((item) => {
                    const label = item.props?.label ?? ""
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
        const initUsefulSlots = () => {
            slot.map((item, index) => {
                if (Array.isArray(item.children)) {
                    const childrenSlots = item.children
                    if (childrenSlots.length > 0) {
                        setUsefulSlots(childrenSlots)
                    }
                }
                if (item.props?.index != undefined) {
                    usefulSlots.push(item)
                }
            })
            if (usefulSlots.length == 0) {
                throwError(
                    COMPONENT_NAME,
                    `请添加index属性`
                );
            }
        }
        const setUsefulSlots = (prsentSlots: VNodeArrayChildren) => {
            prsentSlots.map(item => {
                const childrenSlots = (item as VNode<RendererNode, RendererElement>).children
                if (Array.isArray(childrenSlots)) {
                    if (childrenSlots.length > 0) {
                        setUsefulSlots(childrenSlots)
                    }
                }
                if ((item as VNode<RendererNode, RendererElement>).props?.index != undefined) {
                    usefulSlots.push(item)
                }
            })
        }

        //
        onMounted(() => {
            initUsefulSlots()
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
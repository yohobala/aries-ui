import { ref, defineComponent, readonly, h, provide, ExtractPropTypes, reactive } from "vue";
import type { VNode } from "vue"
import { MenuProvide } from "./types";

import { cssName, isUndefined } from "aries-ui/libs";

const COMPONENT_NAME = "AriMenu";

export const menuProps = {
    mode: {
        type: String,
        values: ['horizontal', 'vertical'],
        default: 'vertical'
    },
    defaultIndex:{
        type: String,
        default: ""
    }
} as const
export type MenuProps = ExtractPropTypes<typeof menuProps>

export const menuEmits = {
    
}





export default defineComponent({
    name: COMPONENT_NAME,
    props: menuProps,
    emits: menuEmits,

    setup(props, { emit, slots }) {
        //定义样式的根名称
        const cn = cssName("menu");
        //定义了类型为HTMLUListElement的ref对象
        const menu = ref<HTMLUListElement>()
        //定义activeIndex 用于确定当前活动菜单项
        const activeIndex = ref<MenuProvide['activeIndex']>(props.defaultIndex)
        

        //provide
        provide<MenuProvide>("rootMenu", reactive({
            props,
            activeIndex
        }))

        return () => {
            //如果slots.default()有值则赋予slot
            let slot = slots.default?.() ?? []
            const vMoreSlots: VNode[] = []
            if (props.mode === "horizontal" && menu.value) {
                const items: HTMLElement[] = Array.from(menu.value?.childNodes ?? []).filter(
                    (item) => item.nodeName !== '#text' || item.nodeValue
                ) as HTMLElement[]

                console.log(items)
            }
            return h('ul', {
                class: {
                    [cn.b()]: true,
                }
            }, [...slot,...vMoreSlots])
        }
    },
})
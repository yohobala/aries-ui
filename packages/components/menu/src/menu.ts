import { computed, toRefs, onMounted, ref, defineComponent, reactive, h } from "vue";
import type {VNode} from "vue"

export const menuProps = {

} as const


export const menuEmits = {

}


const COMPONENT_NAME = "aqr-menu";
import { cssName, isUndefined} from "../../../../libs";

export default defineComponent({
    name: COMPONENT_NAME,
    props: menuProps,
    emits: menuEmits,

    setup(props, { emit, slots }) {
        //设置样式的根名称
        const cn = cssName("menu");

        const readersNumber = ref(0);
        const book = reactive({ title: "Vue 3 Guide" });

        return () => {
            let slot = slots.default?.() ?? []
            const vMoreSlots: VNode[] = []

            return h('ul', { class: "test" }, [...slot])
        }
    },
})
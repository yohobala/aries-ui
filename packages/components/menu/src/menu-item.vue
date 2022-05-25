<template>
  <li
    :class="[
        cnMentItem.b(),
        cnMentItem.is('active',active),
        cnMentItem.is('disabled',disabled)
    ]"
    role="menuitem"
  >
  </li>
</template>
<script lang="ts">
import { computed, toRefs, onMounted, ref,inject,defineComponent, getCurrentInstance } from "vue";
import { cssName, isUndefined,throwError} from "../../../../libs";
import {menuItemProps} from "./menu-item"
import {MenuProvide} from "./types"

const COMPONENT_NAME = "AriMenuItem";
export default defineComponent({
  name: COMPONENT_NAME,
  props: menuItemProps,

  setup(props, { emit }) {
    const cnMentItem = cssName("menu-item");

    //访问内部组件实例
    const instance = getCurrentInstance()!
    console.log(instance)
    
    const rootMenu = inject<MenuProvide>('rootMenu')
    if(!rootMenu) throwError(COMPONENT_NAME,`不能inject"rootMenu",请添加${COMPONENT_NAME}`)
    // console.log(rootMenu.props)

    const active = computed( () => props.index === rootMenu.activeIndex)
    return {
      cnMentItem,
      active
    };
  },
});
</script>



<template>
  <i
    :class="[iconName,cn.b(), iconClass]"
    :style="style"
    v-bind="$attrs"
  >
    <slot></slot>
  </i>
</template>

<script lang="ts">
import { computed, toRefs, onMounted, ref, defineComponent } from "vue";
import type { CSSProperties } from "vue";

import { iconProps, iconEmits } from "./icon";
import { useCss } from "../../../libs/hooks";
import { isUndefined,addUnit } from "../../../libs/utils";
const COMPONENT_NAME = 'AriIcon'

export default defineComponent({
  name: COMPONENT_NAME,
  props: iconProps,
  emits: iconEmits,

  setup(props, { emit }) {
    //设置样式的根名称
    const cn = useCss("icon");
    //得到默认尺寸
    const { size } = toRefs(props);
    const { color } = toRefs(props);
    const { iconStyle } = toRefs(props);
    const style = computed<CSSProperties>(() => {
      if (!size.value && !color.value && !iconStyle.value) return {};

      let re = {
        "fontSize": isUndefined(props.size) ? undefined : addUnit(props.size),
        "--color": props.color,
      };
      if (!iconStyle.value) {
        return re;
      } else {
        return Object.assign(re, iconStyle.value);
      }
    });
    return {
      cn,
      style,
    };
  },
});
</script>
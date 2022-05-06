<template>
  <i
    :class="[cn.b(), name, iconClass]"
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
import { cssName,isUndefined,addUnit } from "../../../../libs";

const COMPONENT_NAME = 'aqr-icon'

export default defineComponent({
  name: COMPONENT_NAME,
  props: iconProps,
  emits: iconEmits,

  setup(props, { emit }) {
    //设置样式的根名称
    const cn = cssName("icon");
    //得到默认尺寸
    const { size } = toRefs(props);
    const { color } = toRefs(props);
    const { iconStyle } = toRefs(props);
    console.log(size.value, color.value, iconStyle.value);
    const style = computed<CSSProperties>(() => {
      if (!size.value && !color.value && !iconStyle.value) return {};

      let re = {
        fontSize: isUndefined(props.size) ? undefined : addUnit(props.size),
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
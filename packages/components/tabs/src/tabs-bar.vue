<template>
  <div
    :key="dividerKey"
    :name="'tabs-divider' + guid()"
    :class="[cnBar.b(), ...barClass]"
    :style="[vBarStyle,barStyle]"
    :role="COMPONENT_NAME"
  ></div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, inject, computed, reactive } from "vue";

import { useCss} from "../../../libs/hooks";
import { isUndefined, guid, throwError } from "../../../libs/utils";
import { tabsBarProps } from "./tabs-bar";
import { TabsProvide } from "./types";

const COMPONENT_NAME = "AriTabsBar";
export default defineComponent({
  props: tabsBarProps,
  setup(props, { emit }) {
    const dividerKey = ref(0);
    const cnBar = useCss("tabs-bar");
    //inject
    const rootTabs = inject<TabsProvide>("rootTabs") as TabsProvide;
    if (!rootTabs)
      throwError(
        COMPONENT_NAME,
        `不能inject"rootTabs",请添加${COMPONENT_NAME}`
      );

    /*--- vDivider ---*/
    const transform = computed(() => rootTabs.barInitLeft + rootTabs.barLeft);
    const vBarStyle = reactive({
      width: props.barWidth + "px",
      transform: `translateX(${transform}px)`,
      // // 滑块在页面渲染后第一次滑动时，无需动画效果
      // 'transition-duration': dividerDuration.value + 's',
    });
    watch(transform, () => {
      vBarStyle.transform = `translateX(${transform.value}px)`;
    });
    return {
      COMPONENT_NAME,
      dividerKey,
      guid,
      cnBar,
      vBarStyle,
    };
  },
});
</script>

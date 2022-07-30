<template>
  <div
    :name="COMPONENT_NAME"
    :id="itemID"
    :class="[
      cnTabsItem.b(),
      cnTabsItem.is('active',active),
      cnTabsItem.is('disabled',disabled),
      active ? [...itemActiveClass] : [],
      [...itemClass]
    ]"
    :style="[
      active ? itemActiveStyle : '',
      itemStyle,
      {width: itemWidth + 'px'}
    ]"
    :role="COMPONENT_NAME"
    @click="handleClick"
  >{{label}}
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { useCss } from "../../../libs/hooks";
import { throwError } from "../../../libs/utils";
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  reactive,
} from "vue";
import { tabsItemProps } from "./tabs-item";
import { TabsItemRegistered, TabsProvide } from "./types";

const COMPONENT_NAME = "AriTabsItem";
export default defineComponent({
  name: COMPONENT_NAME,
  props: tabsItemProps,
  setup(props, { emit, slots }) {
    //定义样式的根名称
    const cnTabsItem = useCss("tabs-item");
    //访问内部组件实例
    const instance = getCurrentInstance()!;
    //inject
    const rootTabs = inject<TabsProvide>("rootTabs") as TabsProvide;
    if (!rootTabs)
      throwError(
        COMPONENT_NAME,
        `不能inject"rootTabs",请添加${COMPONENT_NAME}`
      );
    //id
    const itemID = rootTabs.tabsID + props.index;

    //当前items是否是活动状态
    const active = computed(() => props.index === rootTabs.activeIndex);

    //宽度
    const itemWidth = computed(() => rootTabs.itemWidth);

    //
    const item: TabsItemRegistered = reactive({
      index: props.index,
    });
    const handleClick = () => {
      if (!props.disabled) {
        rootTabs.handleTabsItemClick({
          index: props.index,
        });
        emit("click", item);
      }
    };
    return {
      COMPONENT_NAME,
      cnTabsItem,
      active,
      itemWidth,
      itemID,
      handleClick,
    };
  },
});
</script>

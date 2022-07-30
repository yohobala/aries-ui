<template>
  <div
    ref="button"
    :class="[cn.b(), { hover: hovering, dragging }]"
    :style="wrapperStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="onButtonDown"
    @touchstart="onButtonDown"
    @focus="handleMouseEnter"
    @blur="handleMouseLeave"
    @keydown="onKeyDown"
  >
    <div :class="[cn.e('button'), { hover: hovering, dragging }]" />
  </div>
</template>
<script lang="ts">
import { useCss } from "../../../libs/hooks";
import { defineComponent, reactive, toRefs } from "vue";
import { sliderButtonEmits, sliderButtonProps } from "./button";
import { useSliderButton } from "./useSliderButton";
const COMPONENT_NAME = "AriSliderButton";
export default defineComponent({
  name: COMPONENT_NAME,
  props: sliderButtonProps,
  emits: sliderButtonEmits,
  setup(props, { emit }) {
    const cn = useCss("slider-button");
    const initData = reactive({
      hovering: false,
      dragging: false,
      isClick: false,
      startX: 0,
      currentX: 0,
      startY: 0,
      currentY: 0,
      startPosition: 0,
      newPosition: 0,
      oldValue: props.modelValue,
    });

    const {
      button,
      tooltip,
      showTooltip,
      tooltipVisible,
      wrapperStyle,
      handleMouseEnter,
      handleMouseLeave,
      onButtonDown,
      onKeyDown,
      setPosition,
    } = useSliderButton(props, initData, emit);

    const { hovering, dragging } = toRefs(initData);

    return {
      cn,
      setPosition,
      button,
      onButtonDown,
      wrapperStyle,
      handleMouseEnter,
      handleMouseLeave,
      tooltip,
      showTooltip,
      tooltipVisible,
      onKeyDown,

      hovering,
      dragging,
    };
  },
});
</script>

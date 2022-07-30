<template>
  <div
    :class="cn.b()"
    @click="onClick"
  >
    <div :class="cn.e('container')">
      <ari-icon
        :iconClass="[cn.e('icon'),iconClass]"
        :style="iconStyle"
        :role="COMPONENT_NAME + 'Icon'"
        :icon-name="iconName"
      ></ari-icon>
      <slot></slot>
    </div>
    <ari-animation
      :class="cn.e('animation')"
      v-if="showRipple"
      effect="ripple"
    ></ari-animation>

  </div>
</template>
<script lang="ts">
import { useCss } from "../../../../../libs/hooks";
import { defineComponent, ref } from "vue";
import { buttonEmits, buttonProps } from "./button";

const COMPONENT_NAME = "AriLeafletButton";
export default defineComponent({
  name: COMPONENT_NAME,
  props: buttonProps,
  emits: buttonEmits,
  setup(props, { emit }) {
    const cn = useCss("leaflet-button");
    const showRipple = ref(false);
    const animationTime = ref(props.animationTime);
    const onClick = () => {
      emit("click");

      showRipple.value = true;
      setTimeout(() => {
        showRipple.value = false;
      }, animationTime.value);
    };
    return {
      cn,
      COMPONENT_NAME,
      onClick,
      showRipple,
    };
  },
});
</script>

<template>
  <ari-leaflet-button
    :class="[cn.e('button')]"
    iconName="aries icon-tuceng"
    @click="onButClick"
  >
  </ari-leaflet-button>
  <ari-side v-model="showSide">

  </ari-side>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useCss } from "../../../../../libs/hooks";
import { controlProps } from "./leaflet-layerControl";

const COMPONENT_NAME = "AriLeafletLayerControl";
export default defineComponent({
  name: COMPONENT_NAME,
  props: controlProps,
  setup(props, { emit }) {
    const cn = useCss("leaflet-layerControl");
    const showSide = ref(false);


    const onButClick = () => {
      showSide.value = true;
    };
    return {
      cn,
      showSide,
      onButClick,
      COMPONENT_NAME,
    };
  },
});
</script>

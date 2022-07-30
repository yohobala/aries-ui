<template>
  <ari-leaflet-button
    :class="[cn.b(),locationClass]"
    :style="locationStyle"
    :role="COMPONENT_NAME"
    iconName="aries icon-location"
    :iconClass="cn.e('icon')"
    @click="moveTo">
  </ari-leaflet-button>
</template>
<script lang="ts">
/*--- 第三方引用 --- */
import { leafletProvideKey } from "../../../../../keys";
import { useCss } from "../../../../../libs/hooks";
import { throwError } from "../../../../../libs/utils";
import { defineComponent, inject, ref } from "vue";
import { LeafletProvide, LocationInf } from "../../type";
import { locationEmits, locationProps } from "./leaflet-location";

const COMPONENT_NAME = "AriLeafletLocation";

export default defineComponent({
  name: COMPONENT_NAME,
  props: locationProps,
  emits: locationEmits,
  setup(props, { emit, slots }) {
    /*--- 通用变量 --- */
    const cn = useCss("leaflet-location");

    /*--- ref --- */

    /*--- inject --- */
    const rootLeaflet = inject<LeafletProvide>(leafletProvideKey)!;
    if (!rootLeaflet)
      throwError(
        COMPONENT_NAME,
        `不能inject${leafletProvideKey},请添加${COMPONENT_NAME}`
      );

    /*--- method --- */
    const moveTo = () => {
      const locationInf = rootLeaflet.location_toLocation();
      emit("click", locationInf);
    };
    return {
      COMPONENT_NAME,
      cn,
      moveTo,
    };
  },
});
</script>

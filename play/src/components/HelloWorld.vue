<template>
  <!-- <ari-switch v-model="value"></ari-switch> -->
  <!-- <ari-slider
    :range="true"
    show-stops
    :step="10"
    v-model="value"
    :marks="marks"
  ></ari-slider> -->
  <div>
    <ari-leaflet
      class="map"
      ref="leafletMap"
      :zoom="zoom"
      :layers="layers"
      @mapClick="click"
      @drawStart="test"
      @zoomChange="test"
    >
      <ari-leaflet-location containerClass="test" @click="test">
      </ari-leaflet-location>
      <ari-leaflet-layer-control v-model="layerControlShow"></ari-leaflet-layer-control>
    </ari-leaflet>
  </div>
  <!-- <ari-drop>
    <ari-drop-item>测试1</ari-drop-item>
    <ari-drop-item>测试2</ari-drop-item>
    <ari-drop-item>测试3</ari-drop-item>
    <ari-drop-item>测试4</ari-drop-item>
    <ari-drop-item>测试5</ari-drop-item>
  </ari-drop> -->

  <!-- <div
    class="button"
    @click="buttonclick"
  >
  </div> -->
<!-- 
  <ari-side
    v-model="test2"
    v-if="test"
  >
  </ari-side> -->
</template>
<script lang="ts" setup >
import { AriToast } from "../../../init";
import { defineComponent, onMounted, reactive, ref, Ref, watch } from "vue";
import * as L from "leaflet";
import { throwError } from "../../../packages/libs/utils";
import { LeafletExpose } from "aries-ui/plugins/leaflet";
 
defineProps({
  modelValue: String,
});
defineEmits(["update:modelValue"]);
const leafletMap = ref<LeafletExpose>();
//地图设置
const zoom = ref(15);

const _layers = {
  tianditu_img_c: L.tileLayer(
    //"http://t0.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={x}&TILECOL={y}&tk="
    `http://t0.tianditu.com/DataServer?T=img_c&x={x}&y={y}&l={z}&tk=0cc143ee0d847794cee0d99fd7c170be`,
    {
      zoomOffset: 1, //缩放偏移，很重要
      zIndex: 1,
      id: "2311",
    }
  ),
  tianditu_cia_c: L.tileLayer(
    `http://t0.tianditu.com/DataServer?T=cia_c&x={x}&y={y}&l={z}&tk=0cc143ee0d847794cee0d99fd7c170be`,
    {
      zoomOffset: 1, //缩放偏移，很重要
      zIndex: 0,
      id: "32312",
    }
  ),
};
const layers = [_layers.tianditu_img_c, _layers.tianditu_cia_c];
const click = (e: L.LeafletMouseEvent) => {};
const buttonclick = (e) => {
  // _layers.tianditu_cia_c.setZIndex(1);
  const test = leafletMap?.value.addLayers;

  test.value = !test.value;
};

const test = ref(false);
const layerControlShow= ref(true);
</script>

<style lang="scss" scoped>
.test {
  background-color: aqua;
}
.map {
  height: calc(100vh);
  width: calc(100vw);
}
.button {
  height: 50px;
  width: 50px;
  position: absolute;
  z-index: 1;
  bottom: 0;
  background-color: aqua;
}
</style>
<template>
  <template v-if="true">
    <div
      :id="leafletID"
      :class="cn.b()"
    >
    </div>
    <slot></slot>
  </template>
</template>
<script lang="ts">
/*--- 第三方引用 --- */
//leaflet地图框架引入
import "leaflet/dist/leaflet.css";
// 引入Leaflet对象 挂载到Vue上，便于全局使用，也可以单独页面中单独引用
import L from "leaflet";
//leaflet 插件
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import {
  defineComponent,
  onMounted,
  defineProps,
  defineEmits,
  defineExpose,
  watch,
  reactive,
  ref,
  Ref,
  provide,
  inject,
  getCurrentInstance,
} from "vue";
/*--- 本地引用 --- */
import { leafletProps, leafletEmits, leafletID } from "./leaflet";
import type {
  LocationInf,
  Geolocation,
  LeafletProvide,
  LeafletMap,
  LeafletExpose,
  LocationMethod,
  MapMethod,
  LayerMethod,
} from "./type";
import { EmitsDraw, PmDrawStart } from "./type";
import { useCss } from "../../../libs/hooks";
import { useLocation, useMap, useLayer } from "./hooks";
import { leafletProvideKey } from "../../../keys";

/*--- 初始化 --- */
const COMPONENT_NAME = "AriLeaflet";

export default defineComponent({
  name: COMPONENT_NAME,
  props: leafletProps,
  emits: leafletEmits,
  setup(props, { emit, attrs, slots, expose }) {
    /*--- 通用变量 --- */
    const cn = useCss("leaflet");

    /*--- refs --- */
    // //地图
    // const map: Ref<Map | null> = ref(null);

    /*--- 地图 --- */
    const {
      mapCenter,
      map,

      initMap,
      setCenter,
      setZoom,

      mapMethod,
    } = useMap(props, slots, emit);

    const {
      layers,
      layerGroups,

      addLayers,
      resetLayer,
    } = useLayer(props);

    /*--- 坐标 --- */
    const {
      location,
      locationMark,
      locationIcon,
      locationOpen,
      showLoaction,

      drawLoaction,
      moveToLocation,

      locationMethod,
    } = useLocation(props, slots);

    /*--- 图层 --- */
    const layer_addLayers = (layers: L.Layer[]) => {
      addLayers(layerGroup, layers);
    };
    // --- 设置图层
    const layer_resetLayer = () => {
      resetLayer(map, layerGroup, props.layers);
    };

    /*--- pm,地图绘制功能 --- */
    const initPm = (_map: Map) => {
      // 设置绘制后的线条颜色等
      _map.pm.setPathOptions({
        color: "rgba(15, 128, 255, 1.0)",
        fillColor: "rgba(102, 204, 255, 0.8)",
        fillOpacity: 0.4,
      });

      //设置pm语言
      _map.pm.setLang("zh"); //设置语言  en, de, it, ru, ro, es, fr, pt_br, zh , nl

      pmListen(_map);
    };
    //pm的事件监听
    const pmListen = (_map: Map) => {
      //绘制开始的时候调用的
      _map.on("pm:drawstart", (e: PmDrawStart) => {
        emit("drawStart", e);
        const result: EmitsDraw<PmDrawStart> = {
          e,
          type: "drawstart",
        };
        emit("draw", result);
      });
      //绘制结束的时候调用
      _map.on("pm:drawend", (e) => {
        var end = {
          e: e,
        };
      });
      //创建完成的时候调用
      _map.on("pm:create", (e) => {
        console.log(e);
        //如果是直线，完成后就禁止编辑
        e.layer.pm.enable({
          allowSelfIntersection: false,
          preventMarkerRemoval: false, // 禁止右键删除点
        });

        //拖动时调用
        e.layer.on("pm:edit", (e) => {
          console.log(e);
        });
        //添加顶点
        e.layer.on("pm:vertexadded", (e) => {
          console.log(e, "添加顶点");
        });
        //剪切的时候调用
        e.layer.on("pm:cut", (e) => {
          console.log(e, "切割");
        });
      });
    };

    /*--- lifecycle --- */
    onMounted(() => {
      console.log("到这2");
      // //因为启动定位权限有延迟，所以需要一个定时执行，当定位开启后再执行mounted方法，
      // //同时为了避免一直不开启，当执行60次后直接执行mounted方法
      // let count = 1;
      // const loadingLactionOpen = setInterval(() => {
      //   if (count === 30) {
      //     clearInterval(loadingLactionOpen);
      //     mounted();
      //   }
      //   if (locationOpen.value) {
      //     clearInterval(loadingLactionOpen);
      //     mounted();
      //   } else {
      //     count += 1;
      //   }
      // }, 100);
    });
    const mounted = () => {
      //初始化默认定位到当前gps位置
      mapCenter.value =
        mapCenter.value || ([location.lat, location.lng] as L.LatLngTuple);
      layer_resetLayer();
      initMap();
      if (showLoaction.value) {
        drawLoaction();
      }
    };

    provide<LeafletProvide>(leafletProvideKey, {
      map,
      locationMark,
      layers,
      layerGroups,

      setCenter,
      moveToLocation,
    });


    expose(<LeafletExpose>{
      map,
      location,
      ...layerMethod,
      ...mapMethod,
      ...locationMethod,
    });

    return {
      leafletID,
      cn,
    };
  },
});
</script>

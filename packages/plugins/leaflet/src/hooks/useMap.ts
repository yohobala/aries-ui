import { leafletProvideKey } from "../../../../keys";
import { throwError } from "../../../../libs/utils";
import L from "leaflet";
import { ComponentInternalInstance, inject, onMounted, ref, Ref, watch } from "vue";
import { leafletID } from "../leaflet";



export const useMap = (
    leafletProps: Ari.Leaflet.LeafletProps,
    slot: Readonly<ComponentInternalInstance['slots']>,
    emit: ComponentInternalInstance['emit']
) => {
    //inject
    const rootLeaflet = inject<Ari.Leaflet.LeafletProvide>(leafletProvideKey)!
    // if (!rootLeaflet) {
    //     throwError(
    //         "useMap",
    //         `不能inject rootLeaflet,请添加AriLeaflet`
    //     );
    // }

    //地图中心
    const mapCenter: Ref<L.LatLngExpression> = ref(leafletProps.center);
    const zoom = ref(leafletProps.zoom);
    //地图
    const map: Ref<Ari.Leaflet.LeafletMap | null> = ref(null);

    const { layerGroups } = rootLeaflet

    /*--- watch --- */
    watch(
        (): number => leafletProps.zoom,
        (): void => {
            console.log("zoom改变:" + leafletProps.zoom);
            setZoom(zoom.value);
        }
    );
    watch(
        () => leafletProps.center,
        () => {
            setCenter(leafletProps.center);
        }
    );

    /*--- methods --- */
    //--- 地图点击
    const mapClick = (e: L.LeafletMouseEvent): void => {
        emit("mapClick", e);
    };
    const mapZoom = (e: L.LeafletEvent): void => {
        const _zoom = map.value?.getZoom();
        if(_zoom){
            emit("zoomChange", _zoom);
        }   
    };

    const initMap = (): void => {
        map.value = L.map(leafletID, {
            minZoom: 1,
            maxZoom: 19,
            center: mapCenter.value, // 地图中心
            zoom: zoom.value, //缩放比列
            zoomControl: false, //禁用 + - 按钮
            doubleClickZoom: false, // 禁用双击放大
            attributionControl: false, // 移除右下角leaflet标识
            crs: L.CRS.EPSG4326,
            // preferCanvas: true    //使用canvas模式渲染矢量图形
        });

        //监听
        map.value.on("click", (e: L.LeafletMouseEvent): void => {
            mapClick(e);
        });

        map.value.on("zoomend", (e: L.LeafletEvent): void => {
            mapZoom(e);
        });

        //刻度条
        L.control
            .scale({
                maxWidth: 200,
                metric: true,
                imperial: false,
            })
            .addTo(map.value);
        // initPm(map.value);
    };

    /**
     * 设置地图中心,同时地图到移动到该中心
     * @param center 设置的地图中心
    **/
    const setCenter = (center: L.LatLngExpression) => {
        if (map.value) {
            let zoom = map.value.getZoom();
            mapCenter.value = center;
            map.value.flyTo(mapCenter.value, zoom, {
                animate: true,
                duration: 0.25,
            });
        }
    }

    /**
     * 设置地图缩放登记
     * @param zoom 缩放等级
     **/
    const setZoom = (zoom: number): void => {
        if (map.value != null) {
            map.value.setZoom(zoom);
        }
    };

    /*--- lifecycle --- */
    onMounted(() => {
        console.log("到这")
    })


    const mapMethod: Ari.Leaflet.MapMethod = {
        setCenter: setCenter,
        setZoom: setZoom,
    };
    return {
        mapCenter,
        map,

        initMap,
        setCenter,
        setZoom,


        mapMethod
    }
}
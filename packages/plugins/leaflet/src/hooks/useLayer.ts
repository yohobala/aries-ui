import { LeafletDefaultLayerGroup, leafletProvideKey } from "../../../../keys";
import { throwError } from "../../../../libs/utils";
import L from "leaflet";
import { computed, inject, reactive, Ref, ref, toRef, toRefs } from "vue";
import { LayerMethod, LeafletLayer, LeafletLayerGroup, LeafletMap, LeafletProps, LeafletProvide } from "../type";


export const useLayer = (
    leafletProps: LeafletProps,

) => {
    //inject
    const rootLeaflet = inject<LeafletProvide>(leafletProvideKey)!

    //图层
    // const layers= ref<LeafletLayer[]>(leafletProps.layers);
    //图层组
    const layerGroups: Ref<LeafletLayerGroup[]> = ref([{
        name: LeafletDefaultLayerGroup.name,
        key: LeafletDefaultLayerGroup.key,
        layers: [],
        layerGroup: null
    }]);
    const _map = rootLeaflet?.map
    const _leafletIds = ref<Array<number>>([])
    const _optionsIds = ref<Array<string>>([])

    const _layers = computed(()=> {
        return leafletProps.layers
    })


    const getLayerGroup = (layerGroupKey: string | number): LeafletLayerGroup | undefined => {
        for (let i = 0; i <= layerGroups.value.length - 1; i++) {
            const layerGroup = layerGroups.value[i]
            if (layerGroup.key === layerGroupKey) {
                return layerGroup
            }
        }

        return undefined
    }


    /**
    * 往图层组中添加图层.在layer中的options设置id字段,可以判断是否是重复图层,如果重复不添加.如果options无id字段则默认不重复
    * @param layers 图层
    * @param layerGroupKey 图层组的key
    **/
    const addLayers = (layers: LeafletLayer[], layerGroupKey: string | number = LeafletDefaultLayerGroup.key): number[] => {
        const leafletIds: number[] = []
        const _group = getLayerGroup(layerGroupKey)
        if (!_group) {
            throwError(
                "AriLeaflet",
                `addLayers调用失败,无该图层组`
            );
        }
        else {
            //天地图图组
            layers.map((_l, index) => {
                const leaflet_id = _group.layerGroup ? _group.layerGroup.getLayerId(_l.layer) : -1
                const options_id = _l.layer.options.id
                if (leaflet_id >= 0) {
                    _leafletIds.value.push(leaflet_id)
                    leafletIds.push(leaflet_id)
                }
                if (_group.layerGroup == null) {
                    _group.layerGroup = L.layerGroup([_l.layer])
                }
                else if (options_id) {
                    if (_optionsIds.value.indexOf(options_id) == -1) {
                        _group.layerGroup.addLayer(_l.layer);
                    }
                    _optionsIds.value.push(options_id)
                }
                else {
                    _group.layerGroup.addLayer(_l.layer);
                }

            })
        }

        return leafletIds
    };

    /**
     * 重置图层,先清空当前图层组的全部图层,再把图层添加图层组,最后把图层组添加到地图上
     * @param layers 图层
     * @param layerGroupKey 图层组的key
     **/
    const resetLayer = (layers: LeafletLayer[] = _layers.value, layerGroupKey: string | number = LeafletDefaultLayerGroup.key): number[] => {
        const _group = getLayerGroup(layerGroupKey)
        if (!_group) {
            throwError(
                "AriLeaflet",
                `addLayers调用失败,无该图层组`
            );
        }
        if (_group!.layerGroup != null) {
            _group!.layerGroup.clearLayers();
        }
        const leafletIds: number[] = addLayers(layers,layerGroupKey)
            
        if (_map.value != null) {
            if (_group!.layerGroup != null)
                _group!.layerGroup.addTo(_map.value);
        }
        return leafletIds
    };

    const layerMethod: LayerMethod = {
        addLayers: addLayers,
        resetLayer: resetLayer,
      };
    return {
        layers,
        layerGroups,

        addLayers,
        resetLayer,

        layerMethod
    }
}
import { type } from "os";
import { ExtractPropTypes, Ref } from "vue";
import { leafletProps, leafletEmits } from "./leaflet";
import { locationEmits, locationProps } from "./components/location/leaflet-location"
import { iteratee } from "lodash-unified";
export namespace Leaflet {
    export type LeafletProps = ExtractPropTypes<typeof leafletProps>
    export type LeafletEmits = typeof leafletEmits
    export type LeafletProvide = {
        map: Ref<LeafletMap | null>,
        locationMark: Ref<L.Marker | null>,
        layers: Ref<LeafletLayer>[],
        layerGroups: Ref<LeafletLayerGroup[]>,

        setCenter: (center: L.LatLngExpression) => void,
        moveToLocation: () => LocationInf
    }
    export interface LeafletExpose extends LayerMethod, MapMethod, LocationMethod {
        map: Ref<LeafletMap | null>,
        location: LocationInf,
    }
    export type LeafletLocationProps = ExtractPropTypes<typeof locationProps>
    export type LeafletLocationEmits = typeof locationEmits
    export interface LeafletMap extends L.Map {
        pm?: any
    }
    export interface LeafletLayer {
        layer: L.Layer,
        name: string,
        zIndex: number,
    }
    export interface LeafletLayerGroup {
        name: string,
        key: string|number
        layers: LeafletLayer[],
        layerGroup: L.LayerGroup | null,
    }
    export type LocationInf = {
        /**
         * 绘制定位图标
        **/
        lat: number,
        lng: number,
        altitude: number | null,
        open: boolean,
        gravity: {
            alpha: number,
            beta: number,
            gamma: number,
        }
    }
    export interface Geolocation {
        location: LocationInf,
        init: () => void
    }
    export interface EmitsDraw<T = any> {
        e: T,
        type: string
    }
    export interface PmDrawStart {
        shape: string,
        workingLayer: L.Layer
    }
    export interface LayerMethod {
        /**
         * 往图层组中添加图层
         **/
        addLayers: (layers: LeafletLayer[], layerGroupKey: string | number) =>  number[],

        /**
         * 重置图层,先清空当前图层组的全部图层,再把props.layers中的图层添加到图层组,最后把图层组添加到地图上
         **/
        resetLayer: (_layers:LeafletLayer[],layerGroupKey: string | number) => number[],
    }
    export interface MapMethod {

        /**
         * 设置地图中心,同时地图到移动到该中心
         * @param center 设置的地图中心
         **/
        setCenter: (center: L.LatLngExpression) => void
        /**
         * 设置地图缩放登记
         * @param zoom 缩放等级
         **/
        setZoom: (zoom: number) => void
    }
    export interface LocationMethod {
        /**
       * 地图移动到当前定位
       **/
         moveToLocation: () => LocationInf,
        /**
         * 绘制定位图标
        **/
         drawLocation: () => void
    }
}
export type LeafletProps = Leaflet.LeafletProps
export type LeafletEmits = Leaflet.LeafletEmits
export type LeafletProvide = Leaflet.LeafletProvide
export type LeafletExpose = Leaflet.LeafletExpose
export type LeafletLocationProps = Leaflet.LeafletLocationProps
export type LeafletLocationEmits = Leaflet.LeafletLocationEmits
export type LeafletMap = Leaflet.LeafletMap
export type LeafletLayer = Leaflet.LeafletLayer
export type LeafletLayerGroup = Leaflet.LeafletLayerGroup
export type LocationInf = Leaflet.LocationInf
export type Geolocation = Leaflet.Geolocation
export type EmitsDraw = Leaflet.EmitsDraw
export type PmDrawStart = Leaflet.PmDrawStart
export type LayerMethod = Leaflet.LayerMethod
export type MapMethod = Leaflet.MapMethod
export type LocationMethod = Leaflet.LocationMethod






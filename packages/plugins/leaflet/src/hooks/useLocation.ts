import { ref, reactive, Ref, provide, inject, watch, ComponentInternalInstance } from "vue"
import { LocationInf, Geolocation } from "../../../../type/src/leaflet"
import { setProperty, throwError } from "../../../../libs/utils"
import { leafletID } from "../leaflet"
import L from "leaflet";
import { leafletProvideKey } from "../../../../keys";

export class geolocation<Geolocation> {
    declare public location: LocationInf;
    constructor() {
        this.init()
    }
    init() {
        // if ("geolocation" in navigator) {
        //     let res = { lat: "", lng: "", altitude: "" }
        //     navigator.geolocation.getCurrentPosition((e) => {
        //         console.log(e)
        //         res.lat = e.coords.latitude
        //         res.lng = e.coords.longitude
        //         res.altitude = e.coords.altitude
        //     });

        //     this.location = new Proxy(res, {
        //         //targetObj是目标对象
        //         //propoty是设置的属性
        //         //receiver是代理对象proxy
        //         get(targetObj, propoty, receiver) {
        //             return targetObj[propoty];
        //         },
        //         //value是设置的值
        //         set(targetObj, property, value, receiver) {
        //             if (property === "lat" || property === "lng" || property === "altitude") {
        //                 return Reflect.set(targetObj, property, value);
        //             }
        //             else {
        //                 throw ("无效的属性")
        //             }
        //         },
        //     })

        //     navigator.geolocation.watchPosition((e) => {
        //         this.location.lat = e.coords.latitude
        //         this.location.lng = e.coords.longitude
        //         this.location.altitude = e.coords.altitude
        //     });
        // } else {
        //     throw ("定位不可用")
        // }

        if ("geolocation" in navigator) {
            const initLocation: LocationInf = { lat: <number>0, lng: <number>0, altitude: <number>0, open: <boolean>true, gravity: { alpha: 0, beta: 0, gamma: 0 } }
            this.location = reactive(initLocation)
            navigator.geolocation.getCurrentPosition((e) => {
                this.location.lat = e.coords.latitude
                this.location.lng = e.coords.longitude
                this.location.altitude = e.coords.altitude

            }, ((e) => {
            }));
            navigator.geolocation.watchPosition((e) => {
                this.location.lat = e.coords.latitude
                this.location.lng = e.coords.longitude
                this.location.altitude = e.coords.altitude
            });

            window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
                this.location.gravity.alpha = e.alpha ?? 0
                this.location.gravity.beta = e.beta ?? 0
                this.location.gravity.gamma = e.gamma ?? 0
                console.log(this.location.gravity.alpha)
                if (this.location.gravity.alpha) {
                    const dom = document.getElementById(leafletID)
                    if (dom) {
                        setProperty(dom, "--ari-leaflet-rotate", `rotate(${this.location.gravity.alpha}deg)`)
                    }
                    else {
                        throwError(
                            '--ari-leaflet-rotate',
                            `不能初始化方位角,请添加leafletID`
                        );
                    }

                }
            }, false);
        } else {
            const initLocation: LocationInf = { lat: 0, lng: 0, altitude: 0, open: false, gravity: { alpha: 0, beta: 0, gamma: 0 } }
            this.location = reactive(initLocation)
            throw ("定位不可用")
        }

    }

}

export const useLocation = (
    leafletProps: Ari.Leaflet.LeafletProps,
    slot: Readonly<ComponentInternalInstance['slots']>,
    locationProps?: Ari.Leaflet.LeafletLocationProps,
) => {
    //定位权限
    const permission: Geolocation = new geolocation();
    //位置信息
    const location: LocationInf = permission.location;
    //inject
    const rootLeaflet = inject<Ari.Leaflet.LeafletProvide>(leafletProvideKey)!
    // if (!rootLeaflet) {
    //     throwError(
    //         "rootLeaflet",
    //         `不能injectrootLeaflet,请添加AriLeaflet`
    //     );
    // }

    const map: Ref<Ari.Leaflet.LeafletMap | null> = rootLeaflet?.map

    //定位点图片样式
    const locationIcon: Ref<L.DivIconOptions> = locationProps ? ref(locationProps.locationIcon) : ref(leafletProps.locationIcon)
    const showLoaction = locationProps ? ref(locationProps.showLoaction) : ref(leafletProps.locationIcon)
    //尝试定位开启是否完成，因为开启定位权限会有延迟，所以增加这个变量并监测，进行判断是否完成
    const locationOpen = ref(false);
    //定位在地图上的标记
    const locationMark: Ref<L.Marker | null> = rootLeaflet?.locationMark ?? ref(null)

    watch(location, (newVal, oldVal) => {
        locationOpen.value = true;
        if (showLoaction.value) {
            drawLoaction();
        }
    });

    const drawLoaction = (latlng: L.LatLngTuple = [location.lat, location.lng]) => {
        //添加定位标记
        let icon = L.divIcon(locationIcon.value);
        if (locationMark.value != null) {
            locationMark.value.setLatLng(latlng);
        } else {
            if (map.value != null) {
                locationMark.value = L.marker(latlng, {
                    icon: icon,
                });
                locationMark.value.addTo(map.value);
            }
        }
    }
    const moveToLocation = (): Ari.Leaflet.LocationInf => {
        if(rootLeaflet){
            rootLeaflet.setCenter([location.lat, location.lng]);
        }
        return location;
    };


    const locationMethod: Ari.Leaflet.LocationMethod = {
        moveToLocation: moveToLocation,
        drawLocation: drawLoaction,
    };

    return {
        location,
        locationMark,
        locationIcon,
        locationOpen,
        showLoaction,

        drawLoaction,
        moveToLocation,

        locationMethod
    }
}
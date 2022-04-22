
import {App} from 'vue'

import utils from './libs/utils'
import store from './libs/store/store'

import aqr_icon from "./packages/components/aqr-icon"

const api = {
    utils : utils
}

const components = [aqr_icon]

export default {
    install(app: App){
        //组件注册
        components.map(item => {
            app.use(item)
        })
        
        //共享状态
        app.use(store)

        //全局变量
        app.config.globalProperties.aqrui = api
        //测试
    }
}
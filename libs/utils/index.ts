import { def } from '@vue/shared'
import { App } from 'vue'



function install(Vue, options) {

}

function on(event, callback) {
	console.log("测试")
}


const utils = function utils() {

}

utils.install = install
utils.on = on
export default utils

export * from "./dom"
export * from "./vue"
export * from "./types"


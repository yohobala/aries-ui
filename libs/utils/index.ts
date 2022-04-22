import { def } from '@vue/shared'
import { App } from 'vue'
import {
	isArray,
		isFunction,
		isObject,
		isString,
		isDate,
		isPromise,
		isSymbol,
  } from '@vue/shared'
import { isBoolean, isNumber } from '@vueuse/core'

export const isUndefined = (val: any): val is undefined => val === undefined
export function addUnit(value: string | number, defaultUnit = 'px') {
	if (!value) return ''
	if (isString(value)) {
		return value
	} else if (isNumber(value)) {
		return `${value}${defaultUnit}`
	}
}
function install(Vue, options) {

}

function on(event, callback) {
	console.log("测试")
}


const utils = function utils() {

}

utils.install = install
utils.on = on
utils.isUndefined = isUndefined
export default utils
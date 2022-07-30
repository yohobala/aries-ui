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
import { EventPoint } from '../type'


export function addUnit(value: string | number, defaultUnit = 'px') {
    if (!value) return ''
    if (isString(value)) {
        return value
    } else if (isNumber(value)) {
        return `${value}${defaultUnit}`
    }
}

/* 根据点击滑动事件获取第一个手指的坐标 */
export const getPoint = (e: MouseEvent | TouchEvent): EventPoint => {
    if ( (e as TouchEvent).touches && (e as TouchEvent).touches[0]) {
        return {
            x: (e as TouchEvent).touches[0].pageX,
            y: (e as TouchEvent).touches[0].pageY,
        };
    } else if ((e as TouchEvent).changedTouches && (e as TouchEvent).changedTouches[0]) {
        return {
            x: (e as TouchEvent).changedTouches[0].pageX,
            y: (e as TouchEvent).changedTouches[0].pageY,
        };
    } else {
        return {
            x: (e as MouseEvent).clientX,
            y: (e as MouseEvent).clientY,
        };
    }
};
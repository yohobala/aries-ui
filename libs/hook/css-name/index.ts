import { unref, computed } from 'vue'

const defaultNamespace = 'aqr'
const statePrefix = 'is-'

const _bem = (
    //ui的默认命名
    namespace: string,
    //组件的命名
    block: string,
    //子组件的命名
    blockSuffix: string,
    //元素，如：input，label
    element: string,
    //修饰,如：horizontal,top等
    modifier: string
  ) => {
    let cls = `${namespace}-${block}`
    if (blockSuffix) {
      cls += `-${blockSuffix}`
    }
    if (element) {
      cls += `__${element}`
    }
    if (modifier) {
      cls += `--${modifier}`
    }
    return cls
  }

  export const cssName = (block: string) => {
    const namespace = defaultNamespace
    const b = (blockSuffix = '') =>
      _bem(unref(namespace), block, blockSuffix, '', '')
    const e = (element?: string) =>
      element ? _bem(unref(namespace), block, '', element, '') : ''
    const m = (modifier?: string) =>
      modifier ? _bem(unref(namespace), block, '', '', modifier) : ''
    const be = (blockSuffix?: string, element?: string) =>
      blockSuffix && element
        ? _bem(unref(namespace), block, blockSuffix, element, '')
        : ''
    const em = (element?: string, modifier?: string) =>
      element && modifier
        ? _bem(unref(namespace), block, '', element, modifier)
        : ''
    const bm = (blockSuffix?: string, modifier?: string) =>
      blockSuffix && modifier
        ? _bem(unref(namespace), block, blockSuffix, '', modifier)
        : ''
    const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
      blockSuffix && element && modifier
        ? _bem(unref(namespace), block, blockSuffix, element, modifier)
        : ''
    const is: {
      (name: string, state: boolean | undefined): string
      (name: string): string
    } = (name: string, ...args: [boolean | undefined] | []) => {
      const state = args.length >= 1 ? args[0]! : true
      return name && state ? `${statePrefix}${name}` : ''
    }
    return {
      namespace,
      b,
      e,
      m,
      be,
      em,
      bm,
      bem,
      is,
    }
  }
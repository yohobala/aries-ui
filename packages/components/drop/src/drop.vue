<template>
  <div :class="[cn.b(),cn.is('horizontal',!isVertical)]">
    <transition-group>
      <slot></slot>
    </transition-group>

  </div>
</template>
<script lang="ts">
import { useCss } from "../../../libs/hooks";
import { dropProps, dropProvideKey } from "./drop";
import {
  computed,
  defineComponent,
  onMounted,
  provide,
  reactive,
  ref,
  unref,
  watch,
} from "vue";
import { DropProvide, DropItemContext } from "./type";

const COMPONENT_NAME = "AriDrop";
export default defineComponent({
  name: COMPONENT_NAME,
  props: dropProps,
  setup(props, { emit, slots }) {
    /*--- 通用变量 --- */
    const cn = useCss("drop");
    //如果slots.default()有值则赋予slot
    const slot = slots.default?.() ?? [];

    /*--- refs --- */
    const items = ref<Array<DropItemContext>>([]);
    const isChange = ref(false);
    const isMove = ref(false);
    const translateDif = ref(0)
    const direction = ref(props.direction)
    /*--- reactive ---  */

    /*--- computed ---  */
    const isVertical = computed(() => props.direction === "vertical");

    /*--- method ---  */
    const addItem = (item: DropItemContext) => {
      items.value.push(item);
    };
    const resetItem = (oldIndex?: number) => {
      items.value.forEach((item, index) => {
        item.changeIndex(index);
      });
    };
    const resetData = () => {
        translateDif.value = 0
    }
    const changeMoveState = (state: boolean) => {
        isMove.value = state
    }
    const changeActiveIndex = (
      beginIndex: number,
      endIndex: number,
      step: number
    ) => {
      console.log(beginIndex, endIndex, step);
      isChange.value = true;
      let _beginIndex = 0;
      let _endIndex = 0;
      let _step = 0;
      let _state = 1
      if (beginIndex < endIndex && beginIndex >= 0) {
        _beginIndex = beginIndex;
        _endIndex = endIndex;
        _step = step;
      } else if (endIndex < beginIndex && endIndex >= 0) {
        _beginIndex = endIndex;
        _endIndex = beginIndex;
        _state = -1
        _step = -step;
      } else {
        return;
      }
      const _items: Array<DropItemContext> = Array.from(unref(items));

      items.value.forEach((item, index) => {
        let _index = index
        if (index === endIndex) {
          _index = beginIndex;
          translateDif.value += _state * item.itemDistance
        } else if (index >= _beginIndex && index <= _endIndex) {
          _index +=  _step;
        }
        _items.splice(_index, 1, item);
        item.changeIndex(_index);
      });
      items.value = _items;
      console.log("d螯合1")
      isChange.value = false;
    };

    /*--- watch ---  */


    /*--- lifecycle ---  */
    onMounted(async () => {
      resetItem();
    });
    /*--- provide ---  */
    provide<DropProvide>(dropProvideKey, {
      isVertical,
      items,
      isChange,
      isMove,
      translateDif,
      direction,
      addItem,
      changeActiveIndex,
      resetData,
      changeMoveState
    });
    return {
      cn,
      isVertical
    };
  },
});
</script>

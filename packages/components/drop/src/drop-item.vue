<template>
  <template v-if="true">
    <div
      :class="[cn.b(),cn.m(direction),cn.is('move',isMove),cn.is('active',active)]"
      ref="dropItem"
      :id="id"
      :style="{...itemStyle}"
      @mousedown.stop="monitorOpen($event,'mouse')"
      @touchstart="monitorOpen($event,'touch')"
      @mouseup="monitorClose"
      @touchcancel="monitorClose"
    >
      <slot></slot>
    </div>
    <div
      v-if="active"
      :class="[cn.b(),cn.m(direction),cn.e('blank'),cn.is('move',isMove)]"
      :style="blankItemStyle"
    >
    </div>
  </template>
</template>
<script lang="ts">
import { get } from "@vueuse/core";
import { useCss } from "../../../libs/hooks";
import { guid, throwError, getPoint } from "../../../libs/utils";
import {
  defineComponent,
  ref,
  inject,
  onMounted,
  CSSProperties,
  computed,
  unref,
  watch,
} from "vue";
import { dropProvideKey } from "./drop";
import { dropItemProps } from "./drop-item";
import { DropItemContext, DropProvide, MovePoint } from "./type";

const COMPONENT_NAME = "AriDropItem";
export default defineComponent({
  name: COMPONENT_NAME,
  props: dropItemProps,
  setup(props, { emit, slots }) {
    /*--- 通用变量 --- */
    const cn = useCss("drop-item");
    const id = guid(4);
    let timer: number | null = null;
    /*--- ref --- */
    const dropItem = ref<HTMLDivElement>();
    const index = ref(-1);
    const title = ref("");
    const delay = ref(props.delay);
    const active = ref(false);

    const monitorType = ref("");
    const scale = ref(1.02);
    const startPoint = ref<MovePoint>({ x: 0, y: 0 });
    const lastPoint = ref<MovePoint>({ x: 0, y: 0 });
    const moveTime = ref(0);
    const moveTimeDiff = ref(1000 / props.downFps); //移动时间间隔
    const translate = ref(0);
    const acitveTranslateX = ref(0);
    const acitveTranslateY = ref(0);
    const offsetTranslateX = ref(0);
    const offsetTranslateY = ref(0);
    /*--- inject --- */
    const rootDrop = inject<DropProvide>(dropProvideKey)!;
    if (!rootDrop)
      throwError(
        COMPONENT_NAME,
        `不能inject${dropProvideKey},请添加${COMPONENT_NAME}`
      );

    /*--- computed --- */
    const { isVertical, items, isChange, translateDif, direction, isMove } =
      rootDrop;
    const itemStyle = computed<CSSProperties>(() => {
      if (active.value) {
        console.log(acitveTranslateY.value);
        const width = `${dropItem.value?.clientWidth || 0}px`;
        const height = `${dropItem.value?.clientHeight || 0}px`;
        const _translate = `translate(${acitveTranslateX.value || 0}px,${
          acitveTranslateY.value || 0
        }px)`;
        const _scale = `scale(${unref(scale)})`;
        const transform = [_translate, _scale].join(" ");
        return {
          width,
          height,
          transform,
        };
      } else {
        return initStyle();
      }
    });
    const blankItemStyle = computed<CSSProperties>(() => {
      return initStyle();
    });
    const itemsDistance = computed<number[]>(() => {
      const presentItemDistance = distance.value;
      let previousDistance: number[] = [];
      let afterDistance: number[] = [];
      for (let i = index.value - 1; i >= 0; i--) {
        const _distance = items.value[i].itemDistance / 2;
        if (previousDistance.length === 0) {
          const dif = -_distance;
          previousDistance.unshift(dif);
        } else {
          const dif =
            -_distance +
            previousDistance[0] +
            -items.value[i + 1].itemDistance / 2;
          previousDistance.unshift(dif);
        }
      }
      for (let i = index.value + 1; i <= items.value.length - 1; i++) {
        const _distance = items.value[i].itemDistance / 2;
        if (afterDistance.length === 0) {
          const dif = _distance + presentItemDistance;
          afterDistance.push(dif);
        } else {
          const dif =
            _distance +
            afterDistance[afterDistance.length - 1] +
            items.value[i - 1].itemDistance / 2;
          afterDistance.push(dif);
        }
      }
      return previousDistance.concat(0, afterDistance);
    });
    const distance = computed<number>(() => {
      return (
        (isVertical.value
          ? dropItem.value?.clientHeight
          : dropItem.value?.clientWidth) || 0
      );
    });

    /*--- method ---  */
    const initStyle = (): CSSProperties => {
      console.log(translate.value);
      const translateType = `translate${unref(isVertical) ? "Y" : "X"}`;
      //translateX(0px)
      const _translate = `${translateType}(${unref(translate)}px)`;
      let transform = [_translate].join(" ");
      return {
        transform,
      };
    };
    const monitorOpen = (e: MouseEvent | TouchEvent, type: string) => {
      monitorType.value = type;
      switch (type) {
        case "mouse":
          document.addEventListener("mousemove", monitorMove, false);
          break;
        case "touch":
          document.addEventListener("touchmove", monitorMove, false);
          break;
      }
      timer = window.setTimeout(() => {
        active.value = true;
        monitorStart(e);
      }, delay.value);
    };
    const monitorClose = () => {
      if (timer) clearTimeout(Number(timer));
      monitorEnd();
    };
    const monitorStart = (e: MouseEvent | TouchEvent) => {
      lastPoint.value = getPoint(e);
      startPoint.value = getPoint(e);
      if (!isVertical.value) {
        offsetTranslateX.value = calcOffsetTranslateX();
        acitveTranslateX.value += offsetTranslateX.value;
      } else {
        offsetTranslateY.value = translate.value;
        acitveTranslateY.value += offsetTranslateY.value;
      }
      rootDrop.changeMoveState(true);
    };
    const monitorMove = (e) => {
      if (!active.value) {
        if (timer) clearTimeout(timer);
        monitorEnd();
      } else {
        e.cancelBubble = true;
        //节流,节省运算量
        const t = Date.now();
        if (moveTime.value && t - moveTime.value < moveTimeDiff.value) {
          // 小于节流时间,则不处理
          return;
        } else {
          moveTime.value = t;
        }
        const point = getPoint(e);
        acitveTranslateX.value += point.x - lastPoint.value.x;
        acitveTranslateY.value += point.y - lastPoint.value.y;
        if (!isChange.value) {
          let _translate = 0;
          if (isVertical.value) {
            const move = point.y - lastPoint.value.y;
            //往下
            if (move > 0) {
              _translate =
                acitveTranslateY.value +
                translateDif.value -
                offsetTranslateY.value;
              calcAcitveTranslate(move, _translate);
            }
            //往上
            else if (move < 0) {
              _translate =
                acitveTranslateY.value +
                translateDif.value +
                distance.value -
                offsetTranslateY.value;
              calcAcitveTranslate(move, _translate);
            }
          } else {
            const move = point.x - lastPoint.value.x;
            console.log(move);
            //往右
            if (move > 0) {
              _translate =
                acitveTranslateX.value +
                translateDif.value -
                offsetTranslateX.value;
              console.log(_translate);
              calcAcitveTranslate(move, _translate);
            }
            //往左
            else if (move < 0) {
              _translate =
                acitveTranslateX.value +
                translateDif.value +
                distance.value -
                offsetTranslateX.value;
              console.log(_translate);
              console.log(offsetTranslateX.value);
              calcAcitveTranslate(move, _translate);
            }
          }
        }
        lastPoint.value = point;
      }
    };
    const monitorEnd = () => {
      lastPoint.value = { x: 0, y: 0 };
      startPoint.value = { x: 0, y: 0 };
      acitveTranslateX.value = 0;
      acitveTranslateY.value = 0;
      console.log(acitveTranslateY.value);
      active.value = false;
      rootDrop.resetData();
      rootDrop.changeMoveState(false);
      switch (monitorType.value) {
        case "mouse":
          document.removeEventListener("mousemove", monitorMove, false);
          break;
        case "touch":
          document.removeEventListener("touchmove", monitorMove, false);
          break;
      }
    };

    const changeIndex = (num: number) => {
      if (index.value == -1) {
        index.value = num;
      } else if (num !== index.value) {
        console.log(num);
        console.log(index.value);
        translate.value = calcTranslate(num);
        index.value = num;
      }
    };
    const calcTranslate = (changeIndex: number) => {
      const difValue = changeIndex - index.value;
      return translate.value + distance.value * (changeIndex - index.value);
    };
    const calcAcitveTranslate = (move: number, _translate: number) => {
      //往下,或往右
      if (move > 0) {
        for (let i = itemsDistance.value.length - 1; i >= 0; i--) {
          const _distance = itemsDistance.value[i];
          if (_distance < _translate && i > index.value) {
            rootDrop.changeActiveIndex(i, index.value, 1);
            break;
          }
        }
      }
      //往上,或往左
      else if (move < 0) {
        for (let i = 0; i <= itemsDistance.value.length - 1; i++) {
          const _distance = itemsDistance.value[i];
          if (_translate < _distance && i < index.value) {
            rootDrop.changeActiveIndex(i, index.value, 1);
            break;
          }
        }
      }
    };
    const calcOffsetTranslateX = () => {
      let _distance = 0;
      for (let i = 0; i < index.value; i++) {
        _distance += items.value[i].itemDistance;
      }
      return _distance;
    };
    /*--- watch ---  */
    watch(
      () => index.value,
      (current, prev) => {}
    );

    /*--- lifecycle ---  */
    onMounted(() => {
      title.value = dropItem.value?.innerHTML as string;

      rootDrop.addItem(<DropItemContext>{
        props,
        id,
        title: title.value,
        itemDistance: distance.value,
        changeIndex,
      });
    });
    return {
      cn,
      id,
      dropItem,
      itemStyle,
      blankItemStyle,
      active,
      monitorOpen,
      monitorClose,
      direction,
      isMove,
    };
  },
});
</script>

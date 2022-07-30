<template>
  <div
    :class="cn.b()"
    :id="id"
    @mousedown.stop="[scorll && !stop ? mousedown($event) : '']"
    @touchstart.stop="[scorll  && !stop ? touchstart($event) : '']"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useCss } from "../../../libs/hooks";
import { EventPoint, getPoint, guid } from "../../../libs/utils";
import { scrollEmits, scrollProps } from "./scroll";
import { ScrollResult } from "./type";
import { DIRECTION } from "../../../constants";

const COMPONENT_NAME = "AriScroll";
export default defineComponent({
  props: scrollProps,
  emits: scrollEmits,
  name: COMPONENT_NAME,
  setup(props, { emit, slots }) {
    const cn = useCss("scroll");
    const id = guid();

    let startPoint: EventPoint = reactive({ x: 0, y: 0 }); //开始的点位，鼠标按下和触摸开始时记录
    let lastPoint: EventPoint = reactive({ x: 0, y: 0 }); //上次move的点
    let endPoint: EventPoint = reactive({ x: 0, y: 0 });
    let translateY = ref(0);
    let startY = ref(0);
    let translateX = ref(0);
    let startX = ref(0);
    let moveTime = ref(0); //上次移动时间
    let moveX = ref(0);
    let moveY = ref(0);
    let moveTimeDiff = ref(1000 / props.downFps); //移动时间间隔
    let direction = ref("");
    //props

    const mousedown = (e: MouseEvent) => {
      start(e);
      document.addEventListener("mousemove", move, false);
      document.addEventListener("mouseup", mouseup, false);
      document.addEventListener("mouseout", mouseup, false);
    };
    const mouseup = (e: MouseEvent) => {
      end(e);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", mouseup);
      document.removeEventListener("mouseout", mouseup);
    };
    const touchstart = (e: TouchEvent) => {
      start(e);
      document.addEventListener("touchmove", move, false);
      document.addEventListener("touchend", touchend, false);
    };
    const touchend = (e: TouchEvent) => {
      end(e);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", touchend);
    };

    const start = (e: MouseEvent | TouchEvent): void => {
      e.cancelBubble = true;
      startPoint = getPoint(e); // 记录起点
      lastPoint = startPoint; // 重置上次move的点
      startY.value = startPoint.y;
      translateY.value = startPoint.y;
      startX.value = startPoint.x;
      translateX.value = startPoint.x;
      const result: ScrollResult = {
        initY: startY.value,
        translateY: startY.value,
        initX: startX.value,
        translateX: startX.value,
        moveX: 0,
        moveY: 0,
        direction: "",
        e: e,
      };
      emit("start", result);
    };

    const move = (e: MouseEvent | TouchEvent): void => {
      e.cancelBubble = true;
      //节流,节省运算量
      const t = Date.now();
      if (moveTime.value && t - moveTime.value < moveTimeDiff.value) {
        // 小于节流时间,则不处理
        return;
      } else {
        moveTime.value = t;
      }
      endPoint = getPoint(e); // 记录起点
      const result = moveResult(e);
      directionEmit(direction.value, e);

      lastPoint = endPoint;
      emit("move", result);
    };
    const end = (e: MouseEvent | TouchEvent) => {
      e.cancelBubble = true;
      endPoint = getPoint(e); // 记录起点
      const result = moveResult(e);
      startPoint = { x: 0, y: 0 };
      moveX.value = 0;
      moveY.value = 0;

      emit("end", result);
      directionEmit(direction.value, e);
    };

    //
    const getDirection = (): string => {
      const _moveX = endPoint.x - startPoint.x;
      const _moveY = endPoint.y - startPoint.y;
      const x = Math.abs(_moveX);
      const y = Math.abs(_moveY);
      const z = Math.sqrt(x * x + y * y);
      let direction = DIRECTION.x;
      if (z != 0) {
        const angle = (Math.asin(y / z) / Math.PI) * 180;
        if (angle < 45) {
          direction = DIRECTION.x;
        } else {
          direction = DIRECTION.y;
        }
        if (direction == DIRECTION.x) {
          if (_moveX < 0) {
            // console.log("向左")
            return DIRECTION.left;
          } else if (_moveX > 0) {
            // console.log("向右")
            return DIRECTION.right;
          }
        } else if (direction == DIRECTION.y) {
          if (_moveY < 0) {
            // console.log("向上")
            return DIRECTION.up;
          } else if (_moveY > 0) {
            // console.log("向下")
            return DIRECTION.down;
          }
        }
        // console.log(angle)
      }
      return "";
    };
    const directionEmit = (direction: string, e: any): void => {
      switch (direction) {
        case DIRECTION.left:
          emit(DIRECTION.left, e);
          break;
        case DIRECTION.right:
          emit(DIRECTION.right, e);
          break;
        case DIRECTION.up:
          emit(DIRECTION.up, e);
          break;
        case DIRECTION.down:
          emit(DIRECTION.down, e);
          break;
      }
    };
    const moveResult = (e: MouseEvent | TouchEvent): ScrollResult => {
      const lastX = lastPoint.x;
      const lastY = lastPoint.y;
      const endX = endPoint.x;
      const endY = endPoint.y;
      moveX.value = endX - lastX;
      moveY.value = endY - lastY;
      translateY.value = translateY.value + moveY.value;
      translateX.value = translateX.value + moveX.value;
      direction.value = getDirection();
      const result: ScrollResult = {
        initY: startY.value,
        translateY: translateY.value,
        initX: startX.value,
        translateX: translateX.value,
        moveX: moveX.value,
        moveY: moveY.value,
        direction: direction.value,
        e: e,
      };

      return result;
    };
    return {
      cn,
      id,
      mousedown,
      touchstart,
    };
  },
});
</script>

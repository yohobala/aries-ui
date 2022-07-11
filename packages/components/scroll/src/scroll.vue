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
import { cssName } from "aries-ui/libs";
import { guid } from "aries-ui/libs";
import { scrollProps, scrollResult } from "./scroll";
import type { point } from "./scroll";
export default defineComponent({
  props: scrollProps,
  setup(props, { emit, slots }) {
    const cn = cssName("scroll");
    const id = guid();

    let startPoint: point = reactive({ x: 0, y: 0 }); //开始的点位，鼠标按下和触摸开始时记录
    let lastPoint: point = reactive({ x: 0, y: 0 }); //上次move的点
    let endPoint: point = reactive({ x: 0, y: 0 });
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

    const mousedown = (e) => {
      start(e);
      document.addEventListener("mousemove", move, false);
      document.addEventListener("mouseup", mouseup, false);
      document.addEventListener("mouseout", mouseup, false);
    };
    const mouseup = (e) => {
      end(e);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", mouseup);
      document.removeEventListener("mouseout", mouseup);
    };

    const touchstart = (e) => {
      start(e);
      document.addEventListener("touchmove", move, false);
      document.addEventListener("touchend", touchend, false);
    };
    const touchend = (e) => {
      end(e);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", touchend);
    };

    const start = (e): void => {
      e.cancelBubble = true;
      startPoint = getPoint(e); // 记录起点
      lastPoint = startPoint; // 重置上次move的点
      startY.value = startPoint.y;
      translateY.value = startPoint.y;
      startX.value = startPoint.x;
      translateX.value = startPoint.x;
      const result: scrollResult = {
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

    const move = (e): void => {
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
    const end = (e) => {
      e.cancelBubble = true;
      endPoint = getPoint(e); // 记录起点
      const result = moveResult(e);

      startPoint = { x: 0, y: 0 };
      moveX.value = 0;
      moveY.value = 0;

      emit("end", result);
      directionEmit(direction.value, e);
    };
    /* 根据点击滑动事件获取第一个手指的坐标 */
    const getPoint = (e): point => {
      if (e.touches && e.touches[0]) {
        return {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY,
        };
      } else if (e.changedTouches && e.changedTouches[0]) {
        return {
          x: e.changedTouches[0].pageX,
          y: e.changedTouches[0].pageY,
        };
      } else {
        return {
          x: e.clientX,
          y: e.clientY,
        };
      }
    };
    //
    const getDirection = (): string => {
      const x = Math.abs(moveX.value);
      const y = Math.abs(moveY.value);
      const z = Math.sqrt(x * x + y * y);
      let direction = "x";
      if (z != 0) {
        const angle = (Math.asin(y / z) / Math.PI) * 180;
        if (angle < 45) {
          direction = "x";
        } else {
          direction = "y";
        }
        if (direction == "x") {
          if (moveX.value < 0) {
            // console.log("向左")
            return "toLeft";
          } else if (moveX.value > 0) {
            // console.log("向右")
            return "toRight";
          }
        } else if (direction == "y") {
          if (moveY.value < 0) {
            // console.log("向上")
            return "toUp";
          } else if (moveY.value > 0) {
            // console.log("向下")
            return "toDown";
          }
        }
        // console.log(angle)
      }
      return "";
    };
    const directionEmit = (direction: string, e: any): void => {
      switch (direction) {
        case "toLeft":
          emit("toLeft", e);
          break;
        case "toRight":
          emit("toRight", e);
          break;
        case "toUp":
          emit("toUp", e);
          break;
        case "toDown":
          emit("toDown", e);
          break;
      }
    };
    const moveResult = (e: any): scrollResult => {
      const lastX = lastPoint.x;
      const lastY = lastPoint.y;
      const endX = endPoint.x;
      const endY = endPoint.y;
      moveX.value = endX - lastX;
      moveY.value = endY - lastY;
      translateY.value = translateY.value + moveY.value;
      translateX.value = translateX.value + moveX.value;
      direction.value = getDirection();
      const result: scrollResult = {
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

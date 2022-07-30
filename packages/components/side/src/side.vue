<template>
  <teleport
    to="body"
    :disabled="!appendToBody"
  >
    <transition
      :name="cn.b('fade')"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      @before-leave="beforeLeave"
    >
      <ari-overlay
        ref="overlayRef"
        :id="overlayID"
        v-show="visible"
        :mask="modal"
        :overlay-class="[modalClass]"
        :z-index="zIndex"
        @click="onModalClick"
      >
        <div
          ref="sideRef"
          :class="[cn.b(), direction, visible && 'open',cn.is('move',isMove)]"
          :style="
            isHorizontal ? 'width: ' + drawerSize : 'height: ' + drawerSize
          "
        >
          <ari-scroll
            :class="cn.e('scroll')"
            @end="onEnd"
            @start="onStart"
            @move="onMove"
          >
            <div :class="[cn.e('bar-wrapper'),direction]">
              <div :class="[cn.e('bar'),direction]"></div>
            </div>
            <slot></slot>
          </ari-scroll>
        </div>
      </ari-overlay>

    </transition>
  </teleport>

</template>

<script lang="ts">
import type { ScrollResult } from "../../../components/scroll";
import { DIRECTION, UPDATE_MODEL_EVENT } from "../../../constants";
import { useCss } from "../../../libs/hooks";
import { guid } from "../../../libs/utils";
import { computed, defineComponent, Ref, ref } from "vue";
import { sideProps, useSide } from "./side";

const COMPONENT_NAME = "AriSide";
export default defineComponent({
  name: COMPONENT_NAME,
  props: sideProps,
  setup(props, { emit }) {
    const cn = useCss("side");
    const SIZE = {
      init: "init",
      max: "max",
    };
    const sideRef = ref<HTMLElement>();
    const overlayRef = ref<HTMLElement>();
    const overlayID = guid(4);
    const currentSize = ref(props.initSize);
    const vector = ref(1);
    const isMove = ref(false);

    const isHorizontal = computed(
      () => props.direction === "rtl" || props.direction === "ltr"
    );
    const drawerSize = computed(() => {
      return typeof currentSize.value === "number"
        ? `${currentSize.value}px`
        : currentSize.value;
    });
    const isMax = computed(() => currentSize.value === props.maxSize);
    const overlayDOM = computed(() => document.getElementById(overlayID));

    const onStart = (e: ScrollResult) => {
      isMove.value = true;
    };
    const onMove = (e: ScrollResult) => {
      setVector(e.direction);
      console.log(vector.value, e);
      changeSize(isHorizontal.value ? Math.abs(e.moveX) : Math.abs(e.moveY));
    };
    const onEnd = (e: ScrollResult) => {
      setVector(e.direction);
      handleMoveEnd();
      isMove.value = false;
    };

    const setVector = (direction: string) => {
      console.log(direction, DIRECTION.up, props.direction);
      if (isHorizontal.value) {
        if (
          (direction === DIRECTION.left && props.direction === "rtl") ||
          (direction === DIRECTION.right && props.direction === "ltr")
        ) {
          vector.value = 1;
          changeSize(SIZE.max);
        } else if (
          (direction === DIRECTION.right && props.direction === "rtl") ||
          (direction === DIRECTION.left && props.direction === "ltr")
        ) {
          vector.value = -1;
          changeSize(SIZE.init);
        }
      } else {
        if (
          (direction === DIRECTION.up && props.direction === "btt") ||
          (direction === DIRECTION.down && props.direction === "ttb")
        ) {
          vector.value = 1;
        } else if (
          (direction === DIRECTION.up && props.direction === "ttb") ||
          (direction === DIRECTION.down && props.direction === "btt")
        ) {
          vector.value = -1;
        }
      }
    };

    const handleMoveEnd = () => {
      if (vector.value === 1) {
        changeSize(SIZE.max);
      } else {
        changeSize(SIZE.init);
      }
    };

    const changeSize = (val: string | number) => {
      if (typeof val === "string") {
        if (val === SIZE.init || val === SIZE.max) {
          currentSize.value =
            val === SIZE.init ? props.initSize : props.maxSize;
          emit("changeSize", val);
        }
      } else if (typeof val === "number") {
        const maxSize = isHorizontal.value
          ? overlayDOM.value?.clientWidth
          : overlayDOM.value?.clientHeight;
        const _currentSize: number | undefined = isHorizontal.value
          ? sideRef.value?.clientWidth
          : sideRef.value?.clientHeight;
        const changeVal = vector.value * val;
        if (maxSize && _currentSize) {
          if (maxSize >= changeVal + _currentSize) {
            currentSize.value = _currentSize + changeVal;
          } else {
            currentSize.value = maxSize;
          }
        }
      }
    };

    return {
      cn,
      ...useSide(props, sideRef),
      sideRef,
      overlayRef,
      overlayID,
      onStart,
      onMove,
      onEnd,

      isHorizontal,
      drawerSize,
      isMax,
      isMove,
    };
  },
});
</script>

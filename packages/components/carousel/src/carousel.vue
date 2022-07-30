<template>
  <div
    ref="root"
    :class="[cn.b(),cn.m(direction),...carouselClass]"
    :style="carouselStyle"
    :role="COMPONENT_NAME"
    @mouseenter.stop="mouseEnter"
    @mouseleave.stop="mouseLeave"
  >
    <ari-scroll :class="[cn.e('scroll')]">
      <div
        :class="[cn.e('container'),...containerClass]"
        :style="containerStyle"
        :role="COMPONENT_NAME + 'Container'"
      >
        <transition
          v-if="arrowDisplay"
          name="carousel-arrow-left"
        >
          <button
            v-show="
            (arrow === 'always' || hover) && (loop || activeIndex > 0)
          "
            type="button"
            :class="[cn.e('arrow'), cn.em('arrow', 'left')]"
            @mouseenter="buttonEnter('left')"
            @mouseleave="buttonLeave"
            @click.stop="arrowClick(activeIndex - 1)"
          >
            <ari-icon icon-name="aries icon-arrow-left"></ari-icon>
          </button>
        </transition>
        <transition
          v-if="arrowDisplay"
          name="carousel-arrow-right"
        >
          <button
            v-show="
            (arrow === 'always' || hover) && (loop || activeIndex < items.length - 1)
          "
            type="button"
            :class="[cn.e('arrow'), cn.em('arrow', 'right')]"
            @mouseenter="buttonEnter('right')"
            @mouseleave="buttonLeave"
            @click.stop="arrowClick(activeIndex + 1)"
          >
            <ari-icon icon-name="aries icon-arrow-right"></ari-icon>
          </button>
        </transition>
        <slot></slot>
      </div>
      <ul
        :role="COMPONENT_NAME + 'Indicators'"
        v-if="indicatorPosition != 'none'"
        :class="[cnIndicators.b(),
                cnIndicators.m(direction),
                ...indicatorsClass,
                {[cnIndicators.m('outside')] : indicatorPosition == 'outside' ||  isCardType,
                [cnIndicators.m('outside-circle')] : (indicatorPosition == 'outside' ||  isCardType) && indicatorType === 'circle'},
                ]"
        :style="indicatorsStyle"
      >
        <li
          :role="COMPONENT_NAME + 'Indicator'"
          v-for="(item, index) in items"
          :key="index"
          :class="[cnIndicators.e('indicator'),
                  cnIndicators.em('indicator', indicatorType),
                  cnIndicators.em('indicator', direction),
                  cnIndicators.is('indicator-active', index === activeIndex),...indicatorClass]"
          :style="indicatorStyle"
          @click.stop="indicatorClick(index)"
          @mouseenter="indicatorHover(index)"
        >
          <button :class="cnIndicators.e('button')">
            <span v-if="hasLabel">{{ item.props.label}}</span>
          </button>
        </li>
      </ul>
    </ari-scroll>
  </div>
</template>

<script lang="ts">
import { useCss } from "../../../libs/hooks";
import {
  defineComponent,
  onMounted,
  provide,
  reactive,
  ref,
  computed,
  unref,
  watch,
  shallowRef,
} from "vue";
import { AriScroll } from "../../scroll";
import { AriIcon } from "../../icon";
import { carouselProps, carouselProvideKey } from "./carousel";
import { CarouselItemContext, CarouselProvide } from "./type";
import { debugWarn } from "../../../libs/utils";
import { useResizeObserver } from "@vueuse/core";

const COMPONENT_NAME = "AriCarousel";
export default defineComponent({
  name: COMPONENT_NAME,
  components: {
    AriScroll,
  },
  props: carouselProps,
  setup(props, { emit, slots }) {
    /*--- 通用变量 --- */
    const cn = useCss("carousel");
    const cnIndicators = useCss("carousel-indicators");

    /*--- refs --- */
    const activeIndex = ref(-1);
    const hover = ref(false);
    const timer = ref<ReturnType<typeof setInterval> | null>(null);
    const root = ref<HTMLDivElement>();

    /*--- reactive ---  */
    const items = reactive<Array<CarouselItemContext>>([]);

    /*--- computed ---  */
    const hasLabel = computed(() => {
      return items.some((item) => {
        return item.props.label.toString().length > 0;
      });
    });
    const isCardType = computed(() => props.type === "card");
    const isShowcase = computed(() => props.type === "showcase");
    const isVertical = computed(() => props.direction === "vertical");
    const arrowDisplay = computed(
      () => props.arrow !== "none" && !unref(isVertical)
    );

    /*--- method ---  */
    const mouseEnter = () => {
      hover.value = true;
      if (props.pauseOnHover) {
        pauseTimer();
      }
    };
    const mouseLeave = () => {
      hover.value = false;
      startTimer();
    };
    const pauseTimer = () => {
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
      }
    };
    const startTimer = () => {
      if (props.intervalTime <= 0 || !props.autoplay || timer.value) return;
      timer.value = setInterval(() => play(), props.intervalTime);
    };
    const play = () => {
      if (activeIndex.value < items.length - 1) {
        activeIndex.value = activeIndex.value + 1;
      } else if (props.loop) {
        activeIndex.value = 0;
      }
    };
    const setActiveItem = (index: number) => {
      if (Number.isNaN(index) || index !== Math.floor(index)) {
        debugWarn(COMPONENT_NAME, "index must be integer.");
        return;
      }
      const itemLength = items.length;
      const oldIndex = activeIndex.value;
      if (index < 0) {
        activeIndex.value = props.loop ? itemLength - 1 : 0;
      } else if (index >= itemLength) {
        activeIndex.value = props.loop ? 0 : itemLength - 1;
      } else {
        activeIndex.value = index;
      }
      if (oldIndex === activeIndex.value) {
        resetItem(oldIndex);
      }
    };
    const resetItem = (oldIndex?: number) => {
      items.forEach((item, index) => {
        item.translateItem(index, activeIndex.value, oldIndex);
      });
    };
    const addItem = (item: CarouselItemContext) => {
      items.push(item);
    };

    const indicatorClick = (index: number) => {
      activeIndex.value = index;
    };
    const indicatorHover = (index: number) => {
      if (props.trigger === "hover" && index !== activeIndex.value) {
        activeIndex.value = index;
      }
    };

    const buttonEnter = (arrow: "left" | "right") => {
      if (unref(isVertical)) return;
    };

    const buttonLeave = () => {
      if (unref(isVertical)) return;
    };

    const arrowClick = (index: number) => {
      setActiveItem(index);
    };

    function toRight(e) {}
    /*--- watch ---  */
    watch(
      () => activeIndex.value,
      (current, prev) => {
        resetItem(prev);
        if (prev > -1) {
          emit("change", current, prev);
        }
      }
    );
    watch(
      () => props.autoplay,
      (autoplay) => {
        autoplay ? startTimer() : pauseTimer();
      }
    );
    watch(
      () => props.loop,
      () => {
        setActiveItem(activeIndex.value);
      }
    );

    const resizeObserver = shallowRef<ReturnType<typeof useResizeObserver>>();
    /*--- lifecycle ---  */
    onMounted(async () => {
      resizeObserver.value = useResizeObserver(root.value, () => {
        resetItem();
      });
      if (props.initialIndex < items.length && props.initialIndex >= 0) {
        activeIndex.value = props.initialIndex;
      }
      startTimer();
    });

    /*--- provide ---  */
    provide<CarouselProvide>(carouselProvideKey, {
      root,
      props: props,
      addItem,
      isCardType,
      isShowcase,
      isVertical,
      items,
      loop: props.loop,
    });
    return {
      /*--- 变量 --- */
      COMPONENT_NAME,
      cn,
      cnIndicators,
      items,
      activeIndex,
      hasLabel,
      isCardType,
      arrowDisplay,
      isVertical,
      hover,
      root,
      /*--- 方法 --- */
      mouseEnter,
      mouseLeave,
      toRight,
      indicatorClick,
      indicatorHover,
      buttonEnter,
      buttonLeave,
      arrowClick,
      setActiveItem,
    };
  },
});
</script>
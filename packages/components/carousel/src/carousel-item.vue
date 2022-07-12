<template>
  <div
    ref="itemRef"
    :class="[cn.b(),cn.is('active',active),cn.is('in-stage'),cn.is('hover',hover),cn.is('animating',animating),{[cn.m('card')]:isCardType},{[cn.m('showcase')]:isShowcase}]"
    :style="itemStyle"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  unref,
  ref,
  CSSProperties,
} from "vue";
import { throwError } from "aries-ui/libs";
import { carouselProvideKey } from "./carousel";
import { CarouselItemContext, CarouselProvide } from "./type";
import { cssName, debugWarn, isUndefined } from "aries-ui/libs";
import { carouselItemProps } from "./carousel-item";

const COMPONENT_NAME = "AriCarouselItem";
export default defineComponent({
  name: COMPONENT_NAME,
  props: carouselItemProps,
  setup(props, { emit, slots }) {
    /*--- 通用变量 --- */
    const cn = cssName("carousel-item");
    const CARD_SCALE = 0.83;

    /*--- ref --- */
    const hover = ref(false);
    const active = ref(false);
    const inStage = ref(false);
    const translate = ref(0);
    const scale = ref(1);
    const ready = ref(false);
    const animating = ref(false);
    const itemRef = ref<HTMLDivElement>();
    const showcaseInterval = ref(props.showcaseInterval)
    /*--- inject --- */
    const rootCarousel = inject<CarouselProvide>(carouselProvideKey)!;
    if (!rootCarousel)
      throwError(
        COMPONENT_NAME,
        `不能inject"rootTabs",请添加${COMPONENT_NAME}`
      );

    /*--- computed --- */
    const { isCardType, isVertical, isShowcase } = rootCarousel;

    const itemStyle = computed<CSSProperties>(() => {
      const translateType = `translate${unref(isVertical) ? "Y" : "X"}`;
      //translateX(0px)
      const _translate = `${translateType}(${unref(translate)}px)`;
      //scale(1)
      const _scale = `scale(${unref(scale)})`;
      const transform = [_translate, _scale].join(" ");
      let padding = ""
      if(isShowcase.value){
         padding = `0px ${showcaseInterval.value}px`
      }
      return {
        transform,
        padding
      };
    });
    /*--- method ---  */
    const translateItem = (
      index: number,
      activeIndex: number,
      oldIndex?: number
    ) => {
      const _isCardType = unref(isCardType);
      const _isShowcase = unref(isShowcase);
      const itemsLength = rootCarousel.items.length ?? Number.NaN;

      const isActive = index === activeIndex;
      if (!_isCardType && !isUndefined(oldIndex)) {
        animating.value = isActive || index === oldIndex;
      }
      if(_isShowcase){
        animating.value = true
      }
      if (!_isCardType && !_isShowcase && itemsLength > 2 && rootCarousel.loop) {
        index = processIndex(index, activeIndex, itemsLength);
      }

      const _isVertical = unref(isVertical);
      active.value = isActive;
      if (_isCardType) {
        if (_isVertical) {
          debugWarn(
            "Carousel",
            "vertical direction is not supported for card mode"
          );
        }
        inStage.value = Math.round(Math.abs(index - activeIndex)) <= 1;
        translate.value = calcCardTranslate(index, activeIndex);
        scale.value = unref(active) ? 1 : CARD_SCALE;
      } else if (_isShowcase) {
        if (_isVertical) {
          debugWarn(
            "Carousel",
            "vertical direction is not supported for showcase mode"
          );
        }
        inStage.value = Math.round(Math.abs(index - activeIndex)) <= 1;
        translate.value = calcShowcaseTranslate(index, activeIndex);
      } else {
        translate.value = calcTranslate(index, activeIndex, _isVertical);
      }

      ready.value = true;
    };
    const processIndex = (
      index: number,
      activeIndex: number,
      length: number
    ) => {
      const lastItemIndex = length - 1;
      const prevItemIndex = activeIndex - 1;
      const nextItemIndex = activeIndex + 1;
      const halfItemIndex = length / 2;

      if (activeIndex === 0 && index === lastItemIndex) {
        return -1;
      } else if (activeIndex === lastItemIndex && index === 0) {
        return length;
      } else if (
        index < prevItemIndex &&
        activeIndex - index >= halfItemIndex
      ) {
        return length + 1;
      } else if (
        index > nextItemIndex &&
        index - activeIndex >= halfItemIndex
      ) {
        return -2;
      }
      return index;
    };
    const calcTranslate = (
      index: number,
      activeIndex: number,
      isVertical: boolean
    ) => {
      const rootEl = rootCarousel.root.value;
      if (!rootEl) return 0;

      const distance =
        (isVertical ? rootEl.offsetHeight : rootEl.offsetWidth) || 0;
      return distance * (index - activeIndex);
    };
    const calcShowcaseTranslate = (index: number, activeIndex: number) => {
      const refEL = itemRef.value;
      if (!refEL) return 0;
      const distance = refEL.offsetWidth || 0;
      return distance * (index - activeIndex);
    };
    const calcCardTranslate = (index: number, activeIndex: number) => {
      const parentWidth = rootCarousel.root.value?.offsetWidth || 0;
      if (inStage.value) {
        return (
          (parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1)) / 4
        );
      } else if (index < activeIndex) {
        return (-(1 + CARD_SCALE) * parentWidth) / 4;
      } else {
        return ((3 + CARD_SCALE) * parentWidth) / 4;
      }
    };
    // lifecycle
    onMounted(() => {
      rootCarousel.addItem(<CarouselItemContext>{
        props,
        translateItem,
      });
    });

    return {
      /*--- 变量 --- */
      cn,
      active,
      hover,
      animating,
      inStage,
      isCardType,
      itemStyle,
      itemRef,
      isShowcase
    };
  },
});
</script>

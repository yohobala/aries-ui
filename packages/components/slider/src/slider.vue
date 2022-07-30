<template>
  <div
    ref="sliderWrapper"
    :role="COMPONENT_NAME"
    :class="[cn.b()]"
  >
    <div
      ref="slider"
      :class="[cn.e('container'),cn.is('disabled', sliderDisabled)]"
      :style="containerStyle"
      @mousedown="onSliderDown"
      @touchstart="onSliderDown"
    >
      <div
        :class="[cn.e('bar')]"
        :style="barStyle"
      />
      <slider-button
        ref="firstButton"
        role="slider"
        :modelValue="firstValue"
        :vertical="vertical"
        @update:model-value="setFirstValue"
      ></slider-button>
      <slider-button
        v-if="range"
        ref="secondButton"
        role="slider"
        :model-value="secondValue"
        :vertical="vertical"
        @update:model-value="setSecondValue"
      />
      <div v-if="showStops">
        <div
          v-for="(item, key) in stops"
          :key="key"
          :class="cn.e('stop')"
          :style="getStopStyle(item)"
        />
      </div>
      <template v-if="markList.length > 0">
        <div>
          <div
            v-for="(item, key) in markList"
            :key="key"
            :style="getStopStyle(item.position)"
            :class="[cn.e('stop'), cn.e('marks-stop')]"
          />
        </div>
        <div :class="cn.e('marks')">
          <slider-marker
            v-for="(item, key) in markList"
            :key="key"
            :mark="item.mark"
            :style="getStopStyle(item.position)"
          />
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">

import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  toRefs,
  watch,
  ref,
} from "vue";
import { useCss} from "../../../libs/hooks";
import { debugWarn, throwError } from "../../../libs/utils";
import { silderProps, sliderEmits } from "./slider";
import { SliderInitData } from "./type";
import { useSlides } from "./useSlider";
import { useStops } from "./stop";
import { useMarks } from "./mark";
import { sliderProvideKey } from "../../../keys";
import { CHANGE_EVENT, INPUT_EVENT, UPDATE_MODEL_EVENT } from "../../../constants";

import SliderButton from "./button.vue";
import SliderMarker from './marker.vue'

const COMPONENT_NAME = "AriSlider";
export default defineComponent({
  props: silderProps,
  name: COMPONENT_NAME,
  components: {
    SliderButton,
    SliderMarker
  },
  emits: sliderEmits,
  setup(props, { emit }) {
    const cn = useCss("slider");
    const initData = reactive<SliderInitData>({
      firstValue: 0,
      secondValue: 0,
      oldValue: 0,
      dragging: false,
      sliderSize: 1,
    });
    const sliderWrapper = ref<HTMLElement>();

    const {
      slider,
      barStyle,
      containerStyle,
      onSliderDown,
      firstButton,
      secondButton,
      resetSize,
      minValue,
      maxValue,
      setFirstValue,
      setSecondValue,
      sliderDisabled,
      emitChange,
    } = useSlides(props, initData, emit);

    const { stops, getStopStyle } = useStops(
      props,
      initData,
      minValue,
      maxValue
    );

    const markList = useMarks(props);
    console.log(markList.value)
    useWatch(props, initData, minValue, maxValue, emit);

    const precision = computed(() => {
      const precisions = [props.min, props.max, props.step].map((item) => {
        const decimal = `${item}`.split(".")[1];
        return decimal ? decimal.length : 0;
      });
      return Math.max.apply(null, precisions);
    });

    const { firstValue, secondValue, oldValue, dragging, sliderSize } =
      toRefs(initData);

    provide(sliderProvideKey, {
      ...toRefs(props),
      precision,
      resetSize,
      sliderSize,
    });

    onMounted(async () => {
      if (props.range) {
        if (Array.isArray(props.modelValue)) {
          initData.firstValue = Math.max(props.min, props.modelValue[0]);
          initData.secondValue = Math.min(props.max, props.modelValue[1]);
        } else {
          initData.firstValue = props.min;
          initData.secondValue = props.max;
        }
        initData.oldValue = [initData.firstValue, initData.secondValue];
      } else {
        if (
          typeof props.modelValue !== "number" ||
          Number.isNaN(props.modelValue)
        ) {
          initData.firstValue = props.min;
        } else {
          initData.firstValue = Math.min(
            props.max,
            Math.max(props.min, props.modelValue)
          );
        }
        initData.oldValue = initData.firstValue;
      }

      window.addEventListener("resize", resetSize);

      await nextTick();
      resetSize();
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", resetSize);
    });

    return {
      cn,
      COMPONENT_NAME,
      ...initData,

      slider,
      barStyle,
      containerStyle,
      onSliderDown,
      firstButton,
      setFirstValue,
      setSecondValue,
      firstValue,
      secondValue,
      sliderDisabled,
      secondButton,
      emitChange,

      stops,
      getStopStyle,

      markList,

      sliderWrapper,
    };
  },
});

const useWatch = (props, initData, minValue, maxValue, emit) => {
  const _emit = (val: number | number[]) => {
    emit(UPDATE_MODEL_EVENT, val);
    emit(INPUT_EVENT, val);
  };

  const valueChanged = () => {
    if (props.range) {
      return ![minValue.value, maxValue.value].every(
        (item, index) => item === initData.oldValue[index]
      );
    } else {
      return props.modelValue !== initData.oldValue;
    }
  };

  const setValues = () => {
    if (props.min > props.max) {
      throwError("Slider", "min should not be greater than max.");
      return;
    }
    const val = props.modelValue;
    if (props.range && Array.isArray(val)) {
      if (val[1] < props.min) {
        _emit([props.min, props.min]);
      } else if (val[0] > props.max) {
        _emit([props.max, props.max]);
      } else if (val[0] < props.min) {
        _emit([props.min, val[1]]);
      } else if (val[1] > props.max) {
        _emit([val[0], props.max]);
      } else {
        initData.firstValue = val[0];
        initData.secondValue = val[1];
        if (valueChanged()) {
          //   elFormItem.validate?.("change").catch((err) => debugWarn(err));
          initData.oldValue = val.slice();
        }
      }
    } else if (!props.range && typeof val === "number" && !Number.isNaN(val)) {
      if (val < props.min) {
        _emit(props.min);
      } else if (val > props.max) {
        _emit(props.max);
      } else {
        initData.firstValue = val;
        if (valueChanged()) {
          //   elFormItem.validate?.("change").catch((err) => debugWarn(err));
          initData.oldValue = val;
        }
      }
    }
  };

  setValues();

  watch(
    () => initData.dragging,
    (val) => {
      if (!val) {
        setValues();
      }
    }
  );

  watch(
    () => props.modelValue,
    (val, oldVal) => {
      if (
        initData.dragging ||
        (Array.isArray(val) &&
          Array.isArray(oldVal) &&
          val.every((item, index) => item === oldVal[index]) &&
          initData.firstValue === val[0] &&
          initData.secondValue === val[1])
      ) {
        return;
      }
      setValues();
    },
    {
      deep: true,
    }
  );

  watch(
    () => [props.min, props.max],
    () => {
      setValues();
    }
  );
};

const useLifecycle = (props, initData, resetSize) => {};
</script>

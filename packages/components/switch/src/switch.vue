<template>
  <div
    :class="[cn.b(),cn.is('checked', checked),cn.is('disabled', switchDisabled)]"
    @click.prevent="switchValue"
  >
    <input
      ref="input"
      :class="cn.e('input')"
    />
    <span
      v-if="!inlinePrompt && (inactiveIcon || inactiveText)"
      :class="[
        cn.e('label'),
        cn.em('label', 'left'),
        cn.is('active', !checked),
      ]"
    >
      <el-icon v-if="inactiveIcon">
        <component :is="inactiveIcon" />
      </el-icon>
      <span
        v-if="!inactiveIcon && inactiveText"
        :aria-hidden="checked"
      >{{
        inactiveText
      }}</span>
    </span>
    <span :class="cn.e('container')">
      <div
        v-if="inlinePrompt"
        :class="[cn.e('inner')]"
      >
        <template v-if="activeIcon || inactiveIcon">
          <ari-icon
            v-if="activeIcon"
            :icon-name="activeIcon"
            :class="[cn.e('icon'), checked ? cn.is('show') : cn.is('hide')]"
          >

          </ari-icon>
          <ari-icon
            v-if="inactiveIcon"
            :icon-name="inactiveIcon"
            :class="[cn.e('icon'), !checked ? cn.is('show') : cn.is('hide')]"
          >

          </ari-icon>
        </template>
        <template v-else-if="activeText || inactiveIcon">
          <span
            v-if="activeText"
            :class="[cn.is('text'), checked ? cn.is('show') : cn.is('hide')]"
            :aria-hidden="!checked"
          >
            {{ activeText.substring(0, 3) }}
          </span>
          <span
            v-if="inactiveText"
            :class="[cn.is('text'), !checked ? cn.is('show') : cn.is('hide')]"
            :aria-hidden="checked"
          >
            {{ inactiveText.substring(0, 3) }}
          </span>
        </template>
      </div>
      <div :class="cn.e('action')">
      </div>
    </span>
        <span
      v-if="!inlinePrompt && (activeIcon || activeText)"
      :class="[
        cn.e('label'),
        cn.em('label', 'right'),
        cn.is('active', checked),
      ]"
    >
      <el-icon v-if="activeIcon"><component :is="activeIcon" /></el-icon>
      <span v-if="!activeIcon && activeText" :aria-hidden="!checked">{{
        activeText
      }}</span>
    </span>
  </div>
</template>
<script lang="ts">
import {
  CHANGE_EVENT,
  INPUT_EVENT,
  UPDATE_MODEL_EVENT,
} from "../../../constants";
import { useCss, useDisabled } from "../../../libs/hooks";
import { defineComponent, computed, nextTick, ref } from "vue";
import { switchProps } from "./switch";

const COMPONENT_NAME = "AriSwitch";
export default defineComponent({
  name: COMPONENT_NAME,
  props: switchProps,
  setup(props, { emit }) {
    const cn = useCss("switch");

    const isModelValue = ref(props.modelValue !== false);
    const input = ref<HTMLInputElement>();

    const switchDisabled = useDisabled(computed(() => props.loading));

    const actualValue = computed(() => {
      return isModelValue.value ? props.modelValue : props.value;
    });
    const checked = computed(() => actualValue.value === props.activeValue);

    const handleChange = (): void => {
      const val = checked.value ? props.inactiveValue : props.activeValue;
      emit(UPDATE_MODEL_EVENT, val);
      emit(CHANGE_EVENT, val);
      emit(INPUT_EVENT, val);
      nextTick(() => {
        input.value!.checked = checked.value;
      });
    };

    const switchValue = (): void => {
      if (switchDisabled.value) return;
      const { beforeChange } = props;
      if (!beforeChange) {
        handleChange();
        return;
      }
    };
    return {
      cn,
      switchValue,
      input,
      checked,
      switchDisabled
    };
  },
});
</script>

<template >
  <div :id="id" :class="cn.b()">
    <template v-if="effect=='ripple'">
      <div
        v-for="(i,index) in rippleNumber"
        :key="index"
        :class="cn.e('ripple')"
        :name="name"
      ></div>
    </template>
  </div>

</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { animationProps } from "./animation";
import { useCss} from "../../../libs/hooks";
import { guid } from "../../../libs/utils";
/*--- 初始化 --- */
const COMPONENT_NAME = "AriAnimation";
export default defineComponent({
  name: COMPONENT_NAME,
  props: animationProps,
  setup(props, { emit, slots }) {
    /*--- 通用变量 --- */
    const cn = useCss("animation");
    const name = guid();
    const id = guid();
    /*--- ref --- */
    const dom = ref<NodeListOf<HTMLElement> | null>();
    const parentDOM = ref<HTMLElement | null>();
    const effect = ref(props.effect);

    /*--- method --- */
    const init = () => {
      switch (effect.value) {
        case "ripple":
          ripple();
          break;
      }
    };
    const ripple = () => {
      let parentHeight = parentDOM.value?.offsetHeight;
      console.log(parentHeight)
      if (dom?.value && parentHeight) {
        for (let i = 0; i < dom.value?.length; i++) {
          dom.value[i].style.width = parentHeight * ((i + 2) / 5) + "px";
          dom.value[i].style.height = parentHeight * ((i + 3) / 5) + "px";
          dom.value[i].style.top = (-parentHeight * ((i + 4) / 5)) / 2 + "px";
          dom.value[i].style.left = (-parentHeight * ((i + 5) / 5)) / 2 + "px";
        }
      }
    };

    onMounted(() => {
      dom.value = document.getElementsByName(name);
      parentDOM.value = document.getElementById(id)?.parentElement;
      init()
    });

    return {
      name,
      id,
      cn
    };
  },
});
</script>
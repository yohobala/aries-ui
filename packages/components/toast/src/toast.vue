<template>
  <div
    v-if="show"
    :class="[cn.b(),toastClass]"
    :style="toastStyle"
  >
    <div
      :class="[cn.e('icon-container')]"
      :style="IconViewStyle"
    >
      <div
        :class="[iconIsAct == true ? cn.em('icon-container','act') : cn.em('icon-container','clam')]"
        :style="IconActStyle"
      >
        <div
          :class="['icon',iconName,iconClass]"
          :style="iconStyle"
        ></div>
      </div>
    </div>
    <div
      :class="cn.b('content')"
      :style="contentViewStyle"
    >
      <span
        :class="[cn.be('content','text'),textClass]"
        :style="textStyle"
      >{{text}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, toRefs } from "vue";
import { useCss } from "../../../libs/hooks";
import { toastProps } from "./toast";

const COMPONENT_NAME = "AriToast";
export default defineComponent({
  name: COMPONENT_NAME,
  props: toastProps,
  setup(props) {
    /*--- 通用变量 --- */
    const cn = useCss("toast");

    /*--- refs --- */
    const { autoClose } = toRefs(props);
    const { duration } = toRefs(props);
    const { id } = toRefs(props);
    const { type } = toRefs(props);
    let toastClass = ref("");
    let iconClass = ref("");
    let textClass = ref("");
    let show = ref(true);

    /*--- watch ---  */
    watch(
      () => props.close,
      (newVal, oldVal) => {
        show.value = !newVal;
      }
    );



    if (show && autoClose.value) {
      setTimeout(() => {
        show.value = false;

        const dom: HTMLElement = document.getElementById(
          id.value
        ) as HTMLElement;
        (dom.parentNode as ParentNode).removeChild(dom);
      }, duration.value);
    }

    switch (type.value) {
      case "success":
        toastClass.value = "toast-success";
        iconClass.value = "icon-success";
        textClass.value = "text-success";
        break;
      case "warning":
        toastClass.value = "toast-waring";
        iconClass.value = "icon-warning";
        textClass.value = "text-warning";
        break;
      case "message":
        toastClass.value = "";
        iconClass.value = "";
        textClass.value = "";
        break;
    }

    return {
      show,
      toastClass,
      iconClass,
      textClass,
      cn
    };
  },
});
</script>


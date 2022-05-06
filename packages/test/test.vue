<template>
  <div class="box" :class="[iconName, iconClass]" :style="iconStyle">
    <div>声明式渲染:{{ width }}</div>
    <div @click="watchTest">watchTest</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs, onMounted, ref, watch } from "vue";
import { calculatorInject } from "../../libs/store";
import { cssName } from "../../libs/hook";
export default defineComponent({
  name: "aqr-icon",
  props: {
    //图标
    iconName: {
      type: [String, Array],
      default: function () {
        return "";
      },
    },
    iconClass: {
      type: [String, Array],
      default: function () {
        return "";
      },
    },
    iconStyle: [Object, Array],

    text: String,
  },

  setup(props, { attrs, slots, emit, expose }) {
    const cn = cssName("icon");
    const switchKls = computed(() => [
      cn.b(),
      cn.m("lager"),
      cn.is("disabled", true),
      cn.is("checked", true),
    ]);

    //全局状态管理
    let { count, increase, updateCount } = calculatorInject();
    // console.log(count.value);
    increase();
    // console.log(count.value);

    //调用 Props
    const { text } = toRefs(props);
    // console.log(text.value);

    //定义 ref对象
    const ref1 = ref(0);
    //watch
    watch(ref1, () => {
      console.log("改变ref1:" + ref1.value);
    });
    const ref2 = ref<string | boolean>("foo");
    ref2.value = "1";
    // console.log(ref1.value);
    // console.log(ref2.value);

    //data
    let width = ref(0);
    watch(width, () => {
      console.log("改变width:" + width.value);
    });

    //computed
    const height = computed(() => {
      let a: number = 1;
      let b: number = 2;
      return width.value + a;
    });
    watch(height, () => {
      console.log("改变height:" + height.value);
    });

    //method
    const testMethod = () => {
    };
    function testMethod2() {
    }

    //生命周期
    onMounted(() => {
      testMethod();
      testMethod2();
    });

    //return
    return {
      width,
      height,
      ref1,
      cn,
    };
  },

  methods: {
    watchTest() {
      console.log(this.ref1);
      this.ref1 += 1;
      console.log(this.width);
      this.width += 1;
      console.log(this.height);
    },
  },
});
</script>
<style lang="scss">
$bg: rgb(47, 172, 53);
.container {
  background-color: $bg;
}

// div {
//   height: 50px;
//   margin-top: 10px;
//   background-color: aquamarine;
// }

.box1 {
  float: left;
  width: 49%;
}
.box2,
.box3 {
  margin-left: 10px;
  float: left;
  width: 25%;
}
.box4 {
  float: left;
  width: 25%;
}
.waterfall {
  column-count: 3;
  column-gap: 1;
  // display: flex;
  // flex-wrap: wrap;

  // width: 1000px;
}

.item {
  box-sizing: border-box;
  break-inside: avoid;
  padding: 10px;
}
.item-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: auto;
  font-size: 20px;
  color: #686868;
  box-sizing: border-box;
  border: 1px solid #ccc;
}
</style>
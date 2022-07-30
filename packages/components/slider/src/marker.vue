<script lang="ts">
import { computed, defineComponent, h } from 'vue'


import type { PropType } from 'vue'
import { useCss } from '../../../libs/hooks';

const COMPONENT_NAME = "AriSliderButton";
export default defineComponent({
  name: COMPONENT_NAME,
  props: {
    mark: {
      type: [String, Object] as PropType<string | Record<string, unknown>>,
      default: () => undefined,
    },
  },
  setup(props) {
    const cn = useCss('slider')
    const label = computed(() => {
      return typeof props.mark === 'string' ? props.mark : props.mark?.label
    })

    return {
      cn,
      label,
    }
  },
  render() {
    return h(
      'div',
      {
        class: this.cn.e('marks-text'),
        style: this.mark?.style,
      },
      this.label
    )
  },
})
</script>

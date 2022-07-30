import { computed } from 'vue'

export const useMarks = (props: Ari.Slider.SliderProps) => {
  return computed(() => {
    if (props.marks === undefined) {
      return []
    }
    else {
      const marksKeys = Object.keys(props.marks)
      return marksKeys
        .map(parseFloat)
        .sort((a, b) => a - b)
        .filter((point) => point <= props.max && point >= props.min)
        .map(
          (point): Ari.Slider.Mark => ({
            point,
            position: ((point - props.min) * 100) / (props.max - props.min),
            mark: (props.marks as Ari.Slider.Marks)[point] ,
          })
        )
    }


  })
}

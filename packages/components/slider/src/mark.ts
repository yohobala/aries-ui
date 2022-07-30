import { computed } from 'vue'
import { Mark, SliderProps,MarkInfo, Marks} from './type'

export const useMarks = (props: SliderProps) => {
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
          (point): Mark => ({
            point,
            position: ((point - props.min) * 100) / (props.max - props.min),
            mark: (props.marks as Marks)[point] ,
          })
        )
    }


  })
}

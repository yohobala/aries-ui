import { ComponentInternalInstance, computed, CSSProperties, nextTick, shallowRef, Ref, ref } from "vue";
import { getPoint } from "../../../libs/utils";
import { CHANGE_EVENT, INPUT_EVENT, UPDATE_MODEL_EVENT } from "../../../constants";

export const useSlides = (
    props: Ari.Slider.SliderProps,
    initData: Ari.Slider.SliderInitData,
    emit: ComponentInternalInstance['emit']
) => {
    const slider = shallowRef<HTMLElement>()

    const firstButton = ref<Ari.Slider.SliderButton>()

    const secondButton = ref<Ari.Slider.SliderButton>()

    const buttonRefs: Ari.Slider.ButtonRefs = {
        firstButton,
        secondButton,
    }

    const sliderDisabled = computed(() => {
        return props.disabled || false
    })

    const minValue = computed(() => {
        return Math.min(initData.firstValue, initData.secondValue)
    })

    const maxValue = computed(() => {
        return Math.max(initData.firstValue, initData.secondValue)
    })

    const barSize = computed(() => {
        return props.range
            ? `${(100 * (maxValue.value - minValue.value)) / (props.max - props.min)
            }%`
            : `${(100 * (initData.firstValue - props.min)) / (props.max - props.min)
            }%`
    })

    const barStart = computed(() => {
        return props.range
            ? `${(100 * (minValue.value - props.min)) / (props.max - props.min)}%`
            : '0%'
    })

    const containerStyle = computed<CSSProperties>(() => {
        return props.vertical ? { height: props.height } : {}
    })

    const barStyle = computed<CSSProperties>(() => {
        return props.vertical ? {
            height: barSize.value,
            bottom: barStart.value,
        } : {
            width: barSize.value,
            left: barStart.value,
        }
    })

    const resetSize = () => {
        if (slider.value) {
            initData.sliderSize =
                slider.value[`client${props.vertical ? 'Height' : 'Width'}`]
        }
    }

    const getButtonRefByPercent = (
        percent: number
    ): Ref<Ari.Slider.SliderButton | undefined> => {
        const targetValue = props.min + (percent * (props.max - props.min)) / 100
        if (!props.range) {
            return firstButton
        }
        let buttonRefName: 'firstButton' | 'secondButton'
        if (
            Math.abs(minValue.value - targetValue) <
            Math.abs(maxValue.value - targetValue)
        ) {
            buttonRefName =
                initData.firstValue < initData.secondValue
                    ? 'firstButton'
                    : 'secondButton'
        } else {
            buttonRefName =
                initData.firstValue > initData.secondValue
                    ? 'firstButton'
                    : 'secondButton'
        }
        return buttonRefs[buttonRefName]
    }

    const setPosition = (percent: number): Ref<Ari.Slider.SliderButton | undefined> => {
        const buttonRef = getButtonRefByPercent(percent)
        buttonRef.value!.setPosition(percent)
        return buttonRef
    }

    const setFirstValue = (firstValue: number) => {
        initData.firstValue = firstValue
        _emit(props.range ? [minValue.value, maxValue.value] : firstValue)
    }

    const setSecondValue = (secondValue: number) => {
        initData.secondValue = secondValue
        if (props.range) {
            _emit([minValue.value, maxValue.value])
        }
    }

    const _emit = (val: number | number[]) => {
        emit(UPDATE_MODEL_EVENT, val)
        emit(INPUT_EVENT, val)
    }

    const emitChange = async () => {
        await nextTick()
        emit(
          CHANGE_EVENT,
          props.range ? [minValue.value, maxValue.value] : props.modelValue
        )
    }
      
    const handleSliderPointerEvent = (event: MouseEvent | TouchEvent): Ref<Ari.Slider.SliderButton | undefined> | undefined => {
        if (sliderDisabled.value || initData.dragging) return
        resetSize()
        let newPercent = 0
        const point = getPoint(event)
        if (props.vertical) {
            const sliderOffsetBottom = slider.value!.getBoundingClientRect().bottom
            newPercent = ((sliderOffsetBottom - point.y) / initData.sliderSize) * 100
        }
        else {
            const sliderOffsetLeft = slider.value!.getBoundingClientRect().left
            newPercent = ((point.x - sliderOffsetLeft) / initData.sliderSize) * 100
        }
        if (newPercent < 0 || newPercent > 100) return
        return setPosition(newPercent)
    }

    const onSliderDown = async (event: MouseEvent | TouchEvent) => {
        const buttonRef = handleSliderPointerEvent(event)
        if (buttonRef) {
            await nextTick()
            buttonRef.value!.onButtonDown(event)
        }
    }

    console.log(initData)
    return {
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
        emitChange
    }
}  
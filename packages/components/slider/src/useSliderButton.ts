import { ComponentInternalInstance, ComputedRef, nextTick, ref, inject, computed, CSSProperties } from "vue";
import { EVENT_CODE, UPDATE_MODEL_EVENT } from "../../../constants"
import { debounce } from 'lodash-unified'
import { sliderProvideKey } from "../../../keys";
import { getPoint } from "../../../libs/utils";

const { left, down, right, up, home, end, pageUp, pageDown } = EVENT_CODE
const useTooltip = (
    props: Ari.Slider.SliderButtonProps,
    formatTooltip: ComputedRef<(value: number) => number | string>,
    showTooltip: ComputedRef<boolean>
) => {
    const tooltip = ref<any>()

    const tooltipVisible = ref(false)

    const displayTooltip = debounce(() => {
        showTooltip.value && (tooltipVisible.value = true)
    }, 50)


    return {
        tooltip,
        tooltipVisible,
        displayTooltip,
    }
}

export const useSliderButton = (
    props: Ari.Slider.SliderButtonProps,
    initData: Ari.Slider.SliderButtonInitData,
    emit: ComponentInternalInstance['emit']
) => {
    const {
        disabled,
        showTooltip,
        formatTooltip,
        min,
        max,
        step,
        precision,
        resetSize,
        sliderSize,
        emitChange,
    } = inject<Ari.Slider.SliderProvider>(sliderProvideKey)!

    const { tooltip, tooltipVisible, displayTooltip } =
        useTooltip(props, formatTooltip, showTooltip)

    const button = ref<any>()

    const currentPosition = computed(() => {
        return `${((props.modelValue - min.value) / (max.value - min.value)) * 100
            }%`
    })


    const wrapperStyle = computed(() => {
        return (
            props.vertical
                ? { bottom: currentPosition.value }
                : { left: currentPosition.value }
        ) as CSSProperties
    })

    const setPosition = async (newPosition: number) => {
        if (newPosition === null || Number.isNaN(+newPosition)) return
        if (newPosition < 0) {
            newPosition = 0
        } else if (newPosition > 100) {
            newPosition = 100
        }
        const lengthPerStep = 100 / ((max.value - min.value) / step.value)
        const steps = Math.round(newPosition / lengthPerStep)
        let value =
            steps * lengthPerStep * (max.value - min.value) * 0.01 + min.value
        value = Number.parseFloat(value.toFixed(precision.value))
        emit(UPDATE_MODEL_EVENT, value)
        if (!initData.dragging && props.modelValue !== initData.oldValue) {
            initData.oldValue = props.modelValue
        }

        await nextTick()
        initData.dragging && displayTooltip()
        // tooltip.value.updatePopper()
    }

    const handleMouseEnter = () => {
        initData.hovering = true
        displayTooltip()
    }
    const handleMouseLeave = () => {
        initData.hovering = false
        // if (!initData.dragging) {
        //     hideTooltip()
        // }
    }

    const onButtonDown = (event: MouseEvent | TouchEvent) => {
        if (disabled.value) return
        event.preventDefault()
        onDragStart(event)
        window.addEventListener('mousemove', onDragging)
        window.addEventListener('touchmove', onDragging)
        window.addEventListener('mouseup', onDragEnd)
        window.addEventListener('touchend', onDragEnd)
        window.addEventListener('contextmenu', onDragEnd)
        button.value.focus()
    }

    const onDragStart = (event: MouseEvent | TouchEvent) => {
        initData.dragging = true
        initData.isClick = true
        const { x, y } = getPoint(event)
        if (props.vertical) {
            initData.startY = y
        } else {
            initData.startX = x
        }
        initData.startPosition = Number.parseFloat(currentPosition.value)
        initData.newPosition = initData.startPosition
    }

    const onDragging = (event: MouseEvent | TouchEvent) => {
        if (initData.dragging) {
            initData.isClick = false
            displayTooltip()
            resetSize()
            let diff: number
            const { x, y } = getPoint(event)
            if (props.vertical) {
                initData.currentY = y
                diff = ((initData.startY - initData.currentY) / sliderSize.value) * 100
            } else {
                initData.currentX = x
                diff = ((initData.currentX - initData.startX) / sliderSize.value) * 100
            }
            initData.newPosition = initData.startPosition + diff
            setPosition(initData.newPosition)
        }
    }

    const onDragEnd = () => {
        if (initData.dragging) {
            /*
             * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
             * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
             */
            setTimeout(() => {
                initData.dragging = false
                if (!initData.hovering) {
                }
                if (!initData.isClick) {
                    setPosition(initData.newPosition)
                }
            }, 0)
            window.removeEventListener('mousemove', onDragging)
            window.removeEventListener('touchmove', onDragging)
            window.removeEventListener('mouseup', onDragEnd)
            window.removeEventListener('touchend', onDragEnd)
            window.removeEventListener('contextmenu', onDragEnd)
        }
    }

    const incrementPosition = (amount: number) => {
        if (disabled.value) return
        initData.newPosition =
            Number.parseFloat(currentPosition.value) +
            (amount / (max.value - min.value)) * 100
        setPosition(initData.newPosition)
        emitChange()
    }


    const onLeftKeyDown = () => {
        incrementPosition(-step.value)
    }

    const onRightKeyDown = () => {
        incrementPosition(step.value)
    }

    const onPageDownKeyDown = () => {
        incrementPosition(-step.value * 4)
    }

    const onPageUpKeyDown = () => {
        incrementPosition(step.value * 4)
    }

    const onHomeKeyDown = () => {
        if (disabled.value) return
        setPosition(0)
        emitChange()
    }

    const onEndKeyDown = () => {
        if (disabled.value) return
        setPosition(100)
        emitChange()
    }

    const onKeyDown = (event: KeyboardEvent) => {
        let isPreventDefault = true
        if ([left, down].includes(event.key)) {
            onLeftKeyDown()
        } else if ([right, up].includes(event.key)) {
            onRightKeyDown()
        } else if (event.key === home) {
            onHomeKeyDown()
        } else if (event.key === end) {
            onEndKeyDown()
        } else if (event.key === pageDown) {
            onPageDownKeyDown()
        } else if (event.key === pageUp) {
            onPageUpKeyDown()
        } else {
            isPreventDefault = false
        }
        isPreventDefault && event.preventDefault()
    }
    return {
        button,
        tooltip,
        tooltipVisible,
        showTooltip,
        wrapperStyle,
        handleMouseEnter,
        handleMouseLeave,
        onButtonDown,
        onKeyDown,
        setPosition,
    }
}
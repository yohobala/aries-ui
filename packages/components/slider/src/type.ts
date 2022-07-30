import { type } from "os";
import { ComponentPublicInstance, ComputedRef, CSSProperties, ExtractPropTypes, Ref } from "vue";
import { sliderButtonProps } from "./button";
import { silderProps } from "./slider";

export namespace Slider {
  export type SliderProps = ExtractPropTypes<typeof silderProps>
  export type SliderInitData = {
    firstValue: number,
    secondValue: number,
    oldValue: number | number[],
    dragging: boolean,
    sliderSize: number,
  }
  export interface SliderProvider {
    tooltip: Ref<HTMLElement | undefined>,
    showTooltip: ComputedRef<boolean>,
    formatTooltip: ComputedRef<(value: number) => number | string>,
    min: ComputedRef<number>
    max: ComputedRef<number>,
    step: ComputedRef<number>,
    precision: ComputedRef<number>
    disabled: ComputedRef<boolean>,
    sliderSize: ComputedRef<number>
    resetSize: () => void
    emitChange: () => void
  }

  export type SliderButtonProps = ExtractPropTypes<typeof sliderButtonProps>
  export interface SliderButtonInitData {
    hovering: boolean
    dragging: boolean
    isClick: boolean
    startX: number
    currentX: number
    startY: number
    currentY: number
    startPosition: number
    newPosition: number
    oldValue: number
  }

  export interface SliderButton extends ComponentPublicInstance {
    tooltip: Ref<HTMLElement | undefined>
    showTooltip: Ref<boolean>
    onButtonDown: (event: MouseEvent | TouchEvent) => void
    setPosition: (newPosition: number) => void
  }
  export type ButtonRefs = {
    [b in 'firstButton' | 'secondButton']: Ref<SliderButton | undefined>
  }

  export type Stops = {
    stops: ComputedRef<number[]>
    getStopStyle: (position: number) => CSSProperties
  }

  export type MarkInfo = {
    style: CSSProperties
    label: string
  }
  export type Mark = {
    point: number
    position: number
    mark: MarkInfo | string
  }
  export type Marks = {
    [ key in number] : MarkInfo | string
  }
}

export type SliderProps = Slider.SliderProps
export type SliderInitData = Slider.SliderInitData
export type SliderProvider = Slider.SliderProvider
export type SliderButtonProps = Slider.SliderButtonProps
export type SliderButtonInitData = Slider.SliderButtonInitData
export type SliderButton = Slider.SliderButton
export type ButtonRefs = Slider.ButtonRefs
export type Stops = Slider.Stops
export type Mark = Slider.Mark
export type Marks = Slider.Marks
export type MarkInfo = Slider.MarkInfo





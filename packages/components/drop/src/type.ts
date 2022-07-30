import { ExtractPropTypes,Ref } from "vue"
import { dropProps, dropEmits } from "./drop"
import { dropItemProps } from "./drop-item"

export namespace Drop {
    export type DropProps = ExtractPropTypes<typeof dropProps>
    export type DropEmits = typeof dropEmits
    export interface DropProvide {
        isVertical: Ref<boolean>,
        items:Ref<Array<DropItemContext>>,
        isChange: Ref<boolean>,
        isMove: Ref<boolean>,
        translateDif: Ref<number>,
        direction: Ref<string>,
        addItem: (item: DropItemContext) => void,
        changeActiveIndex: (beginIndex: number,endIndex:number,step:number) => void,
        resetData: () => void,
        changeMoveState: (state:boolean) => void
    }
    export type DropItemProps = ExtractPropTypes<typeof dropItemProps>
    export interface DropItemContext {
        props: DropItemProps,
        id: string,
        title: string,
        itemDistance: number,
        changeIndex: (num: number) => void
    }
}
export type DropProps = Drop.DropProps
export type DropEmits = Drop.DropEmits
export type DropProvide = Drop.DropProvide
export type DropItemProps = Drop.DropItemProps
export type DropItemContext = Drop.DropItemContext

import { ExtractPropTypes,Ref } from "vue"
import { sideEmits, sideProps } from "./side"

export namespace Side {
    export type SideProps = ExtractPropTypes<typeof sideProps>
    export type SideEmits = typeof sideEmits
}
export type SideProps = Side.SideProps
export type SideEmits = Side.SideEmits
import { switchProps } from "aries-ui";
import { ExtractPropTypes } from "vue";



export namespace Switch {
    export type SwitchProps = ExtractPropTypes<typeof switchProps>
}  

export type SwitchProps = Switch.SwitchProps
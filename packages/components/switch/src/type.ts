import { ExtractPropTypes } from "vue";
import { switchProps } from "./switch";


export namespace Switch {
    export type SwitchProps = ExtractPropTypes<typeof switchProps>
}  

export type SwitchProps = Switch.SwitchProps
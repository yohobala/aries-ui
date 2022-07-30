import { MaybeRef } from "@vueuse/core"
import { formProvideKey } from "../../../keys"
import { inject,computed,unref } from "vue"
import { useProp } from ".."

export const useDisabled = (fallback?: MaybeRef<boolean | undefined>) => {
    const disabled = useProp<boolean>('disabled')
    const form = inject(formProvideKey, undefined)
    return computed(
      () => disabled.value || unref(fallback) || form?.disabled || false
    )
  }
  
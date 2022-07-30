import { isClient, useTimeoutFn } from "@vueuse/core"
import { DIRECTION, UPDATE_MODEL_EVENT, ZINDEX } from "../../../constants"
import { isBoolean } from "../../../libs/utils"
import { getCurrentInstance, nextTick, onMounted, ref, Ref, SetupContext, watch } from "vue"
import { SideEmits, SideProps } from "./type"

export const sideProps = {
    modelValue: {
        type: Boolean,
        required: true,
    },
    appendToBody: {
        type: Boolean,
        default: false,
    },
    destroyOnClose: {
        type: Boolean,
        default: false,
    },
    direction: {
        type: String,
        default: 'btt',
        values: ['ltr', 'rtl', 'ttb', 'btt'],
    },
    openDelay: {
        type: Number,
        default: 0,
    },
    closeDelay: {
        type: Number,
        default: 0,
    },
    modal: {
        type: Boolean,
        default: true,
    },
    modalClass: String,
    zIndex: {
        type: Number,
    },
    closeOnClickModal: {
        type: Boolean,
        default: true,
    },
    maxSize: {
        type: [Number, String],
        default: "100%"
    },
    initSize: {
        type: [Number, String],
        default: "30%"
    }
}

export const sideEmits = {
    open: () => true,
    opened: () => true,
    close: () => true,
    closed: () => true,
    [UPDATE_MODEL_EVENT]: (value: boolean) => isBoolean(value),
    openAutoFocus: () => true,
    closeAutoFocus: () => true,
    changeSize: (size: string) => true
}

export const useSide = (
    props: SideProps,
    targetRef: Ref<HTMLElement | undefined>
) => {
    const instance = getCurrentInstance()!
    const emit = instance.emit as SetupContext<SideEmits>['emit']

    const rendered = ref(false);
    const visible = ref(false)
    const closed = ref(false)
    const zIndex = ref(props.zIndex || ZINDEX.popper)

    let openTimer: (() => void) | undefined = undefined
    let closeTimer: (() => void) | undefined = undefined

    const open = () => {
        closeTimer?.()
        openTimer?.()

        if (props.openDelay && props.openDelay > 0) {
            ; ({ stop: openTimer } = useTimeoutFn(() => handleOpen(), props.openDelay))
        } else {
            handleOpen()
        }
    }

    const afterEnter = () => {
        emit("opened");
    };

    const afterLeave = () => {
        emit("closed");
        emit(UPDATE_MODEL_EVENT, false);
        if (props.destroyOnClose) {
            rendered.value = false;
        }
    };

    const beforeLeave = () => {
        emit("close");
    };

    function close() {
        openTimer?.()
        closeTimer?.()

        doClose()
    }
    const handleOpen = () => {
        if (!isClient) return
        visible.value = true
    }

    const handleClose = () => {
        close()
    }


    const onModalClick = () => {
        if (props.closeOnClickModal) {
            handleClose()
        }
    }

    function doClose() {
        visible.value = false
    }
    watch(
        () => props.modelValue,
        (val) => {
            console.log(val)
            if (val) {
                console.log(val)
                closed.value = false
                open()
                rendered.value = true // enables lazy rendering
                emit('open')
                zIndex.value = props.zIndex ? zIndex.value++ : ZINDEX.popper
                nextTick(() => {
                    if (targetRef.value) {
                        targetRef.value.scrollTop = 0
                    }
                })
            } else {
                console.log(visible.value)
                if (visible.value) {
                    close()
                }
            }
        }
    )


    onMounted(() => {
        if (props.modelValue) {
            visible.value = true
            rendered.value = true // enables lazy rendering
            open()
        }
    })


    return {
        afterEnter,
        afterLeave,
        beforeLeave,
        visible,
        onModalClick,
    }
}
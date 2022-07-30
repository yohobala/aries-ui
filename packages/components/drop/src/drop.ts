export const dropProps = {
    ...{
        direction: {
            type: String,
            default: 'vertical',
            validator(val: string) {
                return ['horizontal', 'vertical'].includes(val)
            },
        },
    }
}

export const  dropEmits = {

}

export const dropProvideKey = "rootDrop"
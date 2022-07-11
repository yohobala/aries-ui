import { ExtractPropTypes } from "vue"
import { tabsProps } from "./tabs"
import { tabsItemProps } from "./tabs-item"
export type TabsProps = ExtractPropTypes<typeof tabsProps>

export type TabsItemProps = ExtractPropTypes<typeof tabsItemProps>

export interface TabsItemRegistered {
    index: string | number
}


export interface TabsItemClick {
    index: string | number
}


export interface TabsProvide {
    props: TabsProps,
    activeIndex: string | number,
    itemWidth: number,
    barInitLeft: number,
    barLeft: number,
    tabsID: string,
    handleTabsItemClick: (item: TabsItemClick) => void
}
import { TaskFunction } from "gulp";
import { buildRoot } from "./paths";
import { run } from './process'


// 自定义每个task的name
export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>
    Object.assign(fn, { displayName: name })


export const runTask = (name: string) =>
    withTaskName(`shellTask:${name}`, () =>
        run(`pnpm run start ${name}`, buildRoot)
    )
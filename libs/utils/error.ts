import {consoleError,consoleWarning} from "./console"
export function throwError(scope: string, m: string): void {
        consoleError(`[${scope}] ${m}`)
}

export function debugWarn(scope: string, m: string): void {
        consoleWarning(`[${scope}] ${m}`)
}
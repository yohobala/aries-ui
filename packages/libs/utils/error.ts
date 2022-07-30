import { consoleError, consoleWarning } from "./console"

class AriError extends Error {
        constructor(m: string) {
                super(m)
                this.name = 'AriesUIError'
        }
}

export function throwError(scope: string, m: string): void {
        throw new AriError(`[${scope}] ${m}`)
}

export function debugWarn(scope: string, m?: string): void {
        consoleWarning(`[${scope}] ${m}`)
}
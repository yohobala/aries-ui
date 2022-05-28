import { argsToString } from "./arguments"

function getTypeStyle(bgColor) {
    return `background-color:${bgColor};color:white;font-size:12;padding:2px`
}

console.ari = {}

const consolePrimary = console.ari.primary = function () {
    console.log(`%cprimary:%c\n%c${argsToString(arguments)}`, getTypeStyle("rgba(1, 108, 175,0.6)"), "", "font-size:12px")
}
const consoleSuccess = console.ari.success = function () {
    console.log(`%csuccess:%c\n%c${argsToString(arguments)}`, getTypeStyle("rgba(0, 137, 9,0.6)"), "", "font-size:12px")
}
const consoleWarning = console.ari.warning = function () {
    console.log(`%cwarning:%c\n%c${argsToString(arguments)}`, getTypeStyle("rgba(247, 132, 0,0.6)"), "", "font-size:12px")
}
const consoleError = console.ari.error = function () {
    console.log(`%cerror:%c\n%c${argsToString(arguments)}`, getTypeStyle("rgba(247, 0, 0,0.6)"), "", "font-size:12px")
}
const consoleCapsule = console.ari.capsule = function capsule(name: string, version: string) {
    console.log(`%c${name}%c${version}`, "padding: 3px;color:white;background:#023047", "padding:3px;color:white;background:#219EBC")
}



export { consolePrimary, consoleSuccess, consoleWarning, consoleError, consoleCapsule }


export default {
    primary: consolePrimary,
    success: consoleSuccess,
    warning: consoleWarning,
    error: consoleError,
    capsule: consoleCapsule,
}
export function setTheme(name:string){
    const htmlDOM = document.getElementsByTagName("html")[0]
    htmlDOM.className = name
}
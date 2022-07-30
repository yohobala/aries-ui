import {App} from 'vue'
import { TypeComponentInstall } from './typescript'



export const  componentInstall = <T,E>(main : T,extra?: E) : any =>  {
    (main as TypeComponentInstall<T>).install = (app) :void =>{
        for(const component of [main,...Object.values(extra ?? [])]){
            app.component(component.name,component)
        }
    }

    if(extra){
        for (const [key,component] of Object.entries(extra)){
            main[key] = component
        }
    }

    return main
}
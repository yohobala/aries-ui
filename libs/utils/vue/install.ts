import {App} from 'vue'

export const  componentInstall = (component : any) => {
    
    const install = (app: App)  => {
        app.component(component.name, component);
    }

    return install
}
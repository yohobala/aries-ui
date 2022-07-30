import { App } from "vue"

const INSTALLED_KEY = Symbol('INSTALLED_KEY')

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    if (app[INSTALLED_KEY]) return

    app[INSTALLED_KEY] = true
    components.forEach((c) => app.use(c))
  }

  return install
}

// export default {
//   install(app: App){
//       //组件注册
//       components.map(item => {
//           app.use(item)
//       })
      
//       // //共享状态
//       // app.use(store)

//       //全局变量
//       // app.config.globalProperties.aqrui = api
//       //测试
//   }
// }

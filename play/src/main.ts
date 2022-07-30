import { createApp } from 'vue'
import App from './App.vue'


import ariesUI from '../../dist/aries-ui'
import '../../dist/aries-ui/theme-chalk/index.css'

const app = createApp(App)

app.use(ariesUI)
app.mount('#app')
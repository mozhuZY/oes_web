import { createApp } from 'vue'
// 引入vuex的配置对象store
import store from './store/index'
// 引入VueRouter的配置对象router
import router from './router/index'
// 引入ElementPlus配置对象
import {elComponents, elPlugins} from "./utils/elementPlus"

// 引入App组件
import App from './App'

const app = createApp(App);
app.use(store);
app.use(router);

elComponents.forEach((component) => {
    app.component(component.name, component)
})

elPlugins.forEach((plugin) => {
    app.use(plugin)
})

app.mount('#app')
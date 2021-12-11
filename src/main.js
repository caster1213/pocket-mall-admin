import Vue from 'vue'
import App from './App.vue'
import router from './config/router.config'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import component from './config/component.config'

Vue.config.productionTip = false
component.init()
let vue = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
window.instance = vue

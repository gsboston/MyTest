import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// 导入执行一次就可以
import interceptor from './http-interceptor'

Vue.config.productionTip = false

// 挂载全局的
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

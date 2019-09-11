import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // if(to.fullPath === '/shoppingCart'){
    
  // } else{

  // }
  console.log('before each')

  next()
})

// 全局解析守卫
// 时间触发比前置钩子晚一些
router.beforeResolve((to, from, next) => {
  console.log('before resolve',to,from)
  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  console.log('after each')
})

// 钩子执行顺序
// 前置钩子》独享钩子》组件内部beforeRouteEnter》解析钩子》后置钩子


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

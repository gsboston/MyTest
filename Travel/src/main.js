// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// click 延迟300ms执行 解决方案npm install fastclick --save
// import fastClick from 'fastclick'
// 轮播插件
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'styles/reset.css'
// 解决移动端1px边框问题
import 'styles/border.css'
// 引入iconfont
import 'styles/iconfont.css'
// 轮播插件
import 'swiper/dist/css/swiper.css'

Vue.config.productionTip = false
// click 延迟300ms执行 解决方案npm install fastclick --save
// fastClick.attach(document.bodu)
// npm install stylus --save css辅助工具
// npm install stylus-loader --save
// 轮播插件
Vue.use(VueAwesomeSwiper)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

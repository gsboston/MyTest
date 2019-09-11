import Vue from 'vue'
import Router from 'vue-router'
import pageB  from './views/pageB'
import Test from './views/Test'

//安装路由到vue
Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect : '/a'
  },
  {
    path: '/a/:id',
    name: 'pageA',
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      // 在进入路由之前调用
      console.log('before enter');
      next()
    },
    // component : pageA
    // 异步组件 触发路由时才会加载组件
    component: ()=>import('./views/pageA')
  },
  // {
  //   path: '/b/:id',
  //   props: true,
  //   component : pageB,
  //   children:[
  //     {
  //       path: 'test',
  //       component : Test
  //     }
  //   ]
  // }
]

export default new Router({
  mode: 'history',
  routes
})
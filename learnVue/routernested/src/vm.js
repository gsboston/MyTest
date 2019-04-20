import Vue from 'vue/dist/vue.esm';
import VueRouter from 'vue-router';

import router from './router';

import '../css/main.css';

Vue.use(VueRouter);

let vm=new Vue({
  el: '#div1',
  data: {},
  router
});

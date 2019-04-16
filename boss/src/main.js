import "babel-polyfill";
import Vue from 'vue';
import "iview/dist/styles/iview.css";
import iView from "iview";
import BaseComp from "./core";
import filters from './core/base/filters'

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(BaseComp);
window.iView = iView;
window.Vue = Vue;

import Frame from './Frame';
import router from './router';
Vue.$api.setRouter(router);

new Vue({
  el: '#app',
  router,
  template: '<Frame/>',
  components: { Frame }
});

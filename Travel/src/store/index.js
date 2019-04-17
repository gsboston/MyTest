import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

// module拆分代码，

export default new Vuex.Store({
  state,
  mutations,
  // 使用场景，二次处理数据，类似计算属性
  getters: {
    doubleCity(state) {
      return state.city + 'hot'
    }
  }
})

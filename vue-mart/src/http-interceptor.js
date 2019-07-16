import store from "./store";
import axios from "axios";
import router from "./router";

// 拦截axios所有http请求。预先放入token请求头
axios.interceptors.request.use(config => {
    if (store.state.token) {
        // 如果存在令牌，放入请求头
        config.headers.token = store.state.token;
    }
    return config;
})


// 响应拦截器，提前预处理响应
axios.interceptors.response.use(response => {
    // 如果code为-1 说明用户已注销，或者token已经过期
    // 此时需要重新登录，并且还要清除本地缓存信息 localstorage vuex
    if (response.status == 200) {
        const data = response.data;
        if (data.code == -1) {
            clearHandler();
        }
    }
    return response;
}, err => {
    if (err.response.status === 401) { // 用户未授权
        clearHandler();
    }
})

function clearHandler() {
    // 清空缓存
    store.commit('setToken', '');
    localStorage.removeItem('token');

    // 跳转至登录
    router.push({
        path: '/login',
        query: {
            redirect: router.currentRoute.path
        }
    });
}
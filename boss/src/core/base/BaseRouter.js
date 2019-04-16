import Vue from "vue";

const BaseRouter = function() {
    let _this = this;
    _this.routes = new Object();
    _this.param = {};
};

BaseRouter.prototype.addRouter = function(route) {
    if(this.routes[route.code]) {
        console.warn("路由编码 " + route.code + "重复");
    }
    this.routes[route.code] = route;
};

BaseRouter.prototype.getRouter = function(code) {
    var route = null;
    if(code == null || code == "") {
        for(let key in this.routes) {
            route = this.routes[key];
            break;
        }
    }else {
        route = this.routes[code];
    }
    return route ? Object.assign({}, route) : null;
};

BaseRouter.prototype.getPage = function(code, config) {
    config = config || {};
    let route = window.getRouter(code);
    if(route == null) {
        return null;
    }
    let authRes = window.Context._getAuthResources(code);
    if(authRes == null) {
        // Vue.prototype.$Modal.error("您没有该功能的访问权限，请联系管理员");
    }

    let instance = new Vue({
        render: function(createElement) {
            return createElement(route.component, {
                props: Object.assign({}, authRes, config.props)
            });
        }
    });

    instance.$mount();
    let comp = instance.$children[0];

    return comp;
};

Vue.component("func-node", {
    props: {
        code: null
    },
    render (createElement) {
        let _props = this.$attrs;
        let code = this.code;
        let route = window.getRouter(code);
        let authRes = window.Context._getAuthResources(code);
        let comp = createElement(route.component, {
            props: Object.assign({}, authRes, _props)
        });
        return comp;
    },
    mounted () {
        let comp = this.$children[0];
    }
});

let _router = new BaseRouter();

window.addRouter = function() {
    _router.addRouter.apply(_router, arguments);
};

window.getRouter = function() {
    return _router.getRouter.apply(_router, arguments);
};
// Api.init = function() {
//     for(let method in Api) {
//         if(method != "init") {
//             delete Api[method];
//         }
//     }
//     Api.jumpToSignCloud = function(code, props) {
//         window._jumpSignCloudMode = true;
//         window._frameRouter.push("M03");
//         setTimeout(() => {
//             window._portal.initCurrentModule();
//             window._signCloud.openRight(code, {
//                 props: props
//             });
//         });
//     };
//     Api.openContractBuilder = function(defCode, props) {
//         window._jumpSignCloudMode = true;
//         window._frameRouter.push("M03");
//         setTimeout(() => {
//             window._portal.initCurrentModule();
//             window._signCloud.openContractBuilder(defCode, props);
//         });
//     };
// };
// Api.init();

Vue.prototype.getPage = _router.getPage;

export default BaseRouter;
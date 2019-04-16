import Vue from "vue";
import BaseRouter from "../core/base/BaseRouter";
import Router from "vue-router";
// import Login from "../system/login/login.vue";
import Portal from "../Portal.vue";
// import Report from "../report/index.vue";
// import CRM from "../crm/index.vue";
// import SystemManage from "../systemManage/index.vue";
// import SignCloud from "../signCloud/index.vue";
// import Demo from "../system/demo/demo.vue";
import Empty from "../portal/empty.vue";
// import UserInfo from "../portal/userInfo.vue";
// import ChangePhone from "../portal/changePhone.vue";
// import ChangePassword from "../portal/changePassword.vue";
// import ForgotPassword from "../system/login/forgotPassword.vue";
// import CompanyOpenApply from "../system/login/companyOpenApply.vue";
// import Swagger from "../system/swagger/swagger.vue";

Vue.use(Router);

let routes = [{
    path: "/",
    component: Portal,
    beforeEnter: (to, from, next) => {
        $Http.request({
            url: "/system/isLogin.do"
        }).then(loginParam => {
            iView.LoadingBar.start();
            if(loginParam.status) {
                iView.LoadingBar.finish();
                Context._set(loginParam.user, loginParam.organization, loginParam.resources, loginParam.modules, loginParam.menus, loginParam.token);
                next();
            }else {
                iView.LoadingBar.finish();
                router.push({
                    name: "login",
                    params: {
                        error: 403,
                        message: "您尚未登录，请先登录~"
                    }
                });
            }
        });
    },
    children: [{
    //     path: "",
    //     redirect: "empty"
    // }, {
        path: "",
        component: resolve => require(["../system/homepage/homepage.vue"], resolve)
    },{
        path: "M01",
        beforeEnter: (to, from, next) => {
            if(validModule("M01") == true) {
                next();
            }else {
                next();
                next("empty");
            }
        },
        // component: Report
        component: resolve => require(["../report/index.vue"], resolve)
    }, {
        path: "M02",
        beforeEnter: (to, from, next) => {
            if(validModule("M02") == true) {
                next();
            }else {
                next("empty");
            }
        },
        // component: CRM
        component: resolve => require(["../crm/index.vue"], resolve)
    }, {
        path: "M03",
        beforeEnter: (to, from, next) => {
            if(validModule("M03") == true) {
                next();
            }else {
                next("empty");
            }
        },
        // component: SignCloud
        component: resolve => require(["../signCloud/index.vue"], resolve)
    }, {
        path: "M05",
        beforeEnter: (to, from, next) => {
            if(validModule("M05") == true) {
                next();
            }else {
                next("empty");
            }
        },
        // component: SystemManage
        component: resolve => require(["../systemManage/index.vue"], resolve)
    },{
        path: "M07",
        beforeEnter: (to, from, next) => {
            if(validModule("M07") == true) {
                next();
            }else {
                next("empty");
            }
        },
        // component: serviceCloud
        component: resolve => require(["../serviceCloud/index.vue"], resolve)
    }, {
        path: "M07",
        beforeEnter: (to, from, next) => {
            if(validModule("M07") == true) {
                next();
            }else {
                next("empty");
            }
        },
        // component: SystemManage
        component: resolve => require(["../serviceCloud/index.vue"], resolve)
    }, {
        path: "M08",
        beforeEnter: (to, from, next) => {
            if(validModule("M08") == true) {
                next();
            }else {
                next("empty");
            }
        },
        // component: SystemManage
        component: resolve => require(["../operate/index.vue"], resolve)
    }, {
        path: "M09",
        beforeEnter: (to, from, next) => {
            if(validModule("M09") == true) {
                next();
            }else {
                next("empty");
            }
        },
        // component: SystemManage
        component: resolve => require(["../slb/index.vue"], resolve)
    },
        {
      path: "M10",
      beforeEnter: (to, from, next) => {
        if(validModule("M10") == true) {
          next();
        }else {
          next("empty");
        }
      },
      component: resolve => require(["../ztjf/index.vue"], resolve)
      },{
            path: "M11",
            beforeEnter: (to, from, next) => {
                if(validModule("M11") == true) {
                    next();
                }else {
                    next("empty");
                }
            },
            // component: SignCloud
            component: resolve => require(["../signCloud/index.vue"], resolve)
        },
        {
        path: "userInfo",
        // component: UserInfo
        component: resolve => require(["../portal/userInfo.vue"], resolve)
    }, {
        path: "changePhone",
        // component: ChangePhone
        component: resolve => require(["../portal/changePhone.vue"], resolve)
    }, {
        path: "changePassword",
        // component: ChangePassword
        component: resolve => require(["../portal/changePassword.vue"], resolve)
    }, {
        path: "empty",
        beforeEnter: (to, from, next) => {
            if(Array.notEmpty(Context._getModules())) {
                next(Context._getModules()[0].code);
            }else {
                next();
            }
        },
        component: Empty
    }, {
        path: "HelpCenter",
        component: resolve => require(["../systemManage/helpCenter/helpCenter.vue"], resolve)
    }]
},{
    path: "/login",
    name: "login",
    component: resolve => require(["../system/login/login.vue"], resolve)
    // component: Login
},{
    path: "/demo",
    component:  resolve => require(["../system/demo/demo.vue"], resolve)
    // component:  Demo
},{
    name: "ForgotPassword",
    path: "/forgotPassword",
    // component: ForgotPassword
    component: resolve => require(["../system/login/forgotPassword.vue"], resolve)
},{
    name: "CompanyOpenApply",
    path: "/companyOpenApply",
    // component: CompanyOpenApply
    component: resolve => require(["../system/login/companyOpenApply.vue"], resolve)
}, {
    path: "/swagger",
    // component: Swagger
    component: resolve => require(["../system/swagger/swagger.vue"], resolve)
}, {
    path: "/FQ",
    component: resolve => require(["../systemManage/helpCenter/helpCenter.vue"], resolve)
}];

let validModule = function(moduleCode) {
    let modules = Context._getModules();
    if(Array.notEmpty(modules)) {
        for(let module of modules) {
            if(module.code == moduleCode) {
                return true;
                break;
            }
        }
    }
    return false;
};

let router = new Router({
    routes: routes
});

window._frameRouter = router;

export default router;
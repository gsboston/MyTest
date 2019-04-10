define([], function () {

    // 定义Route构造函数，接收调用构造函数时的路由配置
    function Route(option) {
        this.routes = option.routes;
        this.init();
    }

    // 为Route添加原型方法
    Route.prototype = {
        constructor: Route,
        //初始化
        init() {
            var _that = this;

            //1、通过给window对象添加hashchange事件监听路由变化
            window.addEventListener("hashchange", function () {
                //1.1、获取最新的hash值
                var hash = location.hash.substring(1);

                //1.2、将hash(/saleman)跟本地保存的的路由中的path进行匹配，匹配到指定路由，就执行指定模块的代码
                var route = _that.routes.find(item => {
                    return item.path === hash
                }); //如果找不到符合条件的元素，那么route值为空

                if (route) {
                    //route.component只是找到对应模块的返回值，如果值是一个函数，()执行这个函数就是调用了这个模块
                    route.component();
                }

            })
        },

        push({ path }) {
            //从this.routes中找到path与参数path相等的对象
            var route = this.routes.find(item => {
                return item.path === path;
            });

            if (route) {
                route.component();
            }
        }
    }

    return Route;

})
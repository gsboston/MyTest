import Vue from "vue";
import iView from "iview";
import Axios from "axios";
import Layer from "../component/layer.vue";

const STATUS_PENDING = 0;
const STATUS_FULFILLED = 1;
const STATUS_REJECTED = 2;

let RequestPool = new Object();
RequestPool.METHOD_GET = "get";
RequestPool.METHOD_POST = "post";
RequestPool.METHOD_PUT = "put";
RequestPool.METHOD_PUT = "delete";

const layer = (function() {
    let instance = new Vue({
        render: function(createElement) {
            return createElement(Layer);
        }
    });
    instance.$mount();
    let comp = instance.$children[0];
    document.body.appendChild(comp.$el);
    return comp;
})();

RequestPool.request = function() {
    let config = arguments[0];
    if(arguments.length > 1) {
        config = Array.prototype.slice.call(arguments);
    }
    return new HttpRequest(config).init();
};
RequestPool.get = function(config) {
    return RequestPool.request(Object.assign(config, {method: RequestPool.METHOD_GET}));
};

RequestPool.post = function(config) {
    return RequestPool.request(Object.assign(config, {method: RequestPool.METHOD_POST}));
};

RequestPool.put = function(config) {
    return RequestPool.request(Object.assign(config, {method: RequestPool.METHOD_PUT}));
};

RequestPool.delete = function(config) {
    return RequestPool.request(Object.assign(config, {method: RequestPool.METHOD_DELETE}));
};

const DEFAULT_CONFIG = {
    url: "/test/200.do",
    method: "post",
    headers: {"X-Requested-With": "XMLHttpRequest"},
    timeout: 10000,
    responseType: "json",
};

let HttpRequest = function(config) {
    let _this = this;
    _this.status = STATUS_PENDING;
    _this.onResolve = null;
    _this.onReject = null;
    _this.result = null;
    _this.error = null;
    _this.config = buildConfig(config);
};

HttpRequest.prototype.init = function() {
    setTimeout(this.request.bind(this), 0);
    return this;
};

HttpRequest.prototype.request = function() {
    let _this = this;
    let config = _this.config;

    let count = config.length;
    let result = new Array(count);
    let completeCount = 0;

    iView.LoadingBar.start();

    for(let i = 0; i < config.length; i++) {
        let index = i;
        let _config = config[index];
        let needLoading = (_config.loading !== false);
        needLoading && layer.show();
        // console.log("show", layer.queue, _config.url);

        _this._request(_config, function(data) {
            needLoading && layer.hide();
            result[index] = data;
            completeCount++;
            if(completeCount == count) {
                _this.resolve(result);
            }

        }, function(error) {
            needLoading && layer.hide();
            if(count == 1) {
                _this.reject(error);
            }else {
                result[index] = (error.status > 200 && error.status < 300 ? error : null);
                console.log(error);
                completeCount++;
                if(completeCount == count) {
                    _this.resolve(result);
                }
            }
        });

    }

    return _this;
};

HttpRequest.prototype._request = function(config, resolve, reject) {

    Axios.request(config).then(function(response) {

        let demand = response.data;
        let data = demand.data;
        let status = demand.status;

        if(status == 200) {
            resolve(data);
        }else {
            reject(demand);
        }

    }).catch(function(error) {
        if(error.response) {
            reject({
                status: error.response.status,
                message: error.response.statusText
            });
        }else {
            reject(error);
        }
    });

};

HttpRequest.prototype.then = function(onResolve, onReject) {
    this.onResolve = onResolve;
    this.onReject = onReject;
    // this.done();
};

HttpRequest.prototype.resolve = function(result) {
    if(this.status != STATUS_PENDING) {
        return;
    }
    this.status = STATUS_FULFILLED;
    this.result = result;
    this.done();
};

HttpRequest.prototype.reject = function(error) {
    if(this.status == STATUS_REJECTED) {
        return;
    }
    this.status = STATUS_REJECTED;
    this.error = error;
    this.done();
};

HttpRequest.prototype.done = function() {
    if(this.status == STATUS_FULFILLED && this.onResolve) {
        try{
            this.onResolve.apply(window, this.result);
            iView.LoadingBar.finish();

        }catch(error) {
            this.reject(error);
            iView.LoadingBar.error();
        }

    }else if(this.status == STATUS_REJECTED) {
        let error = this.error;

        if(error.status == 403) {
            if(location.href.indexOf("#/login") == -1) {
                _frameRouter.push({
                    name: "login",
                    params: {
                        error: 403,
                        message: "会话过期，请重新登录～"
                    }
                });
            }
            iView.LoadingBar.finish();
            return;
        }

        console.warn(error);
        iView.LoadingBar.error();

        if(error.status == 110) {
            if(error.message != null && error.message != "") {
                Vue.prototype.$Message.info(error.message);
            }
        }

        if(this.onReject) {
            this.onReject.call(window, error);
        }else if(error.status == 120 || error.code == "ECONNABORTED") {
            Vue.prototype.$Notice.warning({
                desc: "对不起，您所访问的服务器正在开小差，请稍后再试！",
                duration: 2.5
            });
        }else if(error.status != 110) {
            Vue.prototype.$Notice.error({
                desc: "系统异常，请稍后再试",
                duration: 2.5
            });
        }
    }
};

const buildConfig = function(_config) {
    let config = [];

    if(_config.constructor == Object) {
        config.push(buildConfigOneByOne(_config));

    }else if(_config.constructor == Array) {
        for(let i = 0; i < _config.length; i++) {
            config.push(buildConfigOneByOne(_config[i]));
        }
    }

    return config;
};

const buildConfigOneByOne = function(_config) {
    let config = Object.assign({}, DEFAULT_CONFIG, _config);
    config.url = buildUrlWithParam(config.url, config.param);
    delete config.param;
    return config;
};

const buildUrlWithParam = function(url, param) {
    if(param) {
        let separate = "?";
        for(let key in param) {
            let value = param[key];
            if(value !== null && value !== "") {
                url = url + separate + key + "=" + encodeURIComponent(value);
                separate = "&";
            }
        }
    }
    return url;
};

export default RequestPool;
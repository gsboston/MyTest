const http = require("http");
const qs = require("querystring");
const chalk = require("chalk");

const STATUS_PENDING = 0;
const STATUS_FULFILLED = 1;
const STATUS_REJECTED = 2;


//Request中间件
const RequestMiddleware = new Object();

RequestMiddleware.METHOD_GET = "GET";
RequestMiddleware.METHOD_POST = "POST";
RequestMiddleware.METHOD_PUT = "PUT";
RequestMiddleware.METHOD_DELETE = "DELETE";

RequestMiddleware.request = function() {
    let context = this;
    let config = arguments[0];
    if(arguments.length > 1) {
        config = Array.prototype.slice.call(arguments);
    }
    return new HttpRequest(config, context).init();
};

RequestMiddleware.get = function(config) {
    let context = this;
    config.method = RequestMiddleware.METHOD_GET;
    return RequestMiddleware.request.call(context, config);
};

RequestMiddleware.post = function(config) {
    let context = this;
    config.method = RequestMiddleware.METHOD_POST;
    return RequestMiddleware.request.call(context, config);
};

RequestMiddleware.put = function(config) {
    let context = this;
    config.method = RequestMiddleware.METHOD_PUT;
    return RequestMiddleware.request.call(context, config);
};

RequestMiddleware.delete = function(config) {
    let context = this;
    config.method = RequestMiddleware.METHOD_DELETE;
    return RequestMiddleware.request.call(context, config);
};

const HttpRequest = function(config, context) {
    let _this = this;
    _this.status = STATUS_PENDING;
    _this.onResolve = null;
    _this.onReject = null;
    _this.result = null;
    _this.error = null;
    _this.context = context;
    _this.config = _this.buildConfig(config);
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

    for(let i = 0; i < config.length; i++) {
        let index = i;

        _this._request(config[index], function (data) {
            result[index] = data;
            completeCount++;
            if(completeCount == count) {
                _this.resolve(result);
            }

        }, function(error) {
            if(count == 1) {
                _this.reject(error);
            }else {
                result[index] == null;
                _this.context.log(error.message);
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
    let beginTime = new Date().getTime();
    let data = null;
    let context = this.context;
    let method = config.option.method;
    let postMode = ((method == RequestMiddleware.METHOD_POST || method == RequestMiddleware.METHOD_PUT) ? true : false);
    if(postMode && config.data != null) {
        data = JSON.stringify(config.data);
    }
    let requestAddr = config.option.method + " http://" + config.option.host + config.option.path;

    let request = http.request(config.option, function(response) {
        let status = response.statusCode;
        let body = [];

        response.on("data", function(chunk) {
            body.push(chunk);
        });

        response.on("end", function() {
            let endTime = new Date().getTime();
            let costTime = endTime - beginTime;
            if(status == 200) {
                body = Buffer.concat(body);
                if(body.length == 0) {
                    reject(new RejectError("100", "没有接收到从网关返回的响应数据"));
                }
                try {
                    body = JSON.parse(body);
                }catch (error) {
                    body = body.toString();
                    resolve(body);
                    return;
                    // reject(new RejectError("100", error.message, error.stack));
                }
                if(body.code == 200) {
                    context && context.log("请求成功： " + requestAddr + ", 耗时" + costTime  + "ms, 接收数据：" + JSON.stringify(body.data));
                    resolve(body.data);
                }else if(body.code == 120) {
                    reject(new RejectError(body.code, "请求异常：" + requestAddr + "，" + body.message, body.errorStack));
                }else {
                    reject(new RejectError(body.code, body.message));
                }
            }else if(status == 302){
                //重定向处理
                resolve(this.headers.location);
            }else {
                reject(new RejectError(status, "请求异常：" + requestAddr + "，" + response.statusMessage));
            }
        });

    });

    request.on("error", function(error) {
        reject(error);
    });


    if(postMode && data != null) {
        request.write(data);
    }
    request.end();
    context && context.log("请求： " + requestAddr + (data != null ? "，发送数据：" + data : ""));
};

HttpRequest.prototype.then = function(onResolve, onReject) {
    this.onResolve = onResolve;
    this.onReject = onReject;
    this.done();
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
    let _this = this;
    try{
        if(this.status == STATUS_FULFILLED) {
            if(this.onResolve) {
                this.onResolve.apply(global, this.result);
            }else {
                if(this.context.response) {
                    this.context.send();
                }
            }
        }else if(this.status == STATUS_REJECTED) {
            let error = this.error;

            if(this.onReject) {
                this.onReject.call(global, error);

            }else {
                this._sendAPIException(error);
            }
        }
    }catch(error) {
        if(error.constructor != BaseError && this.onReject) {
            try {
                _this.onReject.call(global, error);
            } catch(_error) {
                _this._sendException(_error);
            }
        }else {
            _this._sendException(error);
        }
    }
};

HttpRequest.prototype._sendAPIException = function(error) {
    if(error.status != 100 && error.status != 110) {
        let _status = error.status;
        let _message = error.message;
        error.status = 120;
        error.message = "网关接口调用失败：" + _status + " " + _message;
    }

    this._sendException(error);
};


HttpRequest.prototype._sendException = function(error) {
    error.status = (error && error.status != null ? error.status : 100);

    let demand = new Demand(error.status, error.message, error.stack);

    this.context && this.context.log("请求异常：" + JSON.stringify(demand));

    if(this.context.response != null) {
        this.context.response.send(demand);
    }
};

HttpRequest.prototype.buildConfig = function(_config) {
    let _this = this;
    let config = [];

    if(_config.constructor == Object) {
        config.push(_this.buildConfigOneByOne(_config));

    }else if(_config.constructor == Array) {
        for(let i = 0; i < _config.length; i++) {
            config.push(_this.buildConfigOneByOne(_config[i]));
        }
    }

    return config;
};

HttpRequest.prototype.buildConfigOneByOne = function(_config) {
    let _this = this;
    let config = {};
    let httpConfig = process.config;
    let context = this.context;
    _config.param = (_config.param != null ? _config.param : {});

    let baseOption = {
        host: httpConfig.GATEWAY_HOST,
        method: httpConfig.GATEWAY_METHOD,
        headers: httpConfig.GATEWAY_HEADERS,
        // port: httpConfig.GATEWAY_PORT ? httpConfig.GATEWAY_PORT : null
    };

    config.option = Object.assign({}, baseOption, {
        path: _this.buildUrlWithParam(_config.url, _config.param),
        method: _config.method || RequestMiddleware.METHOD_POST
    });
    config.data = _config.data;

    let token = context._getToken ? context._getToken() : null;
    if(token != null) {
        config.option.headers.token = token;
    }
    return config;
};

HttpRequest.prototype.buildUrlWithParam = function(url, param) {
    if(param) {
        let separate = "?";
        let keys = param.keyCodes;
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

const RejectError = function(status, message, stack) {
    let _this = this;
    _this.status = status;
    _this.message = message;
    _this.stack = stack;
};

module.exports = RequestMiddleware;
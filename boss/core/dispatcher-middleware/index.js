const fs = require("fs");
const getFnParamNames = require("get-parameter-names");
const chalk = require("chalk");
const Logger = require("../base/Logger");
let chokidar = null;
if(process.env.NODE_ENV === ENV_DEVELOPMENT) {
    chokidar = require("chokidar");
}

const DispatcherMiddleware = {};
const _RequestMapping = {
    whiteList: {}
};

DispatcherMiddleware.AuthzRealm = function(request, response, next) {
    let url = request.originalUrl;
    let session = request.session;
    if(Object.isNull(session)) {
        response.send(new Demand(100, "Redis连接失败"));
    }
    if(url.indexOf("?") > -1) {
        url = url.split("?")[0];
    }
    if(_RequestMapping.whiteList[url] == true || (session != null && session[ActionContext.CURRENT_USER] != null)) {
        next();
    }else {
        response.status(403).send();
    }
};

DispatcherMiddleware.controllerDispatcher = function(request, response, next) {

    let url = request.originalUrl;
    if(url.indexOf("?") > -1) {
        url = url.substring(0, url.indexOf("?"));
    }
    let action = _RequestMapping[url];
    if(action == null || action.constructor != Function) {
        response.status(404).send();
        return;
    }
    let param = Object.assign({}, request.query);
    let data = Object.assign({}, request.body);

    try{
        let actionParams = loadActionParamaters(action, param, data);
        let context = new ActionContext(request, response);
        context.log("接收请求：" + url);

        action.apply(context, actionParams);
    }catch(error) {
        console.log(chalk.red(error));
        response.send(new Demand(error.status ? error.status : 100, error.message, error.stack));
    }
};

DispatcherMiddleware.addRouter = function(url, action, config) {
    _RequestMapping[url] = action;
    if(config != null) {
        if(config.isAuth == false) {
            _RequestMapping.whiteList[url] = true;
        }
    }
};

DispatcherMiddleware.registerController = function(ctrlPath) {
    let regChildren = function(_dir) {
        if(fs.existsSync(_dir)) {
            fs.readdir(_dir, function(error, files) {
                if(error) {
                    console.log(error);
                    return;
                }
                files.forEach(function(filename) {
                    let filePath = _dir + "/" + filename;
                    fs.stat(filePath, function(error, info) {
                        if(info.isDirectory()) {
                            regChildren(filePath);
                        }else {
                            if(filename&&filename.substring(filename.length-2,filename.length) == 'js'){
                                require(filePath);
                                Logger.log(Logger.TYPE_LOG, "加载 " + filePath + " 成功");
                            }
                        }
                    });
                })
            });
        }
    };
    regChildren(ctrlPath);
    if(process.env.NODE_ENV === ENV_DEVELOPMENT && fs.existsSync(ctrlPath)) {
        let watcher = chokidar.watch(ctrlPath);
        watcher.on("change", (filePath) => {
            delete require.cache[filePath];
            require(filePath);
            Logger.log(Logger.TYPE_LOG, "重新加载 " + filePath + " 成功");
        });
    }
};

const loadActionParamaters = function(action, param, data) {
    let _param = [];
    let actionParamNames = getFnParamNames(action);
    for(let i = 0; i < actionParamNames.length; i++) {
        let paramName = actionParamNames[i];
        let paramValue = null;
        if(paramName == "data") {
            paramValue = data;
        }else if(param[paramName] != null) {
            paramValue = param[paramName];
        }else if(data[paramName] != null) {
            paramValue = data[paramName];
        }else {
            paramName = String.transformFromTF(paramName);
            if(param[paramName] != null) {
                paramValue = param[paramName];
            }else if(data[paramName] != null) {
                paramValue = data[paramName];
            }
        }
        _param.push(paramValue);
    }
    return _param;
};

module.exports = DispatcherMiddleware;
const Demand = require("./Demand");
const request = require("request");
const Logger = require("./Logger");

const CURRENT_USER = "currentUser";
const CURRENT_ORGANIZATION = "currentOrganization";
const MODULES = "modules";
const MENUS = "menus";
const RESOURCES = "resources";
const TOKEN = "token";
const IMAGE_VERIFICATION_CODE = "imageVerificationCode";
const PASSWORD_WRONG_NUM = 0;

const ActionContext = function(request, response) {
    let _this = this;
    _this.__request = request;
    _this.sessionId = request.sessionID;
    _this.session = request.session;
    _this.response = response;
};

ActionContext.prototype.proxy = function(url) {
    this.__request.pipe(request({
        url: "http://" + process.config.http.host + url,
        methods: "GET",
        headers: {
            "token": this._getToken()
        }
    })).pipe(this.response);
};

ActionContext.prototype._setImageVerificationCode = function(imageCode) {
    let session = this.session;
    session[IMAGE_VERIFICATION_CODE] = imageCode;
    session.save(error => {
        if(error) {
            throw error;
        }
    });
};

ActionContext.prototype.getImageVerificationCode = function() {
    return this.session[IMAGE_VERIFICATION_CODE];
};

ActionContext.prototype._setPasswordWrongNum = function(passwordWrongNum) {
    let session = this.session;
    session[PASSWORD_WRONG_NUM] = passwordWrongNum;
    session.save(error => {
        if(error) {
            throw error;
        }
    });
};

ActionContext.prototype.getPasswordWrongNum = function() {
    return this.session[PASSWORD_WRONG_NUM];
};

ActionContext.prototype._setCurrentUser = function(user) {
    let session = this.session;
    session[CURRENT_USER] = user;
    session.save(error => {
        if(error) {
            throw error;
        }
    });
};

ActionContext.prototype.getCurrentUser = function() {
    return this.session[CURRENT_USER];
};

ActionContext.prototype._setCurrentOrganization = function(organization) {
    let session = this.session;
    session[CURRENT_ORGANIZATION] = organization;
    session.save(error => {
        if(error) {
            throw error;
        }
    });
};

ActionContext.prototype.getCurrentOrganization = function() {
    return this.session[CURRENT_ORGANIZATION];
};

ActionContext.prototype._setModules = function(items) {
    let session = this.session;

    let resources = this._getResources();
    let map = {};
    for(let resource of resources) {
        map[resource.moduleId] = true;
    }
    let modules = [];
    for(let item of items) {
        if(map[item.id] === true) {
            switch (item.code) {
                case "M01":
                    item.icon = "home";
                    break;
                case "M02":
                    item.icon = "briefcase";
                    break;
                case "M03":
                    item.icon = "cloud";
                    break;
                case "M05":
                    item.icon = "gear-b";
                    break;
            }
            modules.push(item);
        }
    }

    session[MODULES] = modules;
    session.save(error => {
        if(error) {
            throw error;
        }
    });
};

ActionContext.prototype._getModules = function() {
    return this.session[MODULES];
};

ActionContext.prototype._getModuleByCode = function(code) {
    let result = null;
    let items = this.session[MODULES];
    if(Array.notEmpty(items)) {
        for(let item of items) {
            if(item.code == code) {
                result = item;
                break;
            }
        }
    }
    return result;
};

ActionContext.prototype._setMenus = function(menus) {
    let session = this.session;
    session[MENUS] = (menus ? menus : []);
    session.save(error => {
        if(error) {
            throw error;
        }
    });
};

ActionContext.prototype._getMenus = function(moduleId) {
    let result = [];
    if(moduleId) {
        for(let menu of this.session[MENUS]) {
            if(menu.moduleId == moduleId) {
                result.push(menu);
            }
        }
    }else {
        result = this.session[MENUS];
    }
    return result;
};

ActionContext.prototype._collectMenu = function(menuId, collection) {
    let menus = this.session[MENUS];
    for(let i = 0; i < menus.length; i++) {
        let menu = menus[i];
        if(menu.id == menuId) {
            menu.collection = collection;
            break;
        }else if(Array.notEmpty(menu.children)) {
            let find = false;
            for(let j = 0; j < menu.children.length; j++) {
                let child = menu.children[j];
                if(child.id == menuId) {
                    child.collection = collection;
                    find = true;
                    break;
                }
            }
            if(find) {
                break;
            }
        }
    }
    this.session.save(error => {
        if(error) {
            throw error;
        }
    });
};

ActionContext.prototype._setResources = function(resources) {
    let session = this.session;
    session[RESOURCES] = (resources ? resources : []);
    session.save(error => {
        if(error) {
            throw error;
        }
    });
};

ActionContext.prototype._getResources = function() {
    return this.session[RESOURCES];
};

ActionContext.prototype._setToken = function(token) {
    let session = this.session;
    session[TOKEN] = token;
    session.save(error => {
        if(error) {
            throw error;
        }
    });
};

ActionContext.prototype._getToken = function() {
    return this.session[TOKEN];
};

ActionContext.prototype.send = function() {
    let demand = new Demand();
    if(arguments.length == 1) {
        demand = new Demand(arguments[0]);
    }else if(arguments.length == 2) {
        demand = new Demand(arguments[0], arguments[1]);
    }else if(arguments.length == 3) {
        demand = new Demand(arguments[0], arguments[1], arguments[2]);
    }
    this.response.send(demand);
};

ActionContext.prototype._logout = function() {
    let session = this.session;
    delete session[CURRENT_USER];
    delete session[CURRENT_ORGANIZATION];
    delete session[MODULES];
    delete session[RESOURCES];
    delete session[MENUS];
    delete session[TOKEN];
    delete session[IMAGE_VERIFICATION_CODE];
    session.save(error => {
        if(error) {
            throw error;
        }
    });
};

/**
 * 记录日志
 */
ActionContext.prototype.log = function() {
    let text = arguments[0];
    let param = arguments[1];
    if(Object.isNull(param)) {
        Logger.log(Logger.TYPE_LOG, text);
    }else {
        Logger.log(Logger.TYPE_BUSINESS, text, param, this.getCurrentUser());
    }
};

ActionContext.prototype.CONST_BUSINESS_LOG = "CONST_BUSINESS_LOG";

ActionContext.CURRENT_USER = CURRENT_USER;
ActionContext.CURRENT_ORGANIZATION = CURRENT_ORGANIZATION;

module.exports = ActionContext;
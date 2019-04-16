/**
 * 前端生命周期上下文
 * @type {{_user: null, _organization: null, _modules: Array, _menus: Array, _resources: Array, _resourceMap: {}, _token: null}}
 */
const Context = {
    //是否已经初始化完毕
    initState: false,
    _user: null,
    _organization: null,
    _resources: [],
    _resourceMap: {},
    _modules: [],
    _menus: [],
    _portalMenus: [],
    _menuNameMap: {},
    _commonMenus: [],
    _token: null
};

Context._setCurrentUser = function(user) {
    this._user = user;
};

Context.getCurrentUser = function() {
    return this._user;
};

Context._setCurrentOrganization = function(organization) {
    this._organization = organization;
};

Context.getCurrentOrganization = function() {
    return this._organization;
};

Context._setModules = function(items) {
    this._modules = items;
};

Context._getModules = function() {
    return this._modules;
};

Context._setMenus = function(menus) {
    this._menus = menus;
};

Context._getMenus = function(moduleId) {
    let result = [];
    if(moduleId) {
        for(let menu of this._menus) {
            if(menu.moduleId == moduleId) {
                result.push(menu);
            }
        }
    }else {
        result = this._menus;
    }
    return result;
};

Context._setResources = function(resources) {
    this._resources = resources;
    if(Array.notEmpty(resources)) {
        for(let res of resources) {
            let resCode = res.code;
            let resObj = {};
            if(Array.notEmpty(res.children)) {
                for(let childRes of res.children) {
                    resObj[childRes.code] = true;
                }
            }
            this._resourceMap[resCode] = resObj;
        }
    }
};

Context.hasResource = function(code) {
    let reg = /^F\d{4,6}$/g;
    return  !reg.test(code) || this._resourceMap.hasOwnProperty(code);
};

Context.getResource = function(code) {
    return this._resourceMap[code];
};

Context._getAuthResources = function(code) {
    let result = this._resourceMap[code];
    return result ? result : {};
};

Context._setToken = function(token) {
    this._token = token;
};

Context.getToken = function() {
    return this._token;
};

const Module = function(obj) {
    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;
    this.children = [];
    this.addChild = function(child) {
        child.moduleCode = this.code;
        this.children.push(child);
    };
};
const MenuItem = function(obj) {
    this.id = obj.id;
    this.category = obj.category;
    this.code = obj.code;
    this.name = obj.title;
    this.moduleId = obj.moduleId;
    this.moduleCode = null;
    this.collection = obj.collection;
    if(!this.category) {
        this.parentId = obj.parentId;
        this.funcId = obj.funcId;
        this.funcCode = obj.funcCode;
    }else {
        this.children = [];
        this.addChild = function(child) {
            child.moduleCode = this.moduleCode;
            this.children.push(child);
        };
        if(Array.notEmpty(obj.children)) {
            obj.children.forEach(childObj => {
                let child = new MenuItem(childObj);
                this.addChild(child);
            });
        };
    }
};

Context._set = function(user, organization, resources, modules, menus, token) {
    this._setCurrentUser(user);
    this._setCurrentOrganization(organization);
    this._setResources(resources);
    this._setModules(modules);
    this._setMenus(menus);
    this._setToken(token);
    this._commonMenus = [];
    let _moduleMap = {};
    let _menuDirMap = {};
    // let _menuLeafMap = [];
    modules.forEach(item => {
        let module = new Module(item);
        _moduleMap[module.id] = module;
    });
    menus.forEach(item => {
        let menu = new MenuItem(item);
        if(menu.category) {
            menu.children.forEach(item => {
                let module = _moduleMap[item.moduleId];
                if(module) {
                    module.addChild(item);
                    this._menuNameMap[item.funcCode] = item.name;
                    if(item.collection && this._commonMenus.length < 3) {
                        this._commonMenus.push(item);
                    }
                }
            });
        }else {
            let module = _moduleMap[menu.moduleId];
            if(module) {
                module.addChild(menu);
                this._menuNameMap[menu.funcCode] = menu.name;
                if(item.collection && this._commonMenus.length < 3) {
                    this._commonMenus.push(menu);
                }
            }
        }
        // if(menu.category || !menu.parentId) {
        //     if(menu.category) {
        //         _menuDirMap[menu.id] = menu;
        //     }
        //     let module = _moduleMap[menu.moduleId];
        //     if(module) {
        //         module.addChild(menu);
        //     }
        // }else {
        //     _menuLeafMap.push(menu);
        // }
    });
    // if(Array.notEmpty(_menuLeafMap)) {
    //     _menuLeafMap.forEach(item => {
    //         let parentMenu = _menuDirMap[item.parentId];
    //         if(parentMenu) {
    //             parentMenu.addChild(item);
    //         }
    //     });
    // }
    let portalMenus = Object.values(_moduleMap);
    this._portalMenus = portalMenus;
    this.initState = true;
};

Context.getMenuName = function(funcCode) {
    let name = this._menuNameMap[funcCode];
    if(String.isNullOrBlank(name)) {
        let route = window.getRouter(funcCode);
        name = route.name;
    }
    return name;
};

Context.logout = function() {
    delete this._user;
    delete this._organization;
    delete this._modules;
    delete this._menus;
    delete this._resources;
    delete this._token;
    this.initState = false;
};

export default Context;
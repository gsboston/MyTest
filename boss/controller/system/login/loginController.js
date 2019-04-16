$RequestMapping("/systemManage/login.do", function(data) {
    if(!data.verificationCode || (data.verificationCode && data.verificationCode == this.getImageVerificationCode())){
        this.request({
            url: "/portal-api/portal/login",
            data: {
                username: data.name,
                password: data.password
            }
        }).then(loginParam => {
            this._setPasswordWrongNum(0);
            if(Object.isNull(loginParam)) {
                throw new BaseError("没有找到该用户");
            }
            let user = loginParam.userVo;
            let orgList = loginParam.userOrgVos;
            let token = loginParam.token;
            if(token == null || token == "") {
                throw new BaseError("生成用户Token失败");
            }
            if(Object.isNull(orgList) || Array.isEmpty(orgList)) {
                throw new BaseError("您不属于任何机构，请先联系管理员加入机构");
            }
            let loginOrgId = user.loginOrgId;
            let loginOrg = null;
            if(Object.notNull(loginOrgId) && Array.notEmpty(orgList)) {
                for(let org of orgList) {
                    if(org.orgId == loginOrgId) {
                        loginOrg = org;
                        break;
                    }
                }
            }
            if(loginOrg == null) {
                loginOrg = orgList[0];
            }
            user.orgId = loginOrg.orgId;
            this._setCurrentUser(user);
            this._setCurrentOrganization({
                id: loginOrg.orgId,
                name: loginOrg.orgName
            });
            this._setToken(token);
            console.log("用户登录 Token:" + token + " " +  JSON.stringify(user));
            let appCode = process.config.APP;
            this.request({
                url: "/portal-api/models/list",
                method: $Http.METHOD_GET
            }, {
                url: "/portal-api/menus/app/power",
                method: $Http.METHOD_GET,
                param: {
                    code: appCode
                }
            }, {
                url: "/portal-api/funcs/app/power",
                method: $Http.METHOD_GET,
                param: {
                    code: appCode
                }
            }).then((modules, menus, resources) => {
                if(Object.isNull(modules) || Array.isEmpty(modules)) {
                    throw new BaseError("没有查询到有权限的模块，请联系机构管理员～");
                }
                if(Object.isNull(resources) || Array.isEmpty(resources)) {
                    throw new BaseError("您在该组织没有已分配的岗位，请联系机构管理员～");
                }
                let res = buildResourceTree(resources);
                this._setResources(res);
                this._setModules(modules);
                this._setMenus(menus);
                //判断用户是否激活，如果用户未激活
                if(user.activate) {
                    this.send({
                        activate: true
                    });
                }else {
                    this.send({
                        activate: false,
                        phone: user.phone
                    });
                }
            }, error => {
                throw new BaseError("登录异常：" + error.message);
            });
        }, error => {
            let passwordWrongNum = this.getPasswordWrongNum();
            passwordWrongNum += 1;
            if(passwordWrongNum >= 3){
                throw new BaseError("已输错3次密码，请输入验证码");
            }else{
                this._setPasswordWrongNum(passwordWrongNum);
                throw new BaseError("登录异常：" + error.message);
            }
        });
    }else{
        throw new BaseError("验证码错误");
    }
}, {
    isAuth: false
});

$RequestMapping("/system/isLogin.do", function() {
    let user = this.getCurrentUser();
    if(user && user.activate) {
        this.send({
            status: true,
            user: this.getCurrentUser(),
            organization: this.getCurrentOrganization(),
            resources: this._getResources(),
            modules: this._getModules(),
            menus: this._getMenus(),
            token: this._getToken()
        });
    }else {
        this.send({
            status: false
        });
    }
}, {
    isAuth: false
});

//获取激活短信验证码
$RequestMapping("/systemManage/getValidationCode.do", function(systemCode,phoneNumbers,channelCode) {
    this.post({
        url: "/portal-api/sms/validateSend",
        param: {
            systemCode: systemCode,
            phoneNumbers: phoneNumbers,
            channelCode: channelCode
        }
    }).then(data => {
        this.send(data);
    });
});

//激活用户
$RequestMapping("/systemManage/activateUser.do", function(phoneNumber,validateCode) {
    this.put({
        url: "/portal-api/sms/active",
        param: {
            phoneNumber: phoneNumber,
            validateCode: validateCode
        }
    }).then(data => {
        let user = this.getCurrentUser();
        user.activate = true;
        this._setCurrentUser(user);
        this.send(data);
    });
});

$RequestMapping("/system/logout.do", function() {
    this._logout();
    this.send();
});

$RequestMapping("/system/getBindOrgList.do", function() {
    let user = this.getCurrentUser();
    let org = this.getCurrentOrganization();
    this.get({
        url: "/portal-api/org/getOrgByUserId/" + user.id
    }).then(items => {
        this.send(items);
    });
});

/*
* 分页查询当前用户所有已读消息列表
* */
$RequestMapping("/system/getMessageListHaveRead.do", function(page,size,type,userType) {
    let user = this.getCurrentUser();
    this.get({
        url: "/portal-api/message/page/haveRead",
        param:{
            page:page,
            size:size,
            type:type,
            userType:userType
        }
    }).then(data => {
        this.send(data);
    });
});

/*
* 分页查询当前用户所有未读消息列表
* */
$RequestMapping("/system/getMessageListUnRead.do", function(page,size,type,userType) {
    let user = this.getCurrentUser();
    this.get({
        url: "/portal-api/message/page/unRead/",
        param:{
            page:page,
            size:size,
            type:type,
            userType:userType
        }
    }).then(data => {
        this.send(data);
    });
});
/*
*  根据消息ID，设置消息为已读
* */
$RequestMapping("/system/setMessage.do", function(id,type,userType) {
    this.post({
        url: "/portal-api/message/set/",
        param:{
            ids:id,
            type:type,
            userType:userType
        }
    }).then(data => {
        this.send(data);
    });
});


/*
* 查询当前用户的未读消息数量
* */
$RequestMapping("/system/getMessageNum.do", function() {
    this.get({
        url: "/portal-api/message/get/unread",
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping("/system/switchOrg.do", function(id, name) {
    this.put({
        url: "/portal-api/portal/switchOrg",
        param: {
            orgId: id
        }
    }).then(loginParam => {
        let token = loginParam.token;
        if(String.isBlank(token)) {
            throw new BaseError("生成用户Token失败");
        }

        this._setCurrentOrganization({
            id: id,
            name: name
        });
        this._setToken(token);
        this.response.cookie("token", token);

        let appCode = process.config.APP;
        this.request({
            url: "/portal-api/models/list",
            method: $Http.METHOD_GET
        }, {
            url: "/portal-api/menus/app/power",
            method: $Http.METHOD_GET,
            param: {
                code: appCode
            }
        }, {
            url: "/portal-api/funcs/app/power",
            method: $Http.METHOD_GET,
            param: {
                code: appCode
            }
        }).then((modules, menus, resources) => {
            let res = buildResourceTree(resources);
            this._setResources(res);
            this._setModules(modules);
            this._setMenus(menus);

            this.send();
        });
    })
});

const buildResourceTree = function(resources) {
    let result = [];
    let rootMap = {};
    if(Object.isNull(resources) || Array.isEmpty(resources)) {
        return result;
    }
    for(let resource of resources) {
        if(!resource.parentId) {
            result.push(resource);
            rootMap[resource.id] = resource;
        }
    }
    for(let resource of resources) {
        if(resource.parentId) {
            let root = rootMap[resource.parentId];
            if(root) {
                if(!root.children) {
                    root.children = [];
                }
                root.children.push(resource);
            }
        }
    }
    return result;
};

/*
* 获取图片验证码
* */
$RequestMapping("/systemManage/getCode.do", function() {
    var captchaPng = require("captchapng");
    var code = '0123456789';
    var length = 4;
    var randomCode = '';
    for (var i = 0; i < length; i++) {
        var temp = parseInt(Math.random() * 1000) % code.length;
        if(i == 0 && temp == 0){
            randomCode += code[1];
        }else{
            randomCode += code[temp];
        }
    }
    this._setImageVerificationCode(randomCode);
    // 输出图片
    var p = new captchaPng(150,48,parseInt(randomCode)); // width,height,numeric captcha
    p.color(255, 255, 255, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    img = "data:image/jpg;base64," + img;
    this.send(img) ;
}, {
    isAuth: false
});
$RequestMapping("/systemManage/system/getMenuList.do", function(moduleCode) {
    let module = this._getModuleByCode(moduleCode);
    if(module == null) {
        throw new BaseError("没有查询到编码为" + moduleCode + "的业务模块～");
    }

    let result = [];
    let menus = this._getMenus();
    if(Array.notEmpty(menus)) {
        for(let menu of menus) {
            if(menu.moduleId == module.id) {
                result.push(menu);
            }
        }
    }
    this.send(result);
});

const defaultMenus = [{
    code: "M0500",
    funcCode: "F0500",
    title: "首页",
}, {
    code: "M0501",
    funcCode: "F0501",
    title: "系统管理员维护",
}, {
    code: "M0555",
    funcCode: "F0555",
    title: "用户管理",
}, {
    code: "M0502",
    title: "组织管理",
    category: true,
    children: [{
        code: "M050201",
        funcCode: "F0502",
        title: "组织管理"
    }, {
        code: "M050202",
        funcCode: "F0503",
        title: "组织体系"
    }]
}, {
    code: "M0504",
    title: "权限管理",
    category: true,
    children: [{
        code: "M050401",
        funcCode: "F0506",
        title: "岗位管理",
    }, {
        code: "M050402",
        funcCode: "F0507",
        title: "角色管理",
    }, {
        code: "M050403",
        funcCode: "F0508",
        title: "职责管理",
    }]
}, {
    code: "M0505",
    title: "权限基础设置",
    category: true,
    children: [{
        code: "M050501",
        funcCode: "F0509",
        title: "模块管理",
    }, {
        code: "M050502",
        funcCode: "F0510",
        title: "功能管理",
    }, {
        code: "M050503",
        funcCode: "F0511",
        title: "菜单管理",
    }]
}, {
    code: "M0506",
    title: "档案管理",
    name: "档案管理",
    category: true,
    children: [{
        code: "M050601",
        funcCode: "F0512",
        title: "自定义档案维护",
    }, {
        code: "M050602",
        funcCode: "F0513",
        title: "服务档案维护",
    }]
}, {
    code: "M0507",
    title: "合同定义管理",
    name: "合同定义管理",
    category: true,
    children: [{
        code: "M050701",
        funcCode: "F0515",
        title: "合同定义列表",
    }]
}];
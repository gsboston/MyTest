$RequestMapping("/crm/system/getMenuList.do", function(moduleCode) {
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
    code: "M0201",
    funcCode: "F0201",
    title: "线索管理",
    isCategory: false
}, {
    code: "M0202",
    funcCode: "F0202",
    title: "我的收藏",
    isCategory: false
}];
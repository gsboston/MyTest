$RequestMapping("/systemManage/menu/getMenuList.do", function(moduleId) {
    this.get({
        url: "/portal-api/menus/list",
        param: {
            moduleId: moduleId
        }
    }).then(items => {
        for(let item of items) {
            item.expand = false;
            item.selected = false;
        }
        this.send(items);
    });
});

$RequestMapping("/systemManage/menu/save.do", function(data) {
    this.request({
        url: "/portal-api/menus/save",
        data: {
            id: data.id,
            code: data.code,
            title: data.title,
            sort: data.sort,
            moduleId: data.moduleId,
            parentId: data.parentId,
            category: data.category,
            icon: data.icon,
            funcId: data.funcId
        }
    }).then(item => {
        item.expand = false;
        item.selected = false;
        if(item.funcId) {
            this.get({
                url: "/portal-api/funcs/get/" + item.funcId
            }).then(funcItem => {
                item.funcName = funcItem.name;
                this.send(item);
            });
        }else {
            this.send(item);
        }
    });
});

$RequestMapping("/systemManage/menu/info.do", function(id) {
    this.get({
        url: "/portal-api/menus/get/" + id
    }).then(item => {
        item.expand = false;
        item.selected = false;
        if(item.funcId) {
            this.get({
                url: "/portal-api/funcs/get/" + item.funcId
            }).then(funcItem => {
                item.funcName = funcItem.name;
                this.send(item);
            });
        }else {
            this.send(item);
        }
    });
});

$RequestMapping("/systemManage/menu/remove.do", function(id) {
    this.delete({
        url: "/portal-api/menus/remove/" + id
    }).then(() => {
        this.send();
    });
});

$RequestMapping("/systemManage/menu/searchFunc.do", function(moduleId, searchText) {
    this.get({
        url: "/portal-api/funcs/list",
        param: {
            moduleId: moduleId,
            key: searchText
        }
    }).then(items => {
        let returnData = [];
        if (items) {
            if (items.length > 0) {
                returnData = items[0].funcVos;
            }
        }
        this.send(returnData);
    });
});
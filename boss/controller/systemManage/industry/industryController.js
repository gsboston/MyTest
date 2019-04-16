let categoryCode = 'bd_industry';
/**
 * 行业档案 -- 分页查询自定义档案项
 */
$RequestMapping("/systemManage/industry/list.do", function(curPage, pageSize, searchName) {
    this.get({
        url: "/portal-api/basedocs/itemPage/" + categoryCode,
        param: {
            page: curPage,
            size: pageSize,
            searchText: searchName
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 行业档案 -- 根据主键查询自定义档案项
 */
$RequestMapping("/systemManage/industry/info.do", function(id) {
    this.get({
        url: "/portal-api/basedocs/getItemById/" + id,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 行业档案 -- 根据分类code和档案项code查询自定义档案项
 */
$RequestMapping("/systemManage/industry/checkCode.do", function(code) {
    this.get({
        url: "/portal-api/basedocs/item/check",
        param: {
            categoryCode: categoryCode,
            itemCode: code,
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 行业档案 -- 保存/更新自定义档案项
 */
$RequestMapping("/systemManage/industry/save.do", function(data) {
    this.post({
        url: "/portal-api/basedocs/industry/save",
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 行业档案 -- 根据主鍵刪除自定义档案项
 */
$RequestMapping("/systemManage/industry/delete.do", function(id) {
    this.delete({
        url: "/portal-api/basedocs/removeItem/" + id,
    }).then(() => {
        this.send();
    });
});
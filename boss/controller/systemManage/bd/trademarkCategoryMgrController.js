/**
 * Created by xhr on 2017/12/8.
 */
let categoryCode = 'trademark_category';
/**
 * 商标类别 -- 分页查询自定义档案项
 */
$RequestMapping("/systemManage/trademarkCategory/list.do", function(curPage, pageSize, searchName) {
    this.get({
        url: "/portal-api/basedocs/itemPage/" + categoryCode,
        param: {
            page: curPage,
            size: pageSize,
            searchText: searchName
        }
    }).then(data => {
        console.log(JSON.stringify(data));
        this.send(data);
    });
});

/**
 * 商标类别 -- 根据主键查询自定义档案项
 */
$RequestMapping("/systemManage/trademarkCategory/info.do", function(id) {
    this.get({
        url: "/portal-api/basedocs/getItemById/" + id,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 商标类别 -- 根据分类code和档案项code查询自定义档案项
 */
$RequestMapping("/systemManage/trademarkCategory/checkCode.do", function(code) {
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
 * 商标类别 -- 保存/更新自定义档案项
 */
$RequestMapping("/systemManage/trademarkCategory/save.do", function(data) {
    this.post({
        url: "/portal-api/basedocs/saveItem/",
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 商标类别 -- 根据主鍵刪除自定义档案项
 */
$RequestMapping("/systemManage/trademarkCategory/delete.do", function(id) {
    this.delete({
        url: "/portal-api/basedocs/removeItem/" + id,
    }).then(() => {
        this.send();
    });
});
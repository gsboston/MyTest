/**
 * 查询套餐列表
 */
$RequestMapping("/tcgl/getTcglList.do", function (curPage, pageSize, data) {
    this.post({
        url: '/ztjf-api/ztjf/free/ztpackage/ztjfPackage/search',
        param: {
            page: curPage,
            size: pageSize
        },
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 数据字典--根根据类型查询列表
 */
$RequestMapping("/tcgl/getKeyBook.do", function (type) {
    this.get({
        url: '/ztjf-api/ztjf/free/keybook/ztjfKeybook/findListByType',
        param: {
            type: type
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 账套套餐保存
 */
$RequestMapping("/tcgl/save.do", function (data) {
    this.post({
        url: '/ztjf-api/ztjf/free/ztpackage/ztjfPackage/save',
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 账套套餐更新
 */
$RequestMapping("/tcgl/update.do", function (id, data) {
    this.put({
        url: '/ztjf-api/ztjf/free/ztpackage/ztjfPackage/' + id,
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 账套套餐删除
 */
$RequestMapping("/tcgl/delete.do", function (id) {
    this.delete({
        url: '/ztjf-api/ztjf/free/ztpackage/ztjfPackage/' + id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 账套套餐操作记录列表
 */
$RequestMapping("/tcgl/getTcglRecordList.do", function (packageId, curPage, pageSize) {
    this.get({
        url: '/ztjf-api/ztjf/free/ztpackage/ztjfPackageRecord/search',
        param: {
            packageId: packageId,
            page: curPage,
            size: pageSize
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 账套套餐操作根据id查询对象
 */
$RequestMapping("/tcgl/getZtjfPackage.do", function (packageId) {
    this.get({
        url: '/ztjf-api/ztjf/free/ztpackage/ztjfPackage/' + packageId
    }).then(data => {
        this.send(data);
    });
});

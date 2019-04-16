/**
 * 获取TDK列表
 */
$RequestMapping("/metaManagement/getMetaList.do", function (curPage, pageSize) {
    this.get({
        url: '/slb-api/tdk/list',
        param: {
            page: curPage,
            size: pageSize
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据Id获取TDK
 */
$RequestMapping("/metaManagement/getMetaById.do", function (id) {
    this.get({
        url: '/slb-api/tdk/' + id
    }).then(data => {
        this.send(data);
    });
});

/**
 * TDK保存
 */
$RequestMapping("/metaManagement/save.do", function (data) {
    this.post({
        url: '/slb-api/tdk/save',
        data: data
    }).then(data => {
        this.send(data);
    });
});
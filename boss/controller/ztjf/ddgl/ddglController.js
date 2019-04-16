/**
 * 查询订单列表
 */
$RequestMapping("/ddgl/getDdglList.do", function (curPage, pageSize, type, beginTime, endTime, invoiceStatus, searchText) {
    this.post({
        url: '/ztjf-api/ztjf/free/order/page',
        param: {
            page: curPage,
            size: pageSize,
        },
        data: {
            type: type,
            beginTime: beginTime,
            endTime: endTime,
            invoiceStatus: invoiceStatus,
            searchText: searchText
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 订单详情
 */
$RequestMapping("/ddgl/detail.do", function (id) {
    this.get({
        url: '/ztjf-api/ztjf/free/order/detail',
        param: {
            id: id,
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 通知并创建结构根据订单id
 */
$RequestMapping("/ddgl/notifyOrg.do", function (orderId) {
    this.get({
        url: '/ztjf-api/ztjf/free/order/notifyOrg',
        param: {
            orderId: orderId,
        }
    }).then(data => {
        this.send(data);
    });
});

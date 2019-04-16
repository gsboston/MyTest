/**
 * 查询开票信息列表
 */
$RequestMapping("/kpgl/getKpglList.do", function (curPage, pageSize, beginTime, endTime, invoiceStatus, searchText) {
    this.post({
        url: '/ztjf-api/ztjf/free/invoice/ztjfInvoiceRecoed/page',
        data: {
            page: curPage,
            size: pageSize,
            startTime: beginTime,
            endTime: endTime,
            status: invoiceStatus,
            orgName: searchText
        },
    }).then(data => {
        this.send(data);
    });
});

/**
 * 发票送出
 */
$RequestMapping("/kpgl/save.do", function (data) {
    this.post({
        url: '/ztjf-api/ztjf/free/invoice/ztjfInvoiceRecoed/invoiceSend',
        data: data,
    }).then(res => {
        this.send(res);
    });
});

/**
 * 查询根据订单ids
 */
$RequestMapping("/kpgl/listByIds.do", function (ids) {
    this.get({
        url: '/ztjf-api/ztjf/free/order/listByIds',
        param: {
            ids: ids
        },
    }).then(res => {
        this.send(res);
    });
});
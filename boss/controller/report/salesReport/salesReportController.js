
/**
 * 客户资源质量占比
 */
$RequestMapping('/report/salesReport/collectionCapital.do', function () {
    this.get({
        url: '/report-api/crm/collectionCapital',
        param: {}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取某门店销售员当年累计的签单数、应收款、实收款、待收款
 */
$RequestMapping('/report/salesReport/signSituationDeptTotal.do', function () {
    this.get({
        url: '/report-api/sign/signSituationDeptTotal',
        param: {}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 按周、月、季、年查询该销售的签单总数、应收款总数、实收款总数、待收款总数
 */
$RequestMapping('/report/salesReport/signSituationDeptDate.do', function (type, year) {
    this.get({
        url: '/report-api/sign/signSituationDeptDate',
        param: {
            year: year,
            type: type,
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 订单配额比率-员工订单在总额比重
 */
$RequestMapping('/report/salesReport/contractCountRatio.do', function () {
    this.get({
        url: '/report-api/sign/contractCountRatio',
        param: {}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 销售员列表接口
 */
$RequestMapping('/report/salesReport/salesPersonList.do', function () {
    this.get({
        url: '/crm-api/report/salesPersonList',
        param: {}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 时间段列表接口
 */
$RequestMapping('/report/salesReport/salesPersonTime.do', function () {
    this.get({
        url: '/crm-api/report/salesPersonTime',
        param: {}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 销售员echarts报表
 */
$RequestMapping('/report/salesReport/salesPersonReport.do', function (userId, timeType) {
    this.get({
        url: '/crm-api/report/salesPersonReport',
        param: {
            userId: userId,
            timeType: timeType
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 销售员报表
 */
$RequestMapping('/report/salesReport/salesPersonDetails.do', function (userId, timeType, time) {
    this.get({
        url: '/crm-api/report/salesPersonDetails',
        param: {
            userId: userId,
            timeType: timeType,
            time: time
        }
    }).then(data => {
        this.send(data);
    });
});
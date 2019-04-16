/**
 * 首页-收款模块数据获取
 */
$RequestMapping("/signCloud/report/collectionReport.do", function(current) {
    this.get({
        url:'/sign-api/contract/getReceiptReport?current='+current
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取当前月份
 */
$RequestMapping("/signCloud/report/getMonth.do", function() {
    this.send((new Date().getMonth() + 1));
});

/**
 * 首页-签约    获取待签合约信息
 */
$RequestMapping("/signCloud/report/getNotSignInfo.do", function() {
    this.get({
        url:'/sign-api/contract/unSigned'
    }).then(data => {
        this.send(data);
    });
});

/**
 * 首页-签约    获取正式合约信息
 */
$RequestMapping("/signCloud/report/getFormalContractInfo.do", function(isCurrentMonth) {
    this.get({
        url:'/sign-api/contract/signed',
        param: {
            isCurrentMonth: isCurrentMonth
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 首页-签约    获取解约合约信息
 */
$RequestMapping("/signCloud/report/getTerminationContractInfo.do", function(isCurrentMonth) {
    this.get({
        url:'/sign-api/contract/termination',
        param: {
            isCurrentMonth: isCurrentMonth
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 数据概览-组织   获取数据概览统计
 */
$RequestMapping("/signCloud/report/getDataOverview.do", function(flag,current) {
    this.get({
        url:'/sign-api/contract/getDataOverview',
        param: {
            flag: flag,
            current: current
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 数据概览-组织   业绩统计
 */
$RequestMapping("/signCloud/report/BusinessData.do", function(flag,current,pageNum, size) {
    this.get({
        url:'/sign-api/contract/getUserPerformanceInDataOverview',
        param: {
            flag: flag,
            current: current,
            pageNum: pageNum,
            size: size
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 数据概览-组织   获取数据概览统计-饼图
 */
$RequestMapping("/signCloud/report/getPieChartInDataOverview.do", function(flag,current) {
    this.get({
        url:'/sign-api/contract/getPieChartInDataOverview',
        param: {
            flag: flag,
            current: current
        }
    }).then(data => {
        this.send(data);
    });
});


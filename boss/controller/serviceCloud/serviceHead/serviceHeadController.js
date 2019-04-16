/**
 * 服务负责人   获取服务人员列表
 */
$RequestMapping("/serviceCloud/serviceHead/getServicePersonnelList.do", function() {
    this.get({
        url:"/serve-api/post/user/servePost/list",
        param: {
            size: 1000
        }
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 服务负责人   获取合约服务单列表
 */
$RequestMapping("/serviceCloud/serviceHead/getServiceList.do", function(state,searchText,saleOrgId,billDefId,serveUserId,page,startDate,endDate) {
    this.get({
        url:"/serve-api/serviceLeader/page",
        param: {
            billType: "CONTRACT_SHEET",
            state: state,
            searchText: searchText,
            saleOrgId: saleOrgId,
            billDefId: billDefId,
            serveUserId: serveUserId,
            page: page,
            startTime: startDate,
            endTime: endDate
        }
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 服务负责人   服务派工
 */
$RequestMapping("/serviceCloud/SCOrderOrRefuse/dispatch.do", function(data) {
    console.log(data);
    this.post({
        url:"/serve-api/serviceLeader/dispatch",
        data: data
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 服务负责人   服务退回
 */
$RequestMapping("/serviceCloud/SCOrderOrRefuse/retreat.do", function(billId,reason) {
    this.post({
        url:"/serve-api/serviceLeader/retreat",
        param: {
            billId: billId,
            reason: reason
        }
    }).then((data) => {
        this.send(data);
    });
});



/**
 * 获取销售组织列表
 */
$RequestMapping("/serviceCloud/serviceOrder/getSaleOrgList.do", function() {
    this.get({
        url:"/serve-api/bill/recive/saleOrg",
    }).then((data) => {
        this.send(data);
    });
});
/**
 * 获取服务单类型列表
 */
$RequestMapping("/serviceCloud/serviceOrder/getServiceTypeList.do", function() {
    this.get({
        url:"/serve-api/billdef/get",
        param: {
            enable: true
        }
    }).then((data) => {
        this.send(data);
    });
});
/**
 * 获取服务单列表   未处理/已处理
 */
$RequestMapping("/serviceCloud/serviceOrder/getServiceList.do", function(status,searchContent,saleOrgId,billDefId,page) {
    this.get({
        url:"/serve-api/bill/recive/billList",
        param: {
            status: status,
            searchContent: searchContent,
            saleOrgId: saleOrgId,
            billDefId: billDefId,
            page: page,
        }
    }).then((data) => {
        this.send(data);
    });
});
/**
 * 获取服务单详情
 */
$RequestMapping("/serviceCloud/orderOrRefuse/getServiceInfoById.do", function(serviceOrderId) {
    this.get({
        url:"/serve-api/bill/recive/" + serviceOrderId
    }).then((data) => {
        this.send(data);
    });
});
/**
 * 获取服务单列表   未处理/已处理
 */
$RequestMapping("/serviceCloud/orderOrRefuse/getServiceHeaderList.do", function(billDefids) {
    this.get({
        url:"/serve-api/bill/recive/serveLeader",
        param: {
            billDefids: billDefids
        }
    }).then((data) => {
        this.send(data);
    });
});
/**
 * 服务单操作   接单/拒单
 */
$RequestMapping("/serviceCloud/orderOrRefuse/save.do", function(data) {
    this.post({
        url:"/serve-api/bill/recive/operator",
        data: data
    }).then((data) => {
        this.send(data);
    });
});
/**
 * 服务单操作   获取服务单操作记录
 */
$RequestMapping("/serviceCloud/serviceProgress/getServiceRecordList.do", function(serviceId) {
    this.get({
        url:"/serve-api/bill/recive/record/" + serviceId,
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 服务单操作  获取服务岗位列表
 */
$RequestMapping("/serviceCloud/orderOrRefuse/getOrgServePostList.do", function(billDefId) {
    this.get({
        url:"/serve-api/post/orgServePostList",
        param: {
            billDefId: billDefId
        }
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 服务单操作   获取服务人员列表
 */
$RequestMapping("/serviceCloud/orderOrRefuse/postUserWorkloadList.do", function(secPostId) {
    this.get({
        url:"/serve-api/post/postUserWorkloadList",
        param: {
            secPostId: secPostId
        }
    }).then((data) => {
        this.send(data);
    });
});
/**
 * 服务进度   根据id获取服务进度周期
 */
$RequestMapping("/serviceCloud/serviceProgressComponent/getServiceCycleList.do", function(serviceId) {
    this.get({
        url:"/serve-api/bill/recive/service/cycle/record/" + serviceId
    }).then((data) => {
        this.send(data);
    });
});
/**
 * 服务进度   根据id和期数获取服务进度列表
 */
$RequestMapping("/serviceCloud/serviceProgressComponent/getServiceProgressList.do", function(serviceId,cycleId) {
    this.get({
        url:"/serve-api/bill/recive/service/progress/record/" + serviceId,
        param: {
            cycleId: cycleId
        }
    }).then((data) => {
        this.send(data);
    });
});



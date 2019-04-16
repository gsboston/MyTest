/**
 * 查询任务列表
 */
$RequestMapping("/serviceCloud/servicePerson/taskList.do", function(searchText,state,billType,page) {

    this.get({
        url:'/serve-api/billProcessNode/bill/Page',
        param:{
            page:page,
            searchText:searchText,
            billType:billType,
            state:state
        }
    }).then(data => {
        this.send(data);
    });
});


/**
 * 查询服务单信息
 */
$RequestMapping("/serviceCloud/servicePerson/taskInfo.do", function(billId) {
    this.get({
        url:'/serve-api/bill/'+billId
    }).then(data => {
        this.send(data);
    });
});

/**
 * 开启服务
 */
$RequestMapping("/serviceCloud/servicePerson/startService.do", function(billId,beginDate) {
    this.post({
        // url:'/serve-api/billProcessNode/saveProcessNode',
        url:'/serve-api/billProcessNode/service/start',
        param:{billId:billId,beginDate:beginDate}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 结束服务
 */
$RequestMapping("/serviceCloud/servicePerson/finishService.do", function(billId,endDate) {
    this.post({
        url:'/serve-api/billProcessNode/completeNode',
        param:{billId:billId,endDate:endDate}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取流程定义
 */
$RequestMapping("/serviceCloud/servicePerson/processDef.do", function(defId) {
    this.get({
        url:'/serve-api/billdef/billProcessNodes/get',
        param:{billDefId:defId}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取流程环节
 */
$RequestMapping("/serviceCloud/servicePerson/processNodeList.do", function(billId) {
    this.get({
        url:'/serve-api/billProcessNode',
        param:{billId:billId}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 合约信息
 */
$RequestMapping('/serviceCloud/servicePerson/contractInfo.do', function (id,billDefId,saleOrgId) {
    this.get({
        url: '/sign-api/contract/getContractSimpleInfo',
        param:{
            contractId:id,
            billDefId:billDefId,
            saleOrgId:saleOrgId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 保存流程环节
 */
$RequestMapping("/serviceCloud/servicePerson/saveNode.do", function(nodeInfo) {
    if (nodeInfo.isOutCustomer && nodeInfo.completeState == '1') {
        nodeInfo.contractCustomerVo = JSON.parse(nodeInfo.content);
    }
    this.post({
        url:'/serve-api/billProcessNode/updateNodeState',
        data:nodeInfo
    }).then(data => {
        this.send(data);
    });
});

/**
 * 日常服务单 --- 获取服务单流程定义环节列表
 */
$RequestMapping("/serviceCloud/servicePerson/billDefProcessNodeList.do", function(billDefId) {
    this.get({
        url:'/serve-api/billdef/billProcessNodes/get',
        param: {
            billDefId: billDefId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 日常服务单 --- 根据服务单查询服务环节
 */
$RequestMapping("/serviceCloud/servicePerson/billProcessNodeList.do", function(billId) {
    this.get({
        url:'/serve-api/billProcessNode',
        param: {
            billId: billId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 日常服务单 --- 根据服务环节id获取服务环节信息
 */
$RequestMapping("/serviceCloud/servicePerson/billProcessNodeInfo.do", function(id) {
    this.get({
        url:'/serve-api/billProcessNode/' + id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 日常服务单 --- 服务人员接收/拒绝任务
 */
$RequestMapping("/serviceCloud/servicePerson/receiveOrRefuse.do", function(billId, state, refuse) {
    this.post({
        url:'/serve-api/billProcessNode/receiveOrRefuse',
        param : {
            billId: billId,
            state: state,
            refuse: refuse
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 日常服务单 --- 更新节点信息
 */
$RequestMapping("/serviceCloud/servicePerson/billProcessNodeInfoSave.do", function(data) {
    this.post({
        url:'/serve-api/billProcessNode/updateNodeState',
        data: data
    }).then(data => {
        this.send(data);
    });
});

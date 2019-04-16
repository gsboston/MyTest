/**
 * 查询组织可处理的合约列表
 */
$RequestMapping("/serviceCloud/serviceDispatch/contractList.do", function(status, searchContent, page, startDate, endDate) {
    this.get({
        url: '/serve-api/bill/contractList',
        param: {
            status: status,
            searchContent: searchContent,
            page: page,
            startDate: startDate,
            endDate: endDate
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据合约ID获取服务单列表
 */
$RequestMapping("/serviceCloud/serviceDispatch/serviceList.do", function(contractId) {
    this.get({
        url: '/serve-api/bill/list',
        param: {
            contractId: contractId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据服务单ID查询服务单
 */
$RequestMapping("/serviceCloud/serviceDispatch/SDInfo.do", function(id) {
    this.get({
        url: '/serve-api/bill/' + id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据合同定义ID查询合同定义服务单
 */
$RequestMapping("/serviceCloud/serviceDispatch/contractDefService/list.do", function(contractId) {
    this.get({
        url: '/sign-api/contractDefService/enable/list',
        param: {
            contractDefId: contractId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 接单员根据服务类型ID查询可选 服务负责人
 */
$RequestMapping("/serviceCloud/serviceDispatch/serveLeader.do", function(serviceTypeIds) {
    this.get({
        url: '/serve-api/bill/recive/serveLeader',
        param: {
            billDefids: serviceTypeIds
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据服务单类型ID获取可选 服务商信息
 */
$RequestMapping("/serviceCloud/serviceDispatch/serveOrg.do", function(serviceTypeId) {
    this.get({
        url: '/serve-api/billBusiness/getByBillDefId',
        param: {
            billDefId: serviceTypeId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 生成服务单
 */
$RequestMapping("/serviceCloud/serviceDispatch/save.do", function(data) {
    delete data.serviceDate;
    if (data.state == 'NONE_DISPATCH' && data.dispatchType == 'OWN') {
        delete data.dispatchType;
    }

    //判断是否为派单给服务人员
    if (data.state == 'ALREADY_DISPATCH' && data.dispatchType == 'OWN' && data.receiveOperatorType== 'SERVER_RECEIVE_STAFF') {

    }else {
        delete data.serverList;
    }
    this.post({
        url: '/serve-api/bill/',
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 验证合约指定类型服务是否已存在
 */
$RequestMapping("/serviceCloud/serviceDispatch/validateServiceType.do", function(contractId, serviceTypeId) {
    this.get({
        url: '/serve-api/bill/validateBillType/',
        param: {
            contractId: contractId,
            billDefId: serviceTypeId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据服务单ID获取资料清单列表
 */
$RequestMapping("/serviceCloud/billMaterial/list.do", function(billId, place, nodeId, billCycleId) {
    this.get({
        url: '/serve-api/billMaterial/list',
        param: {
            billId: billId,
            place: place,
            nodeId: nodeId,
            billCycleId: billCycleId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据服务单ID保存资料
 */
$RequestMapping("/serviceCloud/billMaterial/save.do", function(data) {
    this.post({
        url: '/serve-api/billMaterial/',
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 删除服务单资料
 */
$RequestMapping("/serviceCloud/billMaterial/delete.do", function(id) {
    this.delete({
        url: '/serve-api/billMaterial/' + id
    }).then(() => {
        this.send();
    });
});

/**
 * 保存服务单资料附件
 */
$RequestMapping("/serviceCloud/billMaterial/saveFile.do", function(data) {
    this.post({
        url: '/serve-api/billMaterialAtt/',
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 删除服务单资料附件
 */
$RequestMapping("/serviceCloud/billMaterial/deleteFile.do", function(id) {
    this.delete({
        url: '/serve-api/billMaterialAtt/' + id
    }).then(() => {
        this.send();
    });
});

/**
 * 根据资料实例ID获取资料实例交接记录列表
 */
$RequestMapping("/serviceCloud/transferRecords/list.do", function(fileId) {
    this.get({
        url: '/serve-api/bill/data/instance/getTransferRecords',
        param: {
            dataInstanceId: fileId
        }
    }).then(data => {
        if (data) {
            data.forEach((file, index) => {
                let newFileList = file.secBillDataInstanceTransferRecordAffixVos.filter(item => {
                    return !String.isNullOrBlank(item.attId);
                });
                data[index].secBillDataInstanceTransferRecordAffixVos = newFileList;
            });
        }
        this.send(data);
    });
});

/**
 * (提交/确认接收)资料实例交接记录
 */
$RequestMapping("/serviceCloud/transferRecords/save.do", function(data) {
    this.post({
        url: '/serve-api/bill/data/instance/commitTransferRecords',
        data: data
    }).then(() => {
        this.send();
    });
});

/**
 * 删除资料实例交接记录
 */
$RequestMapping("/serviceCloud/transferRecords/delete.do", function(id) {
    this.delete({
        url: '/serve-api/bill/data/instance/removeTransferRecord/' + id
    }).then(() => {
        this.send();
    });
});

/**
 * 获取当前组织的客户经理
 */
$RequestMapping("/serviceCloud/serviceDispatch/managerUser/list.do", function(orgId) {
    this.get({
        url: '/portal-api/users/getUsersByIds/' + orgId
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据合约ID获取服务单列表
 */
$RequestMapping("/serviceCloud/service/serviceList.do", function(contractId) {
    this.get({
        url: '/serve-api/bill/list/progress',
        param: {
            contractId: contractId
        }
    }).then(data => {
        this.send(data);
    });
});
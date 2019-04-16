/**
 * 获取合同变更信息
 */
$RequestMapping("/signCloud/contractChange/getContractInfo.do", function(id) {
    this.get({
        url:'/sign-api/contract/'+id+'/subjectsAndSignedInfo'
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取合同变更信息
 */
$RequestMapping("/signCloud/contractChange/getContractInfoByChangeId.do", function(id) {
    this.get({
        url:'/sign-api/agreement/'+id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 保存合同变更信息
 */
$RequestMapping("/signCloud/contractChange/save.do", function(data) {
    this.post({
        url:'/sign-api/agreement/content',
        data:data
    }).then(data => {
        this.send(data);
    });
});
/**
 * 新版根据合约ID获取变更协议列表
 */
$RequestMapping("/signCloud/newContractChange/getChangeList.do", function(contractId) {
    this.get({
        url:'/sign-api/agreement/list',
        param:{
            contractId: contractId
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 新版根据变更协议ID获取 协议编号  原合约编号  客户名称
 */
$RequestMapping("/signCloud/changeNullifyView/getContractChangeInfo.do", function(changeId) {
    this.get({
        url:'/sign-api/agreement/'+ changeId+'/agreementInvalid'
    }).then(data => {
        this.send(data);
    });
});
/**
 * 新版变更协议作废
 */
$RequestMapping("/signCloud/changeNullifyView/nullify.do", function(changeContractId,nullifyReason) {
    this.put({
        url:'/sign-api/agreement/'+ changeContractId +'/invalid',
        param:{
            content: nullifyReason
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 新版变更协议签署
 */
$RequestMapping("/signCloud/changeSignPage/changeContractSign.do", function(id,list) {
    this.put({
        url:'/sign-api/agreement/'+ id +'/signed',
        data:{
            subjectList: list
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 新版变更协议  获取签约主体
 */
$RequestMapping("/signCloud/changeSignPage/getSubjects.do", function(id) {
    this.get({
        url:'/sign-api/agreement/get/subjects',
        param:{
            agreementId: id
        }
    }).then(data => {
        this.send(data);
    });
});




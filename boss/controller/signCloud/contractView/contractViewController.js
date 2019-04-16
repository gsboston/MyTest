/**
 * 获取左侧合约列表
 */
$RequestMapping("/signCloud/contractView/search.do", function(page,signStatus,receiptStatus,invoiceStatus,agrementStatus,nameOrCode,isTodo) {
    let url = "/sign-api/contract/get/list";
    if(!isTodo){
        url = "/sign-api/contract/pending/list";
    }
    this.get({
        url:url,
        param:{current:page,signStatus:signStatus,receiptStatus:receiptStatus,invoiceStatus:invoiceStatus,nameOrCode:nameOrCode,agrementStatus:agrementStatus}
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('--------------error');
        this.send(error);
    });
});
/**
 * 根据Id获取合约详情
 */
$RequestMapping("/signCloud/contractView/getContractById.do", function(id) {
    this.get({
        url:'/sign-api/contract/get/' + id
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('--------------error');
        this.send(error);
    });
});

/**
 * 审核环节 -- 获取左侧待审核的合约、变更协议列表
 */
$RequestMapping("/signCloud/contractView/pendingAuditList.do", function(page, nameOrCode, status, size) {
    if (String.isNullOrBlank(size)) {
        size = 10;
    }
    this.get({
        url: '/sign-api/contract/getPendingAuditPage',
        param: {
            nameOrCode: nameOrCode,
            current: page,
            approvalStatus: status,
            size: size
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 根据合约ID 获取创建人的Id
 */
$RequestMapping("/signCloud/contractView/getCreaterIdByContractId.do", function(contractId) {
    this.get({
        url:'/sign-api/contract/getCreaterIdByContractId',
        param: {
            contractId: contractId
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('--------------error');
        this.send(error);
    });
});




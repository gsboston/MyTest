/**
 * 新版签约云合约列表查询通用组件
 */
$RequestMapping("/signCloud/contractSearch/searchContractList.do", function(myOwn,searchStatus,baseStatus,invoiceStatus,nameOrCode,signedStartDate,signedEndDate,current,isContractOrg,isSubjectBOrg,isChanging,isReceiptCompleted,isPayee) {
    this.get({
        url: "/sign-api/contract/search",
        param:{
            myOwn: myOwn,
            signStatus: searchStatus,
            baseStatus: baseStatus,
            // invoiceStatus: invoiceStatus,
            nameOrCode: nameOrCode,
            signedStartDate: signedStartDate,
            signedEndDate: signedEndDate,
            current: current,
            isContractOrg: isContractOrg,
            isSubjectBOrg: isSubjectBOrg,
            isChanging: isChanging,
            isReceiptCompleted: isReceiptCompleted,
            isPayee: isPayee,
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('--------------error');
        this.send(error);
    });
});

/**
 * 查询有权限审核合约人员信息
 */
$RequestMapping("/signCloud/contractSearch/getApproveUsers.do", function(contractId) {
    this.get({
        url: "/sign-api/contract/" + contractId + "/approveUsers"
    }).then(data => {
        this.send(data);
    });
});


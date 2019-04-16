/**
 * 合约提交审核
 */
$RequestMapping("/signCloud/audit/updateContractStatus.do", function(id,status) {
    this.request({
        url:'/sign-api/contract/' + id+"/status",
        param:{status:status},
        method: $Http.METHOD_PUT
    }, {
        url: "/sign-api/contract/get/"+id,
        method: $Http.METHOD_GET,
    }).then((status,data) => {
        this.send(data);
    });
});
/**
 * 合约审核通过
 */
$RequestMapping("/signCloud/audit/auditContract.do", function(id) {
    this.request({
        url:'/sign-api/approval/approve/' + id,
        method: $Http.METHOD_PUT
    }, {
        url: "/sign-api/contract/get/"+id,
        method: $Http.METHOD_GET,
    }).then((status,data) => {
        this.send(data);
    });
});
/**
 * 合约驳回
 */
$RequestMapping("/signCloud/audit/reject.do", function(id,rejectReason) {
    this.put({
        url:'/sign-api/approval/reject/' + id,
        param:{comment:rejectReason}
    }).then(data => {
        this.send(data);
    });
});
/**
 * 合约作废
 */
$RequestMapping("/signCloud/audit/nullify.do", function(id,nullifyReason) {
    this.post({
        url:'/sign-api/contract/invalid',
        param:{id:id,reason:nullifyReason}
    }).then(data => {
        this.send(data);
    });
});
/**
 * 变更协议审核通过
 */
$RequestMapping("/signCloud/audit/auditChangeContract.do", function(id) {
    this.put({
        url:'/sign-api/agreement/'+id+'/approve'
    }).then((status) => {
        this.send();
    });
});
/**
 * 变更协议取消审核
 */
$RequestMapping("/signCloud/audit/changeCancel.do", function(id,remark) {
    this.put({
        url:'/sign-api/agreement/'+id+'/cancel',
        param: {
            remark: remark
        }
    }).then((status) => {
        this.send();
    });
});
/**
 * 变更协议作废
 */
$RequestMapping("/signCloud/audit/changeNullify.do", function(id) {
    this.put({
        url:'/sign-api/agreement/'+id+'/invalid'
    }).then((status) => {
        this.send();
    });
});
/**
 * 变更协议驳回
 */
$RequestMapping("/signCloud/audit/changeReject.do", function(id,remark) {
    this.put({
        url:'/sign-api/agreement/'+id+'/rejected',
        param:{remark:remark}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 变更协议驳回
 */
$RequestMapping("/signCloud/audit/getOssFileId.do", function(id) {
    this.get({
        url:'/sign-api/printContract/pdf/' + id
    }).then(data => {
        this.send(data);
    });
});



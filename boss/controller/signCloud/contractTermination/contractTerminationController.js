/**
 * Created by xhr on 2017/11/22.
 */
/**
 * 获取原合约信息
 */
$RequestMapping('/signCloud/contract/termination.do', function (data) {
    this.post({
        url: "/sign-api/contract/termination",
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 按合约ID获取合约已收款金额
 */
$RequestMapping('/signCloud/contract/receiptedPrice.do', function (contractId) {
    this.get({
        url: "/sign-api/receipts/receiptedPrice/"+contractId,
    }).then(data => {
        this.send(data);
    });
});


/**
 * 按合约变更提交
 */
$RequestMapping('/signCloud/contract/terminationSubmit.do', function (data) {
    console.log(data);
    this.post({
        url: "/sign-api/contract/termination/",
        data:data
    }).then(data => {
        this.send();
    });
});

/**
 * 按合约变更提交
 */
$RequestMapping('/signCloud/contractTermination/info.do', function (id) {
    this.get({
        url: "/sign-api/contract/termination/"+id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 合约详情-合约信息
 */
$RequestMapping('/signCloud/contract/info.do', function (contractId) {
    this.get({
        url: '/sign-api/contract/find/' + contractId
    }).then(data => {
        this.send(data);
    });
});

/**
 * 指定发票信息查询
 */
$RequestMapping("/signCloud/invoice/info.do", function(id) {
    this.get({
        url: "/sign-api/invoice/" + id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据合同ID获取发票列表查询
 */
$RequestMapping("/signCloud/invoice/getInvoice.do", function(contractId, isInvoiced) {
    this.get({
        url: "/sign-api/invoice/getInvoice/" + contractId,
        param: {
            isInvoiced: isInvoiced
        }
    }).then(data => {
        let allowOperateData = [], returnData = {};
        if (data) {
            data.forEach(function (item) {
                item.checked = false;
                if (item.status == 'NORMAL') {
                    allowOperateData.push(item);
                }
            });
        }
        returnData.allData = data;
        returnData.allowOperateData = allowOperateData;
        this.send(returnData);
    });
});

/**
 * 开票--新增保存
 */
$RequestMapping("/signCloud/invoice/save.do", function(data) {
    let postData = {
        price: data.price,
        invoiceBillsType: 'PAPER',
        invoiceType: data.invoiceType,
        titleType: data.titleType,
        title: data.title,
        invoiceCode: data.invoiceCode,
        invoiceNumber: data.invoiceNumber,
        invoicedDate: data.invoicedDate,
        drawer: data.drawer,
        receiverName: data.receiverName,
        contractId: data.contractId,
        inviceList: data.inviceList,
        attList: data.attList
    };
    this.post({
        url: "/sign-api/invoiced/",
        data: postData
    }).then(data => {
        this.send(data);
    });
});

/**
 * 开票--修改保存
 */
$RequestMapping("/signCloud/invoice/update.do", function(data) {
    this.put({
        url: "/sign-api/invoiced/" + data.id,
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 申请开票--新增保存
 */
$RequestMapping("/signCloud/applyInvoice/save.do", function(data) {
    this.post({
        url: "/sign-api/invoice/",
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 申请开票--修改保存
 */
$RequestMapping("/signCloud/applyInvoice/update.do", function(data) {
    this.put({
        url: "/sign-api/invoice/" + data.id,
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 申请开票--更新状态
 */
$RequestMapping("/signCloud/invoice/updateState.do", function(id) {
    this.put({
        url: "/sign-api/invoice/updateInvoice/" + id,
        data: {
            isInvoiced: 1
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据合同ID获取金额
 */
$RequestMapping("/signCloud/invoice/getPrice.do", function(contractId) {
    this.get({
        url: "/sign-api/invoice/getPrice/" + contractId,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据合同ID查询最后一条合同开票信息
 */
$RequestMapping("/signCloud/invoice/getLastInvoiceInfo.do", function(contractId) {
    this.get({
        url: "/sign-api/invoice/",
        param: {
            contractId: contractId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 撤销开票申请
 */
$RequestMapping("/signCloud/invoice/unDoApply.do", function(invoiceId) {
    this.delete({
        url: "/sign-api/invoice/" + invoiceId
    }).then(data => {
        this.send(data);
    });
});

/**
 * 发票作废
 */
$RequestMapping("/signCloud/invoice/invoiceInvalidated.do", function(invoiceIds, remark) {
    this.put({
        url: "/sign-api/invoiced/invalidated",
        param: {
            ids: invoiceIds,
            remark: remark
        }
    }).then(() => {
        this.send();
    });
});

/**
 * 查询冲红发票信息
 */
$RequestMapping("/signCloud/invoice/invoiceHedgeInfo.do", function(invoiceId) {
    this.get({
        url: "/sign-api/invoiced/" + invoiceId + "/hedge",
        param: {
            id: invoiceId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 发票冲红
 */
$RequestMapping("/signCloud/invoice/invoiceHedge.do", function(invoiceInfo) {
    this.post({
        url: "/sign-api/invoiced/" + invoiceInfo.id + "/hedge",
        data: {
            price: invoiceInfo.price,
            invoiceBillsType: invoiceInfo.invoiceBillsType,
            invoiceCode: invoiceInfo.invoiceCode,
            invoiceNumber: invoiceInfo.invoiceNumber,
            invoiceType: invoiceInfo.invoiceType,
            invoicedDate: invoiceInfo.invoicedDate,
            drawer: invoiceInfo.drawer,
            title: invoiceInfo.title,
            titleType: invoiceInfo.titleType
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 验证发票编码、号否存在
 */
$RequestMapping("/signCloud/invoiced/validateCode.do", function(invoiceNumber, invoiceCode) {
    this.get({
        url: "/sign-api/invoiced/validateCode",
        param: {
            invoiceNumber: invoiceNumber,
            invoiceCode: invoiceCode
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 分页查询--发票已经申请未开的合约信息
 */
$RequestMapping("/signCloud/contract/getPageContractByInvoice.do", function(page) {
    this.get({
        url: "/sign-api/contract/getPageContractByInvoice",
        param: {
            current: page
        }
    }).then(data => {
        this.send(data);
    });
});
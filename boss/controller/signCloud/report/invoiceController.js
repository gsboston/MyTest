/**
 * 首页-开票模块数据获取
 */
$RequestMapping("/signCloud/report/contractInvoiced.do", function(date) {
    this.get({
        url:'/sign-api/invoiced/report/contractInvoiced?date='+date
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取当前月份
 */
$RequestMapping("/signCloud/report/getInvoiceMonth.do", function() {
    this.send((new Date().getMonth() + 1));
});
/**
 * 微信支付回调-公共对外接口
 */
$RequestMapping("/boss/api/weiXinPayReturn.do", function(data) {
    console.log("url:/boss/api/weiXinPayReturn.do,body:"+JSON.stringify(data));
    this.put({
        url: "/sign-api/pay/outUpdatePayState/"+data.xml.out_trade_no,
    }).then(data => {
        this.post({
            url: data.wxCodeUrl,
            param: {
                orderNo: data.orderNo,
            }
        }).then(() => {
            var s = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
            this.response.contentType("	text/xml; charset=UTF-8").send(s);
        });
    });
}, {
    isAuth: false
});
const fs = require("fs");
const qr = require('qr-image');
const axios = require("axios");

/**
 * 获取当前合约待收款主体信息
 */
$RequestMapping('/signCloud/collection/receivableInfo.do', function (contractId) {
    this.get({
        url: "/sign-api/receivable/info/"+contractId,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取当前合约待收款列表
 */
$RequestMapping('/signCloud/collection/receivables.do', function (contractId) {
    this.get({
        url: "/sign-api/receivable/"+contractId,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取当前合约已收款列表
 */
$RequestMapping('/signCloud/collection/receipts.do', function (contractId) {
    this.get({
        url: "/sign-api/receipts/"+contractId,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取优惠券详情
 */
$RequestMapping('/signCloud/collection/couponDetail.do', function (code, mobile) {
    var result = {};
    console.log(process.config.WINSHOWS_API_COUPON);
    axios.get(process.config.WINSHOWS_API_COUPON + 'coupon/code/detail', {
        params: {
            code: code,
            mobile: mobile,
        }
    })
    .then(response => {
        result = response.data;
        this.send(result);
    })
    .catch(function (error) {
        console.log(error);
    });
});

/**
 * 验证优惠券列表
 */
$RequestMapping('/signCloud/collection/CheckCoupon.do', function (data) {
    var result = {
        success: true,
        msg: "",
    };
    //4.判断当前优惠券单笔订单最多使用张数限制
    let obj = data;
    this.get({
        url: "/sign-api/receipts/contractCouponCount/"+data.receivableInfo.id,
    }).then(data => {
        console.log(JSON.stringify(data));
        if (data >= obj.couponItem.data.coupon.limitedUsedCount && obj.couponItem.data.coupon.limitedUsedCount > 0) {
            result.success = false;
            result.msg = "当前已经使用"+obj.couponItem.data.coupon.limitedUsedCount+"张优惠券,不能再用了！";
            this.send(result);
            return;
        } else {
            //1.判断当前时间是否再活动时间范围内
            if (Date.parse(obj.couponItem.data.coupon.beginTime) > Date.parse(new Date()) || Date.parse(obj.couponItem.data.coupon.endTime) < Date.parse(new Date())) {
                console.log("data.couponItem.data.coupon.beginTime:" + obj.couponItem.data.coupon.beginTime);
                console.log("Date.parse(data.couponItem.data.coupon.beginTime):" + Date.parse(obj.couponItem.data.coupon.beginTime));
                console.log("new Date():" + Date.parse(new Date()));
                result.success = false;
                result.msg = "当前时间不在该优惠券活动时间范围内，不能使用该优惠券！";
                this.send(result);
                return;
            }
            //2.判断合同总金额是否满足金额限制
            if (obj.receivableInfo.price < obj.couponItem.data.coupon.limitedMoneyPrecision) {
                result.success = false;
                result.msg = "当前合约金额不满"+obj.couponItem.data.coupon.limitedMoneyPrecision+"元，不能使用该优惠券！";
                this.send(result);
                return;
            }
            //3.判断优惠券有效期
            if (obj.couponItem.data.coupon.couponValidateType == 1) {
                if(Date.parse(obj.couponItem.data.coupon.couponValidateBeginTime) > Date.parse(new Date()) || Date.parse(obj.couponItem.data.coupon.couponValidateEndTime) < Date.parse(new Date())) {
                    result.success = false;
                    result.msg = "当前优惠券不在有效期范围内，不能使用该优惠券！";
                    this.send(result);
                    return;
                }
            } else {
                if ((Date.parse(obj.couponItem.data.code.sendedTime)+obj.couponItem.data.coupon.couponValidateDays*24*3600*1000) < Date.parse(new Date())) {
                    result.success = false;
                    result.msg = "当前优惠券不在有效期范围内，不能使用该优惠券！";
                    this.send(result);
                    return;
                }
            }
            //5.判断当前合同是否在服务范围内，如果不在则默认返回验证失败的情况
            for (var i=0;i<obj.couponItem.data.coupon.service.length;i++) {
                for (var j=0;j<obj.couponItem.data.coupon.service[i].services.length;j++) {
                    if (obj.couponItem.data.coupon.service[i].services[j].serviceCode == obj.receivableInfo.serviceCode
                        && obj.couponItem.data.coupon.service[i].services[j].serviceAllowed) {
                        this.send(result);
                        return;
                    }
                }
            }
            result.success = false;
            result.msg = "当前合约的类型不在优惠券的合约限定范围，不能使用该优惠券！";
            this.send(result);
        }
    });

});

/**
 * 使用优惠券列表
 */
$RequestMapping('/signCloud/collection/UseCoupon.do', function (data) {
    var result = {};
    axios.post(process.config.WINSHOWS_API_COUPON + 'coupon/use', data)
    .then(response => {
        result = response.data;
        this.send(result);
        console.log(result);
    })
    .catch(error => {
        this.send({success:false});
    });
});



/**
 * 收款
 */
$RequestMapping('/signCloud/collection/saveReceipt.do', function (data) {
    console.log(data.contractId);
    console.log(JSON.stringify(data));
    this.post({
        url: "/sign-api/receipts/"+data.contractId,
        data: data,
    }).then(data => {
        console.log(data);
        this.send(data);
    });
});

/**
 * 支付宝收款
 */
$RequestMapping('/signCloud/collection/aliPay.do', function (data) {
    let returnUrl = "/static/pay/aliPaySuccess.html";
    data.source = "BOSS-PC";
    this.get({
        url: "/sign-api/pay/paySave",
        param: {
            jsonArray: JSON.stringify(data),
            returnUrl: returnUrl
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 支付宝打开支付页面
 */
$RequestMapping('/signCloud/collection/aliPayOpen.do', function (id) {
    this.get({
        url: "/sign-api/pay/aliPay",
        param: {
            payId: id,
        }
    }).then(data => {
        this.response.contentType("text/html; charset=UTF-8").send(data.zfbSHtmlText);
    });
});

/**
 * 微信收款
 */
$RequestMapping('/signCloud/collection/wechatPay.do', function (data) {
    data.source = "BOSS-PC";
    this.get({
        url: "/sign-api/pay/wxPay",
        param: {
            jsonArray: JSON.stringify(data),
        }
    }).then(data => {
        this.send(data.wxCodeUrl);
        // var qr_svg = qr.image(data.wxCodeUrl, { type: 'png' });
        // qr_svg.pipe(require('fs').createWriteStream('.png'));
        // var svg_string = qr.imageSync(data.wxCodeUrl, { type: 'png' });
        // this.response.contentType("	image/png; charset=UTF-8").send(svg_string);
    });
});

/**
 * 微信收款打开支付二维码
 */
$RequestMapping('/signCloud/collection/wechatPayOpen.do', function (code) {
    console.log(code);
    console.log(decodeURI(code));
    var qr_svg = qr.image(code, { type: 'png' });
    qr_svg.pipe(require('fs').createWriteStream('.png'));
    var svg_string = qr.imageSync(code, { type: 'png' });
    this.response.contentType("	image/png; charset=UTF-8").send(svg_string);
});


/**
 * 支付宝支付回调
 */
$RequestMapping("/signCloud/collection/aliPayReturn.do", function(out_trade_no, trade_no, extra_common_param) {
    console.log("out_trade_no:"+out_trade_no);
    console.log("trade_no:"+trade_no);
    console.log("extra_common_param:"+extra_common_param);
    this.request({
        url: "/sign-api/receipts/alipay",
        param: {
            out_trade_no: out_trade_no,
            trade_no: trade_no,
            passback_params: extra_common_param
        }
    }).then(data => {
        this.send();
    });
}, {
    isAuth: false
});

/**
 * 微信支付回调
 */
$RequestMapping("/signCloud/collection/weiXinPayReturn.do", function(data) {
    console.log("body:"+JSON.stringify(data));
    console.log("body:"+data.xml.attach);
    this.request({
        url: "/sign-api/receipts/wechatPay",
        param: {
            attach: data.xml.attach
        }
    }).then(data => {
        var s = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
        this.response.contentType("	text/xml; charset=UTF-8").send(s);
    });
}, {
    isAuth: false
});


/**
 * 凭收款ID获取收款记录
 */
$RequestMapping('/signCloud/collection/getReceipt.do', function (contractReceiptId) {
    this.get({
        url: "/sign-api/receipts/receipt/" + contractReceiptId,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 编辑收款记录
 */
$RequestMapping('/signCloud/collection/editReceipt.do', function (data) {
    this.put({
        url: "/sign-api/receipts/",
        data: data,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 按文件关联ID删除收款记录中的文件
 */
$RequestMapping('/signCloud/collection/receipt/file.do', function (receiptFileId) {
    this.delete({
        url: "/sign-api/receipts/file/"+receiptFileId,
    }).then(data => {
        this.send();
    });
});

/**
 * 合约收款列表
 */
$RequestMapping('/signCloud/collectionPage/getContractList.do', function (nameOrCode,payeeStatus,current) {
    this.get({
        url: "/sign-api/contract/searchPayeePage",
        param: {
            nameOrCode: nameOrCode,
            payeeStatus: payeeStatus,
            current: current,
        },
    }).then(data => {
        this.send(data);
    });
});













/**
 * 企业开通申请
 */
$RequestMapping("/system/companyOpenApply/openApply.do", function(data) {
    this.post({
        url: "/portal-api/org/regist/save",
        data: data
    }).then(data => {
        console.log(JSON.stringify(data));
        this.send(data);
    });
}, {
    isAuth: false
});

/**
 * 企业开通申请  发送短信验证码
 */
$RequestMapping("/system/companyOpenApply/sendPhoneVerificationCode.do", function(phoneNum) {
    this.post({
        url: "/portal-api/sms/send/validate/org/regist",
        param: {
            systemCode: "BOSS_SYSTEM",
            phoneNumber: phoneNum
        }
    }).then(data => {
        console.log(JSON.stringify(data));
        this.send(data);
    });
}, {
    isAuth: false
});

/**
 * 企业开通申请  公司申请注册验证码校验
 */
$RequestMapping("/system/companyOpenApply/verificationCodeAudit.do", function(phoneNumber,validateCode) {
    this.post({
        url: "/portal-api/sms/validate/org/regist",
        param: {
            phoneNumber: phoneNumber,
            validateCode: validateCode
        }
    }).then(data => {
        console.log(JSON.stringify(data));
        this.send(data);
    });
}, {
    isAuth: false
});

/**
 * 企业开通申请  公司名称重复校验
 */
$RequestMapping("/system/companyOpenApply/auditCompanyName.do", function(name) {
    this.get({
        url: "/portal-api/org/regist/check",
        param: {
            name: name
        }
    }).then(data => {
        console.log(JSON.stringify(data));
        this.send(data);
    });
}, {
    isAuth: false
});

/**
 * 企业开通申请  验证文字验证码
 */
$RequestMapping("/system/companyOpenApply/sendVerificationCode.do", function(verificationCode) {
    let flag = (verificationCode == this.getImageVerificationCode());
    this.send(flag);
},{
    isAuth: false
});


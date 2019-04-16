/**
 * Created by xhr on 2017/11/20.
 */
/**
 * 忘记密码请求验证码
 */
$RequestMapping("/systemManage/forgotPasswordSendCode.do", function(userName) {
    this.request({
        url: "/portal-api/sms/checkUser",
        method: $Http.METHOD_GET,
        param: {
            userName: userName,
        }
    }).then(data => {
        this.send(data);
    });
}, {
    isAuth: false
});

/**
 * 忘记密码更改密码
 */
$RequestMapping("/systemManage/forgotPasswordChangePassword.do", function(data) {
    this.put({
        url: "/portal-api/sms/checkCodeAndUpdatePassword",
        param: {
            userName: data.userName,
            validateCode: data.validateCode,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        }
    }).then(data => {
        console.log(JSON.stringify(data));
        this.send(data);
    });
}, {
    isAuth: false
});
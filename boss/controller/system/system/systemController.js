$RequestMapping("/system/getModuleList.do", function() {
    // this.send(defaultModules);
    // return;
    this.send(this._getModules());
});

$RequestMapping("/system/sms/sendValidCode.do", function(phoneNumber) {
    this.request({
        url: "/portal-api/sms/send",
        param: {
            systemCode: "BOSS_SYSTEM",
            phoneNumbers: phoneNumber
        }
    }).then(() => {
        this.send();
    });
});

const defaultModules = [{
    code: "M01",
    name: "首页",
    icon: "home"
}, {
    code: "M02",
    name: "营销管理",
    icon: "briefcase"
}, {
    code: "M03",
    name: "签约管理",
    icon: "cloud"
}, {
    code: "M05",
    name: "系统配置",
    icon: "gear-b"
}];
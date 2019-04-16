$RequestMapping("/system/swagger/getApiUrl.do", function(code) {
    let config = process.config;
    let gatewayHost = config.GATEWAY_HOST;
    this.send("http://" + gatewayHost + "/" + code + "/swagger-ui.html");
}, {
    isAuth: false
});
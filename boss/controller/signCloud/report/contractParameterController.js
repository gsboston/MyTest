const http = require("http");

/**
 * 合约台账   获取正式合约情况统计
 */
$RequestMapping("/signCloud/contractParameter/getSignedContractReport.do", function(signedStart,signedEnd) {
    this.get({
        url:'/sign-api/contract/getSignedContractReport',
        param: {
            signedStart: signedStart,
            signedEnd: signedEnd
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 合约台账   获取待签合约情况统计
 */
$RequestMapping("/signCloud/contractParameter/getPendingSignedContractReport.do", function() {
    this.get({
        url: '/sign-api/contract/getPendingSignedContractReport'
    }).then(data => {
        this.send(data);
    });
});

/**
 * 合约台账   获取正式合约列表
 */
$RequestMapping("/signCloud/contractParameter/getSignedContractByPage.do", function(searchText,current,signedStart,signedEnd) {
    this.get({
        url: '/sign-api/contract/getSignedContractByPage',
        param: {
            key: searchText,
            current: current,
            signedStart: signedStart,
            signedEnd: signedEnd
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 合约台账   获取待签合约列表
 */
$RequestMapping("/signCloud/contractParameter/getPendingSignedContractByPage.do", function(searchText,current,status) {
    this.get({
        url: '/sign-api/contract/getPendingSignedContractByPage',
        param: {
            key: searchText,
            current: current,
            status: status
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 合约台账   导出excel
 */
$RequestMapping("/signCloud/contractParameter/exportFile.do", function(contractState,searchText,pendingState,signedStart,signedEnd) {
    let url = "";
    if(contractState === "formal"){
        url = "/sign-api/contract/download/signedContractExcel";
        if(searchText && signedStart && signedEnd){
            url += "?key=" + searchText + "&signedStart=" + signedStart + "&signedEnd=" + signedEnd;
        }else{
            if(searchText){
                url = url + "?key=" + searchText;
            }else if(signedStart && signedEnd){
                url = url + "?signedStart=" + signedStart + "&signedEnd=" + signedEnd;
            }
        }
    }else if(contractState === "toSign"){
        url = "/sign-api/contract/download/pendingSignedContractExcel";
        if(searchText && pendingState){
            url = url + "?key=" + searchText + "&status=" + pendingState;
        }else{
            if(searchText){
                url = url + "?key=" + searchText;
            }else if(pendingState){
                url = url + "?status=" + pendingState;
            }
        }
    }
    console.log(url);
    var options = {
        host: process.config.GATEWAY_HOST,
        port: "80",
        path: url,
        method: "GET",
        headers: {
            token: this._getToken()
        }
    };
    let _request = http.request(options, _response => {
        this.response.statusCode = _response.statusCode;
        let headers = _response.headers;
        Object.keys(headers).forEach(key => {
            this.response.set(key, headers[key]);
        });
        _response.pipe(this.response);
    }).on("error",function(){
        this.response.statusCode = 503;
        this.response.end();
    });
    this.__request.pipe(_request);
});

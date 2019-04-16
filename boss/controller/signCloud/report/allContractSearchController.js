const http = require("http");

/**
 * 合约查询   获取合约列表
 */
$RequestMapping("/signCloud/allContractSearch/getContractList.do", function(searchText,current,contractStatus,dateFlag,flag,startDate,endDate) {
    this.get({
        url: '/sign-api/contract/searchByStatisticsPage',
        param: {
            key: searchText,
            pageNum: current,
            contractStatus: contractStatus,
            dateFlag: dateFlag,
            flag: flag,
            startDate: startDate,
            endDate: endDate,
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 合约查询   导出excel
 */
$RequestMapping("/signCloud/allContractSearch/exportFile.do", function(key,contractStatus,flag,dateFlag,startDate,endDate) {
    let url = "/sign-api/contract/download/searchByStatisticsExcel?flag=" + flag;
    if(contractStatus){
        url = url + "&contractStatus=" + contractStatus;
    }
    if(key){
        url = url + "&key=" + key;
    }
    if(dateFlag){
        url = url + "&dateFlag=" + dateFlag;
    }
    if(startDate){
        url = url + "&startDate=" + startDate;
    }
    if(endDate){
        url = url + "&endDate=" + endDate;
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

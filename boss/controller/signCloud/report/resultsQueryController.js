const http = require("http");
/**
 * 业绩查询   获取服务及服务群组档案
 */
$RequestMapping("/signCloud/report/getCascadeGroup.do", function() {
    this.get({
        url: '/portal-api/basedocs/cascade/service/group'
    }).then(data => {
        this.send(data);
    });
});

/**
 * 业绩查询   获取业务员签约列表
 */
$RequestMapping("/signCloud/report/getSignList.do", function(startDate,endDate,serviceItemIds) {
    this.get({
        url: '/report-api/sign/achieve/sign/list',
        param: {
            startDate: startDate,
            endDate: endDate,
            serviceItemIds: serviceItemIds
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 业绩查询   获取业务员签约详情
 */
$RequestMapping("/signCloud/report/getSignInfo.do", function(startDate,endDate,serviceItemIds,userId,page) {
    this.get({
        url: '/report-api/sign/achieve/sign/info',
        param: {
            startDate: startDate,
            endDate: endDate,
            serviceItemIds: serviceItemIds,
            userId: userId,
            page: page
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 业绩查询   获取业务员回款列表
 */
$RequestMapping("/signCloud/report/getReceivableList.do", function(startDate,endDate,serviceItemIds) {
    this.get({
        url: '/report-api/sign/achieve/receivables/list',
        param: {
            startDate: startDate,
            endDate: endDate,
            serviceItemIds: serviceItemIds
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 业绩查询   获取业务员回款详情
 */
$RequestMapping("/signCloud/report/getReceivableInfo.do", function(startDate,endDate,serviceItemIds,userId,page) {
    this.get({
        url: '/report-api/sign/achieve/receivables/info',
        param: {
            startDate: startDate,
            endDate: endDate,
            serviceItemIds: serviceItemIds,
            userId: userId,
            page: page
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 业绩查询   导出
 */
$RequestMapping("/signCloud/contractParameter/exportFile.do", function(startDate,endDate,serviceItemIds) {
    let url = "/report-api/sign/achieve/download/signedContractExcel";
    if(startDate && endDate){
        url = url + "?startDate=" + startDate + "&endDate=" + endDate;
        if(serviceItemIds){
            url = url + "&serviceItemIds=" + serviceItemIds;
        }
    }
    else if(serviceItemIds){
        url = url + "?serviceItemIds=" + serviceItemIds;
        if(startDate && endDate){
            url = url + "&startDate=" + startDate + "&endDate=" + endDate;
        }
    }
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


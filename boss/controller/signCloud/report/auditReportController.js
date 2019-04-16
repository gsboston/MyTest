/**
 * 首页-审核模块-图表-待审核数据
 */
$RequestMapping("/signCloud/report/tobeApproval.do", function() {
    this.get({
        url:'/report-api/sign/approval/tobeApproval'
    }).then(data => {
        let returnData = {
            pieData: [],
            pieLegendData: [],
            pieLegendFormat: {},
            auditContractNum: 0,
            signContent: 0,
            signSubject: 0,
        };
        if (data) {
            if (data['contracts']) {
                data['contracts'].forEach(item => {
                    returnData.pieData.push({
                        name: item.defname,
                        value: item.num,
                    });
                    returnData.pieLegendFormat[item.defname] = item.num;
                    returnData.pieLegendData.push(item.defname);
                    returnData.auditContractNum += parseInt(item.num);
                });
            }
            if (data['agreements']) {
                data['agreements'].forEach(item => {
                    if (item.alertType == 'CONTENT') {
                        returnData.signContent = item.num;
                    }else {
                        returnData.signSubject = item.num;
                    }
                });
            }
        }
        this.send(returnData);
    });
});

/**
 * 首页-审核模块-图表-已审核数据
 */
$RequestMapping("/signCloud/report/approvaled.do", function(type) {
    this.get({
        url:'/report-api/sign/approval/Approvaled',
        param: {
            type: type
        }
    }).then(data => {
        this.send(data);
    });
});
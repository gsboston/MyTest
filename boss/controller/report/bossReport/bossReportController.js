/**
 * BOSS报表-地图
 */
$RequestMapping('/report/bossReport/abc.do', function (data) {
    let getData = {
        tooltip : {
            trigger: 'item',
            formatter: '{b}'
        },
        series : [
            {
                name: '中国',
                type: 'map',
                mapType: 'china',
                selectedMode : 'multiple',
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                    {name:'广东',selected:true}
                ]
            }
        ]
    }
    this.send(getData);
})

/**
 * 营销云
 */
$RequestMapping('/report/bossReport/conversion.do', function (type) {
    this.get({
        url: '/report-api/crm/conversion',
        param: {
            type: type
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取省份
 */
$RequestMapping("/report/bossReport/getProvince.do", function(id) {
    this.get({
        url: "/portal-api/basedocs/areaWarZones"
    }).then(data => {
        this.send(data)
    });
});

/**
 * 获取战区
 */
$RequestMapping("/report/bossReport/getWar.do", function(id) {
    this.get({
        url: "/portal-api/basedocs/items/"+ "bd_war_zone"
    }).then(data => {
        this.send(data)
    });
});

/**
 * BOSS报表-日期获取
 */
$RequestMapping("/report/bossReport/getYearList.do", function() {
   let list = [
       {value:'2015',label:'2015年'},
       {value:'2016',label:'2016年'},
       {value:'2017',label:'2017年'},
       {value:'2018',label:'2018年'}
   ]

    this.send(list)

});

/**
 * BOSS报表-柱形图
 */
$RequestMapping("/report/bossReport/reportPillar.do", function(year,type,levelName,levelValue) {
    this.get({
        url: "/report-api/statistics/echart/type",
        param: {
            year:year,
            type:type,
            levelName:levelName,
            levelValue:levelValue
        }
    }).then(data => {
        this.send(data)

    });
});

/**
 * BOSS报表-折线图
 */
$RequestMapping("/report/bossReport/reportFoldCurver.do", function(year,type,levelName,levelValue) {
    this.get({
        url: "/report-api/statistics/echart/year",
        param: {
            year:year,
            type:type,
            levelName:levelName,
            levelValue:levelValue
        }
    }).then(data => {
        this.send(data)

    });
});


/**
 * BOSS报表-饼图数据
 */
$RequestMapping("/report/bossReport/reportPieList.do", function(year,level,childLevel,type) {
    this.get({
        url: "/report-api/sign/signSituationLevelDate",
        param: {
            year:year,
            type:type,
            level:level,
            childLevel:childLevel
        }
    }).then(data => {
        let dataList = data
        for(var i in dataList){
            dataList[i].content= '签单数：'+dataList[i].contractCount+'；<br/>应收额：'+dataList[i].receivablePrice+'；<br/>实际收款：'+dataList[i].receiptPrice+'；<br/>待收款：'+dataList[i].unreceivablePrice+'';

        }
        this.send(dataList)

    });
});

/**
 * BOSS报表-表格
 */
$RequestMapping("/report/bossReport/reportGetTableList.do", function(year,type,levelName,levelValue) {
    this.get({
        url: "/report-api/statistics/list/type",
        param: {
            year:year,
            type:type,
            levelName:levelName,
            levelValue:levelValue
        }
    }).then(data => {
        this.send(data)

    });
});


/**
 * BOSS报表-门店
 */
$RequestMapping("/report/bossReport/reportGetDeptList.do", function(name) {
    this.get({
        url: "/portal-api/org/getDeptList",
        param: {
           name:name
        }
    }).then(data => {
        this.send(data)
    });
});


/**
 * BOSS报表-地图
 */
$RequestMapping("/report/bossReport/reportAmountReport.do", function(year,type,level,childLevel) {
    this.get({
        url: "/report-api/sign/signSituationLevelDateMap",
        param: {
            year:year,
            type:type,
            level:level,
            childLevel:childLevel
        }
    }).then(data => {
        for(var i in data){
               //中站区 :112233555  北站区：112233554 南站区：112233556

             if(childLevel!=null){

                 if(childLevel=='112233555'&&data[i].wzName=='中战区'){
                     data[i].color = 'rgb(92,181,152)';
                 }else if(childLevel=='112233554'||data[i].wzName=='北战区'){
                     data[i].color = 'rgb(59,161,128)';
                 }else  if(childLevel=='112233556'&&data[i].wzName=='南战区'){
                     data[i].color = 'rgb(173,220,205)';
                 }

             }else{
                 if(data[i].wzName=='北战区'){
                     data[i].color = 'rgb(59,161,128)';
                 }else if(data[i].wzName=='南战区'){
                     data[i].color = 'rgb(173,220,205)';
                 }else if(data[i].wzName=='中战区'){
                     data[i].color = 'rgb(92,181,152)';
                 }
             }

             data[i].value = data[i].provinceCode;

             data[i].content= '签单数：'+data[i].contractCount+'；<br/>应收额：'+data[i].receivablePrice+'；<br/>实际收款：'+data[i].receiptPrice+'；<br/>待收款：'+data[i].unreceivablePrice+'';


            if(data[i].province=='黑龙江省'||data[i].province=='内蒙古'){
                data[i].name = data[i].province.substring(0,3);
            }else{
                data[i].name = data[i].province.substring(0,2);
            }


           /* data[i].content= '签单数：'+data[i].contractCount+'；<br/>应收额：'+data[i].receivablePrice+'；<br/>实际收款：'+data[i].receiptPrice+'；<br/>待收款：'+data[i].unreceivablePrice+'';*/
        }

        this.send(data)

    });
});


/**
 * BOSS报表-获取年份、层级查询签约情况
 */
$RequestMapping("/report/bossReport/signSituationLevel.do", function(year,level,childLevel) {
    this.get({
        url: "/report-api/sign/signSituationLevel",
        param: {
            year:year,
            level:level,
            childLevel:childLevel
        }
    }).then(data => {
        this.send(data)
    });
});


$RequestMapping("/report/bossReport/mapDates.do", function() {
    /* this.get({
         url: "",
         param:{

         }
     }).then(data => {
         this.send(data);
     });*/


});

/**
 * BOSS报表-层级获取
 */
$RequestMapping("/report/bossReport/getLoyerList.do", function() {
    /* this.get({
         url: "",
         param:{

         }
     }).then(data => {
         this.send(data);
     });*/
    let layerList = [
        {
            value: 'EQ_GROUP',
            label: '集团'
        },{
            value: 'WAR_ZONE',
            label: '战区'
        },{
            value: 'PROVINCE',
            label: '省份'
        },
        {
            value: 'STORE',
            label: '门店'
        }
    ]

    this.send(layerList)

});

/**
 * 获取年份、层级、子层级查询签约情况--饼图
 */
$RequestMapping('/report/bossReport/serviceForPie.do', function (year, timeType, level, query) {
    this.get({
        url: '/report-api/sign/serviceForPie',
        param: {
            year:year,
            timeType:timeType,
            level:level,
            query:query
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取年份、层级、子层级查询签约情况--折线图
 */
$RequestMapping('/report/bossReport/serviceForBar.do', function (year, timeType, level, query) {
    this.get({
        url: '/report-api/sign/serviceForBar',
        param: {
            year:year,
            timeType:timeType,
            level:level,
            query:query
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 员工订单配额比率
 */
$RequestMapping('/report/bossReport/employContractRatio.do', function () {
    this.get({
        url: '/report-api/sign/employContractRatio',
        param: {}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 服务情况走势报表
 */
$RequestMapping('/report/bossReport/serviceForReport.do', function (year, timeType, level, query) {
    this.get({
        url: '/report-api/sign/serviceForReport',
        param: {
            year:year,
            timeType:timeType,
            level:level,
            query:query
        }
    }).then(data => {
        let list = [];
        data.orgSortForAllServiceList.forEach(( val, i, arr )=>{
            let sub = []
            sub.push(val.orgName)
            for (let v in val) {
                if(val[v].data){
                    sub.push(val[v].data.contractCount)
                    sub.push(val[v].data.receivablePrice)
                    sub.push(val[v].data.receiptPrice)
                    sub.push(val[v].data.unreceivablePrice)
                    sub.push(val[v].index)
                }
            }
            list.push(sub)
        });
        let xlist = [];
        for (let val of data.serviceType) {
            xlist.push(val.serviceName)
        }
        let rs = {};
        rs.list = list;
        rs.xlist = xlist;
        rs.start = data.startDate
        rs.end = data.endDate
        this.send(rs);
    });
});







$RequestMapping('/report/bossReport/getAlais.do', function (year,level,childLevel,type) {
    this.get({
        url: "/report-api/sign/signSituationLevelDateMap",
        param: {
            year:year,
            type:type,
            level:level,
            childLevel:childLevel
        },
    }).then(reportList => {
        var data=[];
        for(var i in reportList){
             if(level=='PROVINCE'){
                 if(childLevel==reportList[i].provinceCode){
                     data.push(reportList[i].alias)
                 }
             }
             if(level=='STORE'){
                 if(childLevel==reportList[i].orgId){
                     data.push(reportList[i].alias)
                 }
             }

        }

        this.send(data);
    });
});
















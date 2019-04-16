<template>
    <div id="report" class="sales-report">
        <div class="overview">

            <Row type="flex" justify="space-between">
                <Col span="6">
                <div class="sign">
                    <h2>签单数</h2>
                    <p style="float: left;margin: -15px 0 0 0;"><i class="iconBtn btn01"></i></p><p><em>{{contractCount}}</em>单</p>
                </div>
                </Col>
                <Col span="6">
                <div class="receivable">
                    <h2>应收款</h2>
                    <p style="float: left;margin: -15px 0 0 0;"><i class="iconBtn btn02"></i></p><p><span>￥</span><em>{{receivablePrice}}</em>元</p>
                </div>
                </Col>
                <Col span="6">
                <div class="actual">
                    <h2>实际收款</h2>
                    <p style="float: left;margin: -15px 0 0 0;"><i class="iconBtn btn03"></i></p><p><span>￥</span><em>{{receiptPrice}}</em>元</p>
                </div>
                </Col>
                <Col span="6">
                <div class="wait">
                    <h2>待收款</h2>
                    <p style="float: left;margin: -15px 0 0 0;"><i class="iconBtn btn04"></i></p><p><span>￥</span><em>{{unreceivablePrice}}</em>元</p>
                </div>
                </Col>
            </Row>
        </div>
        <div id="bar" style="" class="sales-trend"></div>
        <div id="pieOrder" class="pie-order"><img src="/static/report/no.png"></div>
        <div id="pieSource" class="pie-source"><img src="/static/report/no.png"></div>
        <!--<customer v-show="true"></customer>
        <contracts v-if="contractsFlag" @changeContractsFlag="changeContractsFlag"></contracts>
        <contractTable v-else="contractsFlag" :msg="msg" @changeContractsFlag="changeContractsFlag"></contractTable>-->
    </div>
</template>

<script type="es6">
    import echarts from 'echarts'
    require('echarts/theme/macarons');
    //import customer from '../bossReport/customer.vue'; // 客户成交等统计
    //import contractTable from '../bossReport/contractTable.vue'; // 签约云业务走势折视图数据
    //import contracts from '../bossReport/contracts.vue'; // 签约云业务走势折视图数据
    export default {
        props: {

        },
        data: function () {
            return {
                msg: {
                    year: '2017',
                    timeType: 'YEAR',
                    level: 'EQ_GROUP',
                    query: ''
                },
                charts: '',
                contractCount: 0,  //总订单数
                receivablePrice: 0, //总应收款
                receiptPrice: 0, //实际收款
                unreceivablePrice: 0, //代收款
                barParam: {
                    type: 'WEEK',
                    year: ''
                },
                //contractsFlag: true,
                barxAxisData: ['周一','周二','周三','周四','周五','周六','周日'],
                barData: {
                    'qd':[11, 11, 15, 13, 12, 13, 10],
                    'ys':[15, 13, 12, 4, 89, 34, 43],
                    'ss':[18, 45, 43, 65, 43, 67, 76],
                    'ds':[23, 56, 78, 23, 76, 87, 89]
                },
                pieLegend: ['十万以下', '10-30万','30-50万','50-100万','100-300万','300-500万','500以上'],
                pieOrderData: [
                  {value:535, name: '十万以下'},
                  {value:535, name: '10-30万'},
                  {value:510, name: '30-50万'},
                  {value:634, name: '50-100万'},
                  {value:634, name: '100-300万'},
                  {value:634, name: '300-500万'},
                  {value:634, name: '500以上'},
                ],
                pieSourceData: [
                  {value:535, name: '十万以下'},
                  {value:535, name: '10-30万'},
                  {value:510, name: '30-50万'},
                  {value:634, name: '50-100万'},
                  {value:1634, name: '100-300万'},
                  {value:634, name: '300-500万'},
                  {value:634, name: '500以上'},
                ],
                lineBtns: {},
                graphic: [
                    {
                        type: 'image',
                        id: 'logo',
                        right: 'center',
                        top: 'center',
                        z: -10,
                        bounding: 'raw',
                        origin: [75, 75],
                        style: {
                            image: 'static/report/no.png',
                            width: 150,
                            height: 150,
                            opacity: 0.4
                        }
                    }
                ],
            }
        },
        created: function () {
            //获取数据
            //this.getBarData();
            //this.getCollectionCapital();
            this.getDeptTotal();
            this.selectBtn()
        },
        methods: {
            //工具条按钮图
            selectBtn () {
                this.lineBtns = {
                    weekBtn: 'image://static/report/week.png',
                    monthBtn: 'image://static/report/month.png',
                    seasonBtn: 'image://static/report/season.png',
                    yearBtn: 'image://static/report/year.png',
                }
                if( this.barParam.type == 'WEEK') {
                    this.lineBtns.weekBtn = 'image://static/report/week_sel.png';
                }
                if( this.barParam.type == 'MONTH') {
                    this.lineBtns.monthBtn = 'image://static/report/month_sel.png';
                }
                if( this.barParam.type == 'QUARTER') {
                    this.lineBtns.seasonBtn = 'image://static/report/season_sel.png';
                }
                if( this.barParam.type == 'YEAR') {
                    this.lineBtns.yearBtn = 'image://static/report/year_sel.png';
                }
            },
            //父级函数，子组件用于操作控制显示
            /*changeContractsFlag(key) {
                if(key){
                    this.msg.year = key;
                }

                this.contractsFlag = !this.contractsFlag;
            },*/
            //获取头部签单数及各项收款数
            getDeptTotal() {
                this.request({
                    url: '/report/salesReport/signSituationDeptTotal.do',
                    param: {}
                }).then(data => {
                    if(data.signSituationVos.length<1){
                        return false;
                    }
                    let rs = data.signSituationVos[0];
                    this.contractCount = rs.contractCount;
                    this.receiptPrice = rs.receiptPrice;
                    this.receivablePrice = rs.receivablePrice;
                    this.unreceivablePrice = rs.unreceivablePrice;
                });
            },
            //签约走势图 切换统计周期
            changeBreDate() {
                this.request({
                    url: '/report/salesReport/signSituationDeptDate.do',
                    param: {
                        type: this.barParam.type,
                        year: this.barParam.year
                    }
                }).then(data => {
                    this.barxAxisData = data.sysDate;
                    this.barData = {
                        'qd':[],
                        'ys':[],
                        'ss':[],
                        'ds':[],
                    }
                    //console.log(data)
                    let haveData = false;
                    for (let val of data.signSituationVos) {
                        this.barData.qd.push(val.contractCount|0);
                        this.barData.ys.push(val.receivablePrice|0);
                        this.barData.ss.push(val.receiptPrice|0);
                        this.barData.ds.push(val.unreceivablePrice|0);
                        if((val.contractCount>0 && val.contractCount != undefined) || (val.receivablePrice>0 && val.receivablePrice != undefined) || (val.receiptPrice>0 && val.receiptPrice != undefined) || (val.unreceivablePrice>0 && val.unreceivablePrice != undefined)) {
                            haveData = true;
                        }
                    }

                    if(haveData){
                        this.graphic[0].style.opacity = 0
                    }else{
                        this.graphic[0].style.opacity = 1
                    }

                    this.drawBar('bar')
                });
                //this.barxAxisData = ['周一','周二','周三','周四','周五','周六','周日','周二','周三','周四','周五','周六','周日']
                //this.drawBar('bar')
            },
            drawBar(id){
                let self = this;
                let curwidth = window.innerWidth-66;
                let curflag = document.getElementById(id);
                curflag.style.width = curwidth + 'px';
                this.charts = echarts.init(document.getElementById(id),'macarons')
                this.charts.setOption({
                    backgroundColor: '#fff',
                    title : {
                        text: '签约走势图',
                        left: '30px',
                        top: '20px',
                        textStyle: {
                            color:'#666',
                            fontSize: 16
                        }
                    },
                    color: ['#5fc9ce', '#9670cf', '#f05d55', '#52c99f', '#faa791','#e960a4', '#f9ce8a', '#aed899', '#81cef4', '#8d95cc'],
                    tooltip : {
                        trigger: 'axis',
                        formatter: function (params,ticket,callback) {
                            //console.log(params)
                            var res =  params[0].name;
                            for (var i = 0, l = params.length; i < 4; i++) {
                                res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
                            }
                            return res;
                            /*setTimeout(function (){
                                // 仅为了模拟异步回调
                                callback(ticket, res);
                            }, 1)*/

                        },
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    legend: {
                        top: 20,
                        right: 30,
                        itemWidth: 14,
                        itemHeight: 14,
                        data: ['签单数','应收款', '实收款', '待收款']
                    },
                    graphic: this.graphic,
                    toolbox: {
                        show : true,
                        showTitle: false,
                        orient: 'vertical',
                        right: 15,
                        //top: '10px',
                        itemSize: '30',
                        iconStyle: {
                            normal: {
                                color: '#666',
                                borderWidth: 0,
                                borderColor: '#3fcbcd'
                            },
                            emphasis: {
                                color: "#3fcbcd",
                            }
                        },
                        y: 'center',
                        feature : {
                             myTool1 : {
                                show : true,
                                title : '周',
                                icon : this.lineBtns.weekBtn,
                                onclick : function (){
                                    self.barParam.type = 'WEEK';
                                    self.selectBtn()
                                    self.changeBreDate()
                                }
                            },
                            myTool2: {
                                show : true,
                                title : '月',
                                icon : this.lineBtns.monthBtn,
                                onclick : function (){
                                    self.barParam.type = 'MONTH';
                                    self.selectBtn()
                                    self.changeBreDate()
                                }
                            },
                            myTool3 : {
                                show : true,
                                title : '季',
                                icon : this.lineBtns.seasonBtn,
                                onclick : function (){
                                    self.barParam.type = 'QUARTER';
                                    self.selectBtn()
                                    self.changeBreDate()
                                }
                            },
                            myTool4 : {
                                show : true,
                                title : '年',
                                icon : this.lineBtns.yearBtn,
                                onclick : function (){
                                    self.barParam.type = 'YEAR';
                                    self.selectBtn()
                                    self.changeBreDate()
                                }
                            }
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : true,
                            data : this.barxAxisData,
                            axisLine: {
                                lineStyle:{
                                    color: '#000'
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}'
                            },
                            axisLine: {
                                lineStyle:{
                                    color: '#000'
                                }
                            }
                        }
                    ],
                    series : [

                        {
                            name:'签单数',
                            type:'bar',
                            data:this.barData.qd
                        },
                        {
                            name:'应收款',
                            type:'bar',
                            data:this.barData.ys
                        },
                        {
                            name:'实收款',
                            type:'bar',
                            data:this.barData.ss
                        },
                        {
                            name:'待收款',
                            type:'bar',
                            data:this.barData.ds
                        },
                        {
                            name:'签单数',
                            type:'line',
                            data:this.barData.qd
                        },
                        {
                            name:'应收款',
                            type:'line',
                            data:this.barData.ys
                        }
                    ]

                }, true)
            },
            drawPie(id, title, legend, data){
                let curwidth = (window.innerWidth-67)/2;
                let curflag = document.getElementById(id);
                curflag.style.width = curwidth + 'px';
                this.charts = echarts.init(document.getElementById(id),'macarons')
                this.charts.setOption({
                    backgroundColor: '#fff',
                    title: {
                        text: title,
                        left: '30',
                        top: '20px',
                        textStyle: {
                            fontSize: 16,
                            color: '#666'
                        }
                    },
                    color: ['#5fc9ce', '#9670cf', '#f05d55', '#52c99f', '#faa791','#e960a4', '#f9ce8a', '#aed899', '#81cef4', '#8d95cc'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} <br/>{c} ({d}%)",
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    legend: {
                        bottom: 10,
                        left: 'center',
                        itemWidth: 14,
                        itemHeight: 14,
                        data: legend
                    },
                    graphic: this.graphic,
                    series : [
                        {
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '50%'],
                            selectedMode: 'single',
                            label: {
                                normal:{
                                    position:'inner',
                                    formatter: "{d}%"
                                }
                            },
                            data:data   //动态数据
                        }
                    ]
                })
            },
            //获取趋势数据
            getBarData() {
                /*this.request({
                    url: '/report/salesReport/baseinfoCompany.do',
                    param: {
                        id: 1
                    }
                }).then(data => {
                    this.base = data;
                });*/
            },
            //客户资源质量占比
            getCollectionCapital() {
                this.request({
                    url: '/report/salesReport/collectionCapital.do',
                    param: {}
                }).then(data => {
                    let legends = data.legends;
                    let seriesDatas = data.seriesDatas;
                    let arrLegend = [];
                    for(let i=0; i<legends.length; i++) {
                        arrLegend.push(legends[i].name);
                    }
                    this.pieLegend = arrLegend
                    let pieData = [];
                    if(seriesDatas.length>0){
                        for (let i=0; i<seriesDatas.length; i++) {
                            if(seriesDatas[i].value != 0) {
                                pieData.push(seriesDatas[i]);
                            }
                        }
                        this.graphic[0].style.opacity = 0
                    }else{
                        this.graphic[0].style.opacity = 1
                    }
                    //this.pieSourceData = seriesDatas;
                    this.drawPie('pieSource', '客户资源质量占比', this.pieLegend, pieData)
                });
            },
            //员工订单在总额比重
            getContractCountRatio() {
                this.request({
                    url: '/report/salesReport/contractCountRatio.do',
                    param: {}
                }).then(data => {
                    let pieData = [];
                    if(data.data.length>0){
                        for (let i=0; i<data.data.length; i++) {
                            if(data.data[i].value != 0) {
                                pieData.push(data.data[i]);
                            }
                        }
                        this.graphic[0].style.opacity = 0
                    }else{
                        this.graphic[0].style.opacity = 1
                    }
                    this.drawPie('pieOrder', '员工订单在总额比重', data.legend, pieData)
                });
            },
        },
        mounted(){
            this.$nextTick(function() {
                //let curwidth = window.innerWidth-66;
                //let curflag = document.getElementById('report');
                //curflag.style.width = curwidth + 'px';
                //this.drawBar('bar');
                this.changeBreDate();
                //this.drawPie('pieOrder', '员工订单在总额比重', this.pieLegend,  this.pieOrderData)
                //this.drawPie('pieSource', '客户资源质量占比', this.pieLegend, this.pieSourceData)
                this.getContractCountRatio()
                this.getCollectionCapital()
            })
        },
        components: {
            //customer,
            //contractTable,
            //contracts
        }
    };
</script>

<style scoped>
    .sales-report {
        background-color: #f6f6f6;
        padding:10px 30px;
    }
    .sales-trend {
        width: 100%;
        height:400px;
        padding-bottom: 20px;
        margin-bottom: 20px;
        box-shadow: 0px 3px 5px 0px rgba(220,220,220,0.5)
    }
    .pie-order {
        width:50%;
        height:400px;
        float:left;
        /*box-shadow: 0px 0px 5px 0px rgba(220,220,220,0.5);*/
        background-color: #fff;
        text-align: center;
    }
    .pie-order img{
        padding-top: 85px;
        width: 170px;
        height: 235px;
    }
    .pie-source {
        width:50%;
        height:400px;
        float:left;
        /*box-shadow: 0px 3px 0px 0px rgba(220,220,220,0.5);*/
        background-color: #fff;
        text-align: center;
    }
    .pie-source img{
        padding-top: 85px;
        width: 170px;
        height: 235px;
    }
    .head{
        margin: 0 auto;
        width: 100%;
        height: 100px;
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: #fff;
    }
    .head .qd-num{
        background: url(./images/u8369.png) no-repeat;
        background-size: 80px 60px;
        background-position: 0 16px;
        background-color:rgba(68, 125, 173, 1);
        height:80px;
    }
    .head .ys-num{
        background: url(./images/u8374.png) no-repeat;
        background-size: 60px 60px;
        background-position: 0 16px;
        background-color:rgba(204, 68, 68, 1);
        height:80px;
    }
    .head .ss-num{
        background: url(./images/u8420.png) no-repeat;
        background-size: 60px 60px;
        background-position: 0 16px;
        background-color: rgba(58, 156, 150, 1);
        height:80px;
    }
    .head .ds-num{
        background: url(./images/u8425.png) no-repeat;
        background-size: 60px 60px;
        background-position: 0 16px;
        background-color: rgba(125, 107, 161, 1);
        height:80px;
    }

    .head .money{
        font-size: 24px;
        color: #fff;
        text-align: right;
        margin-right: 15px;
    }

    .head .name{
        font-size: 12px;
        color: #fff;
        text-align: right;
        margin-right: 15px;
    }


    .overview .sign,.overview .receivable,.overview .actual,.overview .wait {  background-position: 0 bottom; background-repeat: no-repeat; background-size: 30% auto; box-sizing: border-box;color: #FFF; height: 100px; line-height: 64px; text-align: center;}
    .overview .sign,.overview .receivable,.overview .actual,.overview .wait { background-color: #fff;border-radius: 4px;box-shadow: 0px 3px 5px 0px rgba(220,220,220,0.5)}
    .overview .sign h2,.overview .receivable h2,.overview .actual h2,.overview .wait h2 {font-size:12px;color:#000; font-weight: normal;   text-align: left; margin: 0 0 0 27px; font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif}
    .overview .sign p{color:rgb(249,143,115);font-size: 10px;}
    .overview .sign p em,.overview .receivable p em,.overview .actual p em,.overview .wait p em{font-style: normal;font-size: 20px;margin:0 6px}
    .overview .receivable p{color:rgb(167,131,227);font-size: 10px;}
    .overview .actual p{color:rgb(28,197,144);font-size: 10px;}
    .overview .wait p{color:rgb(22,167,243);font-size:10px;}
    .overview h2 { font-size: 30px; font-weight: bold; }
    .iconBtn{display: inline-block;width: 64px;height:30px; margin:0 6px 0 20px}
    .btn01{ background-image: url("../bossReport/image/icon-1.png");float: left;}
    .btn02{ background-image: url("../bossReport/image/icon-2.png");}
    .btn03{ background-image: url("../bossReport/image/icon-3.png");}
    .btn04{ background-image: url("../bossReport/image/icon-4.png");}
    .overview p { font-size: 16px;  text-align: right;  margin: 0 16px 0 0;height: 0px;  line-height: 0px;    margin: 5px 16px 0 0;}
    .report-floor1 { margin-top: 20px; background-color: #FFF;}
    .report-map { width: 60%; height: 660px;}
    .nav .navRight{float:right}
    .reportMiddle{  background: #fff;  position:relative;  }
    .overview{  margin:0 0 20px 0;  }
    .ivu-col-span-6 {
        width: 24.5%;
    }
</style>
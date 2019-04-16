<template>
    <div class="container">
        <div class="nav">
            <div class="content">
                <div>
                    <i-col span="12" style="text-align: right">
                        <span class="year-text">神州易桥报表</span>
                        <Select class="year-select" v-model="queryListMap.year"  @on-change="selectChange">
                            <Option v-for="item in yearList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>

                    </i-col>
                    <i-col span="12" style="text-align: left">
                        <span class="classify-text">当前层级：</span>
                        <Select class="year-select-layer" v-model="queryListMap.levelName"  @on-change="changelayer($event)">
                            <Option v-for="item in oneLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <Select v-if="isSelect&&isfilterable"   class="year-select-model" v-model="queryListMap.levelValue"  @on-change="changeValue($event)">
                            <Option v-for="item in twoLevel" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                        <Select  v-if="!isfilterable" filterable class="year-select-model" v-model="queryListMap.levelValue"  @on-change="changeValue($event)">
                            <Option v-for="item in twoLevel" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </i-col>

                </div>
            </div>
        </div>
        <div class="overview">
            <Row type="flex" justify="space-between">
                <Col span="6">
                <div class="sign">
                    <h2>签单数</h2>
                    <p style="float: left;margin: -15px 0 0 0;"><i class="iconBtn btn01"></i></p><p><em>{{listNum.contractCount}}</em>单</p>
                </div>
                </Col>
                <Col span="6">
                <div class="receivable">
                    <h2>应收款</h2>
                    <p style="float: left;margin: -15px 0 0 0;"><i class="iconBtn btn02"></i></p><p><span>￥</span><em>{{listNum.receivablePrice}}</em>元</p>
                </div>
                </Col>
                <Col span="6">
                <div class="actual">
                    <h2>实际收款</h2>
                    <p style="float: left;margin: -15px 0 0 0;"><i class="iconBtn btn03"></i></p><p><span>￥</span><em>{{listNum.receiptPrice}}</em>元</p>
                </div>
                </Col>
                <Col span="6">
                <div class="wait">
                    <h2>待收款</h2>
                    <p style="float: left;margin: -15px 0 0 0;"><i class="iconBtn btn04"></i></p><p><span>￥</span><em>{{listNum.unreceivablePrice}}</em>元</p>
                </div>
                </Col>
            </Row>
        </div>
        <Row class="reportMiddle"  v-show="isHidden">
            <ReturnAmountReport v-show="isMap" ref="mapReport" :propList="queryListMap"  @on-select="getOnUrl"></ReturnAmountReport>
            <div v-if="!isMap">
               <!-- <div class="iconButton"  @click="backButton"><Icon style="font-size:27px" type="arrow-left-a"></Icon></div>-->
                <div class="loadDateMap" id="loadDateMap"></div>
            </div>

            <div v-show="isPieShow" class="report-pie" id="reportPie"></div>
            <div v-show="isPieNo" class="backImg"><img src="./image/no.png"> </div>
            <div class="toolBar">
                <p  class="toolBarStyle toolWeek"  @click="toolClick('week')" :class="{active:1==selectTime}">周</p><br>
                <p  class="toolBarStyle toolYear"  @click="toolClick('month')" :class="{active:2==selectTime}">月</p><br>
                <p  class="toolBarStyle toolSeason"  @click="toolClick('season')" :class="{active:3==selectTime}">季</p><br>
                <p  class="toolBarStyle toolYear"  @click="toolClick('year')" :class="{active:4==selectTime}">年</p><br>
                <p class="toolFormSelect"></p><br>
                <p class="toolForm" @click="toolButton" :class="{activeForm:formSelect}"></p><br>
                <p class="spStyle sp8" @click="getTable(8)"></p>

            </div>
        </Row>
        <Row class="componentFoldPillar" v-show="isFoldShow" style="background: #fff">
            <div class="titleFolder">
                <span class="spStyle sp1" @click="getTable(1)"></span><br>
                <span class="spStyle sp2" @click="getTable(2)"></span><br>
                <span class="spStyle sp6"></span>
            </div>
            <div><ReportFoldCurver :content="queryListMap" ></ReportFoldCurver></div>
            <div style="height:20px;background: #f6f6f6"></div>
           <div><ReportPillar :reportContent="queryListMap"></ReportPillar></div>
        </Row>
        <Row v-show="isButton" style="margin-bottom: 20px;background: #fff;  box-shadow: 0px 5px 2px 0px rgba(220,220,220,0.5);">
            <div class="titleFolder" style="font-size: 16px;color: #333">回收款明细
                <span class="spButton1 sp3"  @click="exportData(3)" ></span><br>
                <span class="spButton sp4"  @click="getTable(4)"></span><br>
                <span class="spButton sp5"  @click="getTable(5)"></span><br>
                <span class="spButton sp7"  @click="getTable(7)"></span>
            </div>
            <Row style="width: 94%;margin: -45px 0 17px 24px;"><Table height="290" highlight-row :columns="columns" :data="tableData" size="small" ref="table"></Table></Row>
        </Row>


        <contracts v-show="contractsFlag" ref="contractsInit" :params="queryListMap" @changeContractsFlag="changeContractsFlag"></contracts>
        <contractTable v-show="!contractsFlag" :params="tableListMap" @changeContractsFlag="changeContractsFlag"></contractTable>
        <customer v-show="true"></customer>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import ReturnAmountReport from './returnAmountReport.vue';
    import ReportFoldCurver from './reportFoldCurver.vue';
    import ReportPillar from './reportPillar.vue';
    import Map from "../../core/component/map";
    require('echarts/theme/macarons');

    import customer from './customer.vue'; // 客户成交等统计
    import contractTable from './contractTable.vue'; // 签约云业务走势折视图数据
    import contracts from './contracts.vue'; // 签约云业务走势折视图数据
    export default {
        props: {

        },
        data() {
            return {
                yearList:[],
                IsTrue:false,
                provinceAlias:'',
                formSelect:false,
                isMap:true,
                areaName:[],
                isFoldShow:false,
                addsList:[],
                isPieShow:true,
                isPieNo:false,
                queryList:{},
                arrNum:[],
                queryListMap:{
                    year:'',
                    levelName:'',
                    levelValue:'',
                    timeType:'',
                    temp: ''
                },
                isButton:false,
                tableListMap: {},
                listNum:[],
                isfilterable:true,

                oneModel:'',
                isHidden:true,
                isVisiable:true,
                twoModel:'',
                isSelect:false,
                newModel:'',
                oneLevel: [],
                objList:[],
                twoLevel: [],
                selectTime:1,
                mapUrl:[],
                searchName:'',
                provinceList:[],
                columns: [
                    {
                        title: '日期',
                        key: 'date'
                    },
                    {
                        title: '城市公司',
                        key: 'name'
                    },
                    {
                        title: '签单数（单）',
                        key: 'signed_num'
                    },
                    {
                        title: '应收款（元）',
                        key: 'sum_receivable_price'
                    },
                    {
                        title: '实收款（元）',
                        key: 'sum_receipt_price'
                    },
                    {
                        title: '待收款（元）',
                        key: 'sum_pending_price'
                    },
                    {
                        title: '累计实际完成',
                        key: 'accumulate_receivable_price',
                        width: 120
                    }
                ],
                tableData:[],
                dataList:[],
                signNum:'',
                incomeNum:'',
                predictNum:'',
                agencyNum:'',
                mapUrl:'',
                objValue:{
                    yearValue:null,
                    layerOne:null,
                    layetTwo:null
                },
                classifyList:[],
                pieOrderTable: [],
                contractsFlag: true,
            }
        },
        created: function () {
            this.getYearList();
            this.getLayerCode('1');
            this.queryListMap.timeType='WEEK';
            this.queryListMap.year = '2017'
            this.queryListMap.levelName = 'EQ_GROUP'
            this.$nextTick(function () {
                this.$refs.contractsInit.getData()
            })
            this.getSituationLevel();
            this.getPieList(this.queryListMap.year,this.queryListMap.levelName,this.queryListMap.levelValue,this.queryListMap.timeType);
        },
        methods: {
            //父级函数，子组件用于操作控制显示
            changeContractsFlag(params) {
                this.contractsFlag = !this.contractsFlag;

                if(params){
                    this.tableListMap = Object.assign({},params)
                }
            },
            selectChange(value){
                this.year = value;
                this.getSituationLevel();
            },
            getAmountReport(year,level,childLevel,type,name){
                this.request({
                    url: '/report/bossReport/reportAmountReport.do',
                    param:{
                        year:year,
                        level:level,
                        childLevel:childLevel,
                        type:type
                    }
                }).then(demand => {
                    if(demand[0]){
                        this.dataList = demand;
                    }else{
                        this.dataList = [];
                    }

                    if(name){
                        this.$nextTick(function() {
                            this.showProvince('loadDateMap',this.mapUrl);
                        })
                    }

                });
            },
            getOnUrl(url,param,val){
                this.mapUrl = url;
                this.queryListMap.levelName = 'PROVINCE';
                this.queryListMap.levelValue = String(url.value);
                this.isMap=!this.isMap;
                let aliName = 'Pro';

                this.getPieList(this.queryListMap.year,this.queryListMap.levelName,this.queryListMap.levelValue,this.queryListMap.timeType);

                this.getAmountReport(this.queryListMap.year,this.queryListMap.levelName,this.queryListMap.levelValue,this.queryListMap.timeType,aliName)

            },
           /* backButton(){
                this.isMap = true;
                this.queryListMap.levelName = 'EQ_GROUP';
                this.queryListMap.levelValue = '';
            },*/
            getListPoint(arr){
                var arrNum = this.dataList;
                for(var i in arrNum){
                        arrNum[i].coord = arr[i];
                        if(arrNum[i].coord){
                            arrNum[i].coord=[arrNum[i].coord.lng,arrNum[i].coord.lat]
                        }
                }
                return arrNum;
            },

            showProvince(id,mapUrl) {
               if(!mapUrl){
                   return;
               }
                    let geoJson = mapUrl.url
                    let name = mapUrl.param;
                    let dataitemlist = [];
                    for(var i in geoJson.features){
                        let obj = {};
                        obj = {name:geoJson.features[i].properties.name,value:geoJson.features[i].id}
                        dataitemlist.push(obj)
                    }

                    echarts.registerMap(name, geoJson);

                var markPointData=[]
                //获取圆点显示坐标点
                Map().then(BMap => {
                    var myGeo = new BMap.Geocoder();
                    /* this.getProvince();*/

                    var adds1 = [];

                    for(var i in this.dataList){
                        adds1.push(this.dataList[i])
                    }


                    let _this = this;
                    var bdGEO = function(){
                        for(var i = 0;i<adds1.length;i++){

                            var add = adds1[i].orgAddr;

                            myGeo.getPoint(add, function(point){
                                if(point){
                                    markPointData.push(point)
                                    let arrNum = _this.getListPoint(markPointData);

                                    if(arrNum){
                                        initOption(arrNum);
                                    }

                                }
                            });

                        }
                    }
                    bdGEO();
                })

                function initOption(arrNum) {
                   for(var i in arrNum){
                      if(arrNum[i].coord==undefined){
                          return
                      }
                   }
                    let option = {
                        backgroundColor: '#ffffff',
                        tooltip: {
                            trigger: 'item',
                            formatter: function(params) {
                                if (params.seriesIndex == 0 && JSON.stringify(arrNum).indexOf(params.name) > -1&& params.data.coord) {
                                    return '门店名称：'+params.data.orgName+'<br>'+'签单数：'+params.data.contractCount+'<br>'+'应收额：'+params.data.receivablePrice+'<br>'+'实际收款：'+params.data .receiptPrice+'<br>'+'待收款：'+params.data.unreceivablePrice

                                }
                            }/*,
                           backgroundColor: 'rgba(13,26,52,1)',
                           borderWidth: '2px',
                           borderRadius: '0px',
                           borderColor: 'rgba(94,194,222,1)',
                           textStyle: {
                               color: 'rgba(94,194,222,1)'
                           }*/
                        },
                        title: {
                            text:'神州易桥回款额',
                            subtext:'',
                            left:12,
                            top:10,
                            itemGap: 30,
                            textStyle: {
                                color: '#333',
                                fontStyle: 'normal',
                                fontWeight: 'normal',
                                fontSize: 16
                            }
                        },
                        visualMap: {
                            min: 0,
                            max: 2000,
                            left: 'left',
                            top: 'bottom',
                            show:false,
                            text: ['高', '低'], // 文本，默认为数值文本
                            calculable: true,
                            inRange: {
                                color: ['lightskyblue']
                            }
                        },
                        series: [{
                            type: 'map',
                            mapType: name,
                            zoom: 1.2,
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    textStyle: {
                                        color: '#ccc'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: '#389BB7',
                                    areaColor: '#fff',
                                },
                                emphasis: {
                                    areaColor: '#389BB7',
                                    borderWidth: 0
                                }
                            },

                            data:dataitemlist,
                            "markPoint": {
                                "symbol": "circle",
                                "symbolSize":9,
                                "label": {
                                    "normal": {
                                        "show": false,
                                    },
                                    "emphasis": {
                                        show: false,
                                    }
                                },
                                "itemStyle": {
                                    "normal": {
                                        "color": 'rgb(255,100,100)'
                                    }
                                },
                                "data": arrNum
                            }
                            // animationDurationUpdate: 1000,
                            // animationEasingUpdate: 'quinticInOut'
                        }]

                    }

                    let myChart = echarts.init(document.getElementById(id));
                    myChart.setOption(option);

                    window.addEventListener("resize", function () {
                        myChart.resize();
                    });
                }

            },
            getTableList(){
                this.request({
                    url: '/report/bossReport/reportGetTableList.do',
                    param:{
                        year:this.queryListMap.year,
                        levelName:this.queryListMap.levelName,
                        type:this.queryListMap.timeType,
                        levelValue:this.queryListMap.levelValue
                    }
                }).then(demand => {
                    this.tableData = demand
                });
            },
            exportData(){
                    this.$refs.table.exportCsv({
                        filename: '业务分析'
                    });

            },
            getTable(param){
                switch(param){
                    case 1:
                        this.getTableList();
                        this.isHidden=false;
                        this.isFoldShow=false;
                        this.isButton = true;
                        break;
                    case 2:
                        this.isHidden=true;
                        this.isFoldShow=false;
                        this.isButton = false;
                        this.isMap = true;
                        break;
                    case 3:

                        break;
                    case 4:
                        this.isHidden=true;
                        this.isVisiable=true;
                        this.isButton = false;
                        this.isMap = true;

                        break;
                    case 5:
                        this.isHidden=false;
                        this.isFoldShow=true;
                        this.isButton = false;
                        break;
                    case 8 :
                        this.getTableList();
                        this.isHidden=false;
                        this.isFoldShow=false;
                        this.isButton = true;
                    default:
                        this.isHidden==true;
                        this.isVisiable==true;
                        break;
                }
            },
            toolButton(){
                this.isHidden=false;
                this.isFoldShow = true;
            },
            toolClick(time){
                switch(time){
                    case 'week':
                        this.selectTime=1;
                        this.queryListMap.timeType = 'WEEK';
                        break;
                    case 'month':
                        this.selectTime=2;
                        /*this.isSelect == true;*/
                        this.queryListMap.timeType = 'MONTH';
                        break;
                    case 'season':
                        this.selectTime=3;
                        this.queryListMap.timeType = 'QUARTER';
                        break;
                    case 'year':
                        this.selectTime=4;
                        this.queryListMap.timeType = 'YEAR';
                        break
                    default:
                        this.selectTime=1;
                        this.queryListMap.timeType = 'WEEK';

                }

               /* this.isMap=true;
                this.queryListMap.levelName = 'EQ_GROUP'
               */

                let noUser = 'pro';
                this.getPieList(this.queryListMap.year,this.queryListMap.levelName,this.queryListMap.levelValue,this.queryListMap.timeType);
                if(this.queryListMap.levelName=='PROVINCE'||this.queryListMap.levelName=='STORE'){
                    this.getListAlias();
                    /* this.isMap = false;*/
                    this.getAmountReport(this.queryListMap.year,this.queryListMap.levelName,this.queryListMap.levelValue,this.queryListMap.timeType,noUser)
                }else{
                    this.getAmountReport(this.queryListMap.year,this.queryListMap.levelName,this.queryListMap.levelValue,this.queryListMap.timeType)
                }
            },
            getYearList(){
                this.request({
                    url: `/report/bossReport/getYearList.do`
                }).then(data => {
                    this.yearList = data;
                    this.queryListMap.year = data[2].value;

                });
            },
            getLayerCode (level) {
                this.request({
                    url: "/report/bossReport/getLoyerList.do"
                }).then(items => {
                    this.oneLevel = items;
                    this.queryListMap.levelName = items[0].value;

                });
            },

            getPieList(year,level,childLevel,type){
                this.request({
                    url: "/report/bossReport/reportPieList.do",
                    param:{
                        year:year,
                        level:level,
                        childLevel:childLevel,
                        type:type
                    }
                }).then(demand => {
                    this.pieOrderTable = demand;

                    if(this.pieOrderTable.length>0){
                        this.isPieShow = true;
                        this.isPieNo = false;
                        this.$nextTick(function() {
                            this.getPie('reportPie', '可钻取展示报表', this.pieOrderTable);
                        })

                    }else{
                        this.isPieShow = false;
                        this.isPieNo = true;
                    }


                });

            },
            changelayer(){
                if (arguments[0] == ''){
                    return;
                }
                var url
                if(arguments[0]=='STORE'){  //门店
                    this.isSelect = false;
                    this.isfilterable=false;
                    this.getDeptList();

                }else if(arguments[0]=='WAR_ZONE'){ //战区
                    this.isSelect = true;
                    this.isfilterable = true;
                    url= "/report/bossReport/getWar.do"
                }else if(arguments[0]=='PROVINCE'){ //省份
                    this.isSelect = true;
                    this.isfilterable = true;
                    url="/report/bossReport/getProvince.do"
                }else{//集团
                    this.isfilterable = true;
                    this.isSelect = false;
                    this.isMap = true;
                    this.queryListMap.levelValue='';
                    this.getPieList(this.queryListMap.year,this.queryListMap.levelName,this.queryListMap.levelValue,this.queryListMap.timeType);

                    this.getSituationLevel();

                }
                if(url==''||url==undefined){
                    return ;
                }
                this.request({
                    url: url
                }).then(item => {
                    this.twoLevel = item;

                });

            },
            getDeptList(){
                this.request({
                    url: '/report/bossReport/reportGetDeptList.do',
                    param:{
                        name:this.searchName
                    }
                }).then(data => {
                    this.twoLevel = data
                });
            },
            getSituationLevel(){
                this.request({
                    url: '/report/bossReport/signSituationLevel.do',
                    param:{
                        year:this.queryListMap.year,
                        level:this.queryListMap.levelName,
                        childLevel:this.queryListMap.levelValue
                    }
                }).then(data => {
                    if(data[0]){
                        this.listNum = data[0];
                    }else{
                        this.listNum = []
                    }

                });
            },
            changeVal(){
                this.queryListMap.levelValue = arguments[0];
                this.getPieList(this.queryListMap.year,this.queryListMap.levelName,this.queryListMap.levelValue,this.queryListMap.timeType);
            },
            changeValue(){
                this.queryListMap.levelValue = arguments[0];
                if(this.queryListMap.levelValue!=''){
                    this.getPieList(this.queryListMap.year,this.queryListMap.levelName,this.queryListMap.levelValue,this.queryListMap.timeType);
                    this.getListAlias();
                }
                this.getSituationLevel()
            },
            getListAlias(){
                if(this.queryListMap.levelName=='WAR_ZONE'){
                    this.isMap = true;
                }else if(this.queryListMap.levelName=='STORE'||this.queryListMap.levelName=='PROVINCE'){
                    this.request({
                        url: '/report/bossReport/getAlais.do',
                        param:{
                            year:this.queryListMap.year,
                            level:this.queryListMap.levelName,
                            childLevel:this.queryListMap.levelValue,
                            type:this.queryListMap.timeType
                        }
                    }).then(data => {
                        if(data.length>0){
                            this.isMap = false;
                            let map = require('echarts/map/json/province/'+data[0]);
                            var obj = Object.assign({},{url:map},{param:data[0]});
                            this.mapUrl = obj;
                            var aliName = 'pro';
                            this.getAmountReport(this.queryListMap.year,this.queryListMap.levelName,this.queryListMap.levelValue,this.queryListMap.timeType,aliName)
                        }else{
                            this.isMap = true;
                        }


                    });
                }
            },
            getPie(id, title, data){
                let curwidth = (window.innerWidth+600)/3;
                let curflag = document.getElementById(id);
                curflag.style.width = curwidth + 'px';

                let myChart1= echarts.init(document.getElementById(id),'macarons')
                myChart1.setOption({
                    title: {
                        text: title,
                        left: 0,
                        top:3,
                        textStyle: {
                            fontSize: 12,
                            fontWeight: 'bolder',
                            color: '#663'
                        }
                    },
                    tooltip: {//鼠标移到模块上时,弹出框的内容
                        trigger: 'item',
                        formatter:  function (obj) {
                            return obj.data.content
                        },
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    color:['rgb(59,161,128)', 'rgb(92,181,152)','rgb(145,198,181)','rgb(173,220,205)'],
                    legend: {
                        top:3,
                        left:100,
                        data:data
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : '45%',
                            center: ['50%', '50%'],
                            selectedMode: 'single',
                            label: {
                                normal:{
                                    formatter:"{b}"
                                }
                            },
                            data:data   //动态数据
                        }
                    ]
                })
                window.addEventListener("resize", function () {
                    myChart1.resize();
                });

                myChart1.off('click')
                myChart1.on("click", (param) => {
                    if(param.name=='北战区'||param.name=='中战区'||param.name=='南战区'){
                        this.queryListMap.levelName='WAR_ZONE';
                        this.queryListMap.levelValue=param.value;
                        this.getPieList(this.queryListMap.year,this.queryListMap.levelName,this.queryListMap.levelValue,this.queryListMap.timeType)
                    }else{
                        this.provinceAlias = param.data.alias
                        let level='PROVINCE';
                        this.queryListMap.levelName='PROVINCE';
                        this.queryListMap.levelValue=param.value;
                        this.isMap = false;
                        let map = require('echarts/map/json/province/'+this.provinceAlias);
                        var obj = Object.assign({},{url:map},{param:this.provinceAlias});
                        this.mapUrl = obj;
                        var aliaName = 'obj'
                        this.getAmountReport(this.queryListMap.year,level,param.value,this.queryListMap.timeType,aliaName);

                        this.getPieList(this.queryListMap.year,level,param.value,this.queryListMap.timeType)
                    }

                });
            }
        },

        components: {
            ReturnAmountReport,
            ReportFoldCurver,
            ReportPillar,
            customer,
            contractTable,
            contracts
        }
    };
</script>

<style scoped>
    .container { margin: 75px auto 0; padding: 0 30px; width: 100%; box-sizing: border-box; }
    .nav { position: fixed; top: 90px; left: 0; padding: 10px 37px 0 30px; width: 100%; background-color: #F6F6F6; box-sizing: border-box; z-index: 9; }
    .nav .content { width: 100%; height: 50px;}
    .nav .year-text,.nav .classify-text { font-size: 16px; line-height: 50px; }
    .nav .year-select {margin: 0 10px 5px 15px; width: 75px;}
    .nav .year-select-model{    width: 28%; margin: 9px 0 0 0;}
    .nav .year-select-layer{float: left; margin: 9px 10px 0 15px; width: 68px;}
    .nav .classify-text { float: left; margin: 0 0 0 26px;}
    .nav .classify-select { float: right; margin: 9px 15px 0 10px; width: 240px;}
    .overview .sign,.overview .receivable,.overview .actual,.overview .wait { background-position: 0 bottom; background-repeat: no-repeat; background-size: 30% auto; box-sizing: border-box;color: #FFF; height: 100px; line-height: 64px; text-align: center;}
    .overview .sign,.overview .receivable,.overview .actual,.overview .wait { background-color: #fff;border-radius: 4px;box-shadow: 0px 3px 5px 0px rgba(220,220,220,0.5)}
    .overview .sign h2,.overview .receivable h2,.overview .actual h2,.overview .wait h2 {font-size:12px;color:#000; font-weight: normal;   text-align: left; margin: 0 0 0 27px; font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif}
    .overview .sign p{color:rgb(249,143,115);font-size: 10px;}
    .overview .sign p em,.overview .receivable p em,.overview .actual p em,.overview .wait p em{font-style: normal;font-size: 20px;margin:0 6px}
    .overview .receivable p{color:rgb(167,131,227);font-size: 10px;}
    .overview .actual p{color:rgb(28,197,144);font-size: 10px;}
    .overview .wait p{color:rgb(22,167,243);font-size:10px;}
    .overview h2 { font-size: 30px; font-weight: bold; }
    .iconBtn{display: inline-block;width: 64px;height:30px; margin:0 6px 0 20px}
    .btn01{ background-image: url("./image/icon-1.png");float: left;}
    .btn02{ background-image: url("./image/icon-2.png");}
    .btn03{ background-image: url("./image/icon-3.png");}
    .btn04{ background-image: url("./image/icon-4.png");}
    .overview p { font-size: 16px;  text-align: right;  margin: 0 16px 0 0;height: 0px;  line-height: 0px;    margin: 5px 16px 0 0;}
    .report-floor1 { margin-top: 20px; background-color: #FFF;}
    .report-map { width: 60%; height: 600px; margin:0 0 0 20px}
    .nav .navRight{float:right}
    .reportMiddle{  background: #fff;  position:relative; margin-bottom:20px; box-shadow: 0px 3px 5px 0px rgba(220,220,220,0.5)}
    .overview{  margin:0 0 20px 0;  }
    .report-pie{ width:50%;  height: 520px;  position: absolute;  top:4%;  right: 6px;  }
    .report-floor1{ position: relative;  margin-right: 70%;  padding: 15px;  }
    .reportMiddle .toolBar{  position: absolute;  top: 30%;  right: 18px;  }
   /* .toolBarStyle{  margin:0 0 16px;  font-size: 20px;  font-weight: bold;  cursor:pointer  }*/
    .toolBarStyle{display: inline-block;width: 30px;height: 30px;text-align: center; line-height: 30px;border:solid 1px rgb(92,181,152);margin: 4px 0;border-radius: 4px;cursor: pointer}
    .toolForm{display: inline-block;width:30px;height:30px;background: url("./image/form.png");cursor: pointer; margin:4px 0 0 0}
    .toolFormSelect{display: inline-block;width:30px;height: 30px;background: url("./image/map02.png");margin: 8px 3px 0 0;}
    .active {background-color: rgb(92,181,152);color:#fff}
    .titleFolder{  padding: 16px 0 4px 24px; }
    .reportPillar{  background: #fff;  padding:10px 0 0 10px; }
    .componentFoldPillar{  background: #fff;  overflow: hidden; margin-bottom:20px; padding: 20px 0 0 0;     box-shadow: 0px 5px 2px 0px rgba(220,220,220,0.5);}
    .componentFoldPillar .spStyle{  float:right;  cursor:pointer;  width:30px;  height:30px;display: inline-block}

    .titleFolder .spButton{  float:right;  cursor:pointer; display: inline-block;width:30px;height:30px;  }
    .titleFolder .spButton1{  float:right;   cursor:pointer;display: inline-block;width:30px;height:30px; }
    .toolBar .spStyle{  float:right;  cursor:pointer;  width:30px;  height:30px;display: inline-block}
    .titleFolder .sp1{  background-image: url("./image/E.png"); margin-bottom:10px;position:absolute; right: 18px; top: 30%; z-index: 9999}
    .titleFolder .sp2{  background-image: url("./image/report.png");  margin-bottom:10px;position:absolute; right: 18px;  top: 20%;z-index: 9999 }
    .titleFolder .sp3{  background-image: url("./image/save.png"); position:absolute;right:12px;top:32%}
    .titleFolder .sp6{background-image: url("./image/form02.png"); position:absolute; right: 18px; top: 25%;z-index: 9999}
    .titleFolder .sp7{  background-image: url("./image/table02.png"); position:absolute;right:12px;top:56%  }
    .titleFolder .sp4{  background-image: url("./image/report.png");   position:absolute;right:12px;top:20%}
    .titleFolder .sp5{  background-image: url("./image/form.png");   position:absolute;right:12px;top:44%}
    .toolBar .sp8{  background-image: url("./image/E.png"); margin: 4px 3px 0 0;}
    .loadDateMap{  width:50%;  height:600px;  padding:10px;  }
    /*.iconButton{  position: absolute;  right: 5%;  top: 11%;  cursor:pointer;  z-index:9999;  }*/
    .backImg{
        position: absolute;
        top: 35%;
        right: 8%;
    }
    .backImg img{
        width:70%;
        height:70%;
    }
    .ivu-col-span-6 {
        width: 24.5%;
    }
</style>
<style>
    .ivu-cascader .ivu-input { cursor: pointer;}
</style>
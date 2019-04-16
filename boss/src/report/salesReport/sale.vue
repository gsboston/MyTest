<template>
    <div id="reportx" class="saler-report">
        <!--搜索条件-->
        <div class="queryBar" :class="{'collapse': isCollapse}">
            <div class="condition">搜索条件</div>
            <Form ref="searchCriteria" :model="searchCriteria" :label-width="80" inline>
                <FormItem label="销售顾问" prop="errorReasonType" style="width: 100%;">
                    <Select class="industry-type-select" v-model="searchCriteria.saler" @on-change="changeSalerSelect">
                        <Option v-for="(item, index) in salerList" :key="index" :value="item.id">{{ item.realName  }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="时间" style="width: 100%;">
                    <Select class="industry-type-select" v-model="searchCriteria.timeCode" @on-change="changeTimeSelect">
                        <Option v-for="(item, index) in timeList" :key="index" :value="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="width: 100%;">
                    <Button type="primary" @click="search" style="width: 200px; margin-left: -17px;">查一下</Button>
                </FormItem>
            </Form>
            <Button type="ghost" icon="chevron-left" size="small" @click="collapse" class="collapseBtn"></Button>
        </div>
        <div class="main">
            <div class="clues">
                <!--已选条件-->
                <div class="searchBar">
                    <Row style="line-height: 30px;">
                        <i-col span="3" style="color: #999; width: 70px;">
                            已选条件：
                        </i-col>
                        <i-col span="21">
                            <Tag :title="item.name + ':' + item.val" class="ivu-tag-new" type="border" closable color="green"
                                 v-for="(item, index) in selectedConditionList" :key="index" @on-close="delSelectedCondition(item)" v-show="item.val">
                                {{item.name + ':' + item.val}}
                            </Tag>
                            <!--<div class="del-all" @click="resetParam">重置条件</div>-->
                        </i-col>
                    </Row>
                </div>

                <div class="clueList">
                    <div class="clueHeader">
                        <Row type="flex" align="middle">
                            <i-col span="9" offset="1">
                                <!--找到 {{this.total}} 个相关结果-->
                                <template v-if="searchTime < 3">用时 {{this.searchTime}} 秒</template>
                            </i-col>
                        </Row>
                    </div>
                    <!--报表-->
                    <div id="salerbar" style="" class="sales-trend"></div>
                    <!--列表-->
                    <Table :columns="columns1"  v-show="dataList.length>0" :data="dataList"></Table>

                </div>

            </div>

        </div>

    </div>
</template>

<script type="es6">
    import echarts from 'echarts'
    require('echarts/theme/macarons');
    export default {
        props: {

        },
        data: function () {
            return {
                columns1: [
                    {
                        title: '日期',
                        key: 'date'
                    },
                    {
                        title: '姓名',
                        key: 'realName'
                    },
                    {
                        title: '总收藏数',
                        key: 'allTotalCollection'
                    },
                    {
                        title: '总商机数',
                        key: 'allTotalOpportunity'
                    },
                    {
                        title: '今日跟进客户数',
                        key: 'toDayCustomer'
                    },
                    {
                        title: '今日跟进商机数',
                        key: 'toDayOpportunity'
                    },
                    {
                        title: '今日拜访客户数',
                        key: 'toDayVisit'
                    },
                    {
                        title: '今日收藏客户数',
                        key: 'toDayCollection'
                    },
                    {
                        title: '本月累计跟进客户数',
                        key: 'totalCustomer'
                    },
                    {
                        title: '本月累计跟进商机数',
                        key: 'totalOpportunity'
                    },
                    {
                        title: '本月累计拜访客户数',
                        key: 'totalVisit'
                    },
                    {
                        title: '本月累计收藏客户数',
                        key: 'totalCollection'
                    }
                ],
                dataList: [],
                isCollapse: false, // queryBar 默认展开
                searchCriteria: {
                    saler: '',//报错原因
                    timeCode: 'week', //时间段
                },//查询时提交到node层的对象
                timeList: [], //时间段
                total: 0,
                searchTime: 0, // 查询线索花费时间
                salerList: [],//报错原因列表数据
                selectedConditionList: [
                    {
                        name: "销售员",
                        val: "",
                        tag: "saler"
                    },
                    {
                        name: "时间",
                        val: "",
                        tag: "timeCode"
                    },
                ],//已选择查询条件数据
                barxAxisData: [],
                barData: [],
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
                seriesDatas: [],
                timestamp:0
            }
        },
        created: function () {
            //获取数据
            //this.getBarData();
            //this.getCollectionCapital();
            //this.selectBtn()
            this.getSalerList();
            this.getTimeList();
        },
        methods: {
            resetParam(){
                this.selectedConditionList.forEach(item=>{
                    item.val = '';
                });
                this.searchCriteria.saler = '';
                this.searchCriteria.timeCode = 'week';

            },
            searchSpendTime: function (searchStart, searchEnd) {
                this.searchTime = (searchEnd - searchStart) / 1000;
            },
            /*queryBar 收缩展开*/
            collapse() {
                this.isCollapse = !this.isCollapse;
            },
            findDataList(item) {
                let isdate = item.name.indexOf('-');
                let time = '';
                if(isdate != -1) {
                    time = item.name;
                }
                this.request({
                    url: '/report/salesReport/salesPersonDetails.do',
                    param: {
                        userId: item.id,
                        timeType: this.searchCriteria.timeCode,
                        time: time
                    }
                }).then(data => {
                    this.dataList = [];
                    this.dataList.push(...data);
                })
            },
            search() {
                let searchStart = Date.now(),
                    searchEnd = 0;
                this.request({
                    url: '/report/salesReport/salesPersonReport.do',
                    param: {
                        userId: this.searchCriteria.saler,
                        timeType: this.searchCriteria.timeCode
                    }
                }).then(data => {
                    searchEnd = Date.now();
                    this.searchSpendTime(searchStart, searchEnd);
                    let that = this;
                    this.barxAxisData = [];
                    this.barData = [];
                    this.seriesDatas = [];
                    this.seriesDatas.push(...data.seriesDatas);
                    if(data.seriesDatas.length>0) {
                        this.graphic[0].style.opacity = 0
                        data.seriesDatas.forEach(item=>{

                            that.barxAxisData.push(item.name);
                            that.barData.push(item.value);
                        })
                    }else {
                        this.graphic[0].style.opacity = 1
                    }



                    this.drawBar('salerbar')
                })
            },
            changeTimeSelect(val) {
                let timeList = this.timeList;
                timeList.forEach(data=>{
                    if(data.code == val) {
                        this.conditionalChange(data.name, '时间')
                    }
                })
                this.search()
            },
            changeSalerSelect(val) {
                let salerList = this.salerList;
                salerList.forEach(data=>{
                    if(data.id == val) {
                        this.conditionalChange(data.realName, '销售员')
                    }
                })
                this.search()
            },
            /*删除选择已选条件*/
            delSelectedCondition: function (item) {
                item.val = '';
                this.searchCriteria[item.tag] = '';
                this.search()
            },
            /*时间段查询条件列表*/
            getTimeList: function () {
                this.request({
                    url: '/report/salesReport/salesPersonTime.do'
                }).then(data => {
                    this.timeList = data;
                })
            },
            /*销售查询条件列表*/
            getSalerList: function () {
                this.request({
                    url: '/report/salesReport/salesPersonList.do'
                }).then(data => {
                    this.salerList = [];
                    this.salerList.push({id:'',realName: '全部'})
                    //this.salerList = data;
                    this.salerList.push(...data);
                })
            },
            /*组合已选条件*/
            conditionalChange: function (val, name, arr) {
                if (arr) {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].code == val) val = arr[i].name;
                    }
                }
                for (let i = 0; i < this.selectedConditionList.length; i++) {
                    if (this.selectedConditionList[i].name == name) this.selectedConditionList[i].val = val;
                }
            },

            drawBar(id){
                let self = this;
                let curwidth = window.innerWidth-359;
                let curflag = document.getElementById(id);
                curflag.style.width = curwidth + 'px';

                this.charts = echarts.init(document.getElementById(id),'macarons')
                this.charts.clear();

                this.charts.setOption({
                    backgroundColor: '#fff',
                    title : {
                        text: '销售统计报表',
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
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    graphic: this.graphic,
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
                    dataZoom: [
                        {
                            type: 'inside'
                        }
                    ],
                    series : [

                        {
                            name:'累计跟进客户数',
                            type:'bar',
                            stack: '123',
                            data:this.barData
                        }
                    ]

                }, true)
                this.charts.on("click", function(param) {
                    console.log(param)  //param.seriesIndex
                    let timestamp =(new Date()).valueOf();
                    if((timestamp - self.timestamp) > 500) {
                        self.timestamp = timestamp;
                        let item = self.seriesDatas[param.dataIndex];
                        self.findDataList(item);
                    }

                });
            },
        },
        mounted(){
            this.$nextTick(function() {
                this.search();
            })
        },
        components: {

        }
    };
</script>

<style scoped>
    .saler-report {
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

    .queryBar {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 300px;
        background: #fff;
        padding: 10px 18px 0;
        border-right: 1px solid #e7e9ef;
    }

    .queryBar .condition {
        margin-left: 10px;
        line-height: 28px;
        color: #999;
    }

    .queryBar .ivu-form-item {
        margin-bottom: 8px;
    }

    .queryBar.collapse {
        /*left: -300px;*/
        transform: translate3d(-300px, 0, 0);
    }

    .queryBar.collapse + .main {
        left: 0px;
    }

    .collapseBtn {
        /*position: fixed;*/
        position: absolute;
        /*top: 0;*/
        top: 50%;
        left: 0;
        z-index: 1;
        padding: 10px 7px;
        opacity: .7;
        margin-top: -22px;
        background: #fff;
    }

    .collapseBtn:hover {
        opacity: 1;
    }

    .collapse .collapseBtn {
        transform: translate3d(300px, 0, 0);
    }

    .collapse .collapseBtn >>> .ivu-icon {
        transform: rotate(180deg);
    }

    .queryBar,
    .main,
    .collapseBtn,
    .collapseBtn >>> .ivu-icon {
        transition: all .3s;
        transform: translateZ(0);
        /*backface-visibility: hidden;*/
        /*perspective: 1000;*/
    }
    .searchBar {
        position: relative;
    }

    .searchBar > .ivu-row {
        margin-right: 180px;
    }

    .main {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 300px;
        overflow: auto;
    }

    .clues {
        padding: 10px 25px;
    }

    .clueList {
        margin-top: 15px;
        background: #fff;
        box-shadow: 1px 1px 10px rgba(150, 150, 150, .2);
        height: 30px;
        line-height:30px;
    }

    .clueHeader{
        padding-bottom:10px;
    }
</style>
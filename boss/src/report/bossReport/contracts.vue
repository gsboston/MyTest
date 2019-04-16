<template>
    <div id="contracts" class="contracts-pie">
        <div id="contractsPie" style="width:50%;height:450px;float: left;"></div>
        <div id="contractsLine" style="width:50%;height:450px;float: left;"></div>
    </div>

</template>

<script type="es6">
    import echarts from 'echarts'
    require('echarts/theme/macarons');
    export default {
        props: {
            /*httpParams: {
                year: '2017',
                timeType: 'YEAR',
                level: 'EQ_GROUP',
                query: ''
            }*/
            params:{}
        },
        data: function () {
            let self = this;
            return {
                charts: '',
                pieData: [],
                httpParams: {},
                barLegend: [],
                barXdata: [],
                barSeriesData: [],
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
                imgType: 'line',
                timestamp: 0
            }
        },
        created: function () {
            //获取数据
            this.selectBtn()
            this.httpParams = Object.assign({},this.params);
        },
        methods: {
            //工具条按钮图
            selectBtn () {
                this.lineBtns = {
                    weekBtn: 'image://static/report/week.png',
                    monthBtn: 'image://static/report/month.png',
                    seasonBtn: 'image://static/report/season.png',
                    yearBtn: 'image://static/report/year.png',
                    jumpBtn: 'image://static/report/jump.png',
                    tableBtn: 'image://static/report/table.png',
                    widthBtn: 'image://static/report/width.png',
                    verticalBtn: 'image://static/report/vertical.png',
                    changeBtn: 'image://static/report/change.png',
                    saveBtn: 'image://static/report/save.png',
                }

                if(this.httpParams.timeType == undefined) {
                    this.httpParams.timeType = 'WEEK';
                }
                if( this.httpParams.timeType == 'WEEK') {
                    this.lineBtns.weekBtn = 'image://static/report/week_sel.png';
                }
                if( this.httpParams.timeType == 'MONTH') {
                    this.lineBtns.monthBtn = 'image://static/report/month_sel.png';
                }
                if( this.httpParams.timeType == 'QUARTER') {
                    this.lineBtns.seasonBtn = 'image://static/report/season_sel.png';
                }
                if( this.httpParams.timeType == 'YEAR') {
                    this.lineBtns.yearBtn = 'image://static/report/year_sel.png';
                }
            },
            drawContract(id){
                let curwidth = window.innerWidth-66;
                let curflag = document.getElementById(id);
                curflag.style.width = curwidth + 'px';
                let contractsPie = document.getElementById('contractsPie');
                let contractsLine = document.getElementById('contractsLine');
                contractsPie.style.width = curwidth/2 + 'px';
                contractsLine.style.width = curwidth/2 + 'px';

                this.charts = echarts.init(document.getElementById('contractsPie'),'macarons')
                this.charts2 = echarts.init(document.getElementById('contractsLine', 'macarons'))

                let self = this;
                //设置饼图
                this.charts.setOption({
                    backgroundColor: '#fff',
                    title : {
                        text: '签约云业务走势图',
                        //subtext: '业务线走势图',
                        left:'30',
                        top: '20',
                        textStyle:{
                            color:'#666',
                            fontSize: 16
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        //formatter: "{a} <br/>{b} : {c} ({d}%)"
                        formatter: function (params) {
                            //console.log(params);
                            var tooltip = params.data.tooltip;
                            var res = params.data.name;
                            res += '<br/>' + '总占比' + params.percent + '%';
                            res += '<br/>' + '签单数' + tooltip.contractCount + '单';
                            res += '<br/>' + '应收款' + tooltip.receivablePrice + '元';
                            res += '<br/>' + '实收款' + tooltip.receiptPrice + '元';
                            res += '<br/>' + '待收款' + tooltip.unreceivablePrice + '元';
                            return res;
                        },
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    color: ['#5fc9ce', '#9670cf', '#f05d55', '#52c99f', '#faa791','#e960a4', '#f9ce8a', '#aed899', '#81cef4', '#8d95cc'],
                    /*legend: {
                        orient : 'vertical',
                        x : 'left',
                        itemWidth: 14,
                        itemHeight: 14,
                        left: 20,
                        data:this.barLegend //['工商服务','财税服务','知识产权','税筹服务','人社服务']
                        data:[
                            {name:'直接访问', icon:'arrow'}
                        ]///'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
                    },*/
                    calculable : true,
                    graphic: this.graphic,
                    series : [
                        {
                            name:'签约云业务走势图',
                            type:'pie',
                            radius : '50%',
                            center: ['50%', '50%'],
                            label: {
                                normal: {
                                    formatter: '{b|{b}}',
                                    rich: {
                                        b: {
                                            fontSize: 16,
                                            color: "#666"
                                        }
                                    }
                                }
                            },
                            data: this.pieData
                        }
                    ]
                });

                //设置折线图
                this.charts2.setOption({
                    backgroundColor: '#fff',
                    grid: {
                        x: 80,
                        y:80,
                        x2:100,
                        y2: 80
                    },
                    graphic: this.graphic,
                    tooltip : {
                        trigger: 'axis',
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    color: ['#5fc9ce', '#9670cf', '#f05d55', '#52c99f', '#faa791','#e960a4', '#f9ce8a', '#aed899', '#81cef4', '#8d95cc'],
                    legend: {
                        top: '20',
                        right: '30',
                        itemWidth: 14,
                        itemHeight: 14,
                        data:this.barLegend //['工商服务','财税服务','知识产权','税筹服务','人社服务']
                    },
                    toolbox: {
                        show : true,
                        showTitle: false,
                        orient: 'vertical',
                        right: 15,
                        itemSize: '30',
                        iconStyle: {
                            normal: {
                                color: "#666",
                                borderWidth: 0,
                                //borderColor: "#3fcbcd"
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
                                    self.httpParams.timeType = 'WEEK'
                                    self.selectBtn()
                                    self.getData()
                                }
                            },
                            myTool2: {
                                show : true,
                                title : '月',
                                icon : this.lineBtns.monthBtn,
                                onclick : function (){
                                    self.httpParams.timeType = 'MONTH'
                                    self.selectBtn()
                                    self.getData()
                                }
                            },
                            myTool3 : {
                                show : true,
                                title : '季',
                                icon : this.lineBtns.seasonBtn,
                                onclick : function (){
                                    self.httpParams.timeType = 'QUARTER'
                                    self.selectBtn()
                                    self.getData()
                                }
                            },
                            myTool4 : {
                                show : true,
                                title : '年',
                                icon : this.lineBtns.yearBtn,
                                onclick : function (){
                                    self.httpParams.timeType = 'YEAR'
                                    self.selectBtn()
                                    self.getData()
                                }
                            },
                            mark : {show: true},
                            magicType : {
                                show: true,
                                type: ['line', 'bar', 'stack', 'tiled'],//'line', 'bar', 'stack', 'tiled'
                                icon: {
                                    line:'image://static/report/jump_sel.png',
                                    bar:'image://static/report/table.png',
                                    stack:'image://static/report/width.png',
                                    tiled: 'image://static/report/vertical.png'
                                }
                            },
                            //restore : {show: true},
                            mystore: {
                                show: true,
                                title: '钻取表单',
                                icon: 'image://static/report/excel.png',
                                onclick: function () {
                                    self.$emit('changeContractsFlag', self.httpParams)
                                }
                            },
                            /*saveAsImage : {
                                show: true,
                                icon: 'image://static/report/save.png'
                            }*/
                        }
                    },

                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : this.barXdata//['周一','周二','周三','周四','周五','周六','周日']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : this.barSeriesData
                }, true);

                //失败实验品
                this.charts2.on('magictypechanged', function (params) {
                    //console.log(params)
                    let timestamp =(new Date()).valueOf();
                    if((timestamp - self.timestamp) > 500) {
                        self.timestamp = timestamp;
                        self.lineBtns.jumpBtn = 'image://static/report/jump.png';
                        self.lineBtns.tableBtn = 'image://static/report/table.png';
                        self.lineBtns.verticalBtn = 'image://static/report/vertical.png';
                        self.lineBtns.widthBtn = 'image://static/report/width.png';
                        if(params.currentType == 'bar') {
                            //self.imgType = 'bar'
                            self.lineBtns.tableBtn = 'image://static/report/table_sel.png';
                        }

                        if(params.currentType == 'line') {
                            //self.imgType = 'line'
                            self.lineBtns.jumpBtn = 'image://static/report/jump_sel.png';
                        }

                        if(params.currentType == 'stack') {
                            //self.imgType = 'line'
                            self.lineBtns.widthBtn = 'image://static/report/width_sel.png';
                        }

                        if(params.currentType == 'tiled') {
                            //self.imgType = 'line'
                            self.lineBtns.verticalBtn = 'image://static/report/vertical_sel.png';
                        }
                        let option = {}
                        option.toolbox = {
                            feature: {
                                magicType : {
                                    type: ['line', 'bar', 'stack', 'tiled'],//'line', 'bar', 'stack', 'tiled'
                                    icon: {
                                        line:self.lineBtns.jumpBtn,
                                        bar:self.lineBtns.tableBtn,
                                        stack:self.lineBtns.widthBtn,
                                        tiled: self.lineBtns.verticalBtn
                                    }
                                }
                            }
                        }
                        self.charts2.setOption(option);
                    }



                })

                //echarts.connect([this.charts, this.charts2]);   //关联连个图标，实现联动


            },

            //获取统计数据
            getData() {
                //获取饼图数据
                this.request({
                    url: '/report/bossReport/serviceForPie.do',
                    param: {
                        year:this.httpParams.year,
                        timeType:this.httpParams.timeType,
                        level:this.httpParams.levelName,
                        query:this.httpParams.levelValue
                    }
                }, {
                    url: '/report/bossReport/serviceForBar.do',
                    param: {
                        year:this.httpParams.year,
                        timeType:this.httpParams.timeType,
                        level:this.httpParams.levelName,
                        query:this.httpParams.levelValue
                    }
                }).then((pieData, barData) => {

                    if(pieData.length>0) {
                        //this.curGraphic = [];
                        this.graphic[0].style.opacity = 0
                    }else {
                        //this.curGraphic = Object.assign({}, this.graphic)
                        this.graphic[0].style.opacity = 1
                    }
                    this.pieData = [];
                    for (let val of pieData) {
                        let sub = {};
                        sub.value = val.receivablePrice;
                        sub.name = val.serviceName;
                        sub.tooltip = val;
                        this.pieData.push(sub);
                    }

                    //处理bar图barLegend
                    this.barLegend = [];
                    for (let val of barData.legend ) {
                        let sub = {}
                        sub.name = val.serviceName;
                        sub.icon = 'roundRect';
                        this.barLegend.push(sub)
                    }

                    //bar横坐标
                    this.barXdata = barData.timeLine;

                    //bar series 数据
                    this.barSeriesData = [];
                    if(barData.series.length > 0) {
                        for ( let val of barData.series) {
                            let sub = {};
                            sub.name = val.name;
                            sub.type = this.imgType; //'line'; bar
                            sub.stack = '总量';
                            //sub.symbol =  'triangle';
                            let svo = []
                            for (let vo of val.data)
                            {
                                svo.push(vo.receivablePrice|0)
                            }
                            sub.data = svo;
                            /*
                            name:'人社服务',
                            type:'line',
                            stack: '总量',
                            symbol: 'roundRect',
                            data:[820, 932, 901, 934, 1290, 1330, 1320]
                            */

                            this.barSeriesData.push(sub);
                        }
                        //console.log(this.barSeriesData)
                    }


                    //console.log(this.barSeriesData);
                    this.drawContract('contracts');
                });
                //获取饼图数据
            }
        },
        mounted(){
            this.$nextTick(function() {
                //this.getData()

            })
        },
        watch: {
            params: {
                handler(val, oldVal) {
                    this.httpParams = Object.assign({},val);
                    if(val.levelName == 'WAR_ZONE' && val.levelValue == '') {
                        return false;
                    }
                    this.getData()
                },
                deep: true
            }
        },
        components: {

        }
    };
</script>

<style scoped>
    .contracts-pie{
        height:450px;
        box-shadow: 0px 3px 5px 0px rgba(220,220,220,0.5);
    }
    .no-data{
        margin-top:50px;
        text-align: center;
        vertical-align: middle;
    }
</style>
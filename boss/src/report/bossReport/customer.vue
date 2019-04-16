<template>
    <div class="customer">
        <div class="menu-flag" v-show="isok">
            <Row type="flex" justify="end" class="code-row-bg">
                <Col span="4"><a @click="getBarData('customerSource')" :class="{ 'selActive': reportType=='customerSource' }">客户来源</a></Col>
                <Col span="4"><a @click="getBarData('body')" :class="{ 'selActive': reportType=='body' }">民事主体</a></Col>
                <Col span="4"><a @click="getBarData('companyType')" :class="{ 'selActive': reportType=='companyType' }">企业分类</a></Col>
                <Col span="4"><a @click="getBarData('companyScale')" :class="{ 'selActive': reportType=='companyScale' }">企业规模</a></Col>
                <Col span="4"><a @click="getBarData('province')" :class="{ 'selActive': reportType=='province' }">省份</a></Col>
            </Row>
        </div>
        <div v-show="isok" id="all" style="width:100%;height:400px;" class="pie-source"></div>
        <div v-show="!isok" class="backImg"><img src="./image/no.png"> </div>
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
                charts: '',
                isok: false,
                customerData:[],
                expectFinish: [],
                actualFinish: [],
                finishAllRatio: 0,
                reportType: 'customerSource',
                customTotal: 0,
            }
        },
        created: function () {
            //获取数据

        },
        methods: {
            //获取趋势数据
                getBarData(type = '') {

                 if(type == '') {
                     this.reportType = 'customerSource';
                 } else {
                     this.reportType = type;
                 }

                this.request({
                    url: '/report/bossReport/conversion.do',
                    param: {
                        type: type
                    }
                }).then(data => {
                    this.isok = true;
                    //this.base = data;
                    this.customerData = data.customer.seriesDatas;
                    this.expectFinish = data.conversionExpect.seriesDatas;
                    let actualFinish = data.conversion.seriesDatas;
                    this.customTotal = data.total;
                    /*this.actualFinish = [];
                    let self = this;
                    actualFinish.forEach(function (val, index, arr) {
                        let sub = {};
                        sub.value = arr[index].value;
                        sub.name = arr[index].name;
                        self.actualFinish.push(sub);
                    });
                    console.log(this.actualFinish);*/
                    let bsNum = 100;
                    for (let item of data.conversion.seriesDatas) {
                        item.val = item.value;
                        item.value = bsNum;
                        bsNum -= 25;
                    }
                    this.actualFinish = data.conversion.seriesDatas;
                    this.finishAllRatio = data.finish.attachData.finishAllRatio
                    this.drawAll('all')
                });
            },
            drawAll(id){
                let curwidth = window.innerWidth-66;
                let curflag = document.getElementById(id);
                curflag.style.width = curwidth + 'px';
                this.charts = echarts.init(document.getElementById(id),'macarons')
                this.charts.setOption({
                    backgroundColor: '#fff',
                    /*color : [
                        'rgba(255, 69, 0, 0.5)',
                        'rgba(255, 150, 0, 0.5)',
                        'rgba(255, 200, 0, 0.5)',
                        'rgba(155, 200, 50, 0.5)',
                        'rgba(55, 200, 100, 0.5)'
                    ],*/
                    title : {
                        text: '{a|营销云客户转化率}  {b|线索总量：}{c|'+ this.customTotal +'条}',
                        top: '20px',
                        left: '30px',
                        textStyle: {
                            rich: {
                                a:{
                                    color: '#666',
                                    fontSize: 16,
                                },
                                b:{
                                    color: '#666',
                                    fontSize: 14,
                                    verticalAlign: 'bottom'

                                },
                                c:{
                                    color: '#6abba1',
                                    fontSize: 14,
                                    verticalAlign: 'bottom'
                                }
                            }
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}%",
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    toolbox: {
                        show : true,
                        showTitle: false,
                        orient: 'vertical',
                        right: 30,
                        itemSize: '25',
                        y: 'center',
                        feature : {
                            mark : {show: true},
                            //dataView : {show: true, readOnly: false},
                            //restore : {show: true},
                            /*saveAsImage : {
                                show: true,
                                icon: 'image://static/report/save.png'
                            }*/
                        }
                    },
                    legend: {
                        //data : ['展现','点击','访问','咨询','订单']
                    },
                    series : [
                        {
                            name:'业务指标',
                            type:'gauge',
                            center: ['15%','55%'],
                            radius: '55%',
                            splitNumber: 10,       // 分割段数，默认为5
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.2, '#228b22'],[0.8, '#48b'],[1, '#ff4500']],
                                    width: 8
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                splitNumber: 10,   // 每份split细分多少段
                                length :12,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto'
                                }
                            },
                            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    color: 'auto'
                                }
                            },
                            splitLine: {           // 分隔线
                                show: true,        // 默认显示，属性show控制显示与否
                                length :30,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto'
                                }
                            },
                            pointer : {
                                width : 5
                            },
                            title : {
                                show : true,
                                offsetCenter: [0, '-40%'],       // x, y，单位px
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    fontWeight: 'bolder'
                                }
                            },
                            detail : {
                                formatter:'{value}%',
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    color: 'auto',
                                    fontWeight: 'bolder'
                                }
                            },
                            data:[{value: this.finishAllRatio, name: '转化率'}]
                        },
                        /*{
                            name:'预期',
                            type:'funnel',
                            x: '35%',
                            width: '300',
                            itemStyle: {
                                normal: {
                                    label: {
                                        formatter: '{b}预期'
                                    },
                                    labelLine: {
                                        show : false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        position:'inside',
                                        formatter: '{b}预期 : {c}%'
                                    }
                                }
                            },
                            data:this.expectFinish
                        },*/
                        {
                            name:'实际',
                            type:'funnel',
                            color: ['#fc6f3e', '#fdb13e', '#fdd83e', '#b4d966'],
                            tooltip: {
                                formatter: function (params) {
                                    var tooltip = params.data.toolTip;
                                    var res = params.data.name;
                                    for (var i = 0; i < tooltip.length; i++) {
                                        res += '<br/>' + tooltip[i];
                                    }
                                    return res;
                                },
                                textStyle: {
                                    fontSize: 12
                                }
                            },
                            x: '35%',
                            y: '25%',
                            width: '25%',
                            height: '55%',
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 2,
                                    label: {
                                        position: 'inside',
                                        //formatter: '{b} : {c}',
                                        formatter: function (params) {
                                            return params.data.name + ':' +params.data.val + '';
                                        },
                                        textStyle: {
                                            color: '#666'
                                        }
                                    }
                                },
                                emphasis: {
                                    label: {
                                        position:'inside',
                                        //formatter: '{b} : {c}'
                                        formatter: function (params) {
                                            return params.data.name + ':' +params.data.val;
                                        }
                                    }
                                }
                            },
                            data:this.actualFinish
                        },
                        {
                            name:'线索类型',
                            type:'pie',
                            radius : '50%',
                            center: ['80%', '55%'],
                            tooltip: {
                                show: true,
                                formatter: "{a} <br/>{b} : {c} ({d}%)",
                                textStyle: {
                                    fontSize: 12
                                }
                            },
                            color: ['#5fc9ce', '#9670cf', '#f05d55', '#52c99f', '#faa791','#e960a4', '#f9ce8a', '#aed899', '#81cef4', '#8d95cc'],
                            label: {
                                normal:{
                                    position:'outside',
                                    formatter: "{b}-{d}%"
                                }
                            },
                            data:this.customerData
                        }
                    ]
                })
            }
        },
        mounted(){
            this.$nextTick(function() {
                this.getBarData();

            })
        },
        components: {

        }
    };
</script>

<style scoped>
    .customer{
        padding-top:20px;
        display:inline-block;
        width:100%;
        position: relative;
        background-color: #fff;
        margin-top:20px;
        box-shadow: 0px 3px 5px 0px rgba(220,220,220,0.5);
        height:400px;
    }
    .sales-report {
        width:100%;
        background-color: #fff;
        padding-top:10px;
    }
    .menu-flag{
        position: absolute;
        width:500px;
        text-align: left;
        font-size:16px;
        font-weight:bold;
        right:0px;
        top:42px;
        z-index: 9;
    }
    .selActive{
        color: rgba(80, 168, 253, 1) !important;
    }
    .menu-flag a{
        font-size:14px;
        font-weight:normal;
        color: #666;
    }
    .menu-flag a:hover{
        color: rgba(80, 168, 253, 1);
    }
    .backImg{
        text-align: center;
        margin-top: 50px;
    }

    .backImg img{
        width:150px;
        height:150px;
    }


</style>
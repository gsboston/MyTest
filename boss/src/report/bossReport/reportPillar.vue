<template>
            <div class="reportPillar" id="reportPillar"></div>
</template>

<script>
    import echarts from 'echarts';
    require('echarts/theme/macarons');

    export default {
        props: {
            reportContent:{

            }
        },
        data() {
            return {
                dataList:{}
            }
        },
        created: function () {
            this.getList(parseInt(this.reportContent.year),this.reportContent.levelName,this.reportContent.levelValue);
        },


        methods: {
            getList(year,levelName,levelValue){
                this.request({
                    url: '/report/bossReport/reportPillar.do',
                    param:{
                        year:year,
                        type:'YEAR',
                        levelName:levelName,
                        levelValue:levelValue
                    }
                }).then(demand => {
                    this.dataList = demand;
                    this.$nextTick(function() {
                        this.getPillar('reportPillar', '业务对比图');
                    })
                });
            },
            getPillar(id){
                let curwidth = window.innerWidth-140;
                let curflag = document.getElementById(id);
                curflag.style.width = curwidth + 'px';

                var myChart3 = echarts.init(document.getElementById(id),'macarons')
                myChart3.setOption({
                    title: {
                        text: '全年回款对比图',
                        left:12,
                        textStyle: {
                            color: '#333',
                            fontStyle: 'normal',
                            fontSize: 16

                        },
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data:this.dataList.legend.data,
                        right: 20
                    },
                    grid: {
                        left: '3%',
                        right: '1%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#666'
                            }
                        },
                        data: this.dataList.xAxis.data
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '',
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                color: '#666'
                            }
                        }
                    }],
                    series: this.dataList.series

                })
                window.addEventListener("resize", function () {
                    myChart3.resize();
                });
            },
        },
        watch:{
            reportContent: {
                handler(val) {
                    this.getList(parseInt(val.year),val.levelName,val.levelValue)
                },
                deep: true
            }
        },

    };
</script>

<style scoped>
.reportPillar{
    width:100%;
    height:360px;
    margin:10px 0 0 0;
    background: #ffffff;
}


</style>

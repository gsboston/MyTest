<template>
            <div class="reportFold" style="background: #ffffff" id="reportFold"></div>
</template>

<script>
    import echarts from 'echarts';
    require('echarts/theme/macarons');

    export default {
        props:{
            content:{}
        },
        data() {
            return {
               foldList:{

               }

            }
        },
        created: function () {
            this.getReportFold(parseInt(this.content.year),this.content.levelName,this.content.levelValue)
        },
        watch:{
            content: {
                handler(val) {
                    console.log()
                    this.getReportFold(parseInt(val.year),val.levelName,val.levelValue)
                },
                deep: true
            }
        },

        methods: {
            getReportFold(year,levelName,levelValue){
                this.request({
                    url: '/report/bossReport/reportFoldCurver.do',
                    param:{
                        year:year,
                        levelName:levelName,
                        levelValue:levelValue
                    }
                }).then(demand => {
                    this.foldList = demand;
                    console.log(this.foldList)
                    this.$nextTick(function() {
                        this.getFold('reportFold', '业务走势图');
                    })
                });
            },
            getFold(id, title, data1){
                let curwidth = window.innerWidth-105;
                let curflag = document.getElementById(id);
                curflag.style.width = curwidth + 'px';

                var myChart2 = echarts.init(document.getElementById(id),'macarons')
                myChart2.setOption({

                    title: {
                        text: '近12月回款走势图',
                        left:12,
                        top:10,
                        textStyle: {
                            color: '#333',
                            fontStyle: 'normal',
                            fontSize: 16

                        },
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        right:20,
                        data:this.foldList.legend.data,
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                       /* feature: {
                            saveAsImage: {}
                        }*/
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#666'
                            }
                        },
                        data:  this.foldList.xAxis.data
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#666'
                            }
                        },
                    },
                    series: this.foldList.series
                })
                window.addEventListener("resize", function () {
                    myChart2.resize();
                });
            }
        }
    };
</script>

<style scoped>
.reportFold{
    width: 100%;
    height: 360px;
    background: #ffffff;
    margin: -59px 0 0 0;
    box-shadow:-5px 3px 5px 0px rgba(220,220,220,0.5);

  /*  0px 3px 5px 0px rgba(220,220,220,0.5)*/
}
</style>

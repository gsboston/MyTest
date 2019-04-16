<template>
            <div class="report-map" id="chart-panel" style="-moz-user-select: none; background: transparent none repeat scroll 0% 0%;" _echarts_instance_="ec_1511767953423">

            </div>
</template>

<script>
    import echarts from 'echarts';
    import chinaMap from 'echarts/map/js/china.js';
    import Map from "../../core/component/map";

    require('echarts/theme/macarons');

    export default {
        props: {
            propList: {

            },

        },
        data() {
            return {
                dataList: []
            }
        },
        created: function () {
            this.getAmountReport(this.propList.year,this.propList.levelName,this.propList.levelValue,this.propList.timeType);
        },
        watch:{
            propList: {
                handler(val) {
                    this.getAmountReport(val.year,val.levelName,val.levelValue,val.timeType);
                },
                deep: true
            }
        },
        methods: {
            getAmountReport(year,levelName,levelValue,type){
                this.request({
                    url: '/report/bossReport/reportAmountReport.do',
                    param:{
                        year:year,
                        level:levelName,
                        childLevel:levelValue,
                        type:type
                    }
                }).then(demand => {
                        this.dataList = demand;
                        if(this.dataList){
                            this.$nextTick(function() {
                                this.getMap('chart-panel',this.dataList);
                            })
                        }
                });
            },
            getMap(id,data1) {
                let curwidth = window.innerWidth;
                let curflag = document.getElementById(id);
                curflag.style.width = curwidth/2 + 'px';

                function colorAreaObj(name, color,alias,value,content) {
                    this.name = name;
                    this.alias = alias;
                    this.value = value;
                    this.content = content;
                    this.itemStyle = {
                        normal: {
                            color: color,
                            show: false,
                        },
                        emphasis: {
                            color: color,
                            show: false,
                        }
                    };
                    this.label = {
                        normal: {
                            show: true,
                        },
                        emphasis: {
                            show: true,
                        }
                    }
                }


                var data = [];

                if(data1){
                    data = data1.map(function(v, i) {
                        return new colorAreaObj(v.name, v.color,v.alias,v.value,v.content)
                    })
                }


                var getData = {
                    title:{
                        text:'神州易桥回款额',
                        subtext:'',
                        left:12,
                        top:20,
                        textStyle: {
                            color: '#333',
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: 16

                        },
                    },
                    "tooltip": {
                        "trigger": 'item',
                        "formatter": function(obj) {
                            if(obj.data){
                                return obj.data.content
                            }
                         },
                       /* "backgroundColor": 'rgba(255,26,52,1)',
                        "borderWidth": '2px',
                        "borderRadius": '0px',
                        "borderColor": 'rgba(94,194,222,1)',
                        "textStyle": {
                            "color": 'rgba(94,194,222,1)'
                        }*/
                    },
                    /*legend: {
                        orient: 'horizontal',
                        left: '160',
                        data:data
                    },*/
                    "series": [{
                        "name": '中国',
                        "type": "map",
                        "mapType": "china",
                        "zoom": 1.1,
                        "selectedMode": false,
                        "layoutCenter": ['48%', '53%'],
                        "layoutSize": "90%",
                        "label": {
                            "normal": {
                                "show": true,
                                "textStyle": {
                                    "color": "#9c9a95",
                                    "fontSize": "12"
                                }
                            },
                            "emphasis": {
                                "show": true,
                                "textStyle": {
                                    "color": "#292929",
                                    "fontSize": "12"
                                }
                            }
                        },
                        "itemStyle": {
                            "normal": {
                                "areaColor": "#daeee9",
                                 "borderColor": '#a7c6c6',
                                "textStyle": {
                                    "color": "#9c9a95",
                                    "fontSize": "12"
                                }
                            },
                            "emphasis": {
                                "areaColor": "rgba(51, 69, 89, .5)",
                                "textStyle": {
                                    "color": "#292929",
                                    "fontSize": "12"
                                }
                            }
                        },
                        "data": data
                    }]
                }

                let myChart1 = echarts.init(document.getElementById(id));

                myChart1.setOption(getData);


                window.addEventListener("resize", function () {
                    myChart1.resize();
                });

                window.myChart1 = myChart1;

                myChart1.off("click");

                myChart1.on("click", (param) => {
                    var a = param.data.alias
                    var b = require('echarts/map/json/province/'+a);
                    this.mapUrl = b;
                    this.$emit('on-select',{url:this.mapUrl,param:a,value:param.value})
                });
            }
        },
        components: {

        }
    };
</script>

<style scoped>

</style>

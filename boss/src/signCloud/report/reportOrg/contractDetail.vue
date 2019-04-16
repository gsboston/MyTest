<style scoped>
    .container-Contract-detail{
        padding: 12px 15px;
        background-color: white;
        margin-top: 20px;
    }
    .contract-title{
        padding: 10px 0;
        font-size: 16px;
        color: #59b399;
        font-weight: bold;
    }
    .detail-left-info{
        height: 90px;
        text-align: center;
    }
    .detail-left-info:before{
        content: "";
        position: absolute;
        top: 31px;
        left: 0;
        bottom: 31px;
        width: 1px;
        background: white;
    }
    .contract-detail-item{
        padding: 5px 15px 5px 0;
        margin-top: 10px;
        width: 100%;
        height: 100px;
    }
    .contract-circle{
        position: relative;
        left: 50%;
        margin-left: -22px;
        top: 28px;
        width: 44px;
        height: 44px;
        line-height: 44px;
        border-radius: 22px;
        font-size: 14px;
        color: white;
        text-align: center;
    }
    .contract-pie{
        position: relative;
        top: 10px;
        height: 320px;
    }
    .contract-pie:before{
        content: "";
        position: absolute;
        top: 1px;
        left: 0;
        bottom: 1px;
        width: 1px;
        background: #e5e5e5;
    }
</style>
<template>
    <div class="container-Contract-detail">
        <div class="contract-title">
            <span>合约明细</span>
        </div>
        <div>
            <Row>
                <i-col span="14" style="padding-right: 10px">
                    <div class="contract-detail-item" style="background-color: #F2DEDE">
                        <i-col span="3">
                            <div class="contract-circle" style="background-color: #FEB1AD">
                                <span>待签</span>
                            </div>
                        </i-col>
                        <i-col span="5" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>合约数</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>{{contract.pending_contract_num}}</span>
                            </div>
                        </i-col>
                        <i-col span="4" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>待提交</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>{{contract.none_contract_num}}</span>
                            </div>
                        </i-col>
                        <i-col span="4" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>待审核</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>{{contract.committed_contract_num}}</span>
                            </div>
                        </i-col>
                        <i-col span="4" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>已核准</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>{{contract.approved_contract_num}}</span>
                            </div>
                        </i-col>
                        <i-col span="4" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>签约中</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>{{contract.signing_contract_num}}</span>
                            </div>
                        </i-col>
                    </div>
                    <div class="contract-detail-item" style="background-color: #DFF0D7">
                        <i-col span="3">
                            <div class="contract-circle" style="background-color: #96D8AC">
                                <span>正式</span>
                            </div>
                        </i-col>
                        <i-col span="3" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>合约数</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>{{contract.signed_contract_num}}</span>
                            </div>
                        </i-col>
                        <i-col span="6" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>合约总额</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>￥{{contract.signed_contract_price}}</span>
                            </div>
                        </i-col>
                        <i-col span="6" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>实收金额</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>￥{{contract.signed_receipt_contract_price}}</span>
                            </div>
                        </i-col>
                        <i-col span="6" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>开票金额</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>￥{{contract.signed_invoiced_contract_price}}</span>
                            </div>
                        </i-col>
                    </div>
                    <div class="contract-detail-item" style="background-color: #FCF8E2">
                        <i-col span="3">
                            <div class="contract-circle" style="background-color: #FFE794">
                                <span>解约</span>
                            </div>
                        </i-col>
                        <i-col span="3" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>合约数</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>{{contract.termination_contract_num}}</span>
                            </div>
                        </i-col>
                        <i-col span="6" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>合约总额</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>￥{{contract.termination_total_contract_price}}</span>
                            </div>
                        </i-col>
                        <i-col span="6" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>解约结算总额</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>￥{{contract.settlement_contract_price}}</span>
                            </div>
                        </i-col>
                        <i-col span="6" class="detail-left-info">
                            <div style="font-size: 12px;color: #9b9b9b;padding: 15px 0 8px 0">
                                <span>开票金额</span>
                            </div>
                            <div style="font-size: 20px;color: #5d5d5d;padding-top: 5px">
                                <span>￥{{contract.termination_invoiced_contract_price}}</span>
                            </div>
                        </i-col>
                    </div>
                </i-col>
                <i-col span="10" class="contract-pie">
                    <div>
                        <div id="contractPie" style="width: 100%;height: 280px"></div>
                    </div>
                </i-col>
            </Row>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../../node_modules/iview/src/components/grid/col.vue";
    import echarts from 'echarts';
    require('echarts/theme/macarons');
    export default {
        props: {
            contractData: null,
            pieData: null
        },
        components: {ICol},
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 11){
                    return value.substring(0,10) + "..." ;
                }
                return value;
            },
            formatPrice(num) {
                if(num == undefined || num == null){
                    return
                }
                let cent = 2;
                let isThousand = 1;
                num = num.toString().replace(/\$|\,/g,'');
                // 检查传入数值为数值类型
                if(isNaN(num)) {
                    num = "0";
                }
                num = Math.floor(num*Math.pow(10,cent)+0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
                let cents = num%Math.pow(10,cent);       // 求出小数位数值
                num = Math.floor(num/Math.pow(10,cent)).toString();  // 求出整数位数值
                cents = cents.toString();        // 把小数位转换成字符串,以便求小数位长度

                // 补足小数位到指定的位数
                while(cents.length<cent){
                    cents = "0" + cents;
                }
                if(isThousand) {
                    // 对整数部分进行千分位格式化.
                    var isPositiveNumber = true;//是否正数
                    if(num < 0){
                        isPositiveNumber = false;
                        num = num.substring(1,num.length-1);
                    }
                    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
                        num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
                    }
                    if(!isPositiveNumber){
                        num = "-" + num;
                    }
                }
                var finallyPrice = "";
                if (cent > 0) {
                    finallyPrice = num + '.' + cents;
                } else {
                    finallyPrice = num;
                }
                if(finallyPrice && finallyPrice.length > 13){
                    return finallyPrice.substring(0,12) + "..." ;
                }else{
                    return (finallyPrice);
                }
            },
        },
        watch: {
            contractData(value) {
                this.contract = value;
            },
            pieData(data) {
                if(data && data.items){
                    for(var i=0;i<data.items.length;i++){
                        data.items[i].name = data.items[i].name.replace("-","");
                        this.pieLegendData.push(data.items[i].name);
                        this.pieLegendFormat[data.items[i].name] = data.items[i].value;
                    }
                    this.contractPieData = data.items;
                }
                this.contractNum = data.total;
                this.$nextTick(()=>{
                    this.drawPie();
                })
            },
        },
        data () {
            return{
                contract: {},
                contractPieData: [],
                pieLegendData: [],
                pieLegendFormat: {},
                contractNum: 0,
            }
        },
        created: function () {
        },
        methods: {
            drawPie() {
                var vm = this;
                this.charts = echarts.init(document.getElementById('contractPie'),'macarons');
                this.charts.setOption({
                    title: {
                        x: '100px',
                        y: 'center',
                        width: '50%',
                        text: '{a|' + vm.contractNum + '\n正式合约}',
                        textStyle: {
                            rich: {
                                a: {
                                    color: '#5D5D5D',
                                    fontSize: 20,
                                    lineHeight: 28,
                                    align: 'center',
                                    verticalAlign: 'middle'
                                }
                            }
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c}"
                    },
                    legend: {
                        orient : 'vertical',
                        y: 'center',
                        right: '50px',
                        align: 'left',
                        itemWidth: 12,
                        itemHeight: 12,
                        data: vm.pieLegendData,
                        formatter: function (name) {
                            var _num = name.length > 4 ? 0 : (4 - name.length);
                            var _name = name.length > 4 ? name.substring(0, 4) : name;
                            for(var i = 0; i < _num; i++) {
                                _name = _name + '   ';
                            }
                            if(name == "其他"){
                                return _name + '       ' + (vm.pieLegendFormat[name] ? vm.pieLegendFormat[name] : '');
                            }else{
                                return _name + '      ' + (vm.pieLegendFormat[name] ? vm.pieLegendFormat[name] : '');
                            }
                        },
                        tooltip: {
                            show: true,
                            formatter: function (obj) {
                                if (obj.name == '其他') {
                                    return '    ' + obj.name + '    ';
                                }
                                return obj.name;
                            }
                        },
                    },
                    series: [
                        {
                            center: [150,150],
                            type:'pie',
                            radius: ['60%', '80%'],
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: vm.contractPieData
//                                [
//                                {value:234, name:'税筹-霍尔果斯'},
//                                {value:135, name:'工商代理'},
//                                {value:1048, name:'商标代理'},
//                                {value:251, name:'上海税筹服务'},
//                                {value:147, name:'其他'}
//                            ]
                        }
                    ]
                });
            },
        },
    }
</script>
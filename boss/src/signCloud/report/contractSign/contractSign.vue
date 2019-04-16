<style scoped>
    .container{
        height: 100%;
        padding: 15px 45px;
        overflow-y: hidden;
        overflow-x: hidden;
        background-color: #f6f6f6;
    }
    .contract-module-title{
        margin-left: 10px;
        font-size: 16px;
        color: #59b399;
        font-weight: bold;
    }
    .contract-module{
        width: 100%;
        background-color: #fff;
        height: 355px;
    }
    .contract-module-content{
        padding: 15px 10px 10px 15px;
    }
    .contract-module-head{
        color: #bbbbbb;
        font-size: 16px;
        font-weight: bold;
    }
    .contract-module-head-right{
        color: #bbbbbb;
        font-size: 12px;
        float: right;
        width: 120px;
        text-align: right;
    }
    .wait-sign-count:before{
        content: "";
        position: absolute;
        top: 21px;
        left: 0;
        bottom: 21px;
        width: 1px;
        background: #e5e5e5;
    }
    .contract-title{
        font-size: 14px;
        color: #9b9b9b;
        text-align: center;
    }
    .contract-num-content{
        font-size: 28px;
        color: #59b399;
        text-align: center;
        margin-top: 10px;
    }
    .wait-sign-count-content{
        font-size: 28px;
        color: #5d5d5d;
        text-align: center;
        margin-top: 10px;
    }
    .formal-contract-title{
        font-size: 14px;
        color: #9b9b9b;
        text-align: right;
        width: 70px;
        display: inline-block;
    }
    .formal-contract-content{
        font-size: 18px;
        color: #5d5d5d;
        display: inline-block;
    }
    .termination-contract-title{
        font-size: 18px;
        color: #5d5d5d;
    }
    .termination-contract-content{
        margin-left: 10px;
        font-size: 12px;
        color: #9b9b9b;
    }
</style>
<template>
    <div class="container">
        <span class="contract-module-title">我的签约</span>
        <Row :gutter="8" style="margin-top: 10px">
            <!-- 待签合约 -->
            <i-col span="8" >
                <div class="contract-module">
                    <div class="contract-module-content">
                        <div>
                            <span class="contract-module-head">待签合约</span>
                        </div>
                        <div style="margin-top: 55px">
                            <Row :gutter="16">
                                <i-col span="8">
                                    <div class="contract-title">
                                        <span>合约数</span>
                                    </div>
                                    <div class="contract-num-content">
                                        <span>{{this.notSignInfo.unSigneContractCount}}</span>
                                    </div>
                                </i-col>
                                <i-col span="15" class="wait-sign-count">
                                    <div class="contract-title">
                                        <span>待签约总额</span>
                                    </div>
                                    <div class="wait-sign-count-content" :title="'￥' + this.notSignInfo.unSigneccontractSumPrice">
                                        <span>￥{{this.notSignInfo.unSigneccontractSumPrice | formatPrice}}</span>
                                    </div>
                                </i-col>
                            </Row>
                        </div>
                        <div style="margin-top: 65px">
                            <Row :gutter="8">
                                <i-col span="8">
                                    <div class="contract-title">
                                        <span>待提交</span>
                                    </div>
                                    <div class="wait-sign-count-content">
                                        <span>{{this.notSignInfo.noneContractCount}}</span>
                                    </div>
                                </i-col>
                                <i-col span="8" class="wait-sign-count">
                                    <div class="contract-title">
                                        <span>待审核</span>
                                    </div>
                                    <div class="wait-sign-count-content">
                                        <span>{{this.notSignInfo.noneApprovedContractCount}}</span>
                                    </div>
                                </i-col>
                                <i-col span="8" class="wait-sign-count">
                                    <div class="contract-title">
                                        <span>已核准</span>
                                    </div>
                                    <div class="wait-sign-count-content">
                                        <span>{{this.notSignInfo.approvedContractCount}}</span>
                                    </div>
                                </i-col>
                                <!--<i-col span="6" class="wait-sign-count">-->
                                    <!--<div class="contract-title">-->
                                        <!--<span>签约中</span>-->
                                    <!--</div>-->
                                    <!--<div class="wait-sign-count-content">-->
                                        <!--<span>{{this.notSignInfo.signingContractCount}}</span>-->
                                    <!--</div>-->
                                <!--</i-col>-->
                            </Row>
                        </div>
                    </div>
                </div>
            </i-col>
            <!-- 正式合约 -->
            <i-col span="8">
                <div class="contract-module">
                    <div class="contract-module-content">
                        <div>
                            <span class="contract-module-head">正式合约</span>
                            <Select size="small" v-model="formalCurrent" class="contract-module-head-right" @on-change="getFormalContractInfo">
                                <Option v-for="item in queryType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                        <div style="margin-top: 55px">
                            <Row :gutter="16">
                                <i-col span="12">
                                    <div class="contract-title">
                                        <span>合约数</span>
                                    </div>
                                    <div class="contract-num-content">
                                        <span>{{this.formalContractInfo.signedContractCount}}</span>
                                    </div>
                                </i-col>
                                <i-col span="12" class="wait-sign-count">
                                    <div class="contract-title">
                                        <span>已开票总额</span>
                                    </div>
                                    <div class="wait-sign-count-content" :title="'￥' + this.formalContractInfo.invoicedSumPrice">
                                        <span>￥{{this.formalContractInfo.invoicedSumPrice | formatPrice}}</span>
                                    </div>
                                </i-col>
                            </Row>
                        </div>
                        <div style="margin-top: 25px">
                            <Row :gutter="16">
                                <i-col span="10">
                                    <div id="receivableStateGauge" style="width: 160px;height: 160px;left: 50%;margin-left: -80px"></div>
                                </i-col>
                                <i-col span="14">
                                    <div style="margin-top: 50px" :title="'￥' + this.formalContractInfo.signedContractSumPrice">
                                        <span class="formal-contract-title">合约总额</span>
                                        <span class="formal-contract-content">￥{{this.formalContractInfo.signedContractSumPrice | formatPrice}}</span>
                                    </div>
                                    <div :title="'￥' + this.formalContractInfo.receiptSumPrice">
                                        <span class="formal-contract-title">实收</span>
                                        <span class="formal-contract-content">￥{{this.formalContractInfo.receiptSumPrice | formatPrice}}</span>
                                    </div>
                                </i-col>
                            </Row>
                        </div>
                    </div>
                </div>
            </i-col>
            <!-- 解约合约 -->
            <i-col span="8">
                <div class="contract-module">
                    <div class="contract-module-content">
                        <div>
                            <span class="contract-module-head">解约合约</span>
                            <Select size="small" v-model="terminationCurrent" class="contract-module-head-right" @on-change="getTerminationContractInfo">
                                <Option v-for="item in queryType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                        <div style="margin-top: 55px">
                            <div id="terminationPie" style="width: 240px;height: 210px;margin-left: 50px"></div>
                        </div>
                        <div style="position: relative;top: -220px;left: 190px;">
                            <div :title="'￥' + terminationContractInfo.contractSumPrice">
                                <span class="termination-contract-title">￥{{terminationContractInfo.contractSumPrice | formatPrice}}</span>
                                <span class="termination-contract-content">原合约总额</span>
                            </div>
                            <div :title="'￥' + terminationContractInfo.terminationContractSumPrice">
                                <span class="termination-contract-title">￥{{terminationContractInfo.terminationContractSumPrice | formatPrice}}</span>
                                <span class="termination-contract-content">解约结算总额</span>
                            </div>
                        </div>
                    </div>
                </div>
            </i-col>
        </Row>
    </div>
</template>
<script>
    import ICol from "../../../../node_modules/iview/src/components/grid/col.vue";
    import echarts from 'echarts';

    export default {
        components: {ICol},
        created: function () {
            this.getFormalMonth();
            this.getNotSignInfo();
            this.getFormalContractInfo(1);
            this.getTerminationContractInfo(1);
        },
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
                var index = num.indexOf(".");
                let cents = 0;
                if(index > 0){
                    cents = num.substring(index+1,num.length);
                    num = num.substring(0,index);
                }
                // 补足小数位到指定的位数
                while(cents.length<cent){
                    cents = "0" + cents;
                }
                if(isThousand) {
                    // 对整数部分进行千分位格式化.
                    var isPositiveNumber = true;//是否正数
                    if(num < 0){
                        isPositiveNumber = false;
                        num = num.substring(1,num.length);
                    }
                    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
                        num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
                    }
                    if(!isPositiveNumber){
                        num = "-" + num;
                    }
                }
                var finallyPrice = "";
                if (cents == 0) {
                    finallyPrice = num;
                } else {
                    finallyPrice = num + '.' + cents;
                }
                if(finallyPrice && finallyPrice.length > 13){
                    return finallyPrice.substring(0,12) + "..." ;
                }else{
                    return (finallyPrice);
                }
            },
        },
        data () {
            return {
                isFormalCurrentMonth: true,
                formalCurrent: 1,
                isTerminationCurrentMonth: true,
                terminationCurrent: 1,
                queryType:[],
                dataStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                    }
                },
                placeHolderStyle: {
                    normal: {
                        color: '#f1f2f7',
                        label: {
                            show: true
                        },
                    },
                    emphasis: {
                        color: '#f1f2f7'
                    }
                },
                placeTransparentStyle: {
                    normal: {
                        color: 'white',
                        label: {
                            show: true
                        },
                    },
                },
                notSignInfo: {},
                formalContractInfo: {},
                terminationContractInfo: {},
            }
        },
        methods: {
            getNotSignInfo () {
                this.request({
                    url: "/signCloud/report/getNotSignInfo.do"
                }).then(data => {
                    if(data){
                        this.notSignInfo = data;
                    }
                });
            },
            getFormalMonth(){
                this.request({
                    url: "/signCloud/report/getMonth.do",
                }).then(data => {
                    this.$set(this, "queryType", [
                        {value:1,label:"当月（"+data+"月）"},
                        {value:0,label:"历史"}
                    ])
                });
            },
            getFormalContractInfo (param) {
                if(param == 1){
                    this.isFormalCurrentMonth = true;
                }else{
                    this.isFormalCurrentMonth = false;
                }
                this.request({
                    url: "/signCloud/report/getFormalContractInfo.do",
                    param: {
                        isCurrentMonth: this.isFormalCurrentMonth
                    }
                }).then(data => {
                    if(data){
                        this.formalContractInfo = data;
                        if(data.signedContractSumPrice != 0){
                            let receivableState = data.receiptSumPrice/data.signedContractSumPrice*100;
                            if(data.receiptSumPrice >= data.signedContractSumPrice){
                                receivableState = 100.00;
                            }else{
                                receivableState = receivableState.toFixed(2);
                            }
                            this.drawGauge(receivableState);
                        }else{
                            this.drawGauge(0);
                        }
                    }
                });
            },
            getTerminationContractInfo (param) {
                if(param == 1){
                    this.isTerminationCurrentMonth = true;
                }else{
                    this.isTerminationCurrentMonth = false;
                }
                this.request({
                    url: "/signCloud/report/getTerminationContractInfo.do",
                    param: {
                        isCurrentMonth: this.isTerminationCurrentMonth
                    }
                }).then(data => {
                    if(data){
                        this.terminationContractInfo = data;
                        this.drawPie(data);
                    }
                });
            },
            drawGauge(receivableState){
                this.$nextTick(()=>{
                    this.charts = echarts.init(document.getElementById("receivableStateGauge"),'macarons')
                    this.charts.clear();
                    this.charts.setOption({
                        backgroundColor: '#fff',
                        tooltip : {
                            formatter: "{a} <br/>{c} {b}"
                        },
                        series : [
                            {
                                name: '实收',
                                type: 'gauge',
                                z: 3,
                                min: 0,
                                max: 100,
                                splitNumber: 10,
                                radius: '100%',
                                axisLine: {            // 坐标轴线
                                    lineStyle: {       // 属性lineStyle控制线条样式
                                        width: 5,
                                        color: [
                                            [0.2, '#2DC6C8'],
                                            [0.8, '#5AB1EF'],
                                            [1, '#D87A80']
                                        ]
                                    }
                                },
                                axisTick: {            // 坐标轴小标记
                                    length: 10,        // 属性length控制线长
                                    lineStyle: {       // 属性lineStyle控制线条样式
                                        color: 'auto'
                                    },
                                    axisLabel: {
                                        fontSize: 12
                                    }
                                },
                                pointer: {
                                    width: 4
                                },
                                splitLine: {           // 分隔线
                                    length: 15,         // 属性length控制线长
                                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                        color: 'auto'
                                    }
                                },
                                title : {
                                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                        fontWeight: 'bolder',
                                        fontSize: 12,
                                    }
                                },
                                detail: {
                                    fontSize: 14,
                                    formatter:'{value}%',
                                },
                                data:[{value: receivableState, name: '收款情况'}]
                            }
                        ]
                    }, true);
                });
            },
            drawPie (param) {
                let tempPlaceHolderStyle = this.placeHolderStyle;
                let contractColorRatio = 0.7;
                let contractTransparentRatio = 0;
                let terminationColorRatio = 0.7;
                let terminationTransparentRatio = 0;
                if(param.terminationContractSumPrice <= 0){
                    terminationColorRatio = 0;
                    terminationTransparentRatio = 0.7;
                    if(param.contractSumPrice == 0){
                        contractColorRatio = 0;
                        contractTransparentRatio = 0.7;
                    }else{
                        tempPlaceHolderStyle = this.placeTransparentStyle;
                    }
                }else{
                    if(param.contractSumPrice <= 0){
                        contractColorRatio = 0;
                        contractTransparentRatio = 0.7;
                        terminationColorRatio = 0.7;
                        terminationTransparentRatio = 0;
                    }else{
                        contractColorRatio = 0.7;
                        contractTransparentRatio = 0;
                        terminationColorRatio = param.terminationContractSumPrice/(param.contractSumPrice/0.7);
                        terminationTransparentRatio = 1 - 0.3 - terminationColorRatio;
                    }
                }
                this.$nextTick(()=>{
                    this.terminationPie = echarts.init(document.getElementById("terminationPie"),'macarons');
                    this.terminationPie.clear();
                    this.terminationPie.setOption({
                        backgroundColor: '#fff',
                        animation: false,
                        legendHoverLink: false,
                        color: ['#3AC7C8', '#B6A3DD'],
                        title: {
                            text: '解约合约\n\n' +  param.terminationContractCount,
                            x: 'center',
                            y: 'center',
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: 24,
                                color: "#5d5d5d",
                            }
                        },
                        series: [{
                            name: '原合约总额',
                            type: 'pie',
                            clockWise: false,
                            radius: ['85%','100%'],
                            itemStyle: this.dataStyle,
                            animation: false,
                            hoverAnimation: false,
                            data: [{
                                value: contractColorRatio,
                                name: '原合约总额'
                            }, {
                                value: contractTransparentRatio,
                                itemStyle: this.placeHolderStyle
                            },{
                                value: 0.3,
                                itemStyle: this.placeTransparentStyle
                            }]
                        }, {
                            name: '解约结算总额',
                            type: 'pie',
                            clockWise: false,
                            radius: ['70%', '85%'],
                            itemStyle: this.dataStyle,
                            hoverAnimation: false,
                            data: [{
                                value: terminationColorRatio,
                                name: '解约结算总额'
                            }, {
                                value: terminationTransparentRatio,
                                itemStyle: tempPlaceHolderStyle
                            },{
                                value: 0.3,
                                itemStyle: this.placeTransparentStyle
                            }]
                        }]
                    }, true);
                });
            },
        }
    }
</script>
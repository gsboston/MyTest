<template>
    <div class="container">
        <div class="center">
            <div class="title" style="">我的开票</div>
            <div class="content">
                <div style="display: inline;">
                    <Row>
                        <i-col :lg="14" :md="14" :sm="14">
                            <div style="padding-left:10px; padding-top:15px; display: inline-block; width:auto; font-weight: 700; font-size: 16px; color: #BBBBBB;">正常开票</div>
                        </i-col>
                        <i-col :lg="10" :md="10" :sm="10">
                            <div style="padding-left:10px; padding-top:15px; display: inline-block; width:auto; font-weight: 700; font-size: 16px; color: #BBBBBB;">异常处理</div>
                            <div style="display: inline-block; width: auto; float: right; padding-right: 10px; padding-top: 15px;">
                                <Select size="small" v-model="current" style="width:120px" @on-change="search">
                                    <Option v-for="item in queryType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </div>
                        </i-col>
                    </Row>

                </div>
                <Row style="padding-top: 15px;">
                    <i-col :lg="5" :md="5" :sm="5"  v-show="current == 0">
                        <div style="height: 250px; margin-left: 10px; margin-right: 10px; border: #F2F2F2 solid 1px;">
                            <div style="height:115px;">
                                <!--
                                <div style="height:65px; margin: 25px 0; text-align: center; width: 50%; float: left; ">
                                    <div style="color: #9B9B9B; font-size: 14px; padding: 0 15px 15px; font-weight: 700;">合约总数</div>
                                    <div style="color: #5D5D5D; font-size: 28px;">
                                        {{item.contractCount}}
                                    </div>
                                </div>
                                -->
                                <div style="height:65px; margin: 25px 0;border-left: 1px solid rgb(242, 242, 242);  text-align: center; width: 100%; float: left; ">
                                    <div style="color: #9B9B9B; font-size: 14px; padding:0 15px 15px; font-weight: 700;">开票合约数</div>
                                    <div style="color: #5D5D5D; font-size: 28px;">
                                        {{item.invoiceContractCount}}
                                    </div>
                                </div>
                            </div>
                            <div style="height:125px; margin: 10px; text-align: center;">
                                <div style="color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">可开票总额</div>
                                <div style="color: #5D5D5D; font-size: 28px;" :title="'￥' + item.invoicingPriceSum">
                                    ￥{{item.invoicingPriceSum | formatPrice}}
                                </div>
                            </div>
                        </div>
                    </i-col>
                    <i-col :lg="9" :md="9" :sm="9"  v-show="current == 0">
                        <div style="height: 250px; border: #F2F2F2 solid 1px;">
                            <div style="display:flex; height: 125px; border-bottom: #F2F2F2 solid 1px;text-align: center;">
                                <div style="width: 100%; background-color: #59b399;">
                                    <div style="color: white; margin-top: 10px; font-size: 14px; padding: 15px; font-weight: 700;">开票数/张</div>
                                    <div style="color: white; font-size: 28px; ">
                                        {{item.invoiceCount}}
                                    </div>
                                </div>
                            </div>
                            <div  class="invoiceNum" >
                                <div   class="invoiceAllNum" style="border-right: #F2F2F2 solid 1px;">
                                    <div  class="invoiceAllNumText">已开票总额</div>
                                    <div class="invoiceForehead"  style="color: #54B499" :title="'￥' + item.invoicedPriceSum">￥{{item.invoicedPriceSum | formatPrice}}</div>
                                </div>
                                <div  class="invoiceAllNum">
                                    <div  class="invoiceAllNumText" >待开票总额</div>
                                    <div class="invoiceForehead"  style="color:#F28390" :title="'￥' + item.waitInvocedSum" >￥{{item.waitInvocedSum | formatPrice}}</div>
                                </div>
                            </div>
                        </div>
                    </i-col>
                    <i-col :lg="14" :md="14" :sm="14" v-show="current == 1">
                        <row>
                            <i-col :lg="14" :md="14" :sm="14" offset="5">
                                <div style="height: 250px; margin-left: 10px;">
                                    <div style="display:flex; height: 125px;text-align: center;">
                                        <div style="width: 100%; background-color: #59b399;">
                                            <div style="color: white; font-size: 14px; margin-top: 10px; padding: 15px; font-weight: 700;">开票数/张</div>
                                            <div style="color: white; font-size: 28px; ">
                                                {{item.invoiceCount}}
                                            </div>
                                        </div>
                                    </div>
                                    <div  class="invoiceNum">
                                        <div   class="invoiceAllNum"  style="width: 100%" >
                                            <div  class="invoiceAllNumText">已开票总额</div>
                                            <div class="invoiceForehead"  style="color: #54B499" :title="'￥' + item.invoicedPriceSum">￥{{item.invoicedPriceSum | formatPrice}}</div>
                                        </div>
                                    </div>
                                </div>
                            </i-col>
                        </row>
                    </i-col>

                    <i-col :lg="5" :md="5" :sm="5">
                        <div class="collected" style="margin-right: 0">
                            <div class="collectedBorder" style="border-right:0">
                                <div class="collectedInner"  style="border-right: 1px solid #F2F2F2; margin-top: 30px">
                                    <div class="collectedText">冲红发票/张</div>
                                    <div class="collectedNum" >
                                        {{item.hedgeCount}}
                                    </div>
                                </div>
                                <div class="collectedInner" style="border-right: 1px solid #F2F2F2; margin-top: 4px; margin-bottom: 24px">
                                    <div class="collectedText" style="padding-top: 20px">冲红总额</div>
                                    <div class="collectedNum" :title="'￥' + item.hedgeSum">
                                        ￥{{item.hedgeSum | formatPrice}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </i-col>
                    <i-col :lg="5" :md="5" :sm="5" >
                        <div class="collected" style="margin-left: 0; ">
                            <div class="collectedBorder" style="border-left:0;">
                                <div  class="collectedInner"  style="border-right: 0;margin-top: 30px">
                                    <div  class="collectedText">作废发票/张</div>
                                    <div class="collectedNum" >
                                        {{item.abolishedCount}}
                                    </div>
                                </div>
                                <div  class="collectedInner"  style="border-right: 0;margin-bottom: 24px; margin-top: 4px">
                                    <div  class="collectedText" style="padding-top: 20px">作废总额</div>
                                    <div class="collectedNum" :title="'￥' + item.abolishedSum">
                                        ￥{{item.abolishedSum | formatPrice}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </i-col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                queryType:[],
                current: 1,
                item: {
                    abolishedCount:0,
                    abolishedSum:23,
                    contractCount:21,
                    hedgeCount:0,
                    hedgeSum:0,
                    invoiceCount:0,
                    invoicedPriceSum:0,
                    invoicingPriceSum:0,
                    waitInvocedSum:0,
                },
            }
        },
        created: function () {
            this.getMonth();
            this.search();
        },
        mounted:function(){
        },
        filters: {
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
        components: {
        },
        methods: {
            getMonth(){
                this.request({
                    url: "/signCloud/report/getInvoiceMonth.do",
                }).then(data => {
                    this.$set(this, "queryType", [
                        {value:1,label:"当月（"+data+"月）"},
                        {value:0,label:"历史"}
                    ])
                });
            },
            search() {
                this.request({
                    url: "/signCloud/report/contractInvoiced.do",
                    param:{
                        date: this.current == 1 ? 'MONTH' : 'HISTORY'
                    }
                }).then(data => {
                    this.item = data;
                });
            }
        },
    }
</script>

<style scoped>
    .container {
        padding-top: 10px;
        background: #f6f6f6;
        height: auto;
    }
    .center {
        padding-left: 45px;
        padding-right: 45px;
    }
    .title {
        line-height: 1;
        display: flex;
        padding-left: 10px;
        padding-bottom: 15px;
        white-space: nowrap;
        font-weight:700;
        font-size:16px;
        color: #59b399;
        background: #f6f6f6;
    }
    .content {
        background: #FFFFFF;
        height: 315px;
        box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.55);
    }
    .collectedBorder{
        border: 1px solid #F2F2F2;
    }
    .invoiceNum{
        display: flex; text-align: center;
    }
    .invoiceAllNum{
        width: 50%;height: 85px; margin: 20px 0; text-align: center;
    }
    .invoiceAllNumText{
        color: rgb(155, 155, 155); font-size: 14px; padding: 5px 0 15px; font-weight: 700;
    }
    .invoiceForehead{
        color: rgb(93, 93, 93); font-size: 28px;
    }
    .collected{
        height: 250px; margin-left: 10px; margin-right: 10px; text-align: center;
    }
    .collectedNum{
        color: #5D5D5D; font-size: 28px; padding-top: 15px;
    }
    .collectedInner{
        height: 95px; border-right: #F2F2F2 solid 1px;
        border-bottom: 0;
        border-top: 0;
    }
    .collectedText{
        color: #9B9B9B; font-size: 14px;  font-weight: 700;
    }
    .gray {
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);

        filter: grayscale(100%);

        filter: gray;
    }
</style>
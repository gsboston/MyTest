<template>
    <div class="container">
        <div class="center">
            <div class="title" style="">我的收款</div>
            <div class="content">
                <div style="display: inline;">
                    <div style="padding-left:10px; padding-top:15px; display: inline-block; width:auto; font-weight: 700; font-size: 16px; color: #BBBBBB;">收款统计</div>
                    <div style="display: inline-block; width: auto; float: right; padding-right: 10px; padding-top: 15px;">
                        <Select class="sele" size="small" v-model="current" style="width:120px; position: relative;" @on-change="search">
                            <Option v-for="type in queryType" :value="type.value" :key="type.value">{{ type.label }}</Option>
                        </Select>
                    </div>
                </div>
                <Row style="padding-top: 15px;">
                    <Col :lg="8" :md="8" :sm="8">
                        <div style="height: 250px; margin-left: 10px; margin-right: 10px; border: #F2F2F2 solid 1px;">
                            <div style="display:flex; width: 100%; height: 250px; text-align: center;">
                                <div style="display:block;width: 50%; margin-top:70px; margin-bottom: 10px; border-right: #F2F2F2 solid 1px;">
                                    <div style="width:100%;color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">收款合约数</div>
                                    <div style="color: #5D5D5D; font-size: 20px;">
                                        {{item.contract_num}}
                                    </div>
                                </div>
                                <div style="display:block;width: 50%; margin-top:70px; margin-bottom: 10px;">
                                    <div style="width:100%;color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">收款笔数</div>
                                    <div style="color: #5D5D5D; font-size: 20px;">
                                        {{item.sum_receipt_num}}
                                    </div>
                                </div>
                            </div>
                            <!--<div style="height:125px; margin: 10px; text-align: center;">-->
                                <!--<div style="color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">应收总额</div>-->
                                <!--<div style="color: #5D5D5D;" :style="(item.receivable_price+'').length>9?'font-size: 24px;':'font-size: 28px;'">-->
                                    <!--￥{{item.receivable_price | formatPrice}}-->
                                <!--</div>-->
                            <!--</div>-->
                        </div>
                    </Col>
                    <Col :lg="16" :md="16" :sm="16">
                        <div style="height: 250px; border: #F2F2F2 solid 1px; margin-right: 10px;">
                            <div style="display:flex; height: 115px; border-bottom: #F2F2F2 solid 1px;text-align: center;">
                                <div style="width: 50%; background-color: #59b399;">
                                    <div style="color: white; font-size: 14px; padding: 15px; font-weight: 700;">实收总额</div>
                                    <div style="color: white; font-size: 28px; ">
                                        ￥{{item.sum_receipt_price | formatPrice}}
                                    </div>
                                </div>
                                <div style="display:flex; width: 50%; height: 115px;">
                                    <div style="width: 50%; margin-top:10px; margin-bottom: 10px; border-right: #F2F2F2 solid 1px;">
                                        <div style="color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">减免总额</div>
                                        <div style="color: #5D5D5D; font-size: 20px;">
                                            ￥{{item.sum_reduction_price | formatPrice}}
                                        </div>
                                    </div>
                                    <div style="width: 50%; margin-top:10px; margin-bottom: 10px;">
                                        <div style="color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">优惠总额</div>
                                        <div style="color: #5D5D5D; font-size: 20px;">
                                            ￥{{item.sum_benefit_price | formatPrice}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex; text-align: center;">
                                <div style="width: 20%;">
                                    <div style="padding-top: 30px;">
                                        <img width="30" height="30" class="gray" src="../../../static/collection/cash-grey.png"/>
                                    </div>
                                    <div style="font-size: 18px; color: #5D5D5D;">{{item.cash_percent}}</div>
                                    <div style="font-size: 12px; color: #9B9B9B;">现金</div>
                                </div>
                                <div style="width: 20%;">
                                    <div style="padding-top: 30px;">
                                        <img width="30" height="30" class="gray" src="../../../static/collection/transfer-grey.png"/>
                                    </div>
                                    <div style="font-size: 18px; color: #5D5D5D;">{{item.transfer_percent}}</div>
                                    <div style="font-size: 12px; color: #9B9B9B;">对公转账</div>
                                </div>
                                <div style="width: 20%;">
                                    <div style="padding-top: 30px;">
                                        <img width="30" height="30" class="gray" src="../../../static/collection/check-grey.png"/>
                                    </div>
                                    <div style="font-size: 18px; color: #5D5D5D;">{{item.check_percent}}</div>
                                    <div style="font-size: 12px; color: #9B9B9B;">支票</div>
                                </div>
                                <div style="width: 20%;">
                                    <div style="padding-top: 30px;">
                                        <img width="30" height="30" class="gray" src="../../../static/collection/wxpay-grey.png"/>
                                    </div>
                                    <div style="font-size: 18px; color: #5D5D5D;">{{item.wechat_percent}}</div>
                                    <div style="font-size: 12px; color: #9B9B9B;">微信支付</div>
                                </div>
                                <div style="width: 20%;">
                                    <div style="padding-top: 30px;">
                                        <img width="30" height="30" class="gray" src="../../../static/collection/alipay-grey.png"/>
                                    </div>
                                    <div style="font-size: 18px; color: #5D5D5D;">{{item.alipay_percent}}</div>
                                    <div style="font-size: 12px; color: #9B9B9B;">支付宝支付</div>
                                </div>
                            </div>
                        </div>
                    </Col>
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
                    sum_benefit_price: 0,
                    cash_percent: "0.00%",
                    check_percent: "0.00%",
                    contract_num: "0",
                    wechat_percent: "0.00%",
                    transfer_percent: "0.00%",
                    sum_price: 0,
                    sum_receipt_price: 0,
                    sum_reduction_price: 0,
                    sum_pending_price: 0,
                    alipay_percent: "0.00%"
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
                    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
                        num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
                    }
                }

                if (cent > 0) {
                    return (num + '.' + cents);
                } else {
                    return num;
                }
            },
        },
        components: {
        },
        methods: {
            getMonth(){
                this.request({
                    url: "/signCloud/report/getMonth.do",
                }).then(data => {
                    this.$set(this, "queryType", [
                        {value:1,label:"当月（"+data+"月）"},
                        {value:0,label:"历史"}
                    ])
                });
            },
            search() {
                this.request({
                    url: "/signCloud/report/collectionReport.do",
                    param:{
                        current: this.current
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
        background: #f6f6f6;
    }
    .center {
        padding-top: 15px;
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
    .gray {
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);

        filter: grayscale(100%);

        filter: gray;
    }
</style>
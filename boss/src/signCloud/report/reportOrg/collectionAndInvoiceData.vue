<style scoped>
    .container {
        padding: 12px 15px;
        background-color: white;
        margin-top: 20px;
        box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.55);
        height: 315px;
    }
    /*.center {*/
        /*padding-top: 15px;*/
        /*padding-left: 45px;*/
        /*padding-right: 45px;*/
    /*}*/
    .contract-title{
        padding: 10px;
        font-size: 16px;
        color: #59b399;
        font-weight: bold;
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
        /*box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.55);*/
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
<template>
    <div style="display: inline-flex; width: 100%;">
        <div class="container" style="width: 55%">
            <div class="center">
                <div class="contract-title">
                    <span>收款数据</span>
                </div>
                <div class="content">
                    <div style="height: 250px; border: #F2F2F2 solid 1px;">
                        <div style="display:flex; height: 115px; margin-right: 10px; border-bottom: #F2F2F2 solid 1px;text-align: center;">
                            <div style="width: 50%; background-color: #59b399;">
                                <div style="color: white; font-size: 14px; padding: 15px; font-weight: 700;">实收总额</div>
                                <div style="color: white; font-size: 28px; ">
                                    ￥{{contractData.receipt_contract_price | formatPrice}}
                                </div>
                            </div>
                            <div style="display:flex; width: 50%; height: 115px;">
                                <div style="width: 50%; margin-top:10px; margin-bottom: 10px; border-right: #F2F2F2 solid 1px;">
                                    <div style="color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">减免总额</div>
                                    <div style="color: #5D5D5D; font-size: 20px;">
                                        ￥{{contractData.reduction_contract_price | formatPrice}}
                                    </div>
                                </div>
                                <div style="width: 50%; margin-top:10px; margin-bottom: 10px;">
                                    <div style="color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">优惠总额</div>
                                    <div style="color: #5D5D5D; font-size: 20px;">
                                        ￥{{contractData.benefit_contract_price | formatPrice}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; text-align: center;">
                            <div style="width: 20%;">
                                <div style="padding-top: 30px;">
                                    <img width="30" height="30" class="gray" src="../../../../static/collection/cash-grey.png"/>
                                </div>
                                <div style="font-size: 18px; color: #5D5D5D;">{{contractData.cash_percent}}</div>
                                <div style="font-size: 12px; color: #9B9B9B;">现金</div>
                            </div>
                            <div style="width: 20%;">
                                <div style="padding-top: 30px;">
                                    <img width="30" height="30" class="gray" src="../../../../static/collection/transfer-grey.png"/>
                                </div>
                                <div style="font-size: 18px; color: #5D5D5D;">{{contractData.transfer_percent}}</div>
                                <div style="font-size: 12px; color: #9B9B9B;">对公转账</div>
                            </div>
                            <div style="width: 20%;">
                                <div style="padding-top: 30px;">
                                    <img width="30" height="30" class="gray" src="../../../../static/collection/check-grey.png"/>
                                </div>
                                <div style="font-size: 18px; color: #5D5D5D;">{{contractData.check_percent}}</div>
                                <div style="font-size: 12px; color: #9B9B9B;">支票</div>
                            </div>
                            <div style="width: 20%;">
                                <div style="padding-top: 30px;">
                                    <img width="30" height="30" class="gray" src="../../../../static/collection/wxpay-grey.png"/>
                                </div>
                                <div style="font-size: 18px; color: #5D5D5D;">{{contractData.wechat_percent}}</div>
                                <div style="font-size: 12px; color: #9B9B9B;">微信支付</div>
                            </div>
                            <div style="width: 20%;">
                                <div style="padding-top: 30px;">
                                    <img width="30" height="30" class="gray" src="../../../../static/collection/alipay-grey.png"/>
                                </div>
                                <div style="font-size: 18px; color: #5D5D5D;">{{contractData.alipay_percent}}</div>
                                <div style="font-size: 12px; color: #9B9B9B;">支付宝支付</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container" style="width: 45%; margin-left: 10px;">
            <div class="center">
                <div class="contract-title">
                    <span>开票数据</span>
                </div>
                <div class="content">
                    <div style="height: 250px; border: #F2F2F2 solid 1px;">
                        <div style="display:flex; height: 115px; margin-right: 10px;text-align: center;">
                            <div style="width: 50%; background-color: #59b399;">
                                <div style="color: white; font-size: 14px; padding: 15px; font-weight: 700;">开票数/张</div>
                                <div style="color: white; font-size: 28px; ">
                                    {{contractData.invoiced_total_num}}
                                </div>
                            </div>
                            <div style="display:flex; width: 50%; height: 115px;">
                                <div style="width: 50%; margin-top:10px; border-right: #F2F2F2 solid 1px;">
                                    <div style="color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">冲红发票/张</div>
                                    <div style="color: #5D5D5D; font-size: 20px;">
                                        {{contractData.invoiced_hedge_num}}
                                    </div>
                                </div>
                                <div style="width: 50%; margin-top:10px;">
                                    <div style="color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">作废发票/张</div>
                                    <div style="color: #5D5D5D; font-size: 20px;">
                                        {{contractData.invoiced_inval_num}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; height: 115px; text-align: center; margin-right: 10px; ">
                            <div style="width: 50%; padding-top: 10px;">
                                <div style="color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">已开票总额</div>
                                <div style="color: #59b399;font-size: 28px; ">
                                    ￥{{contractData.invoiced_total_price | formatPrice}}
                                </div>
                            </div>
                            <div style="display:flex; width: 50%; height: 115px;">
                                <div style="width: 50%; padding-top: 10px; margin-bottom: 10px; border-right: #F2F2F2 solid 1px;">
                                    <div style="color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">冲红总额</div>
                                    <div style="color: #5D5D5D; font-size: 20px;">
                                        ￥{{contractData.invoiced_hedge_price | formatPrice}}
                                    </div>
                                </div>
                                <div style="width: 50%; padding-top: 10px; margin-bottom: 10px;">
                                    <div style="color: #9B9B9B; font-size: 14px; padding: 15px; font-weight: 700;">作废总额</div>
                                    <div style="color: #5D5D5D; font-size: 20px;">
                                        ￥{{contractData.invoiced_inval_price | formatPrice}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        props: {
            contractData: null,
        },
        components: {ICol},
        filters: {
            formatPrice(num) {
                if (!num) {
                    return "0.00";
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
        data () {
            return{

            }
        },
        created: function () {

        },
        methods: {

        },
    }
</script>
<style scoped>
    .container-total-Contract{
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
    .contract-background{
        background-color: #F6FAF9;
    }
    .contract-content{
        text-align: center;
        padding-top: 21px;
        padding-bottom: 17px;
    }
    .contract-head-green-title{
        font-size: 14px;
        color: #59b399;
    }
    .contract-head-green-content{
        font-size: 28px;
        color: #59b399;
    }
    .contract-price:before{
        content: "";
        position: absolute;
        top: 21px;
        left: 0;
        bottom: 11px;
        width: 1px;
        background: #e5e5e5;
    }
    .contract-head-black-title{
        font-size: 14px;
        color: #a1a1a1;
    }
    .contract-head-black-content{
        font-size: 28px;
        color: #5d5d5d;
    }
    .main-body-num:before{
        content: "";
        position: absolute;
        top: 11px;
        left: 0;
        bottom: 11px;
        width: 1px;
        background: #e5e5e5;
    }
</style>
<template>
    <div class="container-total-Contract">
        <div class="contract-title">
            <span>合约总数</span>
        </div>
        <div>
            <Row>
                <i-col span="12">
                    <i-col offset="3" span="18">
                        <div class="contract-content contract-background">
                            <div class="contract-head-green-title">
                                <span>合约数</span>
                            </div>
                            <div class="contract-head-green-content">
                                <span>{{contract.contract_num}}</span>
                            </div>
                        </div>
                        <div v-if="this.isShow == 'all'" class="contract-content">
                            <i-col span="12">
                                <div class="contract-head-black-title"><span>销售合约数</span></div>
                                <div class="contract-head-black-content"><span>{{contract.xs_contract_num}}</span></div>
                            </i-col>
                            <i-col span="12" class="main-body-num">
                                <div class="contract-head-black-title"><span>作为签约主体合约数</span></div>
                                <div class="contract-head-black-content"><span>{{contract.csb_contract_num}}</span></div>
                            </i-col>
                        </div>
                    </i-col>
                </i-col>
                <i-col span="12" class="contract-price">
                    <i-col offset="3" span="18">
                        <div class="contract-content contract-background">
                            <div class="contract-head-green-title">
                                <span>合约总额</span>
                            </div>
                            <div class="contract-head-green-content">
                                <span>￥{{contract.total_contract_price | formatPrice}}</span>
                            </div>
                        </div>
                        <div v-if="this.isShow == 'all'" class="contract-content">
                            <i-col span="12">
                                <div class="contract-head-black-title"><span>销售合约金额</span></div>
                                <div class="contract-head-black-content"><span>￥{{contract.xs_contract_price | formatPrice}}</span></div>
                            </i-col>
                            <i-col span="12" class="main-body-num">
                                <div class="contract-head-black-title"><span>作为签约主体的合约金额</span></div>
                                <div class="contract-head-black-content"><span>￥{{contract.csb_contract_price | formatPrice}}</span></div>
                            </i-col>
                        </div>
                    </i-col>
                </i-col>
            </Row>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        props: {
            flag: null,
            contractData: null
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
            flag(value) {
                this.isShow = value;
            },
            contractData(value) {
                this.contract = value;
            },
        },
        data () {
          return{
              isShow: "all",
              contract: {},
          }
        },
        created: function () {

        },
        methods: {

        },
    }
</script>
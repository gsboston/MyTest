<style scoped>
    #conllectionView .ivu-input-wrapper > .ivu-input {
        font-size: 12px;
        color: rgb(51,51,51);
        font-weight: bold;
    }

    #conllectionView .ivu-form-item-label {
        font-size: 14px;
        color: rgb(105,105,105);
    }
    #conllectionView .ivu-alert-info {
        border: 0px solid #d5e8fc;
        border-top: 1px solid #d5f1fc;
        border-bottom: 1px solid #d5f1fc;
        background-color: #eafef9;
    }

    #conllectionView .ivu-alert {
        border-radius: 0px;
        line-height: 38px;
    }
    [conllectionAlert] .ivu-icon {
        color: #59b399;
    }
</style>

<template>
    <div id="conllectionView" style="padding-top: 20px;">
        <Row class="top-info" style="">
            <i-col :xs="12" :sm="12" :md="12" :lg="7" style="display: inline-block;">
                <span>待收金额</span>
                <b><span>￥</span>{{ receivableInfo.receivedPrice ? receivableInfo.receivedPrice.toFixed(2) : 0.00}}</b>
            </i-col>
            <i-col :xs="12" :sm="12" :md="12" :lg="5" style="display: inline-block;">
                <span>已收金额</span>
                <b><span>￥</span>{{receivableInfo.receiptPrice ? receivableInfo.receiptPrice.toFixed(2) : '0.00'}}</b>
            </i-col>
            <i-col :xs="12" :sm="12" :md="12" :lg="6" style="display: inline-block;">
                <span>合约总额</span>
                <b><span>￥</span>{{ receivableInfo.price ? receivableInfo.price.toFixed(2) : 0.00 }}</b>
            </i-col>
            <i-col :xs="12" :sm="12" :md="12" :lg="6" style="display: inline-block;">
                <span>支付类型</span>
                <b>{{receivableInfo.pamentType}}</b>
            </i-col>
        </Row>
        <div class="tab-button-bar">
            <div :class="tabStatus == 2 ? 'tab-button active' : 'tab-button'" @click="checkTab(2)">
                <span>收款记录</span>
            </div>
            <div :class="tabStatus == 1 ? 'tab-button active' : 'tab-button'" @click="checkTab(1)">
                <span>收款计划</span>
            </div>
        </div>
        <Row v-if="tabStatus==1">
            <ul style="border-top: 1px solid #e8e8e8" v-if="receivables.length>0">
                <li style="height: 54px; line-height: 54px; border-bottom: 1px solid #e8e8e8;" v-for="(receivable, index) in receivables" :key="index">
                    <div style="display: inline-block; padding-left: 46px; margin-right: 25px; font-size: 14px; color: rgb(51,51,51);"><b>{{receivable.title}}</b></div>
                    <div style="display: inline-block; font-size: 14px; color: rgb(51,51,51);"><b>计划收款　　 ￥ {{ receivable.price ? receivable.price.toFixed(2) : 0.00 }}</b></div>
                    <div v-if="receivable.tsReceive!=''" style="display: inline-block; float: right;  padding-right: 50px; font-size: 12px; color: rgb(153,153,153);"><span style="padding-right: 10px;">应收款日</span><span>{{receivable.tsReceive}}</span></div>
                </li>
            </ul>
            <Alert conllectionAlert show-icon v-else class="custom-alert">暂无待收款项</Alert>
        </Row>
        <div v-if="tabStatus==2">
            <div style="width: 100%; display:table; height: 54px; border-top: 1px solid #e8e8e8;" v-for="(receipt, index) in receipts" :key="index">
                <div style="display: table-row;">
                    <div style="display: table-cell; width: 100%">
                        <div style="display: table;">
                            <div style="display: table-cell; width: 210px; font-size: 14px;"><span style="display:inline-block; padding-top:15px; padding-left: 46px;">收款日</span><span style="display:inline-block; padding-top:15px; padding-left: 15px;">{{receipt.tsReceipt.substring(0,10)}}</span></div>
                            <div style="display: table-cell; width: 200px; font-size: 14px; color: rgb(51,51,51);"><span style="padding-left: 30px;"><b>应收 ￥ {{receipt.receivablePrice ? receipt.receivablePrice.toFixed(2) : 0.00 }}</b></span></div>
                            <div style="display: table-cell; width: 120px; font-size: 14px; color: rgb(51,51,51);">优惠 ￥ {{receipt.benefitPrice ? receipt.benefitPrice.toFixed(2) : 0.00 }}</div>
                            <div style="display: table-cell; width: 120px; font-size: 14px; color: rgb(51,51,51);"><span v-if="receipt.reductionType!=1">减免</span><span v-else>加收</span> ￥ {{receipt.reductionPrice.toFixed(2)}}</div>
                            <div style="display: table-cell; text-align: center; font-size: 14px; color: rgb(51,51,51); vertical-align: middle;">
                                <Tooltip :content="receipt.type" placement="top" style="position: relative;">
                                    <img v-if="receipt.type=='现金'" src="/static/collection/cash.png" style="width:18px; height:18px; margin-top: 4px;" :title="receipt.type" />
                                    <img v-if="receipt.type=='对公转账'" src="/static/collection/transfer.png" style="width:18px; height:18px; margin-top: 4px;" :title="receipt.type" />
                                    <img v-if="receipt.type=='支票'" src="/static/collection/check.png" style="width:18px; height:18px; margin-top: 4px;" :title="receipt.type" />
                                    <img v-if="receipt.type=='微信'" src="/static/collection/wxpay.png" style="width:18px; height:18px; margin-top: 4px;" :title="receipt.type" />
                                    <img v-if="receipt.type=='支付宝'" src="/static/collection/alipay.png" style="width:18px; height:18px; margin-top: 4px;" :title="receipt.type" />
                                </Tooltip>
                            </div>
                            <div style="display: table-cell; width: 180px; text-align: right; font-size: 14px;"><span style="padding-right: 26px;"><b>实收 ￥ {{receipt.price ? receipt.price.toFixed(2) : 0.00 }}</b></span></div>
                        </div>
                    </div>
                </div>
                <div style="display: table-row;">
                    <div style="display: table-cell; width: 100%">
                        <div style="display: table; font-size: 12px; color: #666;padding-left: 45px; padding-right: 45px;">
                            收费说明：{{receipt.remark}}
                        </div>
                    </div>
                </div>
            </div>
            <Alert conllectionAlert show-icon v-if="receipts.length==0" class="custom-alert">暂无已收款项记录</Alert>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props: {
            //合约主体ID
            contractId: null,
        },
        data() {
            return {
                tabStatus: 2,//默认选择待收款选项卡
                receivableInfo:{},//收款主体信息
                receivables:[],//待收款列表
                receipts:[],//已收款列表
            }
        },
        created: function() {

            //获取收款主体信息
            this.getReceivableInfo();

            //获取待收款列表
            this.getReceivables();

            //获取已收款列表
            this.getReceipts();

        },
        methods: {
            /**
             * 切换选项卡
             */
            checkTab(status) {
                this.tabStatus = status;
            },
            /**
             * 获取财务收款主体信息
             */
            getReceivableInfo() {
                this.request({
                    url: "/signCloud/collection/receivableInfo.do",
                    param: {
                        contractId: this.contractId
                    }
                }).then(data => {
                    this.receivableInfo = data;
                });
            },
            /**
             * 获取待收款列表
             */
            getReceivables() {
                this.request({
                    url: "/signCloud/collection/receivables.do",
                    param: {
                        contractId: this.contractId
                    }
                }).then(data => {
                    this.receivables = data;
                });
            },
            /**
             * 获取已收款列表
             */
            getReceipts() {
                this.request({
                    url: "/signCloud/collection/receipts.do",
                    param: {
                        contractId: this.contractId
                    }
                }).then(data => {
                    this.receipts = data;
                });
            },
        }
    };
</script>

<style scoped>
    .top-info {
        padding: 0 46px;
    }
    .top-info > div > span {
        font-size: 14px;
        color: #5c5c5c;
    }
    .top-info > div > b {
        font-size: 16px;
        color: #333;
        margin-left: 20px;
    }
    .top-info > div > b > span {
        font-size: 12px;
    }

    .tab-button-bar {
        padding: 20px 0 0 46px;
    }
    .tab-button {
        padding-top:5px;
        display: inline-block;
        width: 80px;
        height: 30px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        text-align: center;
        background-color: #eee;
        cursor: pointer;
    }
    .tab-button > span {
        font-size: 14px;
        color: rgb(153,153,153);
    }
    .tab-button.active {
        padding-top:5px;
        display: inline-block;
        width: 80px;
        height: 30px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        text-align: center;
        background-color: #59b399;
    }
    .tab-button.active > span {
        font-size: 14px;
        color: rgb(255,255,255);
    }
</style>
<template>
    <div style="padding: 20px 0;" class="main-div">
        <Row class="top-info" style="">
            <i-col span="7" style="display: inline-block;">
                <span>可申请金额</span>
                <b><span>￥</span>{{ contractPriceInfo ? contractPriceInfo.applyPrice : 0.00 }}</b>
            </i-col>
            <i-col span="5" style="display: inline-block;">
                <span>申请中金额</span>
                <b><span>￥</span>{{ contractPriceInfo ? contractPriceInfo.noneInvoicedPrice.toFixed(2) : 0.00 }}</b>
            </i-col>
        </Row>
        <Row>
            <i-col span="2" offset="1" class="row-title" v-if="isTermination">
                发票处理
            </i-col>
            <div class="tab-button-bar">
                <div :class="tabStatus == 1 ? 'tab-button active' : 'tab-button'" @click="checkTab(1)">
                    <span>开票记录</span>
                </div>
                <div v-if="auth && !auth.isMyContract" :class="tabStatus == 2 ? 'tab-button active' : 'tab-button'" @click="checkTab(2)">
                    <span>补登发票</span>
                </div>
                <div v-if="auth && auth.isMyContract && auth.isEditable" :class="tabStatus == 3 ? 'tab-button active' : 'tab-button'" @click="checkTab(3)">
                    <span>申请发票</span>
                </div>
            </div>
            <Row v-if="tabStatus == 1">
                <div v-if="invoiceDataList.length > 0" class="tab-panel">
                    <Timeline class="invoice-all-list">
                        <TimelineItem v-for="(item, index) in invoiceDataList" :key="index">
                            <p class="time">{{ (item.isInvoiced && item.isInvoiced=='0' ? item.tsRequest : item.invoicedDate) | formatDate }}</p>
                            <div class="content">
                                <div class="invoiced-price">
                                    <span>￥</span>
                                    {{item.invicedPrice ? item.invicedPrice : item.price }}
                                </div>
                                <div style="width: 100%;flex: 1;-ms-flex: 1;line-height: 23px;white-space: nowrap;">
                                    <Row :gutter="32" style="margin-bottom: 10px;">
                                        <i-col span="18">
                                            <span v-if="item.price" class="invoice-price">申请金额：￥{{item.price ? item.price : 0}}</span>
                                            <span v-else>无开票申请</span>
                                        </i-col>
                                        <i-col span="4" style="text-align: right;">
                                            <Button class="custom-button" size="small" @click="showInfo(item)">查看</Button>
                                        </i-col>
                                    </Row>
                                    <Row :gutter="32">
                                        <i-col span="12">
                                            <div>
                                                <span>{{item.invoiceBillsType == 'PAPER' ? '纸质发票' : '电子发票'}}</span>
                                                <span class="invoice-type">{{item.invoiceType == 'NORMAL' ? '普' : '专'}}</span>
                                                <span :title="item.invoiceNumber" style="margin-left: 10px;padding-left: 10px;border-left: 1px solid #eee;">票号：{{item.invoiceNumber}}</span>
                                            </div>
                                        </i-col>
                                        <i-col span="10" style="overflow: hidden;text-overflow: ellipsis;text-align: right;">
                                            <div class="invoice-info">
                                                <span :title="item.drawer" style="cursor: context-menu;">开票人：{{item.drawer}}</span>
                                            </div>
                                        </i-col>
                                        <i-col span="2" style="text-align: right;margin-top: -15px;" v-if="!auth.isMyContract && auth.B030602 && item.status == 'NORMAL'">
                                            <Checkbox v-model="item.checked" @on-change="selectInvoiceInfo(item, index, $event)"></Checkbox>
                                        </i-col>
                                    </Row>
                                    <div class="status-div" v-if="item.status">
                                        <span v-if="item.status == 'NORMAL'">正</span>
                                        <span v-else-if="item.status == 'INVALIDATED'">废</span>
                                        <span v-else-if="item.status == 'HEDGE'">冲</span>
                                    </div>
                                </div>
                            </div>
                        </TimelineItem>
                        <TimelineItem></TimelineItem>
                    </Timeline>
                    <Row v-if="!auth.isMyContract && auth.B030602 && allowOperateData.length>0">
                        <i-col span="24" style="text-align: right;padding-right: 30px;">
                            全选&emsp;<Checkbox v-model="isAllCheck" @on-change="checkAll"></Checkbox>
                        </i-col>
                    </Row>
                    <Row class="operate-btn" v-if="allowOperateData.length>0">
                        <i-col span="6" offset="4">
                            <Button type="ghost" v-if="!auth.isMyContract && auth.B030602" :disabled="!(mergeInvoiceList.length>0)" @click="invoiceInvalidated">作废</Button>
                        </i-col>
                        <i-col span="6" offset="4">
                            <Button type="primary" v-if="!auth.isMyContract && auth.B030602" @click="redInvoice" :disabled="!(mergeInvoiceList.length==1)">冲红</Button>
                        </i-col>
                    </Row>
                </div>
                <Alert conllectionAlert show-icon v-else class="custom-alert">暂无开票记录</Alert>
            </Row>
            <Row v-if="tabStatus == 2" class="tab-panel">
                <i-col span="22" offset="1">
                    <InvoiceCard :contractId="contractId" :currentUser="currentUser" pageType="new" :data="{}" @on-refresh="getInvoiceData"></InvoiceCard>
                </i-col>
            </Row>
            <Row v-if="tabStatus == 3" class="tab-panel">
                <i-col span="20" offset="1">
                    <ApplyInvoice :contractId="contractId" :currentUser="currentUser" :auth="auth" @on-refresh="getInvoiceData"></ApplyInvoice>
                </i-col>
            </Row>
        </Row>
    </div>
</template>

<script>
    import InvoiceCard from "./invoiceCard.vue";
    import ApplyInvoice from "./applyInvoice.vue";

    export default {
        components: {
            InvoiceCard,
            ApplyInvoice
        },
        data() {
            return {
                invoiceDataList: [],
                allowOperateData: [],
                isAllCheck: false,
                mergeInvoiceList: [],
                activePanel: 'invoiceList',
                mergeInvoiceNumbersList: [],
                mergePrice: 0,
                contractPriceInfo: null,

                tabStatus: 1,
            }
        },
        props: {
            contractId: null,
            currentUser: null,
            auth: {},
            refreshNum: 0,
            isTermination: false
        },
        filters: {
            formatDate(value) {
                if (value) {
                    let newDate = new Date(value);
                    if (newDate) {
                        let y = newDate.getFullYear();
                        let m = newDate.getMonth() + 1;
                        m = m < 10 ? '0' + m : m;
                        let d = newDate.getDate();
                        d = d < 10 ? ('0' + d) : d;
                        return y + '/' + m + '/' + d;
                    }
                }
                return value;
            }
        },
        watch: {
            refreshNum(value) {
                this.refreshNum = value;
                if (this.contractId) {
                    this.getInvoiceData();
                }
            },
            isTermination(value) {
                this.isTermination = value;
            }
        },
        created() {
            if (this.contractId) {
                this.getInvoiceData();
            }
        },
        methods: {
            getInvoiceData () {
                this.request({
                    url: "/signCloud/invoice/getInvoice.do",
                    param: {
                        contractId: this.contractId,
                        isInvoiced: (this.isTermination || this.auth.isMyContract) ? 1 : null
                    }
                }).then((data) => {
                    this.mergeInvoiceList = [];
                    this.mergeInvoiceNumbersList = [];
                    this.mergePrice = 0;
                    this.isAllCheck = false;
                    this.invoiceDataList = data.allData;
                    this.allowOperateData = data.allowOperateData;
                    this.getContractPriceInfo();
                });
            },
            getContractPriceInfo () {
                this.request({
                    url: "/signCloud/invoice/getPrice.do",
                    param: {
                        contractId: this.contractId
                    }
                }).then((data) => {
                    this.contractPriceInfo = Object.assign({}, data);
                    this.contractPriceInfo.applyPrice = this.contractPriceInfo.receiptPrice + this.contractPriceInfo.noneReceivablePrice - this.contractPriceInfo.invoicedPrice - this.contractPriceInfo.noneInvoicedPrice;
                    if (this.contractPriceInfo.applyPrice <= 0) {
                        this.contractPriceInfo.applyPrice = '0.00';
                    }else {
                        this.contractPriceInfo.applyPrice = this.contractPriceInfo.applyPrice.toFixed(2);
                    }
                    if (this.isTermination) {
                        //结算金额返回负数为退款，正数为补缴
                        this.contractPriceInfo.total = this.contractPriceInfo.receiptPrice + this.contractPriceInfo.terminationPrice;
                        //判断合约是否存在已收款
                        if (this.contractPriceInfo.receiptPrice == 0 && this.contractPriceInfo.terminationPrice < 0) {
                            this.contractPriceInfo.nullifyPrice = '0.00';
                            this.contractPriceInfo.allowInvoicePrice = '0.00';
                        }else {
                            this.contractPriceInfo.nullifyPrice = this.contractPriceInfo.invoicedPrice - this.contractPriceInfo.total;
                            if (this.contractPriceInfo.nullifyPrice > 0) {
                                this.contractPriceInfo.nullifyPrice = this.contractPriceInfo.nullifyPrice.toFixed(2);
                                this.contractPriceInfo.allowInvoicePrice = '0.00';
                            }else {
                                this.contractPriceInfo.allowInvoicePrice = (0 - this.contractPriceInfo.nullifyPrice).toFixed(2);
                                this.contractPriceInfo.nullifyPrice = '0.00';
                            }
                        }
                    }else {
                        this.contractPriceInfo.total = this.contractPriceInfo.receiptPrice + this.contractPriceInfo.noneReceivablePrice;
                        this.contractPriceInfo.nullifyPrice = '0.00';
                    }
                });
            },
            showInfo (item) {
                this.prompt({
                    title: '发票详情',
                    code: 'invoiceInfo',
                    props: {
                        invoiceId: item.id
                    },
                    width: 800,
                    height: 500,
                    callback: (flag, close) => {
                        if (flag) {
                            close();
                        }
                    }
                });
            },
            selectInvoiceInfo(item, index, event) {
                if (!event.constructor){
                    return;
                }
                this.$emit('change', item, index);

                if (arguments[2]) {
                    this.mergeInvoiceList.push(item.id);
                    this.mergeInvoiceNumbersList.push(item.invoiceNumber);
                    this.mergePrice += parseFloat(item.invicedPrice);
                }else {
                    var _index = this.mergeInvoiceList.indexOf(item.id);
                    if (_index > -1) {
                        this.mergeInvoiceList.splice(_index, 1);
                        this.mergeInvoiceNumbersList.splice(_index, 1);
                        this.mergePrice -= parseFloat(item.invicedPrice);
                    }
                }
                if (this.mergeInvoiceList.length == this.allowOperateData.length) {
                    this.isAllCheck = true;
                }else {
                    this.isAllCheck = false;
                }
            },
            checkAll(val) {
                let $self = this;
                if (val) {
                    this.mergeInvoiceList = [];
                    this.mergeInvoiceNumbersList = [];
                    this.mergePrice = 0;
                    this.invoiceDataList.forEach(function (item, index) {
                        $self.invoiceDataList[index].checked = true;
                        if($self.invoiceDataList[index].status == 'NORMAL') {
                            $self.mergeInvoiceList.push(item.id);
                            $self.mergeInvoiceNumbersList.push(item.invoiceNumber);
                            $self.mergePrice += parseFloat(item.invicedPrice);
                        }
                    });
                }else {
                    this.invoiceDataList.forEach(function (item, index) {
                        $self.invoiceDataList[index].checked = false;
                    });
                    this.mergeInvoiceList = [];
                    this.mergeInvoiceNumbersList = [];
                    this.mergePrice = 0;
                }
            },
            redInvoice() {
                this.prompt({
                    title: '发票冲红',
                    code: 'invoiceCard',
                    height: 460,
                    props: {
                        invoiceId: this.mergeInvoiceList[0],
                        currentUser: this.currentUser,
                        pageType: 'hedge'
                    },
                    callback: (flag, close) => {
                        if (flag){
                            this.getInvoiceData();
                            this.$emit('on-handle-refresh-status', this.contractId);
                        }
                        close();
                    }
                });
            },
            invoiceInvalidated() {
                this.prompt({
                    code: "nullifyInvoice",
                    title: "请填写发票作废原因",
                    width: 600,
                    height: 360,
                    props: {
                        invoiceInfo: {
                            ids: this.mergeInvoiceList,
                            mergeNumbers: this.mergeInvoiceNumbersList,
                            mergePrice: this.mergePrice
                        },
                    },
                    callback: (flag,close) => {
                        close();
                        if(flag){
                            this.getInvoiceData();
                            this.$emit('on-handle-refresh-status', this.contractId);
                        }
                    }
                });
            },
            checkTab(status) {
                this.tabStatus = status;
            },
        }
    }
</script>

<style scoped>
    .invoice-all-list .time {
        width: auto;
        margin-right: 10px;
        margin-bottom: 14px;
    }

    .invoice-all-list .content{
        position: relative;
        display: flex;
        align-items: center;
        padding: 8px 30px;
        background: #f7f7f7;
        width: 100%;
        height: 84px;
        color: #333;
        font-size: 14px;
    }

    .invoice-all-list .content>div {
        line-height: 20px;
    }

    .invoice-all-list .invoice-type {
        border: 1px solid #eee;
        margin-left: 10px;
        padding: 2px;
        border-radius: 5px;
        background: #59b399;
        color: #FFF;
    }

    .invoice-all-list .invoice-info {
        display: inline;
        padding-left: 30px;
    }

    .invoice-all-list .invoice-info span:first-child {
        display: inline-block;
    }

    .invoice-all-list >>> .ivu-timeline-item-head {
        width: 12px;
        height: 12px;
    }

    .invoice-all-list >>> .ivu-timeline-item-head-blue {
        background: #59b399;
        border-color: #59b399;
        color: #59b399;
    }

    .invoice-all-list >>> .invoice-all-list .ivu-timeline-item-content {
        display: block;
    }

    .invoice-all-list >>> .ivu-timeline-item:last-child .ivu-timeline-item-head {
        display: none;
    }

    .invoice-all-list >>> .prompt-container .show-info {
        margin: 5px 25px;
    }

    .invoice-all-list .ivu-timeline-item {
        padding: 0 0 30px 0;
    }

    .invoice-all-list .ivu-timeline-item:nth-last-child(2) {
        padding: 0;
    }

    .invoice-all-list .ivu-timeline-item >>> .ivu-timeline-item-content {
        padding: 0 0 0 26px;
    }

    .invoice-all-list .invoiced-price {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        padding-right: 20px;
        border-right: 1px solid #ccc;
        margin-right: 14px;
        line-height: 40px!important;
        min-width: 100px;
        text-align: center;
        white-space: nowrap;
    }

    .invoice-all-list .invoiced-price span{
        font-size: 14px;
    }

    .invoice-all-list .custom-button {
        background: transparent;
        color: #59b399;
        border: 0;
        font-size: 14px;
        font-weight: 600;
        line-height: 16px;
        border-bottom: 1px solid #59b399;
        border-radius: 0;
    }

    .invoiced-empty-list {
        height: 84px;
        text-align: center;
        color: #333;
        font-size: 16px;
        line-height: 84px;
    }

    .status-div {
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        height: 0;
        border-top: 50px solid #cccccc;
        border-left: 50px solid transparent;
    }

    .status-div span {
        position: absolute;
        top: -45px;
        left: -20px;
        color: #FFF;
        font-weight: 600;
    }

    .operate-btn {
        text-align: center;
        margin: 10px 0;
    }

    .operate-btn button {
        padding: 6px 45px;
    }

    .main-div >>> .ivu-tabs-nav {
        margin-left: 50%;
        transform: translate(-50%, 0);
    }

    .main-div >>> .ivu-tabs-nav .ivu-tabs-ink-bar{
        background-color: #59b399;
    }

    .main-div >>> .ivu-tabs-nav .ivu-tabs-tab-active {
        color: #59b399;
    }

    .main-div >>> .ivu-tabs-nav .ivu-tabs-tab:hover {
        color: #59b399;
    }

    .price-info >>> input {
        border: 1px solid #eee;
        border-radius: 0;
        height: 36px;
    }

    .price-info .price >>> input {
        border: 1px solid transparent;
        border-bottom: 1px solid #eee;
        border-radius: 0;
    }

    .price-info >>> .ivu-input-group-append, .price-info >>> .ivu-input-group-prepend {
        background-color: transparent;
        border: 0;
        border-bottom: 1px solid #eee;
        border-radius: 0;
    }

    .price-info .money-info {
        color: #a2a2a2;
        font-weight: 600;
        margin-top: 20px;
        margin-bottom: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
    }

    .price-info .money-info span:first-child{
        width: 100px;
        display: inline-block;
    }

    .price-info .money-info span:nth-child(2){
        color: #333333;
        font-weight: 700;
    }

    .row-title {
        font-size: 14px;
        font-weight: 600;
        line-height: 30px;
    }

    /*开票样式修改*/
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
    .main-div .custom-alert {
        position: relative;
        border: 1px solid #eee;
        background-color: initial;
        border-radius: 0;
        margin-bottom: 0;
    }
    .main-div .custom-alert > .ivu-alert-icon {
        top: 30PX;
    }
    .main-div .ivu-alert-info {
        border: 0px solid #d5e8fc;
        border-top: 1px solid #d5f1fc;
        border-bottom: 1px solid #d5f1fc;
        background-color: #eafef9;
    }
    .main-div .ivu-alert {
        border-radius: 0px;
        line-height: 38px;
    }
    [conllectionAlert] .ivu-icon {
        color: #59b399;
    }
    .tab-panel {
        padding: 20px 20px 0;
        border-top: 1px solid rgb(232, 232, 232);
    }
</style>
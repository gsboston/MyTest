<template>
    <div style="padding: 20px 0;" class="main-div">
        <Row class="price-info" v-if="isTermination">
            <i-col class="money-info normal" span="20" offset="2">
                <i-col span="11" offset="1">
                    <span>已开票金额：</span>
                    <span>￥{{ contractPriceInfo ? contractPriceInfo.invoicedPrice.toFixed(2) : '00000' }}</span>
                </i-col>
                <i-col span="11" offset="1">
                    <span>待作废金额：</span>
                    <span>￥{{ contractPriceInfo ? contractPriceInfo.nullifyPrice : '00000' }}</span>
                </i-col>
            </i-col>
        </Row>
        <Row>
            <i-col span="20" offset="2">
                <div v-if="invoiceDataList.length > 0">
                    <Timeline class="invoice-all-list">
                        <TimelineItem v-for="(item, index) in invoiceDataList" :key="index">
                            <p class="time">{{ (item.isInvoiced && item.isInvoiced=='0' ? item.tsRequest : item.invoicedDate) | formatDate }}</p>
                            <div class="content">
                                <div class="invoiced-price">
                                    <span>￥</span>
                                    {{item.invicedPrice ? item.invicedPrice : item.price }}
                                </div>
                                <div style="line-height: 23px;width: 100%;white-space: nowrap;">
                                    <Row :gutter="32" style="margin-bottom: 10px;">
                                        <i-col span="14">
                                            <span v-if="item.price" class="invoice-price">申请金额：￥{{item.price ? item.price : 0}}</span>
                                            <span v-else>无开票申请</span>
                                        </i-col>
                                        <i-col span="4" style="text-align: right;">
                                            <Button class="custom-button" size="small" @click="showInfo(item)">查看</Button>
                                        </i-col>
                                    </Row>
                                    <Row>
                                        <i-col span="10">
                                            <div style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
                                                <span>纸质发票</span>
                                                <span class="invoice-type">{{item.invoiceType == 'NORMAL' ? '普' : '专'}}</span>
                                                <span :title="item.invoiceNumber" style="cursor: context-menu;margin-left: 10px;padding-left: 10px;border-left: 1px solid #eee;">票号：{{item.invoiceNumber}}</span>
                                            </div>
                                        </i-col>
                                        <i-col span="8" style="overflow: hidden;text-overflow: ellipsis;text-align: right;padding: 0 8px;">
                                            <div class="invoice-info">
                                                <span :title="item.drawer" style="cursor: context-menu;">开票人：{{item.drawer}}</span>
                                            </div>
                                        </i-col>
                                        <i-col span="6" v-if="auth.isEditable != false && item.status == 'NORMAL'" style="padding-left: 0px;margin-top: -15px;">
                                            <Row class="operate-btn" v-if="allowOperateData.length>0">
                                                <i-col span="11">
                                                    <Button type="ghost" @click="invoiceInvalidated(item)">作废</Button>
                                                </i-col>
                                                <i-col span="11" offset="2">
                                                    <Button type="ghost" @click="redInvoice(item)">冲红</Button>
                                                </i-col>
                                            </Row>
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
                        <Card :padding="0" class="add-invoice" @click.native="addInvoice" v-if="auth.isEditable != false">
                            <Icon type="plus-round" style="font-size: 24px;font-weight: 700;"></Icon>
                        </Card>
                        <TimelineItem></TimelineItem>
                    </Timeline>
                </div>
                <div v-else class="invoiced-empty-list">
                    暂无开票记录
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                invoiceDataList: [],
                allowOperateData: [],
                contractPriceInfo: null,
                invalidatedInvoiceList: [], //作废发票页面缓存集合
                hedgeInvoiceList: [], //冲红发票页面缓存集合
                newInvoiceList: [], //补登发票页面缓存集合
                invoiceCodeList: []
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
                    this.getContractPriceInfo();
                }
            },
            isTermination(value) {
                this.isTermination = value;
                this.getContractPriceInfo();
            }
        },
        created() {
            if (this.contractId) {
                this.getInvoiceData();
                this.getContractPriceInfo();
            }
        },
        methods: {
            getInvoiceData () {
                this.request({
                    url: "/signCloud/invoice/getInvoice.do",
                    param: {
                        contractId: this.contractId,
                        isInvoiced: this.isTermination ? 1 : null
                    }
                }).then((data) => {
                    this.invoiceDataList = data.allData;
                    this.allowOperateData = data.allowOperateData;
                });
            },
            getContractPriceInfo () {
                this.request({
                    url: "/signCloud/invoice/getPrice.do",
                    param: {
                        contractId: this.contractId
                    }
                }).then((data) => {
                    this.contractPriceInfo = data;
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
                        invoiceInfo: item
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
            redInvoice(item) {
                this.prompt({
                    title: '发票冲红',
                    code: 'invoiceCard',
                    height: 460,
                    props: {
                        invoiceId: item.id,
                        currentUser: this.currentUser,
                        pageType: 'hedge',
                        isTermination: this.isTermination,
                        invoiceCodeList: this.invoiceCodeList
                    },
                    callback: (flag, hedgeData, invoiceCodeList, close) => {
                        if (flag){
                            this.hedgeInvoiceList.push(hedgeData);
                            this.invoiceCodeList = invoiceCodeList;
                            hedgeData.status = 'HEDGE';
                            item = Object.assign(item, hedgeData);
                        }
                        close();
                    }
                });
            },
            invoiceInvalidated(item) {
                this.prompt({
                    title: "请填写发票作废原因",
                    code: "nullifyInvoice",
                    width: 600,
                    height: 360,
                    props: {
                        invoiceInfo: {
                            ids: [item.id],
                            mergeNumbers: [item.invoiceNumber],
                            mergePrice: item.invicedPrice
                        },
                        isTermination: this.isTermination
                    },
                    callback: (flag, invalidatedData, close) => {
                        if(flag){
                            item.status = 'INVALIDATED';
                            this.invalidatedInvoiceList.push(invalidatedData);
                        }
                        close();
                    }
                });
            },
            addInvoice() {
                this.prompt({
                    title: '发票补录',
                    code: 'invoiceCard',
                    height: 460,
                    props: {
                        contractId: this.contractId,
                        currentUser: this.currentUser,
                        pageType: 'new',
                        isTermination: this.isTermination,
                        invoiceCodeList: this.invoiceCodeList
                    },
                    callback: (flag, newData, invoiceCodeList, close) => {
                        if (flag){
                            this.newInvoiceList.push(newData);
                            this.invoiceDataList.push(newData);
                            this.invoiceCodeList = invoiceCodeList;
                        }
                        close();
                    }
                });
            },
            handleGetInvoiceInfo() {
                //获取当前页面发票处理后的数据
                return {
                    newInvoiceList: this.newInvoiceList,
                    hedgeInvoiceList: this.hedgeInvoiceList,
                    invalidatedInvoiceList: this.invalidatedInvoiceList
                }
            }
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
        height: 24px;
        padding: 0 10px;
        background: #FFF;
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

    .add-invoice {
        background-color: #f7f7f7;
        text-align: center;
        margin: -30px 0 0 26px;
        padding: 8px 0;
        cursor: pointer;
    }
</style>
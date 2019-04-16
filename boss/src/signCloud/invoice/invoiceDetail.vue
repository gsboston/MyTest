<template>
    <div v-if="invoiceDataList.length > 0">
        <ul class="invoice-list">
            <li v-for="(item, index) in invoiceDataList" :key="index">
                <div v-if="item.isInvoiced && item.isInvoiced=='0'">
                    <span>待开票</span>
                </div>
                <div v-else>
                    <p>
                        <span>{{ item.invoicedDate | formatDate }}</span>
                        <span>开票日</span>
                    </p>
                </div>
                <div style="line-height: 23px;">
                    <Row v-if="item.isInvoiced && item.isInvoiced=='0'" :gutter="32" class="price-div">
                        <i-col span="5" class="invoiced-price" style="border-right: 0;">
                            <span>￥{{item.price ? item.price : 0}}</span>
                        </i-col>
                        <i-col v-if="item.invoiceAttList" span="2" offset="11">
                            <Poptip trigger="hover" placement="left" width="100" transfer v-if="item.invoiceAttList.length > 0">
                                <span class="file-title">附件</span>
                                <div slot="content">
                                    <Row>
                                        <i-col span="6" style="margin: 10px 0;height: 65px;" v-for="(fileItem, fileIndex) in item.invoiceAttList" :key="fileIndex">
                                            <div class="attachment-upload-list">
                                                <template>
                                                    <img v-if="imgTypeEnum.indexOf(fileItem.type)>=0" :src="fileItem.url ? fileItem.url : (server + fileItem.attachmentId)">
                                                    <Icon v-else class="file-pdf-show" type="clipboard"></Icon>
                                                    <div class="attachment-upload-list-cover">
                                                        <Icon type="ios-eye-outline" @click.native="handleFileView(fileItem.attachmentId, fileItem.type)"></Icon>
                                                        <Icon type="ios-cloud-download-outline" style="font-size: 18px;" @click.native="handleFileDown(fileItem.attachmentId, fileItem.type)"></Icon>
                                                    </div>
                                                </template>
                                            </div>
                                        </i-col>
                                    </Row>
                                </div>
                            </Poptip>
                        </i-col>
                        <i-col span="2" :offset="item.invoiceAttList ? '' : 13" v-if="pageType == 'applyInvoice'">
                            <Button class="custom-edit" type="ghost" icon="compose" @click.stop="openInvoiceInfo(item, 'apply')"></Button>
                        </i-col>
                        <i-col span="2" class="operate-div" v-if="pageType == 'applyInvoice' && auth.B030601">
                            <Button class="custom-trash" type="ghost" icon="trash-a" @click.stop="trashInvoice(item.id)"></Button>
                        </i-col>
                    </Row>
                    <Row v-else :gutter="32" class="price-div">
                        <i-col span="5" class="invoiced-price">
                            <span>￥{{item.invicedPrice ? item.invicedPrice : item.price }}</span>
                        </i-col>
                        <template v-if="item.price">
                            <i-col :span="item.invoiceAttList ? '12' : 14">
                                <span>申请金额：￥{{item.price ? item.price : 0}}</span>
                            </i-col>
                            <i-col v-if="item.invoiceAttList" span="2">
                                <Poptip trigger="hover" placement="left" width="100" transfer v-if="item.invoiceAttList.length > 0">
                                    <span class="file-title">附件</span>
                                    <div slot="content">
                                        <Row>
                                            <i-col span="6" style="margin: 10px 0;height: 65px;" v-for="(fileItem, fileIndex) in item.invoiceAttList" :key="fileIndex">
                                                <div class="attachment-upload-list">
                                                    <template>
                                                        <img v-if="imgTypeEnum.indexOf(fileItem.type)>=0" :src="fileItem.url ? fileItem.url : (server + fileItem.attachmentId)">
                                                        <Icon v-else class="file-pdf-show" type="clipboard"></Icon>
                                                        <div class="attachment-upload-list-cover">
                                                            <Icon type="ios-eye-outline" @click.native="handleFileView(fileItem.attachmentId, fileItem.type)"></Icon>
                                                            <Icon type="ios-cloud-download-outline" style="font-size: 18px;" @click.native="handleFileDown(fileItem.attachmentId, fileItem.type)"></Icon>
                                                        </div>
                                                    </template>
                                                </div>
                                            </i-col>
                                        </Row>
                                    </div>
                                </Poptip>
                            </i-col>
                        </template>
                        <template v-else>
                            <i-col :span="item.invoiceAttList ? '12' : 14">
                                <span>无开票申请</span>
                            </i-col>
                            <i-col v-if="item.invoiceAttList" span="2">
                                <Poptip trigger="hover" placement="left" width="100" transfer v-if="item.invoiceAttList.length > 0">
                                    <span class="file-title">附件</span>
                                    <div slot="content">
                                        <Row>
                                            <i-col span="6" style="margin: 10px 0;height: 65px;" v-for="(fileItem, fileIndex) in item.invoiceAttList" :key="fileIndex">
                                                <div class="attachment-upload-list">
                                                    <template>
                                                        <img v-if="imgTypeEnum.indexOf(fileItem.type)>=0" :src="fileItem.url ? fileItem.url : (server + fileItem.attachmentId)">
                                                        <Icon v-else class="file-pdf-show" type="clipboard"></Icon>
                                                        <div class="attachment-upload-list-cover">
                                                            <Icon type="ios-eye-outline" @click.native="handleFileView(fileItem.attachmentId, fileItem.type)"></Icon>
                                                            <Icon type="ios-cloud-download-outline" style="font-size: 18px;" @click.native="handleFileDown(fileItem.attachmentId, fileItem.type)"></Icon>
                                                        </div>
                                                    </template>
                                                </div>
                                            </i-col>
                                        </Row>
                                    </div>
                                </Poptip>
                            </i-col>
                        </template>
                        <i-col span="1" v-if="pageType == 'newInvoice' && item.status == 'NORMAL'">
                            <Button class="custom-edit" type="ghost" icon="compose" @click.stop="openInvoiceInfo(item, 'new')"></Button>
                        </i-col>
                    </Row>
                    <Row :gutter="32" v-if="item.isInvoiced && item.isInvoiced=='0'">
                        <i-col span="5" style="border-right: 1px solid #eee;">
                            <div>
                                <span>{{item.invoiceBillsType == 'PAPER' ? '纸质发票' : '电子发票'}}</span>
                                <span class="invoice-type">{{item.invoiceType == 'NORMAL' ? '普' : '专'}}</span>
                            </div>
                        </i-col>
                        <i-col span="10" style="overflow: hidden;text-overflow: ellipsis;">
                            <span class="invoice-info">待开票</span>
                        </i-col>
                        <i-col span="7" style="text-align: right;">
                            <span>申请日：{{ item.tsRequest | formatDate }}</span>
                        </i-col>
                    </Row>
                    <Row :gutter="32" v-else>
                        <i-col span="5" style="border-right: 1px solid #eee;">
                            <div>
                                <span>{{item.invoiceBillsType == 'PAPER' ? '纸质发票' : '电子发票'}}</span>
                                <span class="invoice-type">{{item.invoiceType == 'NORMAL' ? '普' : '专'}}</span>
                            </div>
                        </i-col>
                        <i-col span="17" style="overflow: hidden;text-overflow: ellipsis;">
                            <div class="invoice-info">
                                <span :title="item.invoiceNumber">票号：{{item.invoiceNumber | wordLengthLimit}}</span>
                                <span :title="item.drawer" style="cursor: context-menu;padding-left: 20px;">开票人：{{item.drawer}}</span>
                            </div>
                        </i-col>
                        <i-col span="1" class="operate-div" v-if="pageType == 'newInvoice' && item.status == 'NORMAL' && auth.B030602">
                            <Checkbox style="position: absolute;top: -18px;" v-model="item.checked" @on-change="selectInvoiceInfo(item, index, $event)"></Checkbox>
                        </i-col>
                    </Row>
                    <div class="status-div" v-if="item.status">
                        <span v-if="item.status == 'NORMAL'">正</span>
                        <span v-else-if="item.status == 'INVALIDATED'">废</span>
                        <span v-else-if="item.status == 'HEDGE'">冲</span>
                    </div>
                </div>
            </li>
            <li>
                <Row v-if="pageType == 'newInvoice' && auth.B030602 && allowOperateData.length>0">
                    <i-col span="4" offset="20" style="text-align: right;">
                        全选&emsp;<Checkbox v-model="isAllCheck" @on-change="checkAll"></Checkbox>
                    </i-col>
                </Row>
            </li>
        </ul>
        <Row v-if="pageType == 'newInvoice' && allowOperateData.length>0 && auth.B030602">
            <i-col span="24" class="operate-btn">
                <Button type="ghost" class="custom-color" @click="invoiceInvalidated" :disabled="!(mergeInvoiceList.length>0)">作废</Button>
                <Button type="ghost" class="custom-color" :disabled="!(mergeInvoiceList.length==1)" @click="redInvoice">冲红</Button>
            </i-col>
        </Row>
    </div>
    <div v-else class="invoice-empty-list">
        暂无开票记录
    </div>
</template>

<script>
    export default {
        data() {
            return {
                invoiceDataList: [],
                allowOperateData: [],
                isAllCheck: false,
                mergeInvoiceList: [],
                mergeInvoiceNumbersList: [],
                mergePrice: 0,
                imgTypeEnum: ['bmp','gif','ico','jpg','jpeg','png'],
                server: '/ossController/oss/file.do?id=',
            }
        },
        props: {
            contractId: null,
            currentUser: null,
            auth: {},
            pageType: null
        },
        watch: {
            contractId (val) {
                this.contractId = val;
                this.getInvoiceData();
            }
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 10){
                    return value.substring(0,10) + "..." ;
                }
                return value;
            },
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
        created() {
            this.getInvoiceData();
        },
        methods: {
            refresh() {
                this.getInvoiceData();
            },
            getInvoiceData () {
                this.request({
                    url: "/signCloud/invoice/getInvoice.do",
                    param: {
                        contractId: this.contractId
                    }
                }).then(data => {
                    this.mergeInvoiceList = [];
                    this.mergeInvoiceNumbersList = [];
                    this.mergePrice = 0;
                    this.isAllCheck = false;
                    this.invoiceDataList = data.allData;
                    this.allowOperateData = data.allowOperateData;
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
            openInvoiceInfo(item, type) {
                if (type == 'apply') {
                    this.$emit('on-open-invoice-info', {invoiceId: item.id, isInvoiced: item.isInvoiced});
                }else {
                    this.$emit('on-edit-invoice', item, 'edit');
                }
            },
            trashInvoice(invoiceId) {
                if (invoiceId) {
                    this.request({
                        url: "/signCloud/invoice/unDoApply.do",
                        param: {
                            invoiceId: invoiceId
                        }
                    }).then(() => {
                        this.refresh();
                        this.$emit('on-refresh');
                        this.$Message.info("发票申请撤销成功");
                    });
                }
            },
            invoiceInvalidated() {
                this.$emit('on-cancel-invoice-detail');
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
                            this.refresh();
                            this.$emit('on-refreshInfo');
                        }
                    }
                });
            },
            redInvoice() {
                this.$emit('on-cancel-invoice-detail');
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
                            this.refresh();
                            this.$emit('on-refreshInfo');
                        }
                        close();
                    }
                });
            },
            handleFileView(name, type) {
                window.open(this.server + name);
            },
            handleFileDown(name, type) {
                let url = '/ossController/oss/downloadFile.do?id=' + name + '&type=' + type;
                if (this.imgTypeEnum.indexOf(type) > -1) {
                    this.request({
                        url: url + '&isImage=' + true
                    }).then(data => {
                        var $a = document.createElement('a');
                        $a.setAttribute("href", data);
                        $a.setAttribute("download", name + '.' + type);

                        var evObj = document.createEvent('MouseEvents');
                        evObj.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, true, false, 1, null);
                        $a.dispatchEvent(evObj);
                    });
                }else {
                    location = url;
                }
            },
        }
    }
</script>

<style scoped>
    .invoice-list li{
        position: relative;
        display: flex;
        display: -ms-flexbox;
        align-items: center;
        padding: 14px 20px;
        height: 84px;
        border-bottom: 1px solid #f6f6f6;
    }

    .invoice-list li:hover {
        background: #f2f6f9;
    }

    /*.invoice-list li:nth-child(2n) {*/
        /*background: #f7f7f7;*/
    /*}*/

    .invoice-list li>div {
        line-height: 28px;
        font-size: 14px;
    }

    .invoice-list li>div:first-child {
        font-size: 12px;
        min-width: 100px;
        text-align: center;
        border-right: 1px solid #eee;
        line-height: 56px!important;
        padding-right: 10px;
    }

    .invoice-list li>div:first-child p {
        line-height: 28px;
        font-size: 12px;
    }

    .invoice-list li>div:first-child p span{
        display: block;
    }

    .invoice-list li:last-child {
        text-align: right;
        align-items: center;
        padding: 5px 32px;
        height: auto;
        background: #FFF;
    }

    .invoice-list li:last-child>div {
        width: 100%;
        text-align: center;
        border-right: 0;
        padding-right: 0;
    }

    .invoice-list .invoiced-price{
        font-weight: 600;
        font-size: 16px;
        padding-right: 20px;
        border-right: 1px solid #eee;
    }

    .invoice-list li>div:nth-child(2) {
        padding: 0px 20px;
        width: 100%;
        flex: 1;
        -ms-flex: 1;
    }

    .invoice-list .invoice-type {
        padding: 2px;
        margin-left: 10px;
        border-radius: 5px;
        background: #59b399;
        color: #FFF;
    }

    .operate-btn {
        text-align: center;
        margin: 10px 0;
    }

    .invoice-list .price-div {
        margin-bottom: 10px;
    }

    .invoice-list .custom-trash, .invoice-list .custom-edit {
        border: 0;
    }

    .invoice-list .custom-trash >>> i, .invoice-list .custom-edit >>> i {
        font-size: 20px;
    }

    .invoice-list .operate-div {
        text-align: right;
    }

    .invoice-list .trash-div {
        margin-top: -18px;
    }

    .invoice-empty-list {
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

    .custom-color {
        color: #59b399;
        border-color: #59b399;
    }

    .file-title {
        color: rgb(89, 179, 153);
        height: 34px;
        line-height: 34px;
        padding: 0 5px 2px;
        border-bottom: 1px solid #59b399;
    }

    .attachment-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .attachment-upload-list img{
        width: 100%;
        height: 100%;
    }
    .attachment-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: -1px;
        left: 0;
        right: -1px;
        background: rgba(0,0,0,.6);
    }

    .attachment-upload-list:hover .attachment-upload-list-cover{
        display: block;
    }

    .attachment-upload-list-cover i{
        color: #fff;
        font-weight: 600;
        font-size: 24px;
        cursor: pointer;
        margin: 0 2px;
        display: block;
    }

    .attachment-upload-list-cover i:first-child {
        border-bottom: 1px dashed #FFF;
        margin: 4px 10px;
    }

    .file-pdf-show {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        line-height: 30px;
        height: 60px;
        font-size: 48px;
        color: #cccccc;
    }
</style>

<style>
    div[data-transfer="true"][x-placement="left"].ivu-poptip-popper {
        min-width: 350px;
    }
</style>
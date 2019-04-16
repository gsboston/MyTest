<template>
    <Row :style="invoiceList.length>1 ? 'background: #eee;padding: 5px 10px;margin: -5px;' : 'background: transparent;'">
        <Card class="show-info" v-for="(invoiceData, index) in invoiceList" :key="index" :bordered="false" dis-hover :padding="invoiceList.length>1 ? 16 : 0" :style="pageType == 'new' ? 'background: transparent;' : ''">
            <p v-if="invoiceList.length>1" slot="title">
                {{ invoiceData.status == 'HEDGE' ? '原始发票信息' : '冲红发票信息' }}
            </p>
            <div class="info-content" v-if="invoiceData">
                <label>
                    发票信息
                </label>
                <div>
                    <i-col span="24">
                        <p style="display: inherit;">
                            <Button class="check-button active" size="small">纸质发票</Button>
                        </p>
                    </i-col>
                    <i-col span="24">
                        <p>
                            <span>发票类型：</span>
                            <span class="info-text" style="flex: 0 0 auto;margin-right: 20px;">{{ invoiceData.titleType == 'COMPANY' ? '公司' : '个人' }}</span>
                            <Button :class="invoiceData.invoiceType == 'NORMAL' ? 'check-button active' : 'check-button none'" size="small">普通发票</Button>
                            <Button :class="invoiceData.invoiceType == 'SPECIAL' ? 'check-button active' : 'check-button none'" size="small">专用发票</Button>
                        </p>
                    </i-col>
                    <i-col span="12">
                        <p>
                            <span>发票抬头：</span>
                            <span class="info-text" :title="invoiceData.title">{{ invoiceData.title }}</span>
                        </p>
                    </i-col>
                    <i-col span="12" v-if="invoiceList.length == 1 && invoiceData.idno">
                        <p>
                            <span>纳税人识别号：</span>
                            <span class="info-text" :title="invoiceData.idno">{{ invoiceData.idno }}</span>
                        </p>
                    </i-col>
                    <i-col span="12" v-if="invoiceData.invoiceCode">
                        <p>
                            <span>发票代码：</span>
                            <span class="info-text" :title="invoiceData.invoiceCode">{{ invoiceData.invoiceCode }}</span>
                        </p>
                    </i-col>
                    <i-col span="12" v-if="invoiceData.invoiceNumber">
                        <p>
                            <span>{{ invoiceData.status == 'HEDGE' ? '冲红号码：' : '发票号码：'}}</span>
                            <span class="info-text" :title="invoiceData.invoiceNumber">{{ invoiceData.invoiceNumber }}</span>
                        </p>
                    </i-col>
                    <i-col span="12" v-if="invoiceData.invoicedDate">
                        <p>
                            <span>{{ invoiceData.status == 'HEDGE' ? '冲红日期：' : '开票日期：'}}</span>
                            <span class="info-text" :title="invoiceData.invoicedDate">{{ invoiceData.invoicedDate | formatDate }}</span>
                        </p>
                    </i-col>
                    <i-col span="12" v-if="invoiceData.bankName">
                        <p>
                            <span>开户银行：</span>
                            <span class="info-text" :title="invoiceData.bankName">{{ invoiceData.bankName }}</span>
                        </p>
                    </i-col>
                    <i-col span="12" v-if="invoiceData.bankAccount">
                        <p>
                            <span>开户账号：</span>
                            <span class="info-text" :title="invoiceData.bankAccount">{{ invoiceData.bankAccount }}</span>
                        </p>
                    </i-col>
                    <i-col span="12" v-if="invoiceData.companyPhone">
                        <p>
                            <span>单位电话：</span>
                            <span class="info-text" :title="invoiceData.companyPhone">{{ invoiceData.companyPhone }}</span>
                        </p>
                    </i-col>
                    <i-col span="12" v-if="invoiceData.companyAddress">
                        <p>
                            <span>单位地址：</span>
                            <span class="info-text" :title="invoiceData.companyAddress">{{ invoiceData.companyAddress }}</span>
                        </p>
                    </i-col>
                    <i-col span="24" v-if="invoiceData.remark">
                        <p>
                            <span>作废原因：</span>
                            <span class="info-text" style="white-space: normal;" :title="invoiceData.remark">{{ invoiceData.remark }}</span>
                        </p>
                    </i-col>
                </div>
            </div>

            <div class="info-content" v-if="invoiceData">
                <label>
                    接收信息
                </label>
                <div>
                    <i-col span="24">
                        <p style="display: inherit;">
                            <Button class="check-button active" size="small">{{ invoiceData.deliveryType == 'POST' ? '邮寄' : '自取' }}</Button>
                        </p>
                    </i-col>
                    <div v-if="invoiceData.deliveryType == 'POST'">
                        <i-col span="12">
                            <p v-if="invoiceData.contactName">
                                <span>联系人：</span>
                                <span class="info-text" :title="invoiceData.contactName">{{ invoiceData.contactName }}</span>
                            </p>
                        </i-col>
                        <i-col span="12">
                            <p v-if="invoiceData.contactPhone">
                                <span>联系电话：</span>
                                <span class="info-text" :title="invoiceData.contactPhone">{{ invoiceData.contactPhone }}</span>
                            </p>
                        </i-col>

                        <i-col span="12">
                            <p v-if="invoiceData.contactEmail">
                                <span>电子邮箱：</span>
                                <span class="info-text" :title="invoiceData.contactEmail">{{ invoiceData.contactEmail }}</span>
                            </p>
                        </i-col>
                        <i-col span="12">
                            <p v-if="invoiceData.contactAddress">
                                <span>邮寄地址：</span>
                                <span class="info-text" :title="invoiceData.contactAddress">{{ invoiceData.contactAddress }}</span>
                            </p>
                        </i-col>
                    </div>
                </div>
            </div>

            <div class="info-content" v-if="((invoiceList.length>1 && invoiceData.status == 'HEDGE') || invoiceList.length == 1) && attList.length > 0">
                <label>附件信息</label>
                <Poptip class="aaa" placement="bottom-start" trigger="hover" :transfer="true">
                    <Button class="custom-button" size="small">查看附件</Button>
                    <div slot="content">
                        <Row v-if="attList.length > 0">
                            <i-col span="6" style="margin: 10px 0;height: 65px;" v-for="(fileItem, fileIndex) in attList" :key="fileIndex">
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
                        <p v-else style="text-align: center;font-size: 14px;font-weight: 600;height: 60px;line-height: 60px;">暂无附件</p>
                    </div>
                </Poptip>
            </div>
        </Card>
    </Row>
</template>

<script>
    import UploadView from '../contractDetails/uploadView';

    export default {
        components: {
            UploadView
        },
        data() {
            return {
                invoiceList: [],
                attList: [],
                imgTypeEnum: ['bmp','gif','ico','jpg','jpeg','png'],
                server: '/ossController/oss/file.do?id=',
            }
        },
        props: {
            invoiceId: null,
            pageType: null,
            invoiceInfo: {}
        },
        watch: {
            invoiceId (val) {
                this.invoiceId = val;
                this.getInvoiceData();
            }
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
        created() {
            this.getInvoiceData();
        },
        methods: {
            getInvoiceData() {
                if (this.invoiceId) {
                    this.request({
                        url: "/signCloud/invoice/invoiceHedgeInfo.do",
                        param: {
                            invoiceId: this.invoiceId
                        }
                    }).then((data) => {
                        if (data) {
                            if (data.length > 0) {
                                this.invoiceList = data;
                                if (data.length > 1) {
                                    data.forEach(item => {
                                        if (item.status == 'HEDGE') {
                                            this.attList = item.attList;
                                        }
                                    });
                                }else {
                                    this.attList = data[0].attList;
                                }
                            }
                        }
                    });
                }else {
                    this.invoiceList.push(this.invoiceInfo);
                    if (this.invoiceInfo.isInvoiced == '0') {
                        this.attList = this.invoiceInfo.invoiceAttList ? this.invoiceInfo.invoiceAttList : [];
                    }else {
                        this.attList = this.invoiceInfo.attList ? this.invoiceInfo.attList : [];
                    }
                }
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
    .show-info {
        line-height: 32px;
        font-size: 14px;
        color: #666;
        padding: 20px 30px 0 30px;
        margin: 10px 0;
    }

    .show-info .invoice-type {
        border: 1px solid #59b399;
        background: #FFF;
        color: #59b399;
        font-size: 12px;
        padding: 6px 16px;
    }

    .show-info .info-content {
        display: flex;
        margin-bottom: 10px;
    }

    .show-info .info-content label {
        display: inline-flex;
        width: 80px;
        white-space: nowrap;
    }

    .show-info .info-content p {
        display: flex;
    }

    .show-info .info-content p span {
        white-space: nowrap;
    }

    .show-info .info-content p span:nth-of-type(2) {
        display: block;
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: context-menu;
    }

    .show-info .info-content>div {
        width: 100%;
        flex: 1;
        -ms-flex: 1;
    }

    .show-info .info-text {
        color: #333;
    }

    .show-info .check-button.active {
        position: relative;
        color: #59b399;
        background: #FFF;
        border: 1px solid #59b399;
        font-size: 12px;
        padding: 6px 16px;
        border-radius: 0;
        cursor: initial;
    }

    .show-info .check-button.active >>> span:after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0;
        height: 0;
        border-bottom: 15px solid #59b399;
        border-left: 20px solid transparent;
    }

    .show-info .check-button.active:after {
        font-family: Ionicons;
        font-size: 12px;
        content: "\F383";
        position: absolute;
        bottom: -5px;
        right: 2px;
        color: #FFF;
    }

    .show-info .check-button.none {
        color: #333333;
        background: #e5e5e5;
        border: 1px solid #e5e5e5;
        padding: 6px 16px;
        border-radius: 0;
        cursor: initial;
    }.attachment-upload-list{
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
    div[data-transfer="true"][x-placement="bottom-start"].ivu-poptip-popper {
        min-width: 240px;
    }
</style>
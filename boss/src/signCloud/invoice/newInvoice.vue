<template>
    <div style="padding: 10px;" id="invoiceDiv">
        <Row>
            <Form class="invoice-form" ref="form" :model="invoiceForm" :label-width="100" :rules="ruleValidate">
                <FormItem :label="applyInvoiceDataList.length>0 ? '开票申请' : '开票金额'" class="normal" style="margin-bottom: 10px;">
                    <i-col span="21" style="padding-top: 5px;" v-if="applyInvoiceDataList.length>0">
                        <Collapse id="collapsePanel" accordion v-model="activeInvoiceIndex" class="custom-collapse" @on-change="jumpToPoint">
                            <Panel v-for="(item, index) in applyInvoiceDataList" :key="index">
                                <div class="custom-collapse-header">
                                    <Checkbox v-model="item.checked" @on-change="selectApplyInfo(item, index, $event)"></Checkbox>
                                    <p style="display: inline-block;">
                                        <span>￥</span>
                                        <span class="applyInvoicePrice">{{item.price}}</span>
                                        <span>纸质发票</span>
                                        <span class="invoice-type">{{ item.invoiceType == 'NORMAL' ? '普' : '专' }}</span>
                                        <span v-if="item.isInvoiced=='0'" class="invoice-info">待开票</span>
                                    </p>
                                    <p class="time">申请日：{{ (item.tsRequest ? item.tsRequest : null) | formatDate }}</p>
                                </div>
                                <InvoiceInfo :invoiceInfo="item" pageType="new" slot="content"></InvoiceInfo>
                            </Panel>
                        </Collapse>

                        <Checkbox v-model="isAllCheck" style="padding-left: 32px;margin-top: 20px;" @on-change="checkAll">合并开票</Checkbox>
                    </i-col>

                    <i-col span="21" v-else>
                        <Input v-model="invoiceForm.price" size="large" class="price" :maxlength="20">
                            <span slot="prepend">￥</span>
                            <Button slot="append" size="small" @click="calAllPrice">全部开票</Button>
                        </Input>
                    </i-col>

                    <Modal v-model="priceTips" width="360">
                        <p slot="header" style="color:#f60;text-align:center">
                            <Icon type="information-circled"></Icon>
                            <span>提示</span>
                        </p>
                        <div style="text-align:center;padding: 10px;">
                            <p>输入的开票金额已大于可开票总额，是否继续开票？</p>
                        </div>
                        <div slot="footer" style="text-align: center;">
                            <Button type="ghost" size="large" @click="priceTips=false">修改金额</Button>
                            <Button type="primary" size="large" @click="saveInvoiceState">继续开票</Button>
                        </div>
                    </Modal>

                    <!-- 发票明细 START -->
                    <i-col span="1" offset="1">
                        <Poptip placement="bottom-end" ref="invoiceDetail" trigger="hover">
                            <Button class="custom-button" size="small">明细</Button>
                            <InvoiceDetail slot="content" :contractId="contractId" :auth="auth" :currentUser="currentUser" pageType="newInvoice" ref="invoiceDetailDiv" @on-cancel-invoice-detail="cancelInvoiceDetail" @on-refreshInfo="refresh" @on-edit-invoice="openInvoiceInfo"></InvoiceDetail>
                        </Poptip>
                    </i-col>
                    <!-- 发票明细 END -->

                    <i-col v-if="applyInvoiceDataList.length==0" class="money-info normal" span="19">
                        <i-col span="24">
                            <span>可开票总额：</span>
                            <span>￥{{ contractPriceInfo ? (contractPriceInfo.receiptPrice + contractPriceInfo.noneReceivablePrice).toFixed(2) : '00000' }}</span>
                        </i-col>
                        <i-col span="11">
                            <span>待开票金额：</span>
                            <span>￥{{ contractPriceInfo ? contractPriceInfo.total : '00000' }}</span>
                        </i-col>
                        <i-col span="11" offset="2">
                            <span>已开票金额：</span>
                            <span>￥{{ contractPriceInfo ? contractPriceInfo.invoicedPrice.toFixed(2) : '00000' }}</span>
                        </i-col>
                    </i-col>
                </FormItem>

                <FormItem label="登记发票" class="normal" style="margin-bottom: 10px;">
                    <!-- 发票明细 START -->
                    <i-col span="1" offset="22">
                        <Button class="custom-button" size="small" v-if="!isEditInfo && mergeInvoiceList.length>0" @click="editInvoiceInfo">编辑</Button>
                        <Button class="custom-button" size="small" v-else-if="mergeInvoiceList.length>0" @click="editInvoiceInfo">取消</Button>
                    </i-col>
                    <!-- 发票明细 END -->
                </FormItem>

                <!-- 编辑信息 -->
                <i-col span="22" offset="1">
                    <i-col span="8">
                        <FormItem class="normal s-price" label="发票金额" prop="price">
                            <Input v-model="invoiceForm.price" :placeholder="isEditInfo ? '请输入发票金额' : ''" :readonly="!isEditInfo" :maxlength="20"/>
                        </FormItem>
                    </i-col>
                    <i-col span="17">
                        <FormItem class="normal" label="发票形式" style="margin-bottom: 10px;">
                            <Button class="check-button active" type="primary" size="small">纸质票</Button>
                        </FormItem>
                    </i-col>
                    <i-col span="17">
                        <FormItem class="normal" label="发票类型" prop="invoiceType" style="margin-bottom: 10px;">
                            <div>
                                <span v-if="!isEditInfo" style="margin-right: 20px;">{{ invoiceForm.titleType == 'COMPANY' ? '公司' : '个人' }}</span>
                                <Button :class="invoiceForm.invoiceType == 'NORMAL' ? 'check-button active' : 'check-button'" :disabled="!isEditInfo" size="small" @click="invoiceTypeChange('NORMAL')">普通发票</Button>
                                <Button :class="invoiceForm.invoiceType == 'SPECIAL' ? 'check-button active' : 'check-button'" :disabled="!isEditInfo" size="small" @click="invoiceTypeChange('SPECIAL')">专用发票</Button>
                            </div>
                        </FormItem>
                    </i-col>

                    <i-col span="17">
                        <FormItem class="normal" v-if="isEditInfo" style="margin-bottom: 10px;">
                            <Button :class="invoiceForm.titleType == 'COMPANY' ? 'check-button active' : 'check-button'" size="small" @click="titleTypeChange('COMPANY')">公司</Button>
                            <Button v-if="isNormalInvoice && contractType == 'PERSON'" :class="invoiceForm.titleType == 'PERSON' ? 'check-button active' : 'check-button'" size="small" @click="titleTypeChange('PERSON')">个人</Button>
                        </FormItem>
                    </i-col>

                    <i-col span="8">
                        <FormItem class="normal" label="发票抬头" prop="title">
                            <Input v-if="contractType != 'COMPANY'" v-model="invoiceForm.title" :placeholder="isEditInfo ? '请输入发票抬头' : ''"/>
                            <Select v-else v-model="invoiceForm.title">
                                <Option v-for="(item, index) in titleList" :key="index" :value="item.name">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem class="normal" label="发票代码" prop="invoiceCode">
                            <Input v-model="invoiceForm.invoiceCode" :placeholder="isEditInfo ? '请输入发票代码' : ''" :maxlength="20"/>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem class="normal" label="发票号码" prop="invoiceNumber">
                            <Input v-model="invoiceForm.invoiceNumber" :placeholder="isEditInfo ? '请输入发票号码' : ''" :maxlength="20"/>
                        </FormItem>
                    </i-col>

                    <i-col span="8">
                        <FormItem class="normal ivu-form-item-required" label="开票日期" prop="invoicedDate">
                            <DatePicker v-model="invoiceForm.invoicedDate" placement="right-start" type="date" placeholder="请选择开票日期" class="date" style="width: 100%" :editable="dateEditable"></DatePicker>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem class="normal" label="开票人" prop="drawer">
                            <Input v-model="invoiceForm.drawer" v-if="!isEditInfo"/>
                            <Select v-else v-model="invoiceForm.drawer">
                                <Option :value="currentUser.realName">{{ currentUser.realName }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem class="normal" label="发票领取人" prop="receiverName">
                            <Input v-model="invoiceForm.receiverName" :placeholder="isEditInfo ? '请输入发票领取人' : ''" :maxlength="20"/>
                        </FormItem>
                    </i-col>
                    <i-col span="24">
                        <FormItem class="normal" label="上传附件">
                            <i-col span="24" style="height: 36px;line-height: 36px;">
                                <span style="font-size: 12px;font-weight: normal;color: #a2a2a2;">（上传文件类型只支持图片或者PDF文件）</span>
                            </i-col>
                            <UploadView :onSuccess="uploadSuccess" :onRemove="uploadRemove" :defaultList="invoiceForm.attList ? invoiceForm.attList : []" @on-change-upload-state="changeUploadState"></UploadView>
                        </FormItem>
                    </i-col>

                    <i-col span="24">
                        <div class="saveBtn">
                            <Button type="primary" :disabled="isUploading" @click="openPriceTips">{{ isInvoiceEdit ? '修改保存' : '确认' }}</Button>
                        </div>
                    </i-col>
                </i-col>
            </Form>
        </Row>
    </div>
</template>

<script>
    import InvoiceInfo from "./invoiceInfo.vue";
    import InvoiceDetail from "./invoiceDetail.vue";
    import UploadView from '../contractDetails/uploadView';

    export default {
        components: {
            InvoiceInfo,
            InvoiceDetail,
            UploadView
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
        props: {
            contractId: null,
            currentUser: null,
            auth: {},
            refreshNum: 0
        },
        watch: {
            refreshNum(value) {
                this.refreshNum = value;
                this.getContractData();
                this.getContractPriceInfo();
            }
        },
        data () {
            let $self = this;
            return {
                isEditInfo: true,
                invoiceForm: {
                    price: '',
                    title: '',
                    invoiceCode: '',
                    invoiceNumber: '',
                    receiverName: '',
                    invoicedDate: new Date(),
                    invoiceType: 'NORMAL',
                    titleType: 'COMPANY'
                },
                ruleValidate: {
                    price: [
                        {validator(rule, value, callback) {
                            if (value.toString().length <= 20) {
                                if (/^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/.test(value)) {
                                    let _value = parseFloat(value);
                                    if (!isNaN(_value)) {
                                        if (_value <= 0) {
                                            if ($self.isEditInfo) {
                                                callback([new Error('发票金额必须大于0元')]);
                                            }else {
                                                callback();
                                            }
                                        }else {
                                            callback();
                                        }
                                    }else {
                                        if ($self.isEditInfo) {
                                            callback([new Error('发票金额必须大于0元')]);
                                        }else {
                                            callback();
                                        }
                                    }
                                }else {
                                    callback(new Error('发票金额最多允许输入两位小数'));
                                }
                            }else {
                                callback(new Error('发票金额不允许超过20位数字'));
                            }
                        }}
                    ],
                    title: [
                        {required: true, message: '发票抬头不能为空', trigger: 'blur'},
                        {max: 100, message: '发票抬头不允许超过100字符'},
                    ],
                    invoiceCode: [
                        {required: true, message: '发票代码不能为空', trigger: 'blur'},
                        {pattern:  /^[0-9]*$/ ,message:'发票代码只允许输入数字'},
                        {max: 20, message: '发票代码不允许超过20字符'},
                    ],
                    invoiceNumber: [
                        {required: true, message: '发票号码不能为空', trigger: 'blur'},
                        {pattern:  /^[0-9]*$/ ,message:'发票号码只允许输入数字'},
                        {max: 20, message: '发票号码不允许超过20字符'},
                    ],
                    invoicedDate: [
                        {validator(rule, value, callback) {
                            if (!value) {
                                callback([new Error('开票日期不能为空')]);
                            }else {
                                callback();
                            }
                        }}
                    ],
                    receiverName: [
                        {required: true, message: '发票领取人不能为空', trigger: 'blur'},
                        {max: 20, message: '发票领取人不允许超过20字符'},
                    ]
                },
                isNormalInvoice: true,
                applyInvoiceDataList: [],
                activeInvoiceIndex: null,
                dateEditable: false,
                contractInfo: null,
                contractPriceInfo: null,
                mergeInvoiceList: [],
                isAllCheck: false,
                contractType: 'PERSON',
                priceTips: false,
                isInvoiceEdit: false,
                editOldPrice: 0,
                attachmentList: [],
                attachmentFileList: [],
                isUploading: false,
                titleList: []
            }
        },
        created: function () {
            if (this.currentUser) {
                this.invoiceForm.drawer = this.currentUser.realName;
            }
            this.getContractData();
            this.getContractPriceInfo();
        },
        methods: {
            getContractData () {
                //获取合同基本信息
                if (this.contractId) {
                    this.request({
                        url: "/signCloud/contract/info.do",
                        param: {
                            contractId: this.contractId
                        }
                    }).then((data) => {
                        this.contractInfo = data;
                        if (data.cSList && data.cSList.length > 0) {
                            let $self = this;
                            this.titleList = [];
                            data.cSList.forEach(function (item) {
                                if (item.subjectAlias == 'A') {
                                    $self.invoiceForm.titleType = item.type;
                                    $self.invoiceForm.title = item.name;
                                    $self.contractType = item.type;
                                }
                                if (item.subjectAlias != 'B') {
                                    $self.titleList.push(item);
                                }
                            });
                        }
                        this.getApplyInvoiceData();
                    });
                }else {
                    this.$Notice.error({
                        title: '系统提示',
                        desc: '获取合约信息失败!'
                    });
                }
            },
            getContractPriceInfo () {
                //获取合同所有相关金额信息
                if (this.contractId) {
                    this.request({
                        url: "/signCloud/invoice/getPrice.do",
                        param: {
                            contractId: this.contractId
                        }
                    }).then((data) => {
                        this.contractPriceInfo = data;
                        this.contractPriceInfo.total = this.contractPriceInfo.receiptPrice + this.contractPriceInfo.noneReceivablePrice - this.contractPriceInfo.invoicedPrice;
                        if (this.contractPriceInfo.total <= 0) {
                            this.contractPriceInfo.total = 0.00;
                        }else {
                            this.contractPriceInfo.total = this.contractPriceInfo.total.toFixed(2);
                        }
                    });
                }
            },
            calAllPrice (){
                //全部开票
                if (this.contractInfo && this.contractPriceInfo){
                    this.invoiceForm.price = this.contractPriceInfo.total;
                }else {
                    this.invoiceForm.price = 0;
                }
            },
            getApplyInvoiceData () {
                //获取申请的发票列表
                this.request({
                    url: "/signCloud/invoice/getInvoice.do",
                    param: {
                        contractId: this.contractId,
                        isInvoiced: 0
                    }
                }).then((data) => {
                    this.applyInvoiceDataList = data.allData;
                    this.mergeInvoiceList = [];
                    this.isAllCheck = false;
                    if (this.applyInvoiceDataList.length != 0) {
                        this.isEditInfo = false;
                        if (this.applyInvoiceDataList.length == 1) {
                            this.activeInvoiceIndex = [0];
                        }
                    }else {
                        this.isEditInfo = true;
                    }
                });
            },
            selectApplyInfo(item, index, event) {
                if (!event.constructor){
                    return;
                }
                this.$emit('change', item, index);

                this.setInvoiceForm(item);
                this.isInvoiceEdit = false;
                if (arguments[2]) {
                    this.activeInvoiceIndex = [index];
                    this.mergeInvoiceList.push(item.id);
                    if (this.mergeInvoiceList.length == 1) {
                        this.invoiceForm = Object.assign({}, item);
                    }
                }else {
                    this.activeInvoiceIndex = null;
                    var _index = this.mergeInvoiceList.indexOf(item.id);
                    if (_index > -1) {
                        this.mergeInvoiceList.splice(_index, 1);
                    }
                }
                let price = 0;
                this.applyInvoiceDataList.forEach(function (item) {
                    if (item.checked){
                        price += parseFloat(item.price);
                    }
                });
                this.invoiceForm.price = price.toFixed(2);
                this.invoiceForm.drawer = this.currentUser.realName;
                this.invoiceForm.invoicedDate = new Date();
                this.attachmentList = [];
                this.attachmentFileList = [];
                if (this.applyInvoiceDataList.length == this.mergeInvoiceList.length){
                    this.isAllCheck = true;
                }else {
                    this.isAllCheck = false;
                }
            },
            checkAll() {
                this.mergeInvoiceList = [];
                this.isInvoiceEdit = false;
                let $self = this;
                let price = 0;
                if (this.isAllCheck) {
                    this.applyInvoiceDataList.forEach(function (item, index) {
                        $self.applyInvoiceDataList[index].checked = true;
                        $self.mergeInvoiceList.push(item.id);
                        price += parseFloat(item.price);
                    });
                    if (this.mergeInvoiceList.length == 1) {
                        this.invoiceForm = Object.assign({}, this.applyInvoiceDataList[0]);
                    }
                }else {
                    this.applyInvoiceDataList.forEach(function (item, index) {
                        $self.applyInvoiceDataList[index].checked = false;
                    });
                }
                this.invoiceForm.drawer = this.currentUser.realName;
                this.invoiceForm.invoicedDate = new Date();
                this.invoiceForm.price = price.toFixed(2);
            },
            invoiceTypeChange (val) {
                this.invoiceForm.invoiceType = val;
                if (val == 'NORMAL'){
                    this.isNormalInvoice = true;
                }else{
                    this.isNormalInvoice = false;
                    this.invoiceForm.titleType = 'COMPANY';
                }
            },
            titleTypeChange (val) {
                this.invoiceForm.titleType =val;
            },
            editInvoiceInfo () {
                this.isEditInfo = !this.isEditInfo;
            },
            setInvoiceForm (item) {
                if (item) {
                    this.isEditInfo = false;
                    this.invoiceForm = Object.assign({}, item);
                    this.invoiceForm.billingUserId = this.currentUser.id;
                }else {
                    this.isEditInfo = true;
                    this.activeInvoiceIndex = null;
                    this.$refs['form'].resetFields();
                }
            },
            saveInvoiceState () {
                this.priceTips = false;
                let $self = this;
                if (this.applyInvoiceDataList.length != 0){
                    this.invoiceForm.inviceList = this.mergeInvoiceList;
                }else {
                    this.invoiceForm.inviceList = [];
                }
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.invoiceForm.attList = new Array();
                        this.attachmentList.forEach((item, index) => {
                            $self.invoiceForm.attList.push({
                                attachmentId: item,
                                idx: index,
                                type: $self.attachmentFileList[index].type
                            });
                        });
                        if (this.isInvoiceEdit) {
                            this.request({
                                url: '/signCloud/invoice/update.do',
                                data: this.invoiceForm
                            }).then(() => {
                                this.$Notice.success({
                                    title: '发票修改成功'
                                });
                                this.refresh();
                                this.$refs['invoiceDetailDiv'].refresh();
                            });
                        }else {
                            this.invoiceForm.contractId = this.contractId;
                            this.request({
                                url: '/signCloud/invoice/save.do',
                                data: this.invoiceForm
                            }).then(() => {
                                this.$Notice.success({
                                    title: '发票开具成功'
                                });
                                this.refresh();
                                this.$refs['invoiceDetailDiv'].refresh();
                            });
                        }
                    }
                })
            },
            refresh() {
                if (this.isAllCheck) {
                    this.$api.refreshApplyInvoice();
                }else {
                    this.getContractData();
                    this.getApplyInvoiceData();
                    this.getContractPriceInfo();
                    this.$refs['form'].resetFields();
                    this.invoiceForm.invoiceCode = null;
                    this.invoiceForm.invoiceNumber = null;
                    this.invoiceForm.receiverName = null;
                    this.invoiceForm.attList = [];
                    this.mergeInvoiceList = [];
                    this.$emit('on-handle-refresh-status', this.contractId);
                }
            },
            handleReset () {
                if (this.applyInvoiceDataList.length == 0){
                    this.$refs['form'].resetFields();
                    this.isNormalInvoice = true;
                    if (this.contractInfo.cSList && this.contractInfo.cSList.length > 0) {
                        let $self = this;
                        this.contractInfo.cSList.forEach(function (item) {
                            if (item.subjectAlias == 'A') {
                                $self.invoiceForm.titleType = item.type;
                                $self.invoiceForm.title = item.name;
                                $self.contractType = item.type;
                            }
                        });
                    }
                }else {
                    this.editInvoiceInfo();
                }
            },
            save () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.applyInvoiceDataList.length != 0){
                            this.editInvoiceInfo();
                            this.invoiceForm.inviceList = this.mergeInvoiceList;
                        }else {
                            this.saveInvoiceState();
                        }
                    }
                })
            },
            jumpToPoint(index) {
                if (index.length > 0) {
                    this.activeInvoiceIndex = index[0];
                    // 获取需要滚动的距离
                    document.getElementById('collapsePanel').scrollTop = 76*this.activeInvoiceIndex;
                }
            },
            cancelInvoiceDetail() {
                this.$refs['invoiceDetail'].cancel();
            },
            openPriceTips() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        let price = parseFloat(this.invoiceForm.price);
                        let total = parseFloat(this.contractPriceInfo.total);
                        if (this.isInvoiceEdit) {
                            total = this.contractPriceInfo.receiptPrice + this.contractPriceInfo.noneReceivablePrice - this.contractPriceInfo.invoicedPrice + this.editOldPrice;
                            total = total.toFixed(2);
                        }
                        if (!isNaN(price) && !isNaN(total)) {
                            if (price > total) {
                                this.priceTips = true;
                            }else {
                                this.saveInvoiceState();
                            }
                        }else {
                            this.$Message.error("金额信息有误");
                        }
                    }
                });
            },
            openInvoiceInfo (data, type) {
                //获取需要更新的发票信息
                if (data) {
                    if (data.id) {
                        if (type == 'edit') {
                            this.cancelInvoiceDetail();
                            let $self = this;
                            this.isInvoiceEdit = true;
                            this.isEditInfo = true;
                            this.mergeInvoiceList = [];
                            this.isAllCheck = false;
                            this.applyInvoiceDataList.forEach(function (item, index) {
                                $self.applyInvoiceDataList[index].checked = false;
                            });
                        }
                        this.request({
                            url: "/signCloud/invoice/invoiceHedgeInfo.do",
                            param: {
                                invoiceId: data.id
                            }
                        }).then((data) => {
                            if (data) {
                                if (data.length > 0) {
                                    this.$refs['form'].resetFields();
                                    this.invoiceForm = Object.assign(this.invoiceForm, data[0]);
                                    if (!data[0].price) {
                                        this.invoiceForm.price = this.invoiceForm.invicedPrice;
                                        delete this.invoiceForm.invicedPrice;
                                    }
                                    this.editOldPrice = this.invoiceForm.price;
                                    this.invoiceForm.billingUserId = this.currentUser.id;

                                    //初始化附件上传控件数据
                                    this.attachmentList = new Array();
                                    this.attachmentFileList = new Array();
                                    if (this.invoiceForm.attList.length > 0) {
                                        this.invoiceForm.attList.forEach(item => {
                                            this.attachmentList.push(item.attachmentId);
                                            this.attachmentFileList.push(item);
                                        });
                                    }
                                }
                                try {
                                    let _parentDiv = document.getElementsByClassName('sign-cloud-center')[0];
                                    _parentDiv.scrollTop = _parentDiv.scrollHeight;
                                }catch (e) {

                                }
                            }
                        });
                    }
                }
            },
            uploadSuccess(name, file) {
                this.isUploading = false;
                this.attachmentList.push(name);
                if (!this.invoiceForm.attList) {
                    this.invoiceForm.attList = new Array();
                }
                this.invoiceForm.attList.push(file);
                this.attachmentFileList.push(file);
            },
            uploadRemove(name, file) {
                let _index = this.attachmentList.indexOf(name);
                this.attachmentList.splice(_index, 1);
                this.attachmentFileList.splice(_index, 1);
                this.invoiceForm.attList.splice(_index, 1);
            },
            changeUploadState(state) {
                this.isUploading = !state;
            }
        }
    };
</script>

<style scoped>
    .invoice-form .ivu-form-item {
        padding-left: 100px;
    }

    .invoice-form .ivu-form-item.normal {
        padding-left: 0;
    }

    .invoice-form >>> .ivu-form-item-label {
        color: #a2a2a2;
        font-weight: 600;
        line-height: 16px;
    }

    .invoice-form .normal >>> .ivu-form-item-label {
        text-align: right;
    }

    .invoice-form >>> .ivu-input-group-append, .invoice-form >>> .ivu-input-group-prepend {
        background-color: transparent;
        border: 0;
        border-bottom: 1px solid #eee;
        border-radius: 0;
    }

    .invoice-form .invoice-type {
        padding: 2px;
        margin-left: 10px;
        border-radius: 5px;
        background: #59b399;
        color: #FFF;
    }

    .invoice-form .invoice-info {
        display: inline;
    }

    .invoice-form .invoice-info span:first-child {
        margin-right: 20px;
    }

    .invoice-form .invoiced-price span {
        font-size: 12px;
    }

    .invoice-form .invoice-time {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
    }

    .invoice-form .check-button {
        color: #333333;
        background: #e5e5e5;
        border: 1px solid #e5e5e5;
        border-radius: 0;
        margin: 0 10px 0 5px;
        font-size: 12px;
        padding: 6px 16px;
    }

    .invoice-form .check-button.active {
        position: relative;
        color: #59b399;
        background: #FFF;
        border: 1px solid #59b399;
    }

    .invoice-form .check-button.active >>> span:after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0;
        height: 0;
        border-bottom: 15px solid #59b399;
        border-left: 20px solid transparent;
    }

    .invoice-form .check-button.active:after {
        font-family: Ionicons;
        font-size: 12px;
        content: "\F383";
        position: absolute;
        bottom: -5px;
        right: 2px;
        color: #FFF;
    }

    .invoice-form .money-info {
        border-bottom: 1px solid #eee;
        color: #a2a2a2;
        font-weight: 600;
        margin-top: 20px;
        padding-bottom: 20px;
    }

    .invoice-form .money-info span:first-child{
        width: 100px;
        display: inline-block;
    }

    .invoice-form .money-info span:nth-child(2){
        color: #333333;
        font-weight: 700;
    }

    .invoice-form .custom-button {
        background: transparent;
        color: #59b399;
        border: 0;
        border-bottom: 1px solid #59b399;
        border-radius: 0;
        line-height: 30px;
    }

    .invoice-form >>> .ivu-poptip-popper {
        min-width: 700px;
    }

    .invoice-form >>> input {
        border: 1px solid #eee;
        border-radius: 0;
        height: 36px;
    }

    .invoice-form .price >>> input,  .invoice-form >>> input[readonly]{
        border: 1px solid transparent;
        border-bottom: 1px solid #eee;
        border-radius: 0;
    }

    .invoice-form .date >>> input {
        border: 1px solid #eee;
    }

    .invoice-form .saveBtn {
        text-align: center;
        padding: 0!important;
    }

    .invoice-form .ivu-select-single >>> .ivu-select-selection {
        height: 36px;
        border-radius: 0;
    }

    .invoice-form .ivu-select-single >>> .ivu-select-selection span {
        height: 34px;
        line-height: 34px;
    }

    .invoice-form >>> .ivu-poptip-body {
        padding: 0;
    }

    .invoice-form >>> .ivu-form-item-error-tip {
        top: 36px;
    }

    .custom-collapse {
        height: 426px;
        overflow-y: auto;
        border: 0;
    }

    .custom-collapse .time {
        display: inline-block;
        float: right;
        margin-right: 30px;
        font-size: 14px;
    }

    .custom-collapse >>> .ivu-collapse-header {
        border-bottom: 1px solid #eee;
        line-height: 16px;
        padding: 30px 20px;
        height: 76px!important;
    }

    .custom-collapse >>> .ivu-collapse-content {
        padding: 0 64px;
        background-color: #f7f7f7;
    }

    .custom-collapse >>> .ivu-collapse-content .show-info{
        padding: 0;
    }

    .custom-collapse .custom-collapse-header {
        display: inline-block;
        width: 100%;
    }

    .custom-collapse .custom-collapse-header span {
        font-size: 14px;
    }

    .custom-collapse >>> .ivu-collapse-header > i {
        display: none;
    }

    .custom-collapse .applyInvoicePrice {
        min-width: 50px;
        font-size: 16px!important;
        color: #333;
        display: inline-block;
    }

    .custom-collapse .ivu-checkbox-wrapper {
        margin-right: 30px;
    }

    .s-price >>> .ivu-form-item-error-tip{
        white-space: nowrap;
    }

</style>
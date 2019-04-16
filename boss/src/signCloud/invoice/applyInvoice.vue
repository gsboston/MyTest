<template>
    <div style="padding: 10px;">
        <Row :gutter="16">
            <Form class="invoice-form" ref="form" :model="invoiceForm" :rules="ruleValidate" :label-width="120" :style="auth.isMyContract ? 'padding: 0!important;' : ''">
                <Form-item label="开票金额" prop="price" class="normal">
                    <i-col span="21">
                        <Input v-model="invoiceForm.price" size="large" class="price" :maxlength="20">
                            <span slot="prepend">￥</span>
                            <Button slot="append" size="small" @click="calAllPrice">全部开票</Button>
                        </Input>
                    </i-col>
                    <!-- 发票明细 START -->
                    <i-col span="1" offset="1">
                        <Poptip class="aaa" placement="bottom-end" ref="invoiceDetail" trigger="hover" :transfer="true">
                            <Button class="custom-button" size="small">明细</Button>
                            <InvoiceDetail slot="content" :contractId="contractId" :auth="auth" :currentUser="currentUser" pageType="applyInvoice" ref="invoiceDetailDiv" @on-open-invoice-info="openInvoiceInfo" @on-refresh="refresh"></InvoiceDetail>
                        </Poptip>
                    </i-col>
                    <!-- 发票明细 END -->

                    <i-col class="money-info normal" span="19" v-if="!auth.isMyContract">
                        <i-col span="11">
                            <span>可申请金额：</span>
                            <span>￥{{ contractPriceInfo ? contractPriceInfo.total : '00000' }}</span>
                        </i-col>
                        <i-col span="11" offset="2">
                            <span>申请中金额：</span>
                            <span>￥{{ contractPriceInfo ? contractPriceInfo.noneInvoicedPrice.toFixed(2) : '00000' }}</span>
                        </i-col>
                    </i-col>
                </Form-item>

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
                        <Button type="primary" size="large" @click="save">继续开票</Button>
                    </div>
                </Modal>

                <!-- 查看信息 -->
                <div v-if="showInfo">
                    <i-col span="21">
                        <InvoiceInfo :invoiceInfo="invoiceForm" style="padding-left: 100px;"></InvoiceInfo>
                    </i-col>
                    <!-- 发票明细 START -->
                    <i-col span="1">
                        <Button size="small" @click="editInvoiceInfo">编辑</Button>
                    </i-col>
                    <!-- 发票明细 END -->
                    <i-col span="6" offset="9">
                        <Button @click="openPriceTips">提交申请</Button>
                    </i-col>
                </div>
                <!-- 编辑信息 -->
                <i-col v-else span="21" offset="1">
                    <i-col span="8">
                        <FormItem label="发票信息" class="normal">
                            <Select class="custom-select" v-model="invoiceForm.invoiceBillsType">
                                <Option value="PAPER">纸质发票</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="17">
                        <FormItem label="发票类型" prop="invoiceType" class="normal" style=" margin-bottom: 10px;">
                            <Button :class="invoiceForm.invoiceType == 'NORMAL' ? 'check-button active' : 'check-button'" size="small" @click="invoiceTypeChange('NORMAL')">普通发票</Button>
                            <Button :class="invoiceForm.invoiceType == 'SPECIAL' ? 'check-button active' : 'check-button'" size="small" @click="invoiceTypeChange('SPECIAL')">专用发票</Button>
                        </FormItem>
                    </i-col>
                    <i-col span="17">
                        <FormItem prop="titleType" class="normal" style=" margin-bottom: 10px;">
                            <Button :class="invoiceForm.titleType == 'COMPANY' ? 'check-button active' : 'check-button'" size="small" @click="titleTypeChange('COMPANY')">公司</Button>
                            <Button v-if="isNormalInvoice && contractType=='PERSON'" :class="invoiceForm.titleType == 'PERSON' ? 'check-button active' : 'check-button'" size="small" @click="titleTypeChange('PERSON')">个人</Button>
                        </FormItem>
                    </i-col>

                    <i-col span="12">
                        <Form-item label="发票抬头" prop="title" :class="isPerson ? 'ivu-form-item-required normal' : 'normal'"class="normal">
                            <!--<Input v-model="invoiceForm.title" placeholder="请输入发票抬头" :readonly="contractType == 'COMPANY'" :maxlength="100"/>-->
                            <Input v-if="contractType != 'COMPANY'" v-model="invoiceForm.title" placeholder="请输入发票抬头" :maxlength="100"/>
                            <Select v-else v-model="invoiceForm.title">
                                <Option v-for="(item, index) in titleList" :key="index" :value="item.name">{{ item.name }}</Option>
                            </Select>
                        </Form-item>
                    </i-col>
                    <i-col span="12">
                        <Form-item label="纳税人识别号" prop="idno" id="idNoFormItem" :class="isCompany ? 'ivu-form-item-required normal' : 'normal'">
                            <Input v-model="invoiceForm.idno" placeholder="请输入纳税人识别号" :maxlength="25"/>
                        </Form-item>
                    </i-col>

                    <!-- 专用发票 START -->
                    <div v-if="!isNormalInvoice">
                        <i-col span="12">
                            <Form-item label="开户银行" prop="bankName" class="normal">
                                <Input v-model="invoiceForm.bankName" placeholder="请输入开户银行" :maxlength="100"/>
                            </Form-item>
                        </i-col>
                        <i-col span="12">
                            <Form-item label="开户账号" prop="bankAccount" class="normal">
                                <Input v-model="invoiceForm.bankAccount" placeholder="请输入开户账号" :maxlength="50"/>
                            </Form-item>
                        </i-col>
                        <i-col span="12">
                            <Form-item label="单位电话" prop="companyPhone" class="normal">
                                <Input v-model="invoiceForm.companyPhone" placeholder="请输入单位电话" :maxlength="20"/>
                            </Form-item>
                        </i-col>
                        <i-col span="12">
                            <Form-item label="单位地址" prop="companyAddress" class="normal">
                                <Input v-model="invoiceForm.companyAddress" placeholder="请输入单位地址" :maxlength="50"/>
                            </Form-item>
                        </i-col>
                    </div>
                    <!-- 专用发票 END -->

                    <i-col span="17">
                        <FormItem label="接收方式" prop="deliveryType" class="normal" style=" margin-bottom: 10px;">
                            <Button :class="invoiceForm.deliveryType == 'SELF' ? 'check-button active' : 'check-button'" size="small" @click="deliveryTypeChange('SELF')">自取</Button>
                            <Button :class="invoiceForm.deliveryType == 'POST' ? 'check-button active' : 'check-button'" size="small" @click="deliveryTypeChange('POST')">邮寄</Button>
                        </FormItem>
                    </i-col>

                    <!-- 是否邮寄发票 START -->
                    <div v-if="isPostInvoice">
                        <i-col span="12">
                            <Form-item label="邮寄联系人" prop="contactName" class="normal">
                                <Input v-model="invoiceForm.contactName" placeholder="请输入邮寄联系人" :maxlength="20"/>
                            </Form-item>
                        </i-col>
                        <i-col span="12">
                            <Form-item label="电子邮箱" prop="contactEmail" class="normal">
                                <Input v-model="invoiceForm.contactEmail" placeholder="请输入电子邮箱" :maxlength="30"/>
                            </Form-item>
                        </i-col>
                        <i-col span="12">
                            <Form-item label="联系电话" prop="contactPhone" class="normal">
                                <Input v-model="invoiceForm.contactPhone" placeholder="请输入联系电话" :maxlength="20"/>
                            </Form-item>
                        </i-col>
                        <i-col span="12">
                            <Form-item label="邮寄地址" prop="contactAddress" class="normal">
                                <Input v-model="invoiceForm.contactAddress" placeholder="请输入邮寄地址" :maxlength="50"/>
                            </Form-item>
                        </i-col>
                    </div>
                    <!-- 是否邮寄发票 END -->

                    <i-col span="24">
                        <FormItem class="normal" label="上传附件">
                            <i-col span="24" style="height: 36px;line-height: 36px;">
                                <span style="font-size: 12px;font-weight: normal;color: #a2a2a2;">（上传文件类型只支持图片或者PDF文件）</span>
                            </i-col>
                            <UploadView :onSuccess="uploadSuccess" :onRemove="uploadRemove" :defaultList="invoiceForm.attList ? invoiceForm.attList : []" @on-change-upload-state="changeUploadState"></UploadView>
                        </FormItem>
                    </i-col>

                    <i-col span="24">
                        <FormItem class="saveBtn">
                            <Button type="primary" :disabled="isUploading" @click="openPriceTips">提交申请</Button>
                        </FormItem>
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
        props: {
            contractId: null,
            currentUser: null,
            auth: {},
            refreshNum: 0
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 10){
                    return value.substring(0,10) + "..." ;
                }
                return value;
            }
        },
        watch: {
            'invoiceForm.deliveryType': function (val) {
                if (val == 'SELF') {
                    this.isPostInvoice = false;
                    this.deliveryTypeChange(val);
                }else {
                    this.isPostInvoice = true;
                }
            },
            'invoiceForm.invoiceType': function (val) {
                if (val == 'NORMAL') {
                    this.isNormalInvoice = true;
                    this.invoiceTypeChange(val);
                }else {
                    this.isNormalInvoice = false;
                }
            },
            refreshNum(value) {
                this.refreshNum = value;
                this.getContractData();
                this.getContractPriceInfo();
            }
        },
        data () {
            let $self = this;
            return {
                showInfo: false,
                invoiceForm: {
                    price: '',
                    invoiceType: 'NORMAL',
                    titleType: 'COMPANY',
                    deliveryType: 'SELF',
                    invoiceBillsType: 'PAPER'
                },
                ruleValidate: {
                    price: [
                        {required: true, message: '申请开票金额不能为空'},
                        {validator(rule, value, callback) {
                            if (value.toString().length <= 20) {
                                if (/^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/.test(value)) {
                                    let _value = parseFloat(value);
                                    if (!isNaN(_value)) {
                                        if (_value <= 0) {
                                            callback([new Error('申请开票金额必须大于0元')]);
                                        } else {
                                            callback();
                                        }
                                    } else {
                                        callback([new Error('开票金额必须大于0元')]);
                                    }
                                }else {
                                    callback(new Error('发票金额最多允许输入两位小数'));
                                }
                            }else {
                                callback(new Error('申请开票金额不允许超过20位数字'));
                            }
                        }}
                    ],
                    title: [
                        {max: 100, message: '发票抬头不允许超过100字符'},
                        {validator(rule, value, callback) {
                            if ($self.invoiceForm.titleType == 'PERSON') {
                                if (!value) {
                                    callback([new Error('发票抬头不能为空')]);
                                }else {
                                    callback();
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                    idno: [
                        {max: 25, message: '纳税人识别号不允许超过25字符'},
                        {validator(rule, value, callback) {
                            if ($self.invoiceForm.titleType == 'COMPANY') {
                                if (!value) {
                                    callback([new Error('纳税人识别号不能为空')]);
                                }else {
                                    callback();
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                    bankName: [
                        {required: true, message: '开户银行不能为空', trigger: 'blur'},
                        {max: 100, message: '开户银行不允许超过100字符'},
                    ],
                    bankAccount: [
                        {required: true, message: '开户账号不能为空', trigger: 'blur'},
                        {pattern:  /^[0-9]*$/ ,message:'请输入正确的开户账号'},
                        {max: 50, message: '开户账号不允许超过50字符'},
                    ],
                    companyPhone: [
                        {required: true, message: '单位电话不能为空', trigger: 'blur'},
                        {max: 20, message: '单位电话不允许超过20字符'},
                    ],
                    companyAddress: [
                        {required: true, message: '单位地址不能为空', trigger: 'blur'},
                        {max: 50, message: '单位地址不允许超过50字符'},
                    ],
                    contactName: [
                        {required: true, message: '邮寄联系人不能为空', trigger: 'blur'},
                        {max: 20, message: '邮寄联系人不允许超过20字符'},
                    ],
                    contactEmail: [
                        {required: true, message: '电子邮箱不能为空', trigger: 'blur'},
                        {max: 30, message: '电子邮箱不允许超过30字符'},
                    ],
                    contactPhone: [
                        {required: true, message: '联系电话不能为空', trigger: 'blur'},
                        // {pattern:  /^[0-9]*$/ ,message:'请输入正确的联系电话'},
                        {max: 20, message: '联系电话不允许超过20字符'},
                        {validator(rule, value, callback) {
                            if (/^[0-9]*$/.test(value)) {
                                callback();
                            }else {
                                if (value.indexOf('-') > -1) {
                                    callback([new Error('请输入不含-的电话号码')]);
                                }else {
                                    callback([new Error('请输入正确的电话')]);
                                }
                            }
                        }}
                    ],
                    contactAddress: [
                        {required: true, message: '邮寄地址不能为空', trigger: 'blur'},
                        {max: 50, message: '邮寄地址不允许超过50字符'},
                    ],
                },
                isNormalInvoice: true,
                isPostInvoice: false,
                contractInfo: null,
                contractPriceInfo: null,
                contractType: 'PERSON',
                saveType: 'add',
                priceTips: false,
                lastInfo: null,
                editOldPrice: 0,
                attachmentList: [],
                attachmentFileList: [],
                isUploading: false,
                titleList: []
            }
        },
        computed: {
            isCompany() {
                if (this.invoiceForm.titleType == 'COMPANY') {
                    return true;
                } else {
                    return false;
                }
            },
            isPerson() {
                if (this.invoiceForm.titleType == 'PERSON') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        created: function () {
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
                                    $self.invoiceForm.title = item.name;
                                    $self.invoiceForm.titleType = item.type;
                                    $self.contractType = item.type;
                                    $self.invoiceForm.invoiceBillsType = 'PAPER';
                                }
                                if (item.subjectAlias != 'B') {
                                    $self.titleList.push(item);
                                }
                            });
                        }
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
                        this.contractPriceInfo.total = this.contractPriceInfo.receiptPrice + this.contractPriceInfo.noneReceivablePrice - this.contractPriceInfo.invoicedPrice - this.contractPriceInfo.noneInvoicedPrice;
                        if (this.contractPriceInfo.total <= 0) {
                            this.contractPriceInfo.total = 0.00;
                        }else {
                            this.contractPriceInfo.total = this.contractPriceInfo.total.toFixed(2);
                        }
                        this.getLastInvoiceInfo();
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
            getLastInvoiceInfo () {
                this.request({
                    url: '/signCloud/invoice/getLastInvoiceInfo.do',
                    param: {
                        contractId: this.contractId
                    }
                }).then(lastInfo => {
                    this.saveType = 'add';
                    this.lastInfo = lastInfo;
                    if (lastInfo) {
                        let invoiceData = Object.assign({}, lastInfo);
                        delete invoiceData.price;
                        delete invoiceData.id;
                        delete invoiceData.dr;
                        delete invoiceData.tsInsert;
                        delete invoiceData.invoiced;
                        delete invoiceData.isInvoiced;
                        if (this.$refs['form']) {
                            this.$refs['form'].resetFields();
                        }
                        this.invoiceForm = Object.assign(this.invoiceForm, invoiceData);
                        this.invoiceForm.invoiceBillsType = 'PAPER';
                        this.showInfo = true;
                    }
                });
            },
            openInvoiceInfo (data) {
                //获取需要更新的发票信息
                if (data) {
                    if (!data.isInvoiced || data.isInvoiced == '0') {
                        this.$refs['invoiceDetail'].cancel();
                        if (data.invoiceId) {
                            this.saveType = 'update';
                            this.request({
                                url: "/signCloud/invoice/info.do",
                                param: {
                                    id: data.invoiceId
                                }
                            }).then((data) => {
                                this.invoiceForm = Object.assign(this.invoiceForm, data);
                                this.showInfo = false;
                                this.editOldPrice = this.invoiceForm.price;

                                //初始化附件上传控件数据
                                this.attachmentList = new Array();
                                this.attachmentFileList = new Array();
                                if (this.invoiceForm.attList.length > 0) {
                                    this.invoiceForm.attList.forEach(item => {
                                        this.attachmentList.push(item.attachmentId);
                                        this.attachmentFileList.push(item);
                                    });
                                }
                            });
                        }
                    }
                }
            },
            invoiceTypeChange (val) {
                //发票类型控制
                this.invoiceForm.invoiceType = val;
                if (val == 'NORMAL'){
                    this.isNormalInvoice = true;
                    this.invoiceForm.titleType = this.contractType;
                    this.invoiceForm.bankName = '';
                    this.invoiceForm.bankAccount = '';
                    this.invoiceForm.companyPhone = '';
                    this.invoiceForm.companyAddress = '';
                }else{
                    this.isNormalInvoice = false;
                    this.invoiceForm.titleType = 'COMPANY';
                }
            },
            deliveryTypeChange (val) {
                //邮寄方式控制
                if (val == 'SELF') {
                    this.isPostInvoice = false;
                    this.invoiceForm.contactName = '';
                    this.invoiceForm.contactPhone = '';
                    this.invoiceForm.contactEmail = '';
                    this.invoiceForm.contactAddress = '';
                }else {
                    this.isPostInvoice = true;
                    if (this.lastInfo) {
                        this.invoiceForm.contactName = this.lastInfo.contactName;
                        this.invoiceForm.contactEmail = this.lastInfo.contactEmail;
                        this.invoiceForm.contactPhone = this.lastInfo.contactPhone;
                        this.invoiceForm.contactAddress = this.lastInfo.contactAddress;
                    }else {
                        if (this.contractInfo.cSList && this.contractInfo.cSList.length > 0) {
                            let $self = this;
                            this.contractInfo.cSList.forEach(function (item) {
                                if (item.subjectAlias == 'A') {
                                    $self.invoiceForm.contactName = item.contactName;
                                    $self.invoiceForm.contactEmail = item.email;
                                    $self.invoiceForm.contactPhone = item.contactPhone;
                                    $self.invoiceForm.contactAddress = item.address;
                                }
                            });
                        }
                    }
                }
                this.invoiceForm.deliveryType =val;
            },
            titleTypeChange (val) {
                this.invoiceForm.titleType =val;
            },
            editInvoiceInfo () {
                this.showInfo = !this.showInfo;
            },
            save () {
                this.priceTips = false;
                let $self = this;
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.invoiceForm.attList = new Array();
                        this.attachmentList.forEach((item, index) => {
                            $self.invoiceForm.attList.push({
                                attachmentId: item,
                                idx: index,
                                type: $self.attachmentFileList[index].type,
                                fileName: $self.attachmentFileList[index].fileName
                            });
                        });
                        this.invoiceForm.contractId = this.contractId;
                        let url = '/signCloud/applyInvoice/save.do';
                        if (this.saveType != 'add') {
                            url = '/signCloud/applyInvoice/update.do';
                        }else {
                            delete this.invoiceForm.id;
                        }
                        this.request({
                            url: url,
                            data: this.invoiceForm
                        }).then(() => {
                            this.$Notice.success({
                                title: '系统提示',
                                desc: '发票申请已提交，请与财务人员确认开票!',
                                duration: 3
                            });
                            if (!this.showInfo) {
                                delete this.invoiceForm.attList;
                                this.editInvoiceInfo();
                            }
                            this.refresh();
                        });
                    }
                });
            },
            refresh() {
                this.getLastInvoiceInfo();
                this.getContractPriceInfo();
                this.$refs['invoiceDetailDiv'].refresh();
                if (this.auth.isMyContract) {
                    this.$emit('on-refresh', this.contractId);
                }else {
                    this.$emit('on-handle-refresh-status', this.contractId);
                }
            },
            openPriceTips() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        let price = parseFloat(this.invoiceForm.price);
                        let total = parseFloat(this.contractPriceInfo.total);
                        if (this.saveType == 'update') {
                            total = this.contractPriceInfo.receiptPrice + this.contractPriceInfo.noneReceivablePrice - this.contractPriceInfo.invoicedPrice - this.contractPriceInfo.noneInvoicedPrice + this.editOldPrice;
                            total = total.toFixed(2);
                        }
                        if (!isNaN(price) && !isNaN(total)) {
                            if (price > total) {
                                this.priceTips = true;
                            }else {
                                this.save();
                            }
                        }else {
                            this.$Message.error("金额信息有误");
                        }
                    }
                });
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
    .invoice-form {
        padding: 0 30px;
    }

    .invoice-form .ivu-form-item {
        padding-left: 100px;
        margin-bottom: 5px;
    }

    .invoice-form .ivu-form-item.normal {
        padding-left: 0;
        margin-bottom: 24px;
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

    .invoice-form .invoice-type {
        border: 1px solid #eee;
        margin-left: 10px;
        padding: 2px;
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

    .invoice-form .price >>> input {
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

    .invoice-form >>> .ivu-input-group-append, .invoice-form >>> .ivu-input-group-prepend {
        background-color: transparent;
        border: 0;
        border-bottom: 1px solid #eee;
        border-radius: 0;
    }

    .invoice-form .saveBtn >>> .ivu-form-item-content {
        margin-left: 0!important;
    }

    .invoice-form >>> .ivu-poptip-body {
        padding: 0;
    }

    .invoice-form >>> .ivu-form-item-label {
        text-align: left;
        color: #a2a2a2;
        font-weight: 600;
        line-height: 16px;
    }

    .invoice-form .normal >>> .ivu-form-item-label {
        text-align: right;
    }

    .invoice-form .custom-select.ivu-select-single >>> .ivu-select-selection {
        height: 36px;
        border-radius: 0;
    }

    .invoice-form .custom-select.ivu-select-single >>> .ivu-select-selection span {
        height: 34px;
        line-height: 34px;
    }

    .invoice-form >>> .ivu-form-item-error-tip {
        top: 36px;
    }
</style>

<style>
    div[data-transfer="true"].ivu-poptip-popper {
        min-width: 700px;
    }
    div[data-transfer="true"].ivu-poptip-popper .ivu-poptip-body{
        padding: 0;
    }
</style>
<template>
    <div style="padding: 10px;">
        <Row>
            <Form class="invoice-form" ref="form" :model="invoiceForm" :label-width="100" :rules="ruleValidate">
                <!-- 编辑信息 -->
                <i-col span="23">
                    <i-col span="12">
                        <FormItem class="normal s-price" label="发票金额" prop="price">
                            <Input v-model="invoiceForm.price" placeholder="请输入发票金额" :readonly="pageType == 'hedge'" :maxlength="20"/>
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
                                <Button :class="invoiceForm.invoiceType == 'NORMAL' ? 'check-button active' : 'check-button'" :disabled="pageType == 'hedge'" size="small" @click="invoiceTypeChange('NORMAL')">普通发票</Button>
                                <Button :class="invoiceForm.invoiceType == 'SPECIAL' ? 'check-button active' : 'check-button'" :disabled="pageType == 'hedge'" size="small" @click="invoiceTypeChange('SPECIAL')">专用发票</Button>
                            </div>
                        </FormItem>
                    </i-col>

                    <i-col span="17">
                        <FormItem class="normal" style="margin-bottom: 10px;">
                            <Button :class="invoiceForm.titleType == 'COMPANY' ? 'check-button active' : 'check-button'" :disabled="pageType == 'hedge'" size="small" @click="titleTypeChange('COMPANY')">公司</Button>
                            <Button v-if="invoiceForm.invoiceType == 'NORMAL'" :class="invoiceForm.titleType == 'PERSON' ? 'check-button active' : 'check-button'" :disabled="pageType == 'hedge'" size="small" @click="titleTypeChange('PERSON')">个人</Button>
                        </FormItem>
                    </i-col>

                    <i-col span="12">
                        <FormItem class="normal" label="发票抬头" prop="title">
                            <Input v-model="invoiceForm.title" placeholder="请输入发票抬头" :readonly="(pageType == 'hedge' ? true : contractType == 'COMPANY')"/>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem class="normal" label="发票代码" prop="invoiceCode">
                            <Input v-model="invoiceForm.invoiceCode" placeholder="请输入发票代码" :maxlength="20"/>
                        </FormItem>
                    </i-col>

                    <i-col span="12">
                        <FormItem class="normal" :label="pageType == 'hedge' ? '冲红号码' : '发票号码'" prop="invoiceNumber">
                            <Input v-model="invoiceForm.invoiceNumber" :placeholder="pageType == 'hedge' ? '请输入冲红号码' : '请输入发票号码'" :maxlength="20"/>
                        </FormItem>
                    </i-col>

                    <i-col span="12">
                        <FormItem class="normal ivu-form-item-required" :label="pageType == 'hedge' ? '冲红日期' : '开票日期'" prop="invoicedDate">
                            <DatePicker v-model="invoiceForm.invoicedDate" :placement="pageType == 'hedge' ? 'right-start' : 'top-start' " type="date" :placeholder="pageType == 'hedge' ? '请选择冲红日期' : '请选择开票日期'" class="date" style="width: 100%" :editable="true"></DatePicker>
                        </FormItem>
                    </i-col>

                    <i-col span="12">
                        <FormItem class="normal" label="开票人" prop="drawer">
                            <Select v-model="invoiceForm.drawer">
                                <Option :value="currentUser.realName">{{ currentUser.realName }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="12" v-if="pageType == 'new'">
                        <FormItem class="normal" label="发票领取人" prop="receiverName">
                            <Input v-model="invoiceForm.receiverName" placeholder="请输入发票领取人" :maxlength="20"/>
                        </FormItem>
                    </i-col>

                    <i-col span="24" v-if="pageType != 'hedge'">
                        <FormItem class="normal" label="上传附件">
                            <i-col span="24" style="height: 36px;line-height: 36px;">
                                <span style="font-size: 12px;font-weight: normal;color: #a2a2a2;">（上传文件类型只支持图片或者PDF文件）</span>
                            </i-col>
                            <UploadView :defaultList="invoiceForm.attList ? invoiceForm.attList : []" :onSuccess="uploadSuccess" :onRemove="uploadRemove" @on-change-upload-state="changeUploadState"></UploadView>
                        </FormItem>
                    </i-col>

                    <i-col span="24" class="saveBtn">
                        <i-col span="6" offset="4">
                            <Button type="ghost" @click="cancel">取消</Button>
                        </i-col>
                        <i-col span="6" offset="4">
                            <Button type="primary" :disabled="isUploading" @click="save">确认</Button>
                        </i-col>
                    </i-col>
                </i-col>
            </Form>
        </Row>
    </div>
</template>

<script>
    import UploadView from '../contractDetails/uploadView';

    export default {
        components: {
            UploadView
        },
        data() {
            let $self = this;
            return {
                invoiceForm: {
                    price: '',
                    title: '',
                    invoiceCode: '',
                    invoiceNumber: '',
                    receiverName: '',
                    invoicedDate: new Date(),
                    invoiceType: 'NORMAL',
                    titleType: 'COMPANY',
                    drawer: '',
                    attList: []
                },
                ruleValidate: {
                    price: [
                        {validator(rule, value, callback) {
                            if (!value) {
                                callback([new Error('发票金额不能为空')]);
                            }else {
                                if (value.toString().length > 20) {
                                    callback(new Error('发票金额不允许超过20位数字'));
                                }else {
                                    if (/^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/.test(value)) {
                                        callback();
                                    }else {
                                        callback(new Error('发票金额最多允许输入两位小数'));
                                    }
                                }
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
                        {max: 20, message: '发票代码不允许超过20字符'}
                    ],
                    invoiceNumber: [
                        {required: true, message: ($self.pageType == 'hedge' ? '冲红号码不能为空' : '发票号码不能为空'), trigger: 'blur'},
                        {pattern:  /^[0-9]*$/ ,message: ($self.pageType == 'hedge' ? '冲红号码只允许输入数字' : '发票号码只允许输入数字')},
                        {validator(rule, value, callback) {
                            if (!value) {
                                callback([new Error($self.pageType == 'hedge' ? '冲红号码不能为空' : '发票号码不能为空')]);
                            }else {
                                if (value.length > 20) {
                                    callback(new Error($self.pageType == 'hedge' ? '冲红号码不允许超过20字符' : '发票号码不允许超过20字符'));
                                }else {
                                    callback();
                                }
                            }
                        }}
                    ],
                    invoicedDate: [
                        {validator(rule, value, callback) {
                            if (!value) {
                                callback([new Error($self.pageType == 'hedge' ? '冲红日期不能为空' : '开票日期不能为空')]);
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
                contractType: 'PERSON',
                attachmentList: [],
                attachmentFileList: [],
                isUploading: false
            }
        },
        props: {
            invoiceId: null,
            currentUser: null,
            data: {},
            pageType: null,
            contractId: null,
            isTermination: false,
            invoiceCodeList: null
        },
        watch: {
            invoiceId (val) {
                this.invoiceId = val;
                this.getInvoiceData();
            },
            data (val) {
                this.data = val;
            }
        },
        created() {
            this.getInvoiceData();
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
                            data.cSList.forEach(function (item) {
                                if (item.subjectAlias == 'A') {
                                    $self.invoiceForm.titleType = item.type;
                                    $self.invoiceForm.title = item.name;
                                    $self.contractType = item.type;
                                }
                            });
                        }
                    });
                }
            },
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
                                this.invoiceForm = Object.assign(this.invoiceForm, data[0]);
                                if (this.pageType == 'hedge') {
                                    this.invoiceForm.price = this.invoiceForm.invicedPrice;
                                    this.invoiceForm.receiverName = '';
                                    this.invoiceForm.invoiceNumber = '';
                                    this.invoiceForm.invoicedDate = new Date();
                                }
                            }
                        }
                    });
                }else {
                    this.invoiceForm = Object.assign(this.invoiceForm, this.data);
                    if (this.currentUser) {
                        this.invoiceForm.drawer = this.currentUser.realName;
                    }
                    this.getContractData();
                }
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
            save() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.isTermination) {
                            //判断是否解约页面引用，解约不需要实时保存数据
                            this.request({
                                url: "/signCloud/invoiced/validateCode.do",
                                param: {
                                    invoiceNumber: this.invoiceForm.invoiceNumber,
                                    invoiceCode: this.invoiceForm.invoiceCode
                                }
                            }).then((data) => {
                                if (data) {
                                    this.$Message.info("此发票号码已存在，请检查！");
                                }else {
                                    let _index = this.invoiceCodeList.indexOf(this.invoiceForm.invoiceNumber + '' + this.invoiceForm.invoiceCode);
                                    if (_index > -1) {
                                        this.$Message.info("此发票号码已存在，请检查！");
                                    }else {
                                        this.invoiceCodeList.push(this.invoiceForm.invoiceNumber + '' + this.invoiceForm.invoiceCode);
                                        this.invoiceForm.contractId = this.contractId;
                                        this.callback(true, this.invoiceForm, this.invoiceCodeList);
                                    }
                                }
                            });
                        }else {
                            if (this.pageType == 'new') {
                                this.invoiceForm.attList = new Array();
                                this.attachmentList.forEach((item, index) => {
                                    this.invoiceForm.attList.push({
                                        attachmentId: item,
                                        idx: index,
                                        type: this.attachmentFileList[index].type
                                    });
                                });

                                this.invoiceForm.contractId = this.contractId;
                                this.request({
                                    url: '/signCloud/invoice/save.do',
                                    data: this.invoiceForm
                                }).then(() => {
                                    this.$Notice.success({
                                        title: '发票开具成功'
                                    });
                                    this.$refs['form'].resetFields();
                                    this.invoiceForm.attList = Object.assign([], []);
                                    this.$emit('on-refresh');
                                });
                            }else {
                                this.request({
                                    url: "/signCloud/invoice/invoiceHedge.do",
                                    data: {
                                        invoiceInfo: this.invoiceForm
                                    }
                                }).then(() => {
                                    this.$Message.info("发票冲红成功");
                                    this.callback(true);
                                });
                            }
                        }
                    }
                })
            },
            cancel() {
                if (this.isTermination) {
                    this.callback(false, null, null);
                }else {
                    if (this.pageType == 'new') {
                        this.$refs['form'].resetFields();
                        this.invoiceForm.attList = Object.assign([], []);
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
                        this.callback(false);
                    }
                }
            },
            uploadSuccess(name, file) {
                this.isUploading = false;
                this.attachmentList.push(name);
                this.attachmentFileList.push(file);
            },
            uploadRemove(name, file) {
                let _index = this.attachmentList.indexOf(name);
                this.attachmentList.splice(_index, 1);
                this.attachmentFileList.splice(_index, 1);
            },
            changeUploadState(state) {
                this.isUploading = !state;
            }
        }
    }
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
        margin-top: 24px;
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

    .invoice-info .invoice-empty-list {
        height: 84px;
        text-align: center;
        color: #333;
        font-size: 16px;
        line-height: 84px;
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
        margin: 10px 0;
    }

    .invoice-form .saveBtn button {
        padding: 6px 45px;
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
</style>
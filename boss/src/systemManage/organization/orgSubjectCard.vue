<template>
    <div style="padding: 15px 20px;" class="subject-main-info">
        <Row>
            <Form ref="form" :model="subjectInfo" :label-width="120" :rules="ruleValidate">
                <header class="org-header">
                    <span>签约主体信息</span>
                </header>
                <br/>
                <Row :gutter="16">
                    <i-col span="11">
                        <Form-item label="开户行名称" prop="bankName">
                            <Input v-model="subjectInfo.bankName" placeholder="请输入开户行名称" :maxlength="100" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <Form-item label="银行账号" prop="bankAccount">
                            <Input v-model="subjectInfo.bankAccount" placeholder="请输入银行账号" :maxlength="50" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                </Row>

                <Row :gutter="16">
                    <i-col span="11">
                        <Form-item label="电子邮箱" prop="email">
                            <Input v-model="subjectInfo.email" placeholder="请输入电子邮箱" :maxlength="30" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <Form-item label="联系地址" prop="address">
                            <Input v-model="subjectInfo.address" placeholder="请输入联系地址" :maxlength="50" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                </Row>

                <Row :gutter="16">
                    <i-col span="11">
                        <Form-item label="签约负责人" prop="legalName">
                            <Input v-model="subjectInfo.legalName" placeholder="请输入签约负责人姓名" :maxlength="20" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <Form-item label="签约负责人电话" prop="legalPhone">
                            <Input v-model="subjectInfo.legalPhone" placeholder="请输入签约负责人电话" :maxlength="11" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                </Row>

                <Row :gutter="16">
                    <i-col span="11">
                        <Form-item label="纳税人识别号" prop="taxpayerIdentifier">
                            <Input v-model="subjectInfo.taxpayerIdentifier" placeholder="请输入纳税人识别号" :maxlength="25" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                    <!--<i-col span="11" offset="2">-->
                        <!--<Form-item label="支付地址" prop="payAddress">-->
                            <!--<Input v-model="subjectInfo.payAddress" placeholder="请输入支付地址" :maxlength="25"/>-->
                        <!--</Form-item>-->
                    <!--</i-col>-->
                    <i-col span="11" offset="2">
                        <Form-item label="移动端签约">
                            <i-switch v-model="mobileSignState" size="large" @on-change="changeMobileSignState" :disabled="isReadonly">
                                <span slot="open">开启</span>
                                <span slot="close">关闭</span>
                            </i-switch>
                            <Button v-if="mobileSignState" :class="['check-button', {'active': signatureState}]" :disabled="signatureState || isReadonly" :loading="signLoading" @click="createSignature">{{ signatureState ? '签章已生成' : '生成签章' }}</Button>
                        </Form-item>
                    </i-col>
                </Row>

                <Row :gutter="16">
                    <i-col span="24">
                        <header class="org-header">
                            <span>支付宝支付配置</span>
                        </header>
                        <br/>
                    </i-col>
                </Row>

                <Row :gutter="16">
                    <i-col span="11">
                        <Form-item label="AppID" prop="ailiID">
                            <Input v-model="subjectInfo.ailiID" placeholder="请输入支付宝支付商户ID" :maxlength="30" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <Form-item label="mchId" prop="ailiMchId">
                            <Input v-model="subjectInfo.ailiMchId" placeholder="请输入支付宝支付mchId" :maxlength="100" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                </Row>

                <Row :gutter="16">
                    <i-col span="11">
                        <Form-item label="key" prop="ailiKey">
                            <Input v-model="subjectInfo.ailiKey" placeholder="请输入支付宝支付key" :maxlength="150" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                </Row>

                <Row :gutter="16">
                    <i-col span="24">
                        <header class="org-header">
                            <span>微信支付配置</span>
                        </header>
                        <br/>
                    </i-col>
                </Row>

                <Row :gutter="16">
                    <i-col span="11">
                        <Form-item label="AppID" prop="wxAppId">
                            <Input v-model="subjectInfo.wxAppId" placeholder="请输入微信支付AppID" :maxlength="30" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <Form-item label="AppSecret" prop="wxAppSecret">
                            <Input v-model="subjectInfo.wxAppSecret" placeholder="请输入微信支付AppSecret" :maxlength="100" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                </Row>

                <Row :gutter="16">
                    <i-col span="11">
                        <Form-item label="mchId" prop="wxMchId">
                            <Input v-model="subjectInfo.wxMchId" placeholder="请输入微信支付mchId" :maxlength="100" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                    <i-col span="11" offset="2">
                        <Form-item label="key" prop="wxKey">
                            <Input v-model="subjectInfo.wxKey" placeholder="请输入微信支付key" :maxlength="150" :disabled="isReadonly"/>
                        </Form-item>
                    </i-col>
                </Row>
            </Form>
        </Row>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                subjectInfo: {
                    bankName: '',
                    taxpayerIdentifier: ''
                },
                ruleValidate: {
                    bankName: [
                        {required: true, message: '开户行名称不能为空', trigger: 'blur'},
                        {max: 100, message: '开户行名称不允许超过100字符'},
                    ],
                    bankAccount: [
                        {required: true, message: '银行账号不能为空', trigger: 'blur'},
                        {max: 50, message: '银行账号不允许超过50字符'},
                    ],
                    email: [
                        {required: true, message: '电子邮箱不能为空', trigger: 'blur'},
                        {max: 30, message: '电子邮箱不允许超过30字符'},
                    ],
                    address: [
                        {required: true, message: '联系地址不能为空', trigger: 'blur'},
                        {max: 50, message: '联系地址不允许超过50字符'},
                    ],
                    taxpayerIdentifier: [
                        {required: true, message: '纳税人识别号不能为空', trigger: 'blur'},
                        {max: 25, message: '纳税人识别号不允许超过25字符'},
                    ]
                },
                mobileSignState: false,
                signatureState: false,

                oldData: null,
                isChangeTaxpayerIdentifier: false,
                isChangeOrgName: false,
                signLoading: false
            }
        },
        props: {
            orgId: null,
            orgInfo: null,
            isReadonly: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            orgId(value) {
                this.orgId = value;
                this.getSubjectInfo();
            },
            'subjectInfo.taxpayerIdentifier'(val) {
                this.subjectInfo.taxpayerIdentifier = val;
                if (this.oldData) {
                    if (!String.isNullOrBlank(val) && val != this.oldData.taxpayerIdentifier) {
                        this.isChangeTaxpayerIdentifier = true;
                    }else {
                        this.isChangeTaxpayerIdentifier = false;
                    }
                }else {
                    this.isChangeTaxpayerIdentifier = false;
                }
            },
            orgInfo(val) {
                this.orgInfo = val;
                if (val) {
                    if (val.supportMobileSign) {
                        this.mobileSignState = true;
                    }else {
                        this.mobileSignState = false;
                    }
                }
            }
        },
        created: function () {
            this.getSubjectInfo();
            if (this.orgInfo) {
                if (this.orgInfo.supportMobileSign) {
                    this.mobileSignState = true;
                }else {
                    this.mobileSignState = false;
                }
            }
        },
        methods: {
            refresh () {
                this.getSubjectInfo();
            },
            switchOrgNameChangeState(state) {
                this.isChangeOrgName = state;
                if (!state) {
                    this.isChangeTaxpayerIdentifier = false;
                }
            },
            getSubjectInfo() {
                if (this.orgId){
                    this.request({
                        url: `/systemManage/orgSubject/info.do`,
                        param: {
                            orgId: this.orgId
                        }
                    }).then(data => {
                        if (undefined !== data && null !== data){
                            this.subjectInfo = Object.assign(this.subjectInfo, data);
                            if (!String.isNullOrBlank(this.subjectInfo.signatureId)) {
                                this.signatureState = true;
                            }
                            this.oldData = Object.assign({}, data);
                        }
                    });
                }
            },
            save: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.$emit('callback-valid', true, this.subjectInfo);
                    }else {
                        this.$emit('callback-valid', false);
                    }
                });
            },
            changeMobileSignState(state) {
                if (this.subjectInfo.id) {
                    this.request({
                        url: `/systemManage/organization/supportMobileSign.do`,
                        param: {
                            orgId: this.orgId,
                            state: state
                        }
                    }).then(() => {
                        this.$Message.success(state ? '移动端签约功能开启' : '移动端签约功能关闭');
                    });
                }else {
                    this.$Message.warning('请先保存当前签约主体信息');
                    this.$nextTick(() => {
                        this.mobileSignState = !this.mobileSignState;
                    });
                }
            },
            createSignature() {
                if (!this.signatureState) {
                    new Promise((resolve, reject) => {
                        this.save();
                        this.$emit('on-save-org-info');
                        resolve();
                    }).then(() => {
                        if (this.isChangeOrgName || this.isChangeTaxpayerIdentifier || String.isNullOrBlank(this.subjectInfo.id) || String.isNullOrBlank(this.subjectInfo.taxpayerIdentifier)) {
                            this.$Message.warning('请先确认并保存组织相关信息后，进行生成签章操作');
                        }else {
                            this.signLoading = true;
                            this.request({
                                url: `/systemManage/organization/currentOrgInfo.do`
                            }).then(data => {
                                this.request({
                                    url: `/systemManage/organization/createSignature.do`,
                                    param: {
                                        orgId: this.orgId,
                                        companyName: data.name,
                                        certificateNo: data.orgSubjectVo ? data.orgSubjectVo.taxpayerIdentifier : null
                                    },
                                    timeout: 60000
                                }).then(() => {
                                    this.$Message.success('签章生成成功');
                                    this.signLoading = false;
                                    this.refresh();
                                }, error => {
                                    this.signLoading = false;
                                });
                            });
                        }
                    });
                }
            }
        }
    };
</script>

<style scoped>
    .org-header:before {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background: #eee;
        position: absolute;
        top: 10px;
        left: 0;
    }

    .org-header span {
        display: inline-block;
        background: #fff;
        padding: 0 5px 0 18px;
        position: relative;
        margin-left: 30px;
        font-size: 14px;
    }

    .subject-main-info >>> .ivu-switch-checked {
        border-color: #59b399;
        background-color: #59b399;
    }

    .subject-main-info .check-button {
        border: 1px solid #e5e5e5;
        border-radius: 0;
        margin: 0 10px 0 25px;
        font-size: 12px;
        padding: 6px 16px;
    }

    .subject-main-info .check-button.active {
        position: relative;
        color: #59b399;
        background: #FFF;
        border: 1px solid #59b399;
        cursor: initial;
    }

    .subject-main-info .check-button.active >>> span:after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0;
        height: 0;
        border-bottom: 15px solid #59b399;
        border-left: 20px solid transparent;
    }

    .subject-main-info .check-button.active:after {
        font-family: Ionicons;
        font-size: 12px;
        content: "\F383";
        position: absolute;
        bottom: -5px;
        right: 2px;
        color: #FFF;
    }
</style>
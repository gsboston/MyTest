<template>
    <div class="sign-confirm">
        <div v-if="contractInfo.contractAgrement.status=='NONE' && contractInfo.agrementApprovalVo" style="width: 100%;border-bottom: 1px;border: #f9cd89;height: 50px;background-color: #fffdec;font-size: 14px;line-height: 50px;color: #c5652a">
            <div v-if="contractInfo.agrementApprovalVo.type == 'REJECTED'" class="reject-reason" :title="contractInfo.agrementApprovalVo.comment">
                <p>驳回原因：{{contractInfo.agrementApprovalVo.comment | wordLengthLimit}}</p>
            </div>
            <div v-if="contractInfo.agrementApprovalVo.type == 'CANCEL'" class="reject-reason" :title="contractInfo.agrementApprovalVo.comment">
                <p>取消原因：{{contractInfo.agrementApprovalVo.comment | wordLengthLimit}}</p>
            </div>
        </div>
        <div style="padding: 15px 0 10px 0">
            <span style="font-weight: bold;font-size: 16px;margin-left: 25px">主体变更</span>
        </div>
        <Form ref="form" :model="contractInfo" :rules="ruleValidate" :label-width="80" label-position="left">
            <Row class="subject-info">
                <i-col span="11" class="partner" v-if="contractInfo.subjectList.length > 0">
                    <Card :bordered="false" :dis-hover="true" :padding="20">
                        <p slot="title">甲方信息<span style="font-size: 12px">(变更前甲方信息)</span></p>
                        <Form-item label="甲方：" prop="subjectList[0].name">
                            <Tooltip :content="contractInfo.subjectList[0].name" class="tips" placement="bottom">
                                <Input class="word-filters" v-model="contractInfo.subjectList[0].name" :maxlength="20" :disabled="true"/>
                            </Tooltip>
                        </Form-item>
                        <Row>
                            <i-col span="13">
                                <Form-item label="联系人：" prop="subjectList[0].contactName">
                                    <Tooltip :content="contractInfo.subjectList[0].contactName" class="tips" placement="bottom">
                                        <Input class="word-filters" v-model="contractInfo.subjectList[0].contactName" :maxlength="20" :disabled="true"/>
                                    </Tooltip>
                                </Form-item>
                            </i-col>
                            <i-col span="10" offset="1">
                                <Form-item :label-width="1" prop="subjectList[0].contactPhone">
                                    <Tooltip :content="contractInfo.subjectList[0].contactPhone" class="tips" placement="bottom">
                                        <Input class="word-filters" v-model="contractInfo.subjectList[0].contactPhone" :maxlength="11" :disabled="true"/>
                                    </Tooltip>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Form-item label="邮箱：" prop="subjectList[0].email">
                            <Tooltip :content="contractInfo.subjectList[0].email" class="tips" placement="bottom">
                                <Input class="word-filters" v-model="contractInfo.subjectList[0].email" :maxlength="30" :disabled="true"/>
                            </Tooltip>
                        </Form-item>
                        <Form-item label="地址：" prop="subjectList[0].address">
                            <Tooltip :content="contractInfo.subjectList[0].address" class="tips" placement="bottom">
                                <Input class="word-filters" v-model="contractInfo.subjectList[0].address" placeholder="联系地址" :maxlength="50" :disabled="true"/>
                            </Tooltip>
                        </Form-item>
                    </Card>
                </i-col>
                <i-col span="2" style=" text-align: center;color: #59b399;font-size: 30px;margin-top: 110px;">
                    <Icon type="arrow-right-a"></Icon>
                    <div style="color: #999999;font-size: 14px">
                        <span>变更为</span>
                    </div>
                </i-col>
                <i-col span="11" class="partner" v-if="contractInfo.subjectList.length > 2">
                    <Card :bordered="false" :dis-hover="true" :padding="20">
                        <p slot="title">丙方信息<span style="font-size: 12px">(变更后甲方信息)</span></p>
                        <Form-item label="丙方：" prop="subjectList[2].name">
                            <Tooltip v-if="!isEdited" :content="contractInfo.subjectList[2].name" class="tips" placement="bottom">
                                <Input class="word-filters" v-model="contractInfo.subjectList[2].name" placeholder="丙方名称" :maxlength="20" :disabled="!isEdited"/>
                            </Tooltip>
                            <Input v-else class="word-filters" v-model="contractInfo.subjectList[2].name" placeholder="丙方名称" :maxlength="20" :disabled="!isEdited"/>
                        </Form-item>
                        <Row>
                            <Form-item label="联系人：" prop="subjectList[2].contactName" class="contact-name-error ivu-form-item-required">
                                <i-col span="13">
                                    <Tooltip v-if="!isEdited" :content="contractInfo.subjectList[2].contactName" class="tips" placement="bottom">
                                        <Input class="word-filters" v-model="contractInfo.subjectList[2].contactName" placeholder="联系人姓名" :maxlength="20" :disabled="!isEdited"/>
                                    </Tooltip>
                                    <Input v-else v-model="contractInfo.subjectList[2].contactName" placeholder="联系人姓名" :maxlength="20" :disabled="!isEdited"/>
                                </i-col>
                                <i-col span="10" offset="1">
                                    <Tooltip v-if="!isEdited" :content="contractInfo.subjectList[2].contactPhone" class="tips" placement="bottom">
                                        <Input class="word-filters" v-model="contractInfo.subjectList[2].contactPhone" placeholder="联系人电话" :maxlength="17" :disabled="!isEdited"/>
                                    </Tooltip>
                                    <Input v-else v-model="contractInfo.subjectList[2].contactPhone" placeholder="联系人电话" :maxlength="17" :disabled="!isEdited"/>
                                </i-col>
                            </Form-item>
                        </Row>
                        <Form-item label="邮箱：">
                            <Tooltip v-if="!isEdited" :content="contractInfo.subjectList[2].email" class="tips" placement="bottom">
                                <Input class="word-filters" v-model="contractInfo.subjectList[2].email" placeholder="电子邮箱" :maxlength="30" :disabled="!isEdited"/>
                            </Tooltip>
                            <Input v-else v-model="contractInfo.subjectList[2].email" placeholder="电子邮箱" :maxlength="30" :disabled="!isEdited"/>
                        </Form-item>
                        <Form-item label="地址：" prop="subjectList[2].address">
                            <Tooltip v-if="!isEdited" :content="contractInfo.subjectList[2].address" class="tips" placement="bottom">
                                <Input class="word-filters" v-model="contractInfo.subjectList[2].address" placeholder="联系地址" :maxlength="50" :disabled="!isEdited"/>
                            </Tooltip>
                            <Input v-else class="word-filters" v-model="contractInfo.subjectList[2].address" placeholder="联系地址" :maxlength="50" :disabled="!isEdited"/>
                        </Form-item>
                    </Card>
                </i-col>
                <i-col span="11" class="partner" v-if="contractInfo.subjectList.length > 1">
                    <Card :bordered="false" :dis-hover="true" :padding="20">
                        <p slot="title">乙方基本信息</p>
                        <Form-item label="乙方：" prop="subjectList[1].name">
                            <Tooltip :content="contractInfo.subjectList[1].name" class="tips" placement="bottom">
                                <Input class="word-filters" v-model="contractInfo.subjectList[1].name" :maxlength="20" :disabled="true"/>
                            </Tooltip>
                        </Form-item>
                        <Row>
                            <i-col span="13">
                                <Form-item label="联系人：" prop="subjectList[1].contactName">
                                    <Tooltip :content="contractInfo.subjectList[1].contactName" class="tips" placement="bottom">
                                        <Input class="word-filters" v-model="contractInfo.subjectList[1].contactName" :maxlength="20" :disabled="true"/>
                                    </Tooltip>
                                </Form-item>
                            </i-col>
                            <i-col span="10" offset="1">
                                <Form-item :label-width="1" prop="subjectList[1].contactPhone">
                                    <Tooltip :content="contractInfo.subjectList[1].contactPhone" class="tips" placement="bottom">
                                        <Input class="word-filters" v-model="contractInfo.subjectList[1].contactPhone" placeholder="联系人电话" :maxlength="11" :disabled="true"/>
                                    </Tooltip>
                                </Form-item>
                            </i-col>
                        </Row>
                        <Form-item label="邮箱：" prop="subjectList[1].email">
                            <Tooltip :content="contractInfo.subjectList[1].email" class="tips" placement="bottom">
                                <Input class="word-filters" v-model="contractInfo.subjectList[1].email" placeholder="电子邮箱" :maxlength="30" :disabled="true"/>
                            </Tooltip>
                        </Form-item>
                        <Form-item label="地址：" prop="subjectList[1].address">
                            <Tooltip :content="contractInfo.subjectList[1].address" class="tips" placement="bottom">
                                <Input class="word-filters" v-model="contractInfo.subjectList[1].address" placeholder="联系地址" :maxlength="50" :disabled="true"/>
                            </Tooltip>
                        </Form-item>
                    </Card>
                </i-col>
            </Row>
            <br>

            <Row class="content-info">
                <i-col span="24" class="partner">
                    <Card :bordered="false" :dis-hover="true" :padding="20">
                        <p slot="title">内容变更详细说明</p>
                        <div>鉴于：</div>
                        <div>
                            <span>甲乙双方（甲乙丙三方）于</span>
                            <Form-item :label-width="1" prop="oldSignedDate" style="display: inline-block;line-height: 30px;">
                                <DatePicker disabled class="input150" placeholder="选择日期" v-model="contractInfo.oldSignedDate"></DatePicker>
                            </Form-item>
                            <span>共同签署了</span>
                            <Form-item prop="signedContractName" :label-width="1" style="display: inline-block;line-height: 30px;">
                                <Tooltip v-if="!isEdited" :content="contractInfo.signedContractName" class="tips" placement="bottom">
                                    <Input class="input150" v-model="contractInfo.signedContractName" :maxlength="20" :disabled="!isEdited"/>
                                </Tooltip>
                                <Input v-else class="input150" v-model="contractInfo.signedContractName" :maxlength="20" :disabled="!isEdited"/>
                            </Form-item>
                        </div>
                        <div>
                            <span>（合同编号为</span>
                            <input class="input80" v-model="contractInfo.signedContractCode" :readonly="true">
                            <span>，以下简称为“原合同”），约定甲方委托乙方为其提供</span>
                            <Form-item prop="signedContractContent" :label-width="1" style="display: inline-block;line-height: 30px;white-space: nowrap;">
                                <Tooltip v-if="!isEdited" :content="contractInfo.signedContractContent" class="tips" placement="bottom">
                                    <Input v-model="contractInfo.signedContractContent" :maxlength="20" :disabled="!isEdited"/>
                                </Tooltip>
                                <Input v-else v-model="contractInfo.signedContractContent" :maxlength="20" :disabled="!isEdited"/>
                            </Form-item>
                            <span>服务合作事宜。</span>
                        </div>
                        <div>
                            现因甲方业务经营调整，并经甲、乙、丙三方协商一致，就甲方将原合同（含与原合同相关的协议文件，下同）项下权利义务一并转让丙方等相关事宜达成以协议下，以资共同遵守执行：
                        </div>
                        <div class="change-items">
                            <h4>变更条款</h4>
                            <ul>
                                <li>
                                    <img src="../contractDetails/image/change-item-1.png">
                                    <div>
                                        <input value="甲方" :disabled="true">
                                        <span>将原合同项下权利义务一并转让丙方，丙方同意受让，</span>
                                        <input value="乙方" :disabled="true">
                                        <span>对此确认同意且无任何异议。</span>
                                    </div>
                                </li>
                                <li>
                                    <img src="../contractDetails/image/change-item-2.png">
                                    <div>
                                        <input value="甲、乙" :disabled="true">
                                        <span>双方保证，丙方具有签署及履行本协议与原合同所需相关资质和条件。</span>
                                    </div>
                                </li>
                                <li>
                                    <img src="../contractDetails/image/change-item-3.png">
                                    <div>
                                        <input value="乙方" :disabled="true">
                                        <span>基于原合同对</span>
                                        <input value="甲方" :disabled="true">
                                        <span>所享有的权利和承担的义务分别由丙方享有和承担。</span>
                                    </div>
                                </li>
                                <li>
                                    <img src="../contractDetails/image/change-item-4.png">
                                    <div>
                                        <input value="甲方" :disabled="true">
                                        <span>确认并同意，本协议生效后就原合同中约定的其所享有的权利及应履行的义务均针对本协议中约定的丙方。</span>
                                    </div>
                                </li>
                                <li>
                                    <img src="../contractDetails/image/change-item-5.png">
                                    <div>
                                        <input value="甲、丙" :disabled="true">
                                        <span>双方应做好相关资料、手续等的交接工作，因合同主体变更所产生的一切费用由</span>
                                        <input value="甲方" :disabled="true">
                                        <span>承担。</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </Card>
                </i-col>
            </Row>

            <div class="button-area" v-if="isEdited">
                <div>
                    <Button type="ghost" size="large" class="change-button" @click="cancel">取消</Button>
                    <Button type="primary" size="large" class="change-button" @click="save">提交审核</Button>
                </div>
            </div>
            <div v-if="changeContractId && (contractInfo.contractAgrement.status=='NONE' || contractInfo.contractAgrement.status=='APPROVED')  && isEdited" style="text-align: center;margin-top: 10px;padding-bottom: 20px">
                <span style="text-decoration: underline;font-size: 12px;color: #738096;cursor: pointer;" @click="nullifyAgreement">客户需求变更，作废当前合约</span>
            </div>
        </Form>
    </div>
</template>

<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        components: {ICol},
        props: {
            contractId: null,
            changeContractId: null,
            isEdited: false
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 25){
                    return value.substring(0,25) + "..." ;
                }
                return value;
            },
            wordLengthLimitName : function (value) {
                if(value && value.length > 10){
                    return value.substring(0,10) + "..." ;
                }
                return value;
            },
        },
        data: function() {
            let $self = this;
            return {
                contractInfo: {
                    contractAgrement: {},
                    alertType: 'SUBJECT',
                    oldSignedDate: '',
                    subjectList: [],
                    signedContractName: '',
                    signedContractContent: ''
                },
                ruleValidate: {
                    'subjectList[2].name': [
                        {required: true, message: '丙方名称不能为空', trigger: 'blur'},
                        {max: 20, message: '丙方名称不允许超过20字符'},
                    ],
                    'subjectList[2].contactName': [
                        {validator(rule, value, callback) {
                            let name = $self.contractInfo.subjectList[2].contactName,
                                phone = $self.contractInfo.subjectList[2].contactPhone;
                            if (String.isNullOrBlank(name) || String.isNullOrBlank(phone)) {
                                callback([new Error('丙方联系人信息不能为空')]);
                            }else {
                                if (name.length > 20) {
                                    callback([new Error('丙方联系人不允许超过20字符')]);
                                }else if (phone.length > 17) {
                                    callback([new Error('丙方联系电话不允许超过17字符')]);
                                }else if (!(/^[0-9-]*$/.test(phone))) {
                                    callback([new Error('请输入正确的联系电话')]);
                                }else {
                                    callback();
                                }
                            }
                        }}
                    ],
//                    'subjectList[2].email': [
//                        {required: true, message: '丙方电子邮箱不能为空', trigger: 'blur'},
//                        { pattern:  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ ,message:'请输入正确的邮箱格式'},
//                        {max: 30, message: '丙方电子邮箱不允许超过30字符'},
//                    ],
                    'subjectList[2].address': [
                        {required: true, message: '丙方联系地址不能为空', trigger: 'blur'},
                        {max: 50, message: '丙方联系地址不允许超过50字符'},
                    ],
                    oldSignedDate: [
                        {validator(rule, value, callback) {
                            if (!value) {
                                callback([new Error('签约日期不能为空')]);
                            }else {
                                callback();
                            }
                        }}
                    ],
                    signedContractName: [
                        { required: true, message: '合约名称不能为空', trigger: 'blur' },
                        { max: 20, message: '合约名称不允许超过20字符' }
                    ],
                    signedContractContent: [
                        {required: true, message: '服务描述不能为空', trigger: 'blur'},
                        {max: 20, message: '服务描述不允许超过20字符'},
                    ]
                },
                subjectC: {
                    name: '',
                    contractId: this.contractId,
                    subjectAlias: 'C',
                    contactName: '',
                    contactPhone: '',
                    email: '',
                    address: '',
                }
            }
        },
        created: function () {
            this.initContractInfo();
        },
        methods: {
            initContractInfo() {
                if (this.changeContractId) {
                    this.request({
                        url: 'signCloud/contractSubjectChange/agreementInfo.do',
                        param: {
                            id: this.changeContractId
                        }
                    }).then(data => {
                        data.subjectList = this.initSubjectInfo(data.subjectVoList);
                        this.contractInfo = Object.assign(this.contractInfo, data);
                        this.contractInfo = Object.assign(this.contractInfo, data.contractAgrement);
                    });
                }else if (this.contractId) {
                    this.request({
                        url: '/signCloud/contractSubjectChange/subjectsAndSignedInfo.do',
                        param: {
                            id: this.contractId
                        }
                    }).then(data => {
                        let subjectData = Object.assign([], data.subjectList);
                        data.subjectList = this.initSubjectInfo(subjectData);
                        this.contractInfo = Object.assign(this.contractInfo, data);
                        this.contractInfo.signedContractId = this.contractId;
                        this.contractInfo.signedContractCode = data.contractCode;
                        this.contractInfo.oldSignedDate = data.signedDate;
                    });
                }
            },
            initSubjectInfo(subjectData) {
                let  returnSubjectData = new Array();
                subjectData.forEach(function (item) {
                    if (item.subjectAlias == 'A') {
                        returnSubjectData[0] = item;
                    }else if (item.subjectAlias == 'B') {
                        returnSubjectData[1] = item;
                    }else {
                        returnSubjectData[2] = item;
                    }
                });
                if (!returnSubjectData[0]) {
                    this.subjectC.subjectAlias = 'A';
                    returnSubjectData[0] = this.subjectC;
                }
                if (!returnSubjectData[1]) {
                    this.subjectC.subjectAlias = 'B';
                    returnSubjectData[1] = this.subjectC;
                }
                if (!returnSubjectData[2]) {
                    this.subjectC.subjectAlias = 'C';
                    returnSubjectData[2] = this.subjectC;
                }
                return returnSubjectData;
            },
            save() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.request({
                            url: '/signCloud/contractSubjectChange/save.do',
                            data: this.contractInfo,
                        }).then(() => {
                            this.$Message.success('主体变更已提交审核');
                            this.$api.getApiChangeList(this.contractId);
                        });
                    }
                });
            },
            nullifyAgreement () {
                this.prompt({
                    code: "changeNullifyView",
                    title: "请填写变更协议作废原因",
                    width:600,
                    height:360,
                    props: {
                        changeContractId:this.changeContractId,
                    },
                    callback: (flag,close) => {
                        close();
                        if(flag=="nullify"){
                            this.$api.getApiChangeList(this.contractId);
                        }
                    }
                });
            },
            cancel () {
                this.$api.changeCacel();
            },
        }
    }
</script>

<style scoped>
    .sign-confirm {
        background: #FFF;
        padding: 0 20px 0 20px;
        max-width: 920px;
        margin: 0 auto;
    }

    .sign-confirm >>> .ivu-form-item {
        margin-bottom: 20px;
    }

    .sign-confirm .partner {
        padding: 10px;
    }

    .sign-confirm .ivu-card {
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        border-color: #eee;
        box-shadow: none!important;
    }

    .sign-confirm .ivu-card >>> .ivu-card-head {
        padding: 0 16px;
        border-bottom: 0;
    }

    .sign-confirm .ivu-card .ivu-card-head p {
        color: #59b399;
        font-size: 16px;
    }

    .sign-confirm .subject-info{
        border-bottom: 1px solid #e9eaec;
    }

    .sign-confirm .subject-info >>> input {
        border-radius: 0;
        height: 36px;
        font-size: 14px;
    }

    .sign-confirm .content-info, .sign-confirm .else-info {
        padding: 20px 0;
        line-height: 30px;
    }

    .sign-confirm .content-info .ivu-card >>> .ivu-card-body {
        padding: 0 20px!important;
    }

    .sign-confirm .content-info .ivu-card >>> .ivu-card-body>div {
        margin-top: 10px;
    }

    .sign-confirm .content-info input, .sign-confirm .content-info >>> .ivu-input {
        width: 100px;
        text-align: center;
        font-weight: 600;
        border-radius: 0;
        height: 30px;
    }

    .sign-confirm .content-info .date-desc, .sign-confirm .content-info .date-last-desc {
        display: inline-block;
        font-weight: 600;
        border-bottom: 1px solid #495060;
        margin: 0 -5px;
        padding: 0 5px;
    }

    .sign-confirm .content-info .date-last-desc {
        margin-right: 0;
    }

    .sign-confirm .content-info .change-items {
        border: 1px solid #cfcfcf;
        padding: 20px 30px;
        margin: 10px 30px;
    }

    .sign-confirm .content-info .change-items ul li{
        display: flex;
        margin-top: 10px;
    }

    .sign-confirm .content-info .change-items ul li>div{
        flex: 1;
        -ms-flex: 1;
    }

    .sign-confirm .content-info .change-items ul li img {
        float: left;
        margin-top: 2px;
        width: 25px;
        height: 25px;
    }

    .input40, .input40 >>> .ivu-input {
        width: 40px!important;
    }

    .input70, .input70 >>> .ivu-input {
        width: 70px!important;
    }

    .input80, .input80 >>> .ivu-input {
        width: 80px!important;
    }

    .input150, .input150 >>> .ivu-input {
        width: 150px!important;
    }

    .button-area{
        position: relative;
        height: 90px;
        padding: 30px 0 10px 0;
        text-align: center;
    }

    .change-button{
        width: 100px;
    }

    .reject-reason{
        display: inline-block;
        margin-left: 20px;
        font-size: 14px;
    }

    .reject-contract{
        display: inline-block;
        float: right;
        margin-right: 40px;
        font-size: 14px;
    }

    .sign-confirm >>> .ivu-input[disabled], .sign-confirm fieldset[disabled] .ivu-input {
        color: #333;
    }

    .sign-confirm .content-info >>> input[disabled], .sign-confirm .content-info >>> input[readonly] {
        background: #FFF;
        border: 0;
        border-bottom: 1px solid #495060;
    }

    .sign-confirm .contact-name-error >>> .ivu-form-item-error-tip {
        white-space: nowrap;
        top: 36px;
    }

    .sign-confirm .contact-phone-error >>> .ivu-form-item-error-tip {
        left: initial;
        right: 0;
    }

    .word-filters, .word-filters >>> input {
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .tips, .tips >>> .ivu-tooltip-rel {
        width: 100%;
    }

    .tips >>> .ivu-tooltip-inner {
        white-space: normal;
        word-break: break-all;
    }

    .sign-confirm .ivu-form >>> .ivu-form-item-label, .sign-confirm .ivu-form >>> .ivu-form-item-content {
        font-size: 14px;
    }

    .sign-confirm >>> .ivu-form-item-error-tip {
        padding: 3px 0;
    }
</style>
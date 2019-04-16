<template>
    <div class="contract-item">
        <div>
            <!-- 标准合约 -->
            <div v-if="this.contractElseInfo.isCriterion != false" class="contract-img" @click="preview">
                <div v-if="contract.status === 'APPROVED' || contract.status === 'SIGNED' || contract.status === 'SIGNING'" class="contract-sign-red">
                    <span v-if="contract.status === 'APPROVED'">已核准</span>
                    <span v-else-if="contract.status === 'SIGNED'">已签署</span>
                    <span v-else-if="contract.status === 'SIGNING'">签约中</span>
                </div>
                <div v-if="contract.status === 'TERMINATION'" class="contract-sign-black">
                    <span v-if="contract.status === 'TERMINATION'">已解约</span>
                </div>
            </div>
            <!-- 非标合约 -->
            <Poptip v-if="this.contractElseInfo.isCriterion == false" placement="bottom-start" width="600" class="content-att-list">
                <div class="contract-img">
                    <div v-if="contract.status === 'APPROVED' || contract.status === 'SIGNED' || contract.status === 'SIGNING'" class="contract-sign-red">
                        <span v-if="contract.status === 'APPROVED'">已核准</span>
                        <span v-else-if="contract.status === 'SIGNED'">已签署</span>
                        <span v-else-if="contract.status === 'SIGNING'">签约中</span>
                    </div>
                    <div v-if="contract.status === 'TERMINATION'" class="contract-sign-black">
                        <span v-if="contract.status === 'TERMINATION'">已解约</span>
                    </div>
                </div>
                <div v-if="this.contractElseInfo.contentAttList && this.contractElseInfo.contentAttList.length>0" class="api" slot="content">
                    <div v-for="(fileItem,index) in this.contractElseInfo.contentAttList" :key="index" :value="fileItem.contentAttachmentId" style="display: inline-block;margin-left: 15px;text-align: center">
                        <div class="contract" @click="showFile(fileItem.contentAttachmentId)">
                        </div>
                    </div>
                </div>
                <div v-else class="api" slot="content">
                    <div class="content-att-list-err">
                        <span>当前非标准合同暂无合同正本</span>
                    </div>
                </div>
            </Poptip>
            <Poptip placement="bottom-start" width="600">
                <div v-if="this.contractElseInfo.protocalAttList && this.contractElseInfo.protocalAttList.length>0" class="supplementary-agreement">
                    <span>查看补充协议</span>
                </div>
                <div class="api" slot="content">
                    <div v-for="(fileItem,index) in this.contractElseInfo.protocalAttList" :key="index" :value="fileItem.attachmentId" style="display: inline-block;margin-left: 30px;text-align: center">
                        <div class="contract" @click="showFile(fileItem.attachmentId)">
                        </div>
                        <div :title="fileItem.fileName">
                            <span>{{fileItem.fileName | wordLengthLimit3}}</span>
                        </div>
                    </div>
                </div>
            </Poptip>
        </div>
        <div class="contract-info">
            <p>
                <span>甲&emsp;&emsp;&nbsp;方</span>
                <span :title="contract.subject ? contract.subject : '暂无'" class="item-text">{{contract.subject ? contract.subject : '暂无' | wordLengthLimit}}</span>
            </p>
            <div style="padding-bottom: 20px">
                <div style="display: inline-block;width: 200px">
                    <span style="margin-right: 20px;color: #aaa;font-weight: 600;">合约金额</span>
                    <span class="item-text">￥{{contract.money ? contract.money.toFixed(2) : '0.00'}}</span>
                </div>
                <div style="display: inline-block">
                    <div v-if="contract.agentMode" style="width: 32px;padding: 1px;border-radius: 4px;background: #59b399;color: white;text-align: center;display: inline-block">
                        <span>代录</span>
                    </div>
                    <div v-if="contract.agentMode" :title="contract.createOrgName"  style="display: inline-block;margin-left: 10px;width: 176px">
                        <span>代录组织：{{contract.createOrgName | wordLengthLimit2}}</span>
                    </div>
                    <div v-if="contract.agentMode" :title="contract.createUserName" style="display: inline-block;margin-left: 10px">
                        <span>代录人：{{contract.createUserName | wordLengthLimit3}}</span>
                    </div>
                </div>
            </div>
            <div class="payment">
                <div style="display: inline-block;width: 200px">
                    <span style="margin-right: 20px;color: #aaa;font-weight: 600;">付款方式</span>
                    <span class="item-text">{{contract.paymentName ? contract.paymentName : '暂无'}}</span>
                </div>
                <div style="display: inline-block">
                    <div v-if="contract.agentMode" :title="contract.optOrgName"  style="display: inline-block;margin-left: 46px;width: 176px">
                        <span>销售组织：{{contract.optOrgName | wordLengthLimit2}}</span>
                    </div>
                    <div v-if="contract.agentMode" :title="contract.optUserName" style="display: inline-block;margin-left: 10px">
                        <span>业务员：{{contract.optUserName | wordLengthLimit3}}</span>
                    </div>
                </div>
            </div>
            <RadioGroup v-model="paperType" class="paperType" v-if="this.contractElseInfo.isCriterion != false && isSign && (contract.status === 'APPROVED' || contract.status === 'SIGNING') && this.isEditable">
                <Radio style="font-size: 14px" label="zz">纸质签约</Radio>
                <Radio style="font-size: 14px;margin-left: 20px" label="dz">电子签约</Radio>
            </RadioGroup>
            <div v-if="paperType == 'zz'" class="btn-div">
                <Button v-if="isPreview && this.contractElseInfo.isCriterion != false" type="ghost" class="active" @click="preview">查看合同</Button>
                <Poptip v-if="this.contractElseInfo.isCriterion == false" placement="bottom" width="600" class="content-att-list2">
                    <Button v-if="isPreview" type="ghost" class="active">查看合同</Button>
                    <div v-if="this.contractElseInfo.contentAttList && this.contractElseInfo.contentAttList.length>0" class="api" slot="content">
                        <div v-for="(fileItem,index) in this.contractElseInfo.contentAttList" :key="index" :value="fileItem.contentAttachmentId" style="display: inline-block;margin-left: 15px;text-align: center">
                            <div class="contract" @click="showFile(fileItem.contentAttachmentId)">
                            </div>
                        </div>
                    </div>
                    <div v-else class="api" slot="content">
                        <div class="content-att-list-err">
                            <span>当前非标准合同暂无合同正本</span>
                        </div>
                    </div>
                </Poptip>
                <Button type="primary" @click="openSignConfirm" v-if="isSign && (contract.status === 'APPROVED' || contract.status === 'SIGNING') && this.isEditable">确认已签署</Button>
                <Button v-else-if="contract.attList && contract.attList.length > 0" type="ghost" class="active" @click="visibleAttachment=true">查看附件</Button>
                <Button type="primary" @click="nullifyAgreement" v-if="nullify && (contract.status === 'APPROVED' || contract.status === 'SIGNING') && this.isEditable">作废</Button>
            </div>
            <div v-else class="btn-div">
                <Button type="ghost" class="active" @click="openSignConfirm" v-if="isSign && (contract.status === 'APPROVED' || (contract.status === 'SIGNING' && (contractType == 'PERSON' || subjectsData.length> 2 ))) && this.isEditable">发起签约</Button>
                <Button type="ghost" class="active" @click="preview" v-if="isPreview">查看合同</Button>
                <Poptip v-if="isShowProgress && contract.status === 'SIGNING'" title="" placement="right-end" class="progress-div">
                    <Button class="custom-button">查看进度</Button>
                    <div slot="content">
                        <div class="A-div">
                            <p>
                                <span>甲方：</span>
                                <span class="item-text">{{ subjectsData[0].name }}</span>
                            </p>
                            <p :class="subjectsData[0].isSigned=='SIGNED'?'status-div signed':'status-div un-signed'">
                                <span>{{ subjectsData[0].isSigned=='SIGNED' ? '已签署' : '未签约' }}</span>
                            </p>
                        </div>
                        <div class="B-div">
                            <p>
                                <span>乙方：</span>
                                <span class="item-text">{{ subjectsData[1].name }}</span>
                            </p>
                            <p :class="subjectsData[1].isSigned=='SIGNED'?'status-div signed':'status-div un-signed'">
                                <span>{{ subjectsData[1].isSigned=='SIGNED' ? '已签署' : '未签约' }}</span>
                            </p>
                        </div>
                        <div class="C-div" v-if="subjectsData.length>2">
                            <p>
                                <span>丙方：</span>
                                <span class="item-text">{{ subjectsData[2].name }}</span>
                            </p>
                            <p :class="subjectsData[2].isSigned=='SIGNED'?'status-div signed':'status-div un-signed'">
                                <span>{{ subjectsData[2].isSigned=='SIGNED' ? '已签署' : '未签约' }}</span>
                            </p>
                        </div>
                    </div>
                </Poptip>
                <Button type="primary" @click="nullifyAgreement" v-if="nullify && (contract.status === 'APPROVED' || contract.status === 'SIGNING') && this.isEditable">作废</Button>
            </div>
        </div>
        <Modal v-if="isSign" v-model="signConfirm" class="sign-confirm" width="800" :mask-closable="false" :title="subjectsData.length>2 ? '请确认三方签约信息' : '请确认双方签约信息'">
            <div class="sign-confirm-content" v-if="contract.status == 'APPROVED' || (contract.status == 'SIGNING' && paperType == 'zz')">
                <Row>
                    <Form ref="form" :label-width="80">
                        <i-col span="12" class="partner" v-if="subjectsData.length>0">
                            <Card :bordered="false">
                                <p slot="title">甲方</p>
                                <Form-item label="甲方">
                                    <Input v-model="subjectsData[0].name" disabled/>
                                </Form-item>
                                <Form-item label="负责人">
                                    <Input v-model="subjectsData[0].legalName" placeholder="请输入负责人" :maxlength="20"/>
                                </Form-item>
                                <Form-item label="电话">
                                    <Input v-model="subjectsData[0].legalPhone" placeholder="请输入电话" :maxlength="11"/>
                                </Form-item>
                                <Form-item label="签约日期">
                                    <DatePicker v-model="subjectsData[0].signedDate" type="date" placement="right-end" placeholder="请选择签约日期" style="width: 100%" @on-change="signedDateChange(0, $event)"></DatePicker>
                                </Form-item>
                            </Card>
                        </i-col>
                        <i-col span="12" class="partner" v-if="subjectsData.length>1">
                            <Card :bordered="false">
                                <p slot="title">乙方</p>
                                <Form-item label="乙方">
                                    <Input v-model="subjectsData[1].name" disabled/>
                                </Form-item>
                                <Form-item label="负责人">
                                    <Input v-model="subjectsData[1].legalName" placeholder="请输入负责人" :maxlength="20"/>
                                </Form-item>
                                <Form-item label="电话">
                                    <Input v-model="subjectsData[1].legalPhone" placeholder="请输入电话" :maxlength="11"/>
                                </Form-item>
                                <Form-item label="签约日期">
                                    <DatePicker v-model="subjectsData[1].signedDate" type="date" placement="right-end" placeholder="请选择签约日期" style="width: 100%" @on-change="signedDateChange(1, $event)"></DatePicker>
                                </Form-item>
                            </Card>
                        </i-col>
                        <i-col span="12" class="partner" v-if="subjectsData.length > 2">
                            <Card :bordered="false">
                                <p slot="title">丙方</p>
                                <Form-item label="丙方">
                                    <Input v-model="subjectsData[2].name"/>
                                </Form-item>
                                <Form-item label="负责人">
                                    <Input v-model="subjectsData[2].legalName" placeholder="请输入负责人" :maxlength="20"/>
                                </Form-item>
                                <Form-item label="电话">
                                    <Input v-model="subjectsData[2].legalPhone" placeholder="请输入电话" :maxlength="11"/>
                                </Form-item>
                                <Form-item label="签约日期">
                                    <DatePicker v-model="subjectsData[2].signedDate" type="date" placement="right-end" placeholder="请选择签约日期" style="width: 100%" @on-change="signedDateChange(2, $event)"></DatePicker>
                                </Form-item>
                            </Card>
                        </i-col>
                        <i-col v-if="paperType == 'zz'" :span="subjectsData.length > 2 ? 12 : 24" class="partner">
                            <Card :bordered="false">
                                <p slot="title">
                                    上传附件
                                    <span style="font-size: 12px;font-weight: normal;color: #a2a2a2;">（上传文件类型只支持图片或者PDF文件）</span>
                                </p>
                                <UploadView :onSuccess="uploadSuccess" :onRemove="uploadRemove" @on-change-upload-state="changeUploadState"></UploadView>
                            </Card>
                        </i-col>
                    </Form>
                </Row>
            </div>
            <div class="sign-person-content" v-else-if="contractType == 'PERSON' || subjectsData.length>2">
                <Row :gutter="16">
                    <i-col :span="subjectsData.length>2 ? 12 : 24" v-if="contractType == 'PERSON'">
                        <Card :bordered="false" style="padding: 20px 0;">
                            <div class="sign-person-img">
                                <img :src="imgSrcForA">
                            </div>
                            <p>请<span style="font-weight: 600;font-size: 16px;padding: 0 2px;color: #333;">甲方</span>客户使用微信扫一扫进行签字确认</p>
                            <Button type="primary" @click="closeSignConfirm">客户已签字</Button>
                        </Card>
                    </i-col>
                    <i-col :span="contractType == 'PERSON' ? 12 : 24" v-if="subjectsData.length>2">
                        <Card :bordered="false" style="padding: 20px 0;">
                            <div class="sign-person-img">
                                <img :src="imgSrcForC">
                            </div>
                            <p>请<span style="font-weight: 600;font-size: 16px;padding: 0 2px;color: #333;">丙方</span>客户使用微信扫一扫进行签字确认</p>
                            <Button type="primary" @click="closeSignConfirm">客户已签字</Button>
                        </Card>
                    </i-col>
                </Row>
            </div>
            <div slot="footer" v-if="contract.status == 'APPROVED' || (contract.status == 'SIGNING' && paperType == 'zz')">
                <Button type="ghost" v-if="paperType == 'zz'" @click="closeSignConfirm">暂未签约</Button>
                <Button type="ghost" v-else @click="closeSignConfirm">暂不签约</Button>
                <Button type="primary" :disabled="isSignSubmit" @click="sign">确认签约</Button>
            </div>
            <div slot="footer" v-else></div>
        </Modal>

        <Modal title="查看附件" v-model="visibleAttachment" width="600">
            <UploadView :isEdit="false" :defaultList="contract.attList ? contract.attList : []"></UploadView>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import UploadView from '../contractDetails/uploadView';

    export default {
        props: {
            contractId: null,
            isPreview: {
                type: Boolean,
                default: false
            },
            isSign: {
                type: Boolean,
                default: false
            },
            isShowProgress: {
                type: Boolean,
                default: false
            },
            nullify: {
                type: Boolean,
                default: false
            },
            isInvoice: {
                type: Boolean,
                default: false
            },
            isEditable: {
                type: Boolean,
                default: false
            },
        },
        data: function() {
            return {
                contract: {
                    attList: []
                },
                contractType: null,
                paperType: 'zz',
                contractElseInfo: {},
                imgSrcForA: '',
                imgSrcForC: '',
                signConfirm: false,
                subjectsData: [],
                isSignSubmit: false,
                visibleAttachment: false,
                attachmentValue: 0,
                attachmentList: [],
                attachmentFileList: []
            }
        },
        watch: {
            signConfirm(val) {
                this.signConfirm = val;
                this.subjectsData.forEach(function (item) {
                    item.signedDate = '';
                });
            }
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 20){
                    return value.substring(0,20) + "..." ;
                }
                return value;
            },
            wordLengthLimit2 : function (value) {
                if(value && value.length > 6){
                    return value.substring(0,6) + "..." ;
                }
                return value;
            },
            wordLengthLimit3 : function (value) {
                if(value && value.length > 4){
                    return value.substring(0,4) + "..." ;
                }
                return value;
            }
        },
        created: function () {
            this.initContract();
            this.imgSrcForA = '/signCloud/contractDetails/getQrCode.do?id=' + this.contractId + '&aliasType=A';
            this.imgSrcForC = '/signCloud/contractDetails/getQrCode.do?id=' + this.contractId + '&aliasType=C';
        },
        methods: {
            initContract: function () {
                let $self = this;
                this.request({
                    url: '/signCloud/contractDetails/info.do',
                    param: {
                        id: this.contractId
                    }
                }).then(data => {
                    this.contract = Object.assign(this.contract, data);
                    if (data.cSList && data.cSList.length > 0) {
                        data.cSList.forEach(function (item) {
                            if (item.subjectAlias == 'A') {
                                $self.contractType = item.type;
                            }
                        });
                    }
                });
                this.request({
                    url: '/signCloud/contractView/getContractById.do',
                    param: {
                        id: this.contractId
                    }
                },{
                    url: '/signCloud/contractDetails/getSubjects.do',
                    param: {
                        id: this.contractId
                    }
                }).then((contractElseData, subjectsData) => {
                    this.contractElseInfo = contractElseData;
                    this.subjectsData = subjectsData;
                    this.subjectsData.forEach(function (item) {
                        item.signedDate = '';
                    });
                });
            },
            sign: function () {
                this.isSignSubmit = true;
                let flag = true, itemTitle = '', errorItem = '', $self = this;
                this.subjectsData.every(function (item) {
                    if (item.legalName == '') {
                        flag = false;
                        errorItem = '负责人姓名不能为空';
                    }
                    if (flag) {
                        if (item.legalPhone == '') {
                            flag = false;
                            errorItem = '负责人电话格式不正确';
                        }
                    }
                    if (flag) {
                        if (item.signedDate == '') {
                            flag = false;
                            errorItem = '签约日期不能为空';
                        }
                    }
                    switch (item.subjectAlias) {
                        case 'A':
                            itemTitle = '甲方';
                            break;
                        case 'B':
                            itemTitle = '乙方';
                            break;
                        case 'C':
                            itemTitle = '丙方';
                            break;
                    }
                    if (!flag) {
                        $self.$Message.error(itemTitle + errorItem);
                    }
                    return flag;
                });
                if (flag) {
                    let attachmentData = [];
                    this.attachmentList.forEach((item, index) => {
                        attachmentData.push({
                            attachmentId: item,
                            idx: index,
                            type: this.attachmentFileList[index].type
                        });
                    });
                    this.request({
                        url: '/signCloud/contractDetails/sign.do',
                        timeout: 80000,
                        data: {
                            id: this.contractId,
                            signedType: (this.paperType == 'zz' ? null : 'ELECTRONIC_SIGN'),
                            list: this.subjectsData,
                            attList: attachmentData
                        }
                    }).then(data => {
                        // if (!String.isNullOrBlank(data)) {
                        //     this.$Message.warning(data);
                        // }
                        if (this.paperType == 'zz') {
                            this.$Message.success('合约已签订，请跟进客户收款和申请开票。');
                            this.closeSignConfirm();
                        }else {
                            if (this.contractType == 'COMPANY') {
                                this.$Notice.success({
                                    title: '系统提示',
                                    desc: '签约步骤已发送至客户电子邮箱，请客户确认邮箱并根据步骤进行合约签署'
                                });
                                this.closeSignConfirm();
                            }else {
                                this.contract.status = 'SIGNING';
                            }
                        }
                        this.$api.newApiContractList();
                    }, () => {
                        this.isSignSubmit = false;
                    });
                }else {
                    this.isSignSubmit = false;
                }
            },
            preview: function () {
                if (this.isPreview) {
                    this.request({
                        url: "/signCloud/audit/getOssFileId.do",
                        param: {
                            id: this.contractId
                        }
                    }).then((data)=>{
                        if(data){
                            window.open('/ossController/oss/file.do?id=' + data);
                        }else{
                            this.$Message.error("无合约文件！");
                        }
                    });
                }
            },
            showFile (attachmentId) {
                window.open('/ossController/oss/file.do?id=' + attachmentId);
            },
            openSignConfirm () {
                this.signConfirm = true;
            },
            closeSignConfirm () {
                this.signConfirm = false;
                this.isSignSubmit = false;
                this.subjectsData.forEach(function (item) {
                    item.signedDate = '';
                });
                this.initContract();
            },
            signedDateChange(index, event) {
                this.subjectsData[index].signedDate = event;
            },
            nullifyAgreement () {
                this.prompt({
                    code: "nullify",
                    title: "请填写合约作废原因",
                    width:600,
                    height:360,
                    props: {
                        contractInfo:this.contract,
                    },
                    callback: (flag,close) => {
                        close();
                        if(flag=="nullify"){
                            this.$api.newApiContractList();
                        }
                    }
                });
            },
            uploadSuccess(name, file) {
                this.attachmentList.push(name);
                this.attachmentFileList.push(file);
                this.isSignSubmit = false;
            },
            uploadRemove(name, file) {
                let _index = this.attachmentList.indexOf(name);
                this.attachmentList.splice(_index, 1);
                this.attachmentFileList.splice(_index, 1);
            },
            changeUploadState(state) {
                this.isSignSubmit = !state;
            }
        },
        components: {
            UploadView
        }
    }
</script>

<style scoped>
    .contract-item {
        position: relative;
        display: flex;
        display: -ms-flexbox;
        margin-top: 15px;
        padding: 40px 25px 40px 80px;
        background: white;
        box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.55);
    }
    .contract-sign-red {
        position: absolute;
        top: 20px;
        left: 0;
        width: 60px;
        height: 28px;
        line-height: 28px;
        background: rgb(255, 100, 100);
        box-shadow: 0 0 4px 0 rgba(255, 100, 100, 0.3);
        color: white;
        text-align: center;
        border-top-right-radius: 14px;
        border-bottom-right-radius: 14px;
        font-weight: bold;
        font-size: 14px;
    }
    .contract-sign-black{
        position: absolute;
        top: 20px;
        left: 0;
        width: 60px;
        height: 28px;
        line-height: 28px;
        background: black;
        box-shadow: 0 0 4px 0 rgba(255, 100, 100, 0.3);
        color: white;
        text-align: center;
        border-top-right-radius: 14px;
        border-bottom-right-radius: 14px;
        font-weight: bold;
        font-size: 14px;
    }
    .contract-info {
        width: 100%;
        flex: 1;
        -ms-flex: 1;
        font-size: 14px;
    }
    .contract-item .contract-img {
        position: relative;
        min-width: 170px;
        min-height: 222px;
        margin-right: 60px;
        background-image: url("../contract/image/contract-bg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        cursor: pointer;
    }
    .contract-item .contract-img:hover{
        -webkit-box-shadow: #59b399 0px 0px 10px;
        -moz-box-shadow: #59b399 0px 0px 10px;
        box-shadow: #59b399 0px 0px 10px;
    }
    .contract-item .supplementary-agreement{
        position: relative;
        min-width: 170px;
        margin-top: 10px;
        text-align: center;
        font-size: 14px;
        color: #59b399;
        margin-right: 60px;
        cursor: pointer;
    }
    .api .contract {
        width: 80px;
        height: 100px;
        background-image: url("../contract/image/contract-bg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .contract-item .contract-info>p {
        margin-bottom: 20px;
    }
    .contract-item .contract-info>p span:first-child{
        margin-right: 20px;
        color: #aaa;
        font-weight: 600;
    }

    .contract-item .contract-info .payment {
        margin-bottom: 0px;
        padding-bottom: 20px;
        border-bottom: 1px solid #dddee1;
    }

    .contract-item .contract-info .paperType {
        margin-top: 22px;
        font-size: 14px;
        color: #666;
    }

    .contract-item .contract-info button.active {
        background-color: white;
        color: #59b399;
        border: 1px solid #59b399;
    }

    .contract-item .contract-info button {
        margin-right: 20px;
    }

    .contract-item .contract-info .custom-button {
        float: right;
        font-size: 14px;
        background: transparent;
        color: #59b399;
        border: 0;
        border-bottom: 1px solid #59b399;
        border-radius: 0;
        line-height: 30px;
        margin-right: 0;
        margin-top: 0px;
    }

    .contract-item .contract-info .btn-div {
        margin-top: 22px;
    }

    .contract-item .contract-info .btn-div .custom-button{
        float: initial;
        padding: 0 15px;
    }

    .contract-item .contract-info .progress-div >>> .ivu-poptip-popper{
        max-width: 500px;
    }

    .contract-item .contract-info .progress-div >>> .ivu-poptip-body{
        padding: 20px;
    }

    .contract-item .contract-info .progress-div p{
        display: flex;
        font-size: 14px;
        color: #666;
        margin-bottom: 0;
        padding-bottom: 10px;
    }

    .contract-item .contract-info .progress-div p span:nth-child(2) {
        white-space: normal;
    }

    .contract-item .contract-info .progress-div .status-div {
        border-bottom: 1px solid #dddee1;
        padding-bottom: 20px;
    }

    .contract-item .contract-info .progress-div .B-div, .contract-item .contract-info .progress-div .C-div {
        padding-top: 20px;
    }

    .contract-item .contract-info .progress-div .C-div .status-div, .contract-item .contract-info .progress-div >>> .ivu-poptip-body-content > div div:last-child .status-div {
        border-bottom: 0;
        padding-bottom: 0;
    }

    .contract-item .contract-info .progress-div .status-div span {
        line-height: 24px;
        margin-left: 10px;
    }

    .contract-item .contract-info .progress-div .status-div.signed span:first-child {
        font-weight: 600;
        font-size: 16px;
        color: #59b399;
        margin-left: 42px;
    }

    .contract-item .contract-info .progress-div .status-div.un-signed span:first-child{
        font-weight: 600;
        font-size: 16px;
        color: rgb(255, 100, 100);
        margin-left: 42px;
    }

    .contract-item .item-text {
        color: #333;
        font-weight: normal;
    }

    .sign-person-content {
        text-align: center;
    }

    .sign-person-content p {
        margin: 20px 0 20px;
        text-align: center;
    }

    .sign-person-content >>> .ivu-modal-footer {
        border: 0;
        padding: 0;
    }

    .sign-person-content >>> .ivu-modal-close {
        width: 32px;
        text-align: center;
        background: rgba(0, 0, 0, .9);
        border-radius: 50%;
        right: -16px;
        top: -16px;
    }

    .sign-person-content >>> .ivu-modal-close .ivu-icon {
        color: #FFF;
    }

    .sign-person-content >>> .ivu-modal-content {
        border-radius: 0;
    }

    .sign-person-content .sign-person-img {
        margin: 0 auto;
        width: 200px;
        height: 200px;
        border: 1px solid #eee;
    }

    .sign-person-content .sign-person-img img {
        width: 100%;
    }

    .sign-confirm >>> .ivu-modal {
        top: 20px;
    }

    .sign-confirm >>> .ivu-modal-body {
        background:#eee;
        padding: 0;
    }

    .sign-confirm .sign-confirm-content >>> .ivu-form-item {
        margin-bottom: 10px;
    }

    .sign-confirm .sign-confirm-content .partner {
        padding: 10px;
    }

    .sign-confirm .ivu-card {
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        border-color: #eee;
    }

    .sign-confirm >>> .ivu-card-head {
        padding: 8px 16px;
    }

    .sign-confirm >>> .ivu-modal-footer {
        padding: 5px 18px;
    }

    .attachment-item img{
        width: auto;
        max-width: 100%;
    }
    .content-att-list{
        display: block;
    }
    .content-att-list >>> .ivu-poptip-inner,.content-att-list2 >>> .ivu-poptip-inner{
        height: 121px;
    }
    .content-att-list-err{
        text-align: center;
        font-size: 18px;
        line-height: 100px;
    }
</style>
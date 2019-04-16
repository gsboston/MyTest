<template>
    <div class="container">
        <div style="margin: 15px auto 15px auto;max-width: 920px">
            <div style="display: inline-block">
                <div style="width: 10px;height: 10px;border-radius: 5px;background: #59b399"></div>
            </div>
            <div style="display: inline-block;font-size: 14px;margin-left: 12px;color: rgb(51,51,51);">
                <span>合约编号：{{contractNum}}</span>
            </div>
            <div style="display: inline-block;font-size: 13px;margin-left: 12px;color: rgb(153,153,153);float: right;">
                <span style="display: inline-block; margin-right: 50px;" v-if="optUserName">
                    <span>业务员：</span>
                    <span>{{ optUserName }}</span>
                </span>
                <Button v-if="contractInfo.isCriterion != false" type="ghost" @click.native="preview" style="margin-right: 15px; border-width: 0; border-bottom-width: 1px; font-weight: bold;margin-top: -5px;">查看原合约</Button>
                <Poptip v-else placement="bottom-end" width="600">
                    <div v-if="(contractInfo.protocalAttList && contractInfo.protocalAttList.length>0) || (contractInfo.contentAttList && contractInfo.contentAttList.length>0)" class="supplementary-agreement">
                        <span style="margin-right: 15px; font-weight: bold;padding: 6px 15px;color: #666;border-bottom: 1px solid #dddee1;">查看原合约</span>
                    </div>
                    <div class="api" slot="content">
                        <div v-if="contractInfo.contentAttList && contractInfo.contentAttList.length>0">
                            <p class="api-title">合同正文</p>
                            <div v-for="(fileItem,index) in contractInfo.contentAttList" :key="index" :value="fileItem.attachmentId" style="display: inline-block;margin-left: 30px;text-align: center">
                                <div class="contract" @click="showFile(fileItem.contentAttachmentId)"></div>
                            </div>
                        </div>
                        <div v-if="contractInfo.protocalAttList && contractInfo.protocalAttList.length>0">
                            <p class="api-title">补充协议</p>
                            <div v-for="(fileItem,index) in contractInfo.protocalAttList" :key="index" :value="fileItem.attachmentId" style="display: inline-block;margin-left: 30px;text-align: center">
                                <div class="contract" @click="showFile(fileItem.attachmentId)"></div>
                            </div>
                        </div>
                    </div>
                </Poptip>
            </div>
        </div>
        <!-- 主体变更 -->
        <div v-if="changeType=='SUBJECT'">
            <func-node code="contractSubjectChange" :contractId="contractId" :changeContractId="changeContractId" :isEdited="isEdited"></func-node>
        </div>
        <!-- 内容变更 -->
        <div v-if="changeType=='CONTENT'">
            <func-node code="contractChange" :contractId="contractId" :changeContractId="changeContractId" :isEdited="isEdited"></func-node>
        </div>
        <div class="button-area">
            <div v-if="changeContractInfo.contractAgrement.status=='REJECTING'">
                <Button type="ghost" size="large" class="save-button" @click="rejectedAgreement">驳回</Button>
                <Button type="primary" size="large" class="audit-button" @click="auditSuccess">通过</Button>
            </div>
            <div v-if="changeContractInfo.contractAgrement.status=='APPROVED'">
                <Button type="primary" size="large" class="audit-button" @click="cancelAudit">取消审核</Button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            contractId: null,
            changeContractId: null,
            contractNum: null,
            optUserName: null,
            changeType: null,
            isEdited: false,
            unsignedFile: null,
        },
        data () {
            return {
                userName: "",
                rejectReason: "",
                changeContractInfo: {
                    contractAgrement: {},
                    subjectVoList: []
                },
                contractInfo: {
                    isCriterion: true
                }
            }
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 30){
                    return value.substring(0,30) + "..." ;
                }
                return value;
            }
        },
        mounted () {

        },
        created () {
            this.initChangeInfo();
            this.request({
                url: "/signCloud/contractView/getContractById.do",
                data:{id:this.contractId}
            }).then(item => {
                this.contractInfo = Object.assign(this.contractInfo, item);
            });
        },
        methods: {
            initChangeInfo () {
                var vm = this;
                this.request({
                    url: "/signCloud/contractDetails/getChangeInfoById.do",
                    data:{id:this.changeContractId}
                }).then(item => {
                    vm.changeContractInfo = item;
                });
            },
            rejectedAgreement () {
                this.prompt({
                    code: "rejectChangeView",
                    title: "请填写变更协议驳回原因",
                    width:600,
                    height:260,
                    props: {
                        contractId:this.contractId,
                        changeContractId:this.changeContractId
                    },
                });
            },
            cancelAudit () {
                this.prompt({
                    code: "changeCancelAuditView",
                    title: "请填写变更协议取消审核原因",
                    width:600,
                    height:360,
                    props: {
                        contractInfo:this.changeContractInfo.contractAgrement,
                        subjectAName:this.changeContractInfo.subjectAName
                    },
                    callback: (flag,close) => {
                        close();
                        if(flag=="changeCancelAudit"){
                            this.$api.auditSearch(null);
                        }
                    }
                });
            },
            auditSuccess () {
                this.request({
                    url: "/signCloud/audit/auditChangeContract.do",
                    data:{id:this.changeContractId}
                }).then(() => {
//                    this.$Message.success({content:"该合约审核无漏洞，可进行签约盖章。进行审核通过操作视为对此合约同意进行合约盖章。",duration:3});
                    this.$api.apiAuditSuccess(this.contractId);
                });
            },
            preview () {
                if(this.unsignedFile){
                    window.open("/ossController/oss/file.do?id=" + this.unsignedFile);
                }else{
                    this.$Message.error("无合约文件！");
                }
            },
            showFile (attachmentId) {
                window.open('/ossController/oss/file.do?id=' + attachmentId);
            },
        }
    }
</script>

<style scoped>
    .container{
        position: relative;
        background-color: #f6f6f6;
    }
    iframe {
        height: 5000px;
    }
    .save-button{
        width: 129px;
        height: 39px;
        border: 1px solid #59b399;
        color: #59b399;
        border-radius: 5px;
    }
    .audit-button{
        width: 129px;
        height: 39px;
        background-color: #59b399;
        border: 1px solid #59b399;
        border-radius: 5px;
    }
    .button-area{
        position: relative;
        height: 90px;
        padding: 30px 0;
        text-align: center;
    }

    .api .contract {
        width: 80px;
        height: 100px;
        background-image: url("../../signCloud/contract/image/contract-bg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .api .api-title {
        padding: 8px 16px;
        color: #1c2438;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #dddee1;
        margin-bottom: 20px;
    }
</style>
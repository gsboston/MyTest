<template>
    <div class="container">
        <div v-if="contractInfo.status=='NONE' && contractInfo.approvalComment && (contractInfo.approvalType == 'REJECTED' || contractInfo.approvalType == 'CANCEL_APPROVED')" style="width: 100%;border-bottom: 1px;border: #f9cd89;height: 50px;background-color: #fffdec;font-size: 14px;line-height: 50px;color: #c5652a">
            <div v-if="contractInfo.approvalType == 'REJECTED'" class="reject-reason" :title="contractInfo.approvalComment">
                <p>驳回原因：{{contractInfo.approvalComment | wordLengthLimit}}</p>
            </div>
            <div v-if="contractInfo.approvalType == 'CANCEL_APPROVED'" class="reject-reason" :title="contractInfo.approvalComment">
                <p>取消原因：{{contractInfo.approvalComment | wordLengthLimit}}</p>
            </div>
            <div class="reject-contract">
                <p>甲方：{{contractInfo.subjectName}}</p>
            </div>
        </div>
        <div style="margin: 15px auto 0;width: 920px;padding: 5px 0;">
            <div style="display: inline-block">
                <div style="width: 10px;height: 10px;border-radius: 5px;background: #59b399"></div>
            </div>
            <div style="display: inline-block;font-size: 14px;margin-left: 12px;color: rgb(51,51,51);">
                <span>合约编号：{{contractInfo.code}}</span>
            </div>
            <div style="display: inline-block;font-size: 14px;margin-left: 12px;color: rgb(51,51,51);">
                <span>合约类型：{{contractInfo.serviceFullName}}</span>
            </div>
            <div style="display: inline-block;font-size: 13px;margin-left: 12px;color: rgb(153,153,153);float: right;">
                <span style="display: inline-block; margin-right: 50px;" v-if="contractInfo.optUserName">
                    <span>业务员：</span>
                    <span>{{ contractInfo.optUserName }}</span>
                </span>
                <span style="display: inline-block; margin-right: 50px;" v-if="contractInfo.approvalUseName">
                    <span>审核员：</span>
                    <span>{{ contractInfo.approvalUseName == '超级管理员' ? '系统自动审核' : contractInfo.approvalUseName }}</span>
                </span>
                <Button v-if="this.contractInfo.isCriterion != false" type="ghost" @click.native="preview" style="margin-right: 15px; border-width: 0; border-bottom-width: 1px; font-weight: bold;margin-top: -5px;">查看</Button>
            </div>
            <div v-if="contractInfo.status=='COMMITTED' || (contractInfo.status=='NONE' && contractInfo.approvalComment && (contractInfo.approvalType == 'REJECTED' || contractInfo.approvalType == 'CANCEL_APPROVED'))" style="position:absolute;margin: 55px auto 5px 22px;;z-index: 6">
                <img v-if="contractInfo.status=='COMMITTED'" src="./image/inAudit.png">
                <img v-if="contractInfo.status=='NONE' && contractInfo.approvalComment && contractInfo.approvalType == 'REJECTED'" src="./image/reject.png">
                <img v-if="contractInfo.status=='NONE' && contractInfo.approvalComment && contractInfo.approvalType == 'CANCEL_APPROVED'" src="./image/cancel.png">
            </div>
        </div>
        <div>
            <div style="position: relative" ref="contractBuilder"></div>
        </div>
        <div class="button-area">
            <div v-if="contractInfo.status=='NONE'">
                <Button v-if="B030301" type="ghost" size="large" class="save-button" @click="editAgreement">编辑合约</Button>
                <Button v-if="B030302" type="primary" size="large" class="audit-button" @click="commitAudit">提交审核</Button>
            </div>
            <div v-if="contractInfo.status=='COMMITTED'">
                <Button type="ghost" size="large" class="save-button" @click="rejectedAgreement">驳回</Button>
                <Button type="primary" size="large" class="audit-button" @click="auditSuccess">通过</Button>
            </div>
            <div v-if="contractInfo.status=='APPROVED' && contractInfo.approvalAutoType != 'AUTO'">
                <Button type="primary" size="large" class="audit-button" @click="cancelAudit">取消审核</Button>
            </div>
        </div>
        <div v-if="contractInfo.status=='NONE'" style="text-align: center">
            <span v-if="B030305" style="text-decoration: underline;font-size: 12px;color: #738096;cursor: pointer;" @click="nullifyAgreement">客户需求变更，作废当前合约</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            contractInfo: null,
            B030301: false,//修改合约
            B030302: false,//提交审核
            B030303: false,//审核通过
            B030304: false,//驳回
            B030305: false//合约作废
        },
        data () {
            return {
                userName: "",
                rejectReason: ""
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
            this.request({
                url: "/signCloud/contractView/getContractById.do",
                data:{id:this.contractInfo.id}
            }).then(item => {
                this.contractInfo = Object.assign(this.contractInfo, item);
                this.$set(this.contractInfo, 'tsUpdate', item.update);
                this.$set(this.contractInfo, "fileId", item.unsignedFile);
                this.$set(this.contractInfo, "isCriterion", item.isCriterion);//是否标准合同
                let comp = this.getPage("contractBuilder", {
                    props: {
                        contractId: this.contractInfo.id,
                        contractType: this.contractInfo.defCode,
                        isEditable: false
                    }
                });
                if(comp) {
                    this.$nextTick(() => {
                        this.$refs.contractBuilder.appendChild(comp.$el);
                        comp.jumpTarget && comp.jumpTarget();
                    });
                }
            });
        },
        methods: {
            preview () {
                if(this.contractInfo.fileId){
                    window.open("/ossController/oss/file.do?id=" + this.contractInfo.fileId);
                }else{
                    this.$Message.error("无合约文件！");
                }
            },
            editAgreement () {
                this.$api.apiAgreementEdit(this.contractInfo.id,this.contractInfo.defCode,true);
            },
            commitAudit () {
                this.request({
                    url: "/signCloud/audit/updateContractStatus.do",
                    data:{id:this.contractInfo.id,status:"COMMITTED"}
                }).then(() => {
                    this.$set(this.contractInfo,"status","COMMITTED");
                    this.$Message.info({content:"合约已提交审核，请稍等或直接联系审核人员！",duration:3});
                    this.$api.apiCommitAudit(this.contractInfo.id);
                });
            },
            rejectedAgreement () {
                this.prompt({
                    code: "rejectView",
                    title: "请填写合约驳回原因",
                    width:600,
                    height:360,
                    props: {
                        contractInfo:this.contractInfo,
                    },
                    callback: (flag,close) => {
                        var vm = this;
                        close();
                        if(flag == "reject"){
                            this.request({
                                url: "/signCloud/contractView/getContractById.do",
                                data:{id:this.contractInfo.id}
                            }).then(item => {
                                vm.$api.apiSureReject(item.id);
                                // vm.$api.getHeadCount();
                            });
                        }
                    }
                });
            },
            nullifyAgreement () {
                this.prompt({
                    code: "nullify",
                    title: "请填写合约作废原因",
                    width:600,
                    height:360,
                    props: {
                        contractInfo:this.contractInfo,
                    },
                    callback: (flag,close) => {
                        close();
                        if(flag=="nullify"){
                            // this.$api.getHeadCount();
                            this.$api.search();
                        }
                    }
                });
            },
            cancelAudit () {
                this.prompt({
                    code: "cancelAuditView",
                    title: "请填写合约取消审核原因",
                    width:600,
                    height:360,
                    props: {
                        contractInfo:this.contractInfo,
                    },
                    callback: (flag,close) => {
                        close();
                        if(flag=="cancel"){
                            this.$api.auditSearch(null);
                        }
                    }
                });
            },
            auditSuccess () {
                this.request({
                    url: "/signCloud/audit/auditContract.do",
                    data:{id:this.contractInfo.id}
                }).then(item => {
                    this.$Message.success({content:"该合约审核无漏洞，可进行签约盖章。进行审核通过操作视为对此合约同意进行合约盖章。",duration:3});
                    // this.$set(this.contractInfo,"status","APPROVED");
                    // this.$set(this.contractInfo, 'tsUpdate', item.update);
                    this.$api.apiAuditSuccess(this.contractInfo.id);
                    // this.$api.getHeadCount();
                });
            }
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
    #contractPdfViewFram {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 100px;
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
    .reject-reason{
        display: inline-block;
        margin-left: 20px;
        font-size: 14px;
        color: #FF9933;
    }
    .reject-contract{
        display: inline-block;
        float: right;
        margin-right: 40px;
        font-size: 14px;
        color: #FF9933;
    }
    .no-contract-view {
        position: relative;
        width: 100%;
        height: auto;
        padding-top: 253px;
        background: #f6f6f6 url("../image/no-contract.png") center 100px no-repeat;
        text-align: center;
    }
    .no-contract-view > .tips {
        font-size: 16px;
        line-height: 1.5;
        text-align: center;
        color: #333;
        background: #f6f6f6;
    }
</style>
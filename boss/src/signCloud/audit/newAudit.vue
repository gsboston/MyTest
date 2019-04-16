<template>
    <div class="container">
        <div v-if="contractInfo.contract_status=='NONE' && contractInfo.approvalComment && (contractInfo.approvalType == 'REJECTED' || contractInfo.approvalType == 'CANCEL_APPROVED')" class="reason-div">
            <div v-if="contract.approvalType == 'REJECTED'" class="reject-reason" :title="contract.approvalComment">
                驳回原因：{{contract.approvalComment}}
            </div>
            <div v-if="contract.approvalType == 'CANCEL_APPROVED'" class="reject-reason" :title="contract.approvalComment">
                取消原因：{{contract.approvalComment}}
            </div>
            <div class="reject-contract" :title="contract.subjectName">
                甲方：{{contract.subjectName}}
            </div>
        </div>
        <div style="margin: 15px auto 15px auto;max-width: 920px">
            <div style="display: inline-block">
                <div style="width: 10px;height: 10px;border-radius: 5px;background: #59b399"></div>
            </div>
            <div style="display: inline-block;font-size: 14px;margin-left: 12px;color: rgb(51,51,51);">
                <span>合约编号：{{contractInfo.contract_code}}</span>
                <span style="margin-left: 10px;">合约类型：{{contractInfo.serviceFullName}}</span>
            </div>
            <div style="display: inline-block;font-size: 14px;margin-left: 12px;color: rgb(153,153,153);float: right;">
                <span style="display: inline-block; margin-right: 50px;" v-if="contractInfo.approvalUseName">
                    <span>审核员：</span>
                    <span>{{ contractInfo.approvalUseName == '超级管理员' ? '系统自动审核' : contractInfo.approvalUseName }}</span>
                </span>
                <Button v-if="this.contractInfo.isCriterion != false" type="ghost" @click.native="preview" style="margin-right: 15px; border-width: 0; border-bottom-width: 1px; font-weight: bold;">查看</Button>
            </div>
            <div v-if="contractInfo.contract_status=='COMMITTED' || (contractInfo.contract_status=='NONE' && contractInfo.approvalComment && (contractInfo.approvalType == 'REJECTED' || contractInfo.approvalType == 'CANCEL_APPROVED'))" style="position:absolute;margin: 55px auto 5px 22px;;z-index: 6">
                <img v-if="contractInfo.contract_status=='COMMITTED'" src="./image/inAudit.png">
                <img v-if="contractInfo.contract_status=='NONE' && contractInfo.approvalComment && contractInfo.approvalType == 'REJECTED'" src="./image/reject.png">
                <img v-if="contractInfo.contract_status=='NONE' && contractInfo.approvalComment && contractInfo.approvalType == 'CANCEL_APPROVED'" src="./image/cancel.png">
            </div>
        </div>
        <div>
            <div style="position: relative" ref="contractBuilder"></div>
        </div>
        <div v-if="contractInfo.contract_status=='NONE'" class="button-area">
            <Button type="ghost" size="large" class="save-button" @click="editAgreement">编辑合约</Button>
            <Button type="primary" size="large" class="audit-button" @click="commitAudit">提交审核</Button>
        </div>
        <!--<div v-if="contractInfo.contract_status=='NONE' || contractInfo.contract_status=='COMMITTED'" style="text-align: center;padding: 10px 0 20px 0">-->
            <!--<span style="text-decoration: underline;font-size: 12px;color: #738096;cursor: pointer;" @click="nullifyAgreement">客户需求变更，作废当前合约</span>-->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        props: {
            contractInfo: null,
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
                data:{id:this.contractInfo.contract_id}
            }).then(item => {
                this.$set(this.contractInfo, 'tsUpdate', item.update);
                this.$set(this.contractInfo, 'code', item.code);
                this.$set(this.contractInfo, 'subjectName', item.subjectName);
                this.$set(this.contractInfo, 'contract_status', item.status);
//                this.$set(this.contractInfo, "fileId", item.unsignedFile);
                this.$set(this.contractInfo, "defCode", item.defCode);
                this.$set(this.contractInfo, "serviceFullName", item.serviceFullName);
                this.$set(this.contractInfo, "isCriterion", item.isCriterion);//是否标准合同
                let comp = this.getPage("contractBuilder", {
                    props: {
                        contractId: this.contractInfo.id,
                        contractType: this.contractInfo.defCode,
                        isEditable: false,
                        defId:this.contractInfo.contract_def_id
                    }
                });
                console.info(this.contractInfo);
                console.info(comp);
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
                var vm = this;
                this.request({
                    url: "/signCloud/audit/getOssFileId.do",
                    param: {
                        id:this.contractInfo.contract_id
                    }
                }).then((data)=>{
                    vm.contractInfo.fileId = data;
                    if(vm.contractInfo.fileId){
                        window.open("/ossController/oss/file.do?id=" + vm.contractInfo.fileId);
                    }else{
                        this.$Message.error("无合约文件！");
                    }
                });
            },
            editAgreement () {
                this.$api.open("contractBuilder",{
                    props:{
                        contractId: this.contractInfo.id,
                        contractType: this.contractInfo.defCode,
                        isEditable:true
                    }
                });
            },
            commitAudit () {
                this.request({
                    url: "/signCloud/audit/updateContractStatus.do",
                    data:{id:this.contractInfo.id,status:"COMMITTED"}
                }).then(() => {
                    this.$set(this.contractInfo,"contract_status","COMMITTED");
                    this.$Message.info({content:"合约已提交审核，请稍等或直接联系审核人员！",duration:3});
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
                            this.$api.newApiContractList();
                        }
                    }
                });
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
        flex: 1;
        font-size: 14px;
        color: #FF9933;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 20px;
    }
    .reject-contract{
        display: inline-block;
        flex: 1;
        font-size: 14px;
        color: #FF9933;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 20px;
    }
    .reason-div {
        display: flex;
        width: 100%;
        border: rgb(249, 205, 137);
        height: 50px;
        background-color: rgb(255, 253, 236);
        font-size: 14px;
        line-height: 50px;
        color: rgb(197, 101, 42);
    }
</style>
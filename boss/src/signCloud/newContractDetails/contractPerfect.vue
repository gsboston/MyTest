<template>
    <div class="container">
        <div v-if="contract.status=='NONE' && contract.approvalComment && (contract.approvalType == 'REJECTED' || contract.approvalType == 'CANCEL_APPROVED')" class="reason-div">
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
                <span>合约编号：{{contract.code}}</span>
                <span style="margin-left: 10px">合约类型：{{contract.serviceFullName}}</span>
            </div>
            <div style="display: inline-block;font-size: 14px;margin-left: 12px;color: rgb(153,153,153);float: right;">
                <span style="display: inline-block; margin-right: 50px;" v-if="contract.approvalUseName">
                    <span>审核员：</span>
                    <span>{{ contract.approvalUseName }}</span>
                </span>
            </div>
            <div v-if="(contract.status=='NONE' && contract.approvalComment && (contract.approvalType == 'REJECTED' || contract.approvalType == 'CANCEL_APPROVED'))" style="position:absolute;margin: 55px auto 5px 22px;;z-index: 6">
                <img v-if="contract.status=='NONE' && contract.approvalComment && contract.approvalType == 'REJECTED'" src="../audit/image/reject.png">
                <img v-if="contract.status=='NONE' && contract.approvalComment && contract.approvalType == 'CANCEL_APPROVED'" src="../audit/image/cancel.png">
            </div>
        </div>
        <div>
            <ContractBuilder :isInit="true" :contractId="this.contractId" :defId="this.defId" :contractType="this.contractType" :isEditable="true" :isContractPerfect="true"></ContractBuilder>
        </div>
        <div v-if="contract.status=='NONE' && isInsteadOfEntry" style="text-align: center;padding: 10px 0 20px 0">
            <span style="text-decoration: underline;font-size: 12px;color: #738096;cursor: pointer;" @click="nullifyAgreement">客户需求变更，作废当前合约</span>
        </div>
    </div>
</template>

<script>
    import ContractBuilder from "../contract/contractBuilder.vue";
    export default {
        props:{
            contractId:'',
            defId:'',
            contractType:''
        },
        components: {
            ContractBuilder
        },
        filters: {
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy-MM-dd');
            },
            wordLengthLimit : function (value) {
                if(value && value.length > 30){
                    return value.substring(0,30) + "..." ;
                }
                return value;
            }
        },
        data: function() {
            return {
                userId: null,
                isInsteadOfEntry: false,
                contract: {}
            }
        },
        created: function () {
            this.userId = window.Context.getCurrentUser().id;
            this.initContract();
        },
        methods: {
            initContract: function () {
                var vm = this;
                this.request({
                    url: '/signCloud/contractView/getContractById.do',
                    param: {
                        id: this.contractId
                    }
                }).then(item => {
                    this.contract = item;
                    if(item.creator == vm.userId){
                        vm.isInsteadOfEntry = true;
                    }else{
                        vm.isInsteadOfEntry = false;
                    }
                });
            },
            getContractStatusName (contract_status) {
                var contract_status_name="";
                if(contract_status=='NONE'){
                    contract_status_name='待提交';
                }else if(contract_status=='COMMITTED'){
                    contract_status_name='待审核';
                }else if(contract_status=='APPROVED'){
                    contract_status_name='已核准';
                }else if(contract_status=='SIGNING'){
                    contract_status_name='签约中';
                }else if(contract_status=='SIGNED'){
                    contract_status_name='已签署';
                }else if(contract_status=='TERMINATION'){
                    contract_status_name='已解约';
                }
                return contract_status_name;
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
        }
    }
</script>

<style scoped>
    .container {
        background: #f6f6f6;
    }
    .center {
        position: absolute;
        top: 45px;
        left: 300px;
        right: 0;
        bottom: 0;
        background: #f7f7f7;
        overflow-x: hidden;
        overflow-y: auto;
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
<template>
    <div class="container">
        <div class="title" style="display: flex;margin-top: 10px;white-space: nowrap;">合约编号
            <span style="margin: 0 50px;font-size: 16px; line-height: 18px;">{{contract.contractNum}}</span>
            <div style="width: 100%;text-align: right;font-size: 14px;">
                <p style="display: inline-block;margin-right: 50px;" v-if="contractElseInfo.optUserName">
                    <span>业务员：</span>
                    <span class="item-text">{{ contractElseInfo.optUserName }}</span>
                </p>
                <p style="display: inline-block;margin-right: 50px;" v-if="contractElseInfo.approvalUseName">
                    <span>审核员：</span>
                    <span class="item-text">{{ contractElseInfo.approvalUseName }}</span>
                </p>
            </div>
        </div>
        <div class="clearFix">
            <func-node code="contractInfo" :contractId="contractId" :B030301="B030301" :B030302="B030302" :B030303="B030303" :B030304="B030304"></func-node>
        </div>

        <div v-if="contract.existAgrement" class="title">变更协议记录</div>
        <div v-if="contract.existAgrement" class="change-info">
            <div style="padding-top: 30px;">
                <div class="tab-button-bar">
                    <div :class="tabStatus == 'ZTBG' ? 'tab-button active' : 'tab-button'" @click="checkTab('ZTBG')">
                        <span>主体变更</span>
                    </div>
                    <div :class="tabStatus == 'NRBG' ? 'tab-button active' : 'tab-button'" @click="checkTab('NRBG')">
                        <span>内容变更</span>
                    </div>
                </div>
                <Row>
                    <ul style="border-top: 1px solid #e8e8e8" v-if="contractChangeList.length>0">
                        <li @click.self="showPDF(contractChangeInfo.unsignedFile)" style="height: 54px; line-height: 54px; border-bottom: 1px solid #e8e8e8;font-size: 14px;" v-for="(contractChangeInfo, index) in contractChangeList" :key="index">
                            <div style="display: inline-block; margin-right: 25px;padding-left: 46px; color: rgb(51,51,51);">
                                <b>{{contractChangeInfo.tsInsert | formatDate}}</b>
                            </div>
                            <div style="display: inline-block; margin-right: 25px; color: #59b399;">
                                <b v-if="tabStatus== 'ZTBG'">主体变更</b>
                                <b v-if="tabStatus== 'NRBG'">内容变更</b>
                                <b style="margin-left: 20px">{{contractChangeInfo.signedContractName}}</b>
                            </div>
                            <div v-if="contract.status != 'TERMINATION'&& contractChangeInfo.status == 'NONE' && B030703" style="display: inline-block;margin-right:30px;float: right;color: rgb(153,153,153);">
                                <Button type="primary" @click="changeEdit(contractChangeInfo.id,contractChangeInfo.alertType)" size="large">变更编辑</Button>
                            </div>
                            <div v-if="contract.status != 'TERMINATION'&& contractChangeInfo.status == 'NONE' && B030704" style="display: inline-block;margin-right:30px;float: right;color: rgb(153,153,153);">
                                <Button type="primary" @click="changeNullify(contractChangeInfo.id,contractChangeInfo.alertType)" size="large">作废</Button>
                            </div>
                            <div v-if="contract.status != 'TERMINATION'&& contractChangeInfo.status == 'REJECTING' && B030705" style="display: inline-block;margin-right:30px;float: right;color: rgb(153,153,153);">
                                <Button type="primary" @click="changeAudit(contractChangeInfo.id,contractChangeInfo.alertType)" size="large">变更审核</Button>
                            </div>
                            <div v-if="contract.status != 'TERMINATION'&& contractChangeInfo.status == 'APPROVED' && B030706" style="display: inline-block;margin-right:30px;float: right;color: rgb(51,51,51);">
                                <Button type="primary" @click="sign(contractChangeInfo.id)" size="large">确认已签署</Button>
                            </div>
                            <div v-if="contract.status != 'TERMINATION'&& contractChangeInfo.status == 'APPROVED' && B030704" style="display: inline-block;margin-right:30px;float: right;color: rgb(153,153,153);">
                                <Button type="primary" @click="changeNullify(contractChangeInfo.id,contractChangeInfo.alertType)" size="large">作废</Button>
                            </div>
                            <div v-if="contract.status != 'TERMINATION'&& contractChangeInfo.status == 'APPROVED' && B030707" style="display: inline-block;margin-right:30px;float: right;color: rgb(153,153,153);">
                                <Button type="primary" @click="changeCancel(contractChangeInfo.id)" size="large">取消审核</Button>
                            </div>
                            <div v-if="contractChangeInfo.status == 'EXECUTED'" style="display: inline-block;margin-right:30px;float: right;color: rgb(51,51,51);">
                                <span>{{contractChangeInfo.signedDate | formatDate}}</span>
                            </div>
                            <div v-if="contractChangeInfo.status == 'NONE' || contractChangeInfo.status == 'REJECTING' || contractChangeInfo.status == 'APPROVED' || contractChangeInfo.status == 'EXECUTED' || contractChangeInfo.status == 'INVALID'" style="display: inline-block;margin-right:60px;float: right;color: rgb(51,51,51);">
                                <b v-if="contractChangeInfo.status == 'NONE'">待提交</b>
                                <b v-if="contractChangeInfo.status == 'REJECTING'">审核中</b>
                                <b v-if="contractChangeInfo.status == 'APPROVED'">已审核</b>
                                <b v-if="contractChangeInfo.status == 'EXECUTED'">已生效</b>
                                <b v-if="contractChangeInfo.status == 'INVALID'">已作废</b>
                            </div>
                        </li>
                    </ul>
                    <Alert conllectionAlert show-icon v-else-if="contractChangeList.length==0 && tabStatus== 'ZTBG'" class="custom-alert">暂无主体变更</Alert>
                    <Alert conllectionAlert show-icon v-else-if="contractChangeList.length==0 && tabStatus== 'NRBG'" class="custom-alert">暂无内容变更</Alert>
                </Row>
            </div>
        </div>

        <div class="title">收款信息</div>
        <div class="collection-info">
            <func-node code="collectionView" :contractId="contractId" :collectionAuth="B030302"></func-node>
        </div>

        <div class="title">发票信息</div>
        <div class="invoice-info">
            <func-node code="invoiceView" :agreementId="contractId" :B030601="true" :B030603="true"></func-node>
        </div>

    </div>
</template>

<script>
    export default {
        props: {
            // 打印合同
            B030301: false,
            //收款操作
            B030302: false,
            //申请开票
            B030303: false,
            //开票确认
            B030304: false,
        },
        filters: {
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy-MM-dd');
            }
        },
        data: function() {
            return {
                contractId: "918357103293263874",
                contract: {},
                contractElseInfo: {},
                tabStatus: "ZTBG",
                contractChangeList: [],
                selectedChangeStatus: null,
                invoiceAuth: {}
            }
        },
        created: function () {
            let authRes = window.Context._getAuthResources("F0307");
            this.B030703 = authRes.B030703;
            this.B030704 = authRes.B030704;
            this.B030705 = authRes.B030705;
            this.B030706 = authRes.B030706;
            this.B030707 = authRes.B030707;

            //获取开票页面权限
            this.invoiceAuth = window.Context._getAuthResources('F0306');

            this.initContract();
        },
        methods: {
            initContract: function () {
                this.request({
                    url: '/signCloud/contractDetails/info.do',
                    param: {
                        id: this.contractId
                    }
                },{
                    url: '/signCloud/contractView/getContractById.do',
                    param: {
                        id: this.contractId
                    }
                }).then((contract, contractElseInfo) => {
                    this.contract = contract;
                    this.contractElseInfo = contractElseInfo;
                    if(true){
                        this.getChangeList();
                    }
                });
            },
            /**
             * 变更协议编辑
             */
            changeEdit (changeContractId,changeType){
                if(changeType == 'SUBJECT'){//主体变更
                    this.$api.openRight("contractSubjectChange",{
                        props: {
                            contractId: this.contractId,
                            changeContractId: changeContractId,
                            isEdited: true
                        }
                    });
                }else if(changeType == 'CONTENT'){//内容变更
                    this.$api.openRight("contractChange",{
                        props: {
                            contractId: this.contractId,
                            changeContractId: changeContractId,
                            isEdited: true
                        }
                    });
                }
            },
            /**
             * 确认已签约
             */
            sign (changeContractId){
                this.request({
                    url: '/signCloud/contractDetails/changeContractSign.do',
                    param: {
                        id: changeContractId
                    }
                }).then(() => {
                    this.getChangeList();
                });
            },
            /**
             * 打开变更审核页
             */
            changeAudit (changeContractId,changeType){
                this.$api.openRight("F0307",{
                    props: {
                        contractId: this.contractId,
                        changeContractId: changeContractId,
                        changeType: changeType,
                        contractNum: this.contract.contractNum,
                        optUserName: this.contractElseInfo.optUserName
                    }
                });
            },
            /**
             * 取消审核
             */
            changeCancel (changeContractId){
//                this.request({
//                    url: "/signCloud/audit/changeCancel.do",
//                    data:{id:changeContractId}
//                }).then(() => {
//                    this.getChangeList();
//                    this.$api.getHeadCount();
//                });
            },
            /**
             * 变更协议作废
             */
            changeNullify (changeContractId){
                this.request({
                    url: "/signCloud/audit/changeNullify.do",
                    data:{id:changeContractId}
                }).then(() => {
                    this.getChangeList();
                    this.$api.getHeadCount();
                });
            },

            /**
             * 切换选项卡
             */
            checkTab(status) {
                this.tabStatus = status;
                this.getChangeList();
            },
            /**
             * 获取变更协议列表
             */
            getChangeList(){
                this.request({
                    url: '/signCloud/contractDetails/getContractChangeById.do',
                    param: {
                        id: this.contractId,
                        changeType: this.tabStatus
                    }
                }).then((contractChangeList) => {
                    this.contractChangeList = contractChangeList;
                });
            },
            showPDF (pdfId) {
                if (pdfId) {
                    window.open('/ossController/oss/file.do?id=' + pdfId);
                }else {
                    this.$Message.error('没有合同文件！');
                }
            }
        }
    }
</script>

<style scoped>
    .container {
        background: #f6f6f6;
    }
    .container > .title {
        margin-top: 30px;
        font-size: 18px;
        line-height: 1;
        font-weight: bold;
        color: #aaa;
    }
    .change-info,
    .collection-info,
    .invoice-info {
        position: relative;
        margin-top: 15px;
        padding: 0;
        background: white;
        box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.55);
    }

    .container .item-text {
        color: #333;
        font-weight: normal;
    }
    .tab-button-bar {
        padding: 20px 0 0 46px;
    }
    .tab-button {
        padding-top:5px;
        display: inline-block;
        width: 80px;
        height: 30px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        text-align: center;
        background-color: #eee;
        cursor: pointer;
    }
    .tab-button > span {
        font-size: 14px;
        color: rgb(153,153,153);
    }
    .tab-button.active {
        padding-top:5px;
        display: inline-block;
        width: 80px;
        height: 30px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        text-align: center;
        background-color: #59b399;
    }
    .tab-button.active > span {
        font-size: 14px;
        color: rgb(255,255,255);
    }
    .sign-confirm >>> .ivu-modal-body {
        background:#eee;
        padding: 10px;
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
</style>
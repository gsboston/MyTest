<template>
    <div class="main-div">
        <Row>
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
                    <li @click="showPDF(contractChangeInfo.unsignedFile)" style="height: 54px; line-height: 54px; border-bottom: 1px solid #e8e8e8;font-size: 14px;cursor: pointer" v-for="(contractChangeInfo, index) in contractChangeList" :key="index">
                        <div style="display: inline-block; margin-right: 25px;padding-left: 66px;color: #8a8a8a;">
                            <span>创建日</span>
                            <span style="margin-left: 20px">{{contractChangeInfo.tsInsert | formatDate}}</span>
                        </div>
                        <div style="display: inline-block; margin-right: 25px; color: #59b399;">
                            <!--<b v-if="tabStatus== 'ZTBG'">主体变更</b>-->
                            <!--<b v-if="tabStatus== 'NRBG'">内容变更</b>-->
                            <b style="margin-left: 20px">{{contractChangeInfo.signedContractName}}</b>
                        </div>
                        <div style="display: inline-block;width: 80px;margin-right:60px;float: right;color: #8a8a8a;text-align: center">
                            <span v-if="contractChangeInfo.status == 'NONE'">暂未签署</span>
                            <span v-if="contractChangeInfo.status == 'REJECTING'">暂未签署</span>
                            <span v-if="contractChangeInfo.status == 'APPROVED'">暂未签署</span>
                            <span v-if="contractChangeInfo.status == 'EXECUTED'">已签署</span>
                            <span v-if="contractChangeInfo.status == 'INVALID'">已作废</span>
                        </div>
                        <div v-if="contractChangeInfo.status == 'EXECUTED'" style="display: inline-block;margin-right:30px;float: right;color: #8a8a8a;">
                            <span>{{contractChangeInfo.signedDate | formatDate}}</span>
                        </div>
                    </li>
                </ul>
                <Alert conllectionAlert show-icon v-else-if="contractChangeList.length==0 && tabStatus== 'ZTBG'" class="custom-alert">暂无主体变更</Alert>
                <Alert conllectionAlert show-icon v-else-if="contractChangeList.length==0 && tabStatus== 'NRBG'" class="custom-alert">暂无内容变更</Alert>
            </Row>
        </Row>
    </div>
</template>

<script>
    export default {
        filters: {
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy-MM-dd');
            }
        },
        props: {
            contractId: null,
        },
        data: function() {
            return {
                contractElseInfo: {},
                tabStatus: "ZTBG",
                contractChangeList: [],
            }
        },
        created: function () {
            this.getChangeList();
        },
        methods: {
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
    .main-div >>> .ivu-tabs-nav {
        margin-left: 50%;
        transform: translate(-50%, 0);
    }
    .main-div >>> .ivu-tabs-nav .ivu-tabs-ink-bar{
        background-color: #59b399;
    }
    .main-div >>> .ivu-tabs-nav .ivu-tabs-tab-active {
        color: #59b399;
    }
    .main-div >>> .ivu-tabs-nav .ivu-tabs-tab:hover {
        color: #59b399;
    }
    .main-div .custom-alert {
        position: relative;
        border: 1px solid #eee;
        background-color: initial;
        border-radius: 0;
        margin-bottom: 0;
    }
    .main-div .custom-alert > .ivu-alert-icon {
        top: 30px;
    }
    .main-div .custom-alert {
        position: relative;
        border: 1px solid #eee;
        background-color: initial;
        border-radius: 0;
        margin-bottom: 0;
    }
    .main-div .custom-alert > .ivu-alert-icon {
        top: 30PX;
    }
    .main-div .ivu-alert-info {
        border: 0px solid #d5e8fc;
        border-top: 1px solid #d5f1fc;
        border-bottom: 1px solid #d5f1fc;
        background-color: #eafef9;
    }
    .main-div .ivu-alert {
        border-radius: 0px;
        line-height: 38px;
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
</style>
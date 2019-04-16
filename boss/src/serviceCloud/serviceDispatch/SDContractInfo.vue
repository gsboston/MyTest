<template>
    <div class="contract-item">
        <div>
            <div v-if="contractElseInfo.isCriterion != false" class="contract-img" @click="preview">
                <div class="contract-sign-red">
                    <span v-if="contractInfo.contractStatus === 'SIGNED'">已签署</span>
                    <span v-else>已核准</span>
                </div>
                <div v-if="contractInfo.contractStatus === 'TERMINATION'" class="contract-sign-black">
                    <span v-if="contractInfo.contractStatus === 'TERMINATION'">已解约</span>
                </div>
            </div>
            <!-- 非标合约 -->
            <Poptip v-if="contractElseInfo.isCriterion == false" placement="bottom-start" width="600" style="display: block">
                <div class="contract-img">
                    <div class="contract-sign-red">
                        <span v-if="contractInfo.contractStatus === 'SIGNED'">已签署</span>
                        <span v-else>已核准</span>
                    </div>
                    <div v-if="contractInfo.contractStatus === 'TERMINATION'" class="contract-sign-black">
                        <span v-if="contractInfo.contractStatus === 'TERMINATION'">已解约</span>
                    </div>
                </div>
                <div class="api" slot="content">
                    <div v-for="(fileItem,index) in contractElseInfo.contentAttList" :key="index" :value="fileItem.contentAttachmentId" style="display: inline-block;margin-left: 15px;text-align: center">
                        <div class="contract" @click="showFile(fileItem.contentAttachmentId)">
                        </div>
                    </div>
                </div>
            </Poptip>
            <Poptip placement="bottom-start" width="600">
                <div v-if="contractElseInfo.protocalAttList && contractElseInfo.protocalAttList.length>0" class="supplementary-agreement">
                    <span>查看补充协议</span>
                </div>
                <div class="api" slot="content">
                    <div v-for="(fileItem,index) in contractElseInfo.protocalAttList" :key="index" :value="fileItem.attachmentId" style="display: inline-block;margin-left: 30px;text-align: center">
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
                <span>客&emsp;&emsp;&nbsp;户：</span>
                <Tooltip :content="contractInfo.subjectAName" class="item-text" style="height: 24px;vertical-align: bottom;">
                    {{contractInfo.subjectAName}}
                </Tooltip>
            </p>
            <p>
                <Row>
                    <i-col span="10">
                        <span>合约金额：</span>
                        <span class="item-text">￥{{contractInfo.price ? contractInfo.price : '0.00'}}</span>
                    </i-col>
                    <i-col span="10">
                        <span>签约时间：</span>
                        <span class="item-text">{{ contractInfo.signedTime | formatDate }}</span>
                    </i-col>
                </Row>
            </p>
            <p class="payment" style="display: flex;">
                <span>联系地址：</span>
                <span class="item-text">{{contractInfo.address ? contractInfo.address : '暂无'}}</span>
            </p>
            <div class="btn-div">
                <Button type="ghost" class="active" @click="dispatchService">生成服务单</Button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            contractInfo: null,
        },
        data: function() {
            return {
                collapseValue: '1',
                contractType: null,
                paperType: 'zz',
                contractElseInfo: {},
                imgSrcForA: '',
                imgSrcForC: '',
                subjectsData: [],
                isSignSubmit: false,
                invoiceAuth: {}
            }
        },
        watch: {

        },
        filters: {
            formatDate(time) {
                if (String.isNullOrBlank(time)) {
                    return '-/-';
                }else {
                    var date = new Date(time);
                    return date.format('yyyy/MM/dd');
                }
            },
            wordLengthLimit : function (value) {
                if(value && value.length > 20){
                    return value.substring(0,20) + "..." ;
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
            this.contractId = this.contractInfo.id;
            this.getContractInfo();
            this.imgSrcForA = '/signCloud/contractDetails/getQrCode.do?id=' + this.contractId + '&aliasType=A';
            this.imgSrcForC = '/signCloud/contractDetails/getQrCode.do?id=' + this.contractId + '&aliasType=C';
        },
        methods: {
            preview: function () {
                if (this.contractInfo.contractStatus === 'SIGNED') {
                    if(this.contractInfo.contractFileAttrId) {
                        window.open('/ossController/oss/file.do?id=' + this.contractInfo.contractFileAttrId);
                    }else {
                        this.$Message.error('没有合同文件！');
                    }
                }else {
                    if (this.contractInfo.signedFile) {
                        window.open('/ossController/oss/file.do?id=' + this.contractInfo.signedFile);
                    }else {
                        this.$Message.error('没有合同文件！');
                    }
                }
            },
            showFile (attachmentId) {
                window.open('/ossController/oss/file.do?id=' + attachmentId);
            },
            getContractInfo () {
                this.request({
                    url: '/signCloud/contractView/getContractById.do',
                    param: {
                        id: this.contractId
                    }
                }).then((contractElseData) => {
                    this.contractElseInfo = contractElseData;
                });
            },
            dispatchService() {
                this.card({
                    code: "SDNewCard",
                    title: '生成服务单',
                    width: 700,
                    height: 900,
                    props: {
                        contractInfo: this.contractInfo
                    },
                    callback: (status, type, close) => {
                        if (status) {
                            // if (type == 'dispatch') {
                            //     this.$api.refreshSDPage();
                            // }else {
                                this.$emit('on-refresh');
                            // }
                        }
                        close();
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .contract-item {
        position: relative;
        display: flex;
        margin-top: 15px;
        padding: 40px 80px;
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
        font-size: 14px;
        padding: 20px;
    }
    .contract-item .contract-img {
        position: relative;
        min-width: 170px;
        min-height: 222px;
        margin-right: 40px;
        background-image: url("../../signCloud/contract/image/contract-bg.png");
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
    .contract-item .contract-info>p {
        margin-bottom: 20px;
        padding-left: 20px;
    }
    .contract-item .contract-info>p span:first-child{
        margin-right: 20px;
        color: #aaa;
        font-weight: 600;
        white-space: nowrap;
    }
    .api .contract {
        width: 80px;
        height: 100px;
        background-image: url("../../signCloud/contract/image/contract-bg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
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
    .contract-item .contract-info .payment {
        margin-bottom: 0px;
        padding-bottom: 20px;
        border-bottom: 1px solid #dddee1;
    }
    .contract-item .contract-info button.active {
        background-color: white;
        color: #59b399;
        border: 1px solid #59b399;
        width: 128px;
        line-height: 28px;
        padding: 0;
        margin: 0;
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
        padding-left: 20px;
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

    .contract-item >>> .ivu-tooltip-inner {
        white-space: normal;
        word-break: break-all;
    }

    .contract-item .item-text >>> .ivu-tooltip-rel {
        display: inline-block;
        max-width: 300px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
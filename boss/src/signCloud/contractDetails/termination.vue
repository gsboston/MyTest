<style scoped>
    .root-content{
        background-color: #f6f6f6;
    }
    .original-content{
        margin-top: 15px;
        padding: 20px 65px 40px 15px;
        position: relative;
        width: 100%;
        background-color: white;
        box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.55);
    }
    .title {
        margin-top: 15px;
        font-size: 18px;
        line-height: 1;
        font-weight: bold;
        color: #aaa;
    }
    .original-part-title{
        font-size: 18px;
        font-weight: 700;
        padding-left: 25px;
        padding-bottom: 10px;
        color: #59b399;
    }
    .original-part-content{
        display: flex;
        display: -ms-flex;
        background-color: #f6faf9;
        margin-left: 40px;
        padding-right: 20px;
        padding: 20px 40px 20px 40px;
    }
    .save-button{
        width: 129px;
        height: 39px;
        border: 1px solid #59b399;
        color: #59b399;
        border-radius: 5px;
    }
    hr{
        margin-top: 20px;
        background-color: #e5e5e5;
        height: 1px;
        border: none;
    }
    .contract-info {
        width:100%;
        flex: 1;
        -ms-flex: 1;
        padding: 20px 0;
    }
    .contract-info-table {
        width: 100%;
        display: table;
    }
    .contract-info-row {
        display: table-row;
    }
    .contract-info-row > div {
        display: table-cell;
        padding-top: 30px;
    }

    .contract-img {
        position: relative;
        width: 170px;
        height: 222px;
        background-image: url("../contract/image/contract-bg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        cursor: pointer;
    }
    .contract-img:hover{
        -webkit-box-shadow: #59b399 0px 0px 10px;
        -moz-box-shadow: #59b399 0px 0px 10px;
        box-shadow: #59b399 0px 0px 10px;
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

    .contract-sign-black {
        position: absolute;
        top: 20px;
        left: 0;
        width: 60px;
        height: 28px;
        line-height: 28px;
        background: rgb(152, 156, 156);
        box-shadow: 0 0 4px 0 rgba(197, 201, 201, 0.3);
        color: white;
        text-align: center;
        border-top-right-radius: 14px;
        border-bottom-right-radius: 14px;
        font-weight: bold;
        font-size: 14px;
    }

    .check-button {
        color: rgb(102,102,102);
        background: #eee;
        border: 2px solid #eee;
        padding: 3px 22px;
        margin: 0 10px 0 5px;
    }

    .check-button.active {
        color: rgb(89,179,153);
        background: #FFF;
        border: 2px solid rgb(89,179,153);
        background-color: rgb(255,255,255);
    }

    .currency >  .ivu-input {
        padding-left: 30px;
    }

    .currency >  .ivu-icon {
        left: 0;
        font-size: 12px;
        color: #666;
    }
    .contract-info-xy a{
        color: rgb(89,179,153);
        font-weight: bolder;
        word-break: keep-all;
    }
    .contract-info-xy a:hover{
        text-decoration: underline;
    }
</style>
<style>
    #terminationRef .currency .ivu-icon-social-yen{
        left: 0;
        font-size: 14px;
    }
    #terminationRef .currency .ivu-input{
        padding-left: 30px;
    }
</style>
<template>
    <div class="root-content" id="terminationRef">
        <div class="title" style="display: flex;margin-top: 10px;white-space: nowrap;">解约明细</div>
        <div class="original-content">
            <Row>
                <div class="original-part-title">原合约内容</div>
            </Row>
            <Row >
                <div :style="{'background':1== selectedArea ?'#f6faf9' :''}">
                    <div class="original-part-content">
                        <div>
                            <div class="contract-img" @click="preview" style="margin-right: 60px;">
                                <div v-if="contract.contract_status === 'SIGNED'" class="contract-sign-red">
                                    <span v-if="contract.contract_status === 'SIGNED'">已签署</span>
                                </div>
                                <div v-if="contract.contract_status === 'TERMINATION'" class="contract-sign-black">
                                    <span v-if="contract.contract_status === 'TERMINATION'">已解约</span>
                                </div>
                            </div>
                        </div>
                        <div class="contract-info">
                            <div class="contract-info-table" style="padding-top: 0px; display: table;">
                                <div class="contract-info-row" style="padding-top: 20px">
                                    <div style="width: 100px; font-size: 16px; color: #888888; font-weight: 700;">合约编号</div>
                                    <div style="font-size: 16px; color: #888888; font-weight: 700;">{{ contract.contract_code}}</div>
                                </div>
                                <div class="contract-info-row">
                                    <div style="width: 100px; font-size: 14px; color: #5D5D5D;">甲　　方：</div>
                                    <div style="width: 30%; font-size: 14px; color: #5D5D5D;">{{ contract.contract_name}}</div>
                                    <div style="padding-left: 30px; text-align: right; width: 100px; font-size: 14px; color: #5D5D5D;">付款方式：</div>
                                    <div style="padding-left: 30px; font-size: 14px; color: #5D5D5D;">{{
                                        contract.payment_type=='PER_YEAR'?'年付':
                                        (contract.payment_type=='HALF_YEAR'?'半年付':
                                        (contract.payment_type=='QUARTERLY'?'季度付':
                                        (contract.payment_type=='MONTHLY'?'月付':
                                        (contract.payment_type=='BATCH'?'分笔':
                                        (contract.payment_type=='ONCE'?'一次性支付':'其他'))))) }}</div>
                                </div>
                                <div class="contract-info-row">
                                    <div style="width: 100px; font-size: 14px; color: #5D5D5D;">签约时间：</div>
                                    <div style="width: 30%; font-size: 14px; color: #5D5D5D;">{{ contract.signed_date&& contract.signed_date.substr(0,10) }}</div>
                                    <div style="padding-left: 30px; text-align: right; width: 100px; font-size: 14px; color: #5D5D5D;">合约金额：</div>
                                    <div style="padding-left: 30px; font-size: 14px; color: #5D5D5D;">￥ {{ contract.contract_price && contract.contract_price.toFixed(2) }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="contract-info-xy" v-if="mainInfo.attachmentId">
                            <a @click="openXY">解约协议</a>
                        </div>
                    </div>
                </div>
            </Row>
            <Row style="padding: 20px 0;">
                <div class="original-part-title">解约内容</div>
            </Row>
            <i-form :model="mainInfo" :label-width="140" ref="form" :rules="ruleCustom">
                <Row style="margin-top: 10px; margin-left: 25px;">
                    <i-col span="12">
                        <Form-item label="服务终止时间" prop="endDate">
                            <date-picker :disabled="!editable" placeholder="请确认服务终止的时间" v-model="mainInfo.endDate" style="width: 100%"></date-picker>
                        </Form-item>
                    </i-col>
                    <i-col span="12">
                        <Form-item  label="解约签署时间" prop="signDate">
                            <date-picker :disabled="!editable" placeholder="请确认解约协议签署时间" v-model="mainInfo.signDate" style="width: 100%"></date-picker>
                        </Form-item>
                    </i-col>
                </Row>
                <Row style="margin-top: 10px; margin-left: 25px;" label-position="top">
                    <FormItem label="原合约终止原因说明" prop="reason" :rules="{required: true, message: '请输入合约终止的原因'}" >
                        <Input :disabled="!editable" v-model="mainInfo.reason" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入合约终止的原因" :maxlength="200"></Input>
                    </FormItem>
                </Row>
                <Row style="margin-top: 10px; margin-left: 25px;">
                    <FormItem label="原合约履行状况说明" prop="performance" :rules="{required: true, message: '请输入合约履行状况'}">
                        <Input :disabled="!editable" v-model="mainInfo.performance" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入合约履行状况" :maxlength="200"></Input>
                    </FormItem>
                </Row>
                <Row style="padding: 20px 0;">
                    <div class="original-part-title">解约款项处理</div>
                </Row>
                <div style="margin-top: 10px; margin-left: 50px; font-size: 13px;">
                    <Checkbox v-model="editPay">需要进行款项处理</Checkbox>
                </div>
                <div style="padding-left: 150px;" v-if="editPay">
                    <FormItem label="款项处理方式" prop="paymentProcess">
                        <RadioGroup v-model="mainInfo.paymentProcess">
                            <Radio :disabled="!editable" label="RETURN">退款</Radio>
                            <Radio :disabled="!editable" label="COMPENSATE" style="padding-left: 50px;">补缴</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem :label="mainInfo.paymentProcess == 'RETURN' ? '退款金额' : '补缴金额'" prop="amount">
                        <Input :disabled="!editable" v-model="mainInfo.amount" :placeholder="mainInfo.paymentProcess == 'RETURN' ? '请输入退款金额' : '请输入补缴金额'" style="width: 400px;" :maxlength="12"></Input>
                    </FormItem>
                    <FormItem :label="mainInfo.paymentProcess == 'RETURN' ? '退款方式' : '补缴方式'" prop="mode">
                        <Button :disabled="!editable" :class="mainInfo.mode == 'CASH' ? 'check-button active' : 'check-button'" size="small" @click="choosePayWay('CASH')">现金</Button>
                        <Button :disabled="!editable" :class="mainInfo.mode == 'TRANSFER' ? 'check-button active' : 'check-button'" size="small"  @click="choosePayWay('TRANSFER')">对公转账</Button>
                        <Button :disabled="!editable" :class="mainInfo.mode == 'WECHAT' ? 'check-button active' : 'check-button'" size="small"  @click="choosePayWay('WECHAT')">微信支付</Button>
                        <Button :disabled="!editable" :class="mainInfo.mode == 'ALIPAY' ? 'check-button active' : 'check-button'" size="small"  @click="choosePayWay('ALIPAY')">支付宝支付</Button>
                    </FormItem>
                </div>
                <Row style="padding-left: 150px;" v-if="mainInfo.mode=='TRANSFER'">
                    <i-col span="12">
                        <FormItem :label-width="150" prop="transferAccountName" label="付款方户名" :rules="{required: true, message: '请输入付款方户名'}">
                            <Input :disabled="!editable" v-model="mainInfo.transferAccountName" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem :label-width="150" prop="transferAccount" label="付款方帐号" :rules="{required: true, message: '请输入付款方帐号'}">
                            <Input :disabled="!editable" v-model="mainInfo.transferAccount" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem :label-width="150" prop="transferBankName" label="付款方开户行名称" :rules="{required: true, message: '请输入付款方开户行名称'}">
                            <Input :disabled="!editable" v-model="mainInfo.transferBankName" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem :label-width="150" prop="transferBankNumber" label="付款方开户行行号" :rules="{required: true, message: '请输入付款方开户行行号'}">
                            <Input :disabled="!editable" v-model="mainInfo.transferBankNumber" placeholder="请输入" :maxlength="30"/>
                        </FormItem>
                    </i-col>
                </Row>
                <Row style="margin-top: 10px; margin-left: 25px;" v-if="editPay">
                    <i-col span="12">
                        <Form-item label="合约结算金额" prop="settlementPrice">
                            <Input :disabled="!editable" class="currency" v-model="totalPrice" style="width: 200px;" readonly placeholder="0.00" icon="social-yen">
                            </Input>
                        </Form-item>
                    </i-col>
                </Row>
            </i-form>

        </div>
    </div>
</template>
<script type="text/babel">
    export default {
        props:{
            isEditable: false,
            contract: {}
        },
        data: function() {
            const amountInput = (rule, value, callback) => {
                if(Object.isNull(value) || String.isBlank(String(value))) {
                    callback(new Error("金额不能为空"));
                } else if (isNaN(value)) {
                    callback(new Error('请输入数字!'));
                } else if (value < 0) {
                    callback(new Error('请输入大于0的金额!'));
                } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    callback(new Error('请把小数点位数限制在2位以内!'));
                } else {
                    callback();
                }
            };
            const endDateInput = (rule, value, callback) => {
                if (value < new Date(this.contract.signed_date.substr(0,10))) {
                    callback(new Error('服务终止时间必须在合约签定日期以后!'));
                } else {
                    callback();
                }
            };
            const signDateInput = (rule, value, callback) => {
                if (value < new Date(this.contract.signed_date.substr(0,10))) {
                    callback(new Error('解约签署时间必须在合约签定日期以后!'));
                } else {
                    callback();
                }
            };
            return {
                editPay:false,
                editable:false,
                selectedArea:0,
                contractElseInfo: {},
                contractReceipt: 0.0,
                mainInfo:{
                    contractId: this.contract.contract_id,
                    paymentProcess: "RETURN",
                    mode: "CASH",
                    amount: 0.00,
                },
                ruleCustom: {
                    endDate:[
                        {required: true, message: '请确认服务终止的时间'},
                        { validator: endDateInput, trigger: "change"},
                    ],
                    signDate:[
                        {required: true, message: '请确认解约协议签署时间'},
                        { validator: signDateInput, trigger: "change"},
                    ],
                    amount:[
                        { validator: amountInput, trigger: "change"}
                    ],
                },
            }
        },
        mounted () {
//            this.getOldContract();
            this.loadData();
            this.getContractReceiptPrice();
        },
        computed: {
            totalPrice() {
                return this.countPrice();
            },
        },
        methods: {
            refresh(){
                this.loadData();
                this.getContractElseInfo();
                this.getContractReceiptPrice();
            },
            loadData(){
                this.request({
                    url: '/signCloud/contractTermination/info.do',
                    param: {
                        id: this.contract.contract_id
                    }
                }).then(data => {
                    if(data&&data.id){
                        this.mainInfo = data;
                        this.editable = false;
                    }else{
                        if(this.isEditable){
                            this.editable = true;
                        }else{
                            this.editable = false;
                        }
                    }
                });
            },
            loadMainInfo(){
                this.request({
                    url: '/signCloud/contractDetails/info.do',
                    param: {
                        id: this.contract.contract_id
                    }
                }).then(data => {
                    this.contract = data;
                    for (var index_i=0; index_i<data.cSList.length; index_i++) {
                        if (data.cSList[index_i].subjectAlias == "A") {
                            this.contract.Aname = data.cSList[index_i].name;
                            this.contract.AsignedDate = data.cSList[index_i].signedFormatDate;
                        }
                    }
                });
            },
            countPrice() {
                if (this.mainInfo.paymentProcess == 'COMPENSATE') {
                    return Math.format(Number(this.contractReceipt) + Number(this.mainInfo.amount), 2);
                } else {
                    return Math.format(Number(this.contractReceipt) - Number(this.mainInfo.amount), 2);
                }
            },
            getContractElseInfo(){
                this.request({
                    url: '/signCloud/contractView/getContractById.do',
                    param: {
                        id: this.contract.contract_id
                    }
                }).then((contractElseData) => {
                    this.contractElseInfo = contractElseData;
                });
            },
            getOldContract () {
                this.request({
                    url: '/signCloud/contractDetails/info.do',
                    param: {
                        id: this.contract.contract_id
                    }
                }).then(data => {
                    this.contract = data;
                    for (var index_i=0; index_i<data.cSList.length; index_i++) {
                        if (data.cSList[index_i].subjectAlias == "A") {
                            this.contract.Aname = data.cSList[index_i].name;
                            this.contract.AsignedDate = data.cSList[index_i].signedFormatDate;
                        }
                    }
                });
                this.request({
                    url: '/signCloud/contractView/getContractById.do',
                    param: {
                        id: this.contract.contract_id
                    }
                }).then((contractElseData) => {
                    this.contractElseInfo = contractElseData;
                });
            },
            openXY(){
                if (this.mainInfo.attachmentId) {
                    window.open('/ossController/oss/file.do?id=' + this.mainInfo.attachmentId);
                }else {
                    this.$Message.error('没有合同文件！');
                }
            },
            preview: function () {
                if (this.contractElseInfo.signedFile) {
                    window.open('/ossController/oss/file.do?id=' + this.contractElseInfo.signedFile);
                }else {
                    if (this.contractElseInfo.unsignedFile) {
                        window.open('/ossController/oss/file.do?id=' + this.contractElseInfo.unsignedFile);
                    }else {
                        this.$Message.error('没有合同文件！');
                    }
                }
            },
            /**
             * 选择支付方式
             */
            choosePayWay(type) {
                this.mainInfo.mode = type;
            },

            /**
             * 确认解除合约
             */
            submitTermination() {
                this.mainInfo.settlementPrice = this.countPrice();
                var vm = this;
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.request({
                            url: "/signCloud/contract/termination.do",
                            data: this.mainInfo
                        }).then(() => {
                            this.$Message.success('合约已解除！');
                            this.$api.getHeadCount();
                            this.$api.apiTermination(vm.contractId);
                        });
                    }
                })
            },

            getTerminationData() {
                this.mainInfo.settlementPrice = this.countPrice();
                return  this.mainInfo;
            },
            checkTerminationData() {
                return this.$refs['form'].validate();
            },

            /**
             * 获取合约已收款金额
             */
            getContractReceiptPrice() {
                this.request({
                    url: "/signCloud/contract/receiptedPrice.do",
                    param: {
                        contractId: this.contract.contract_id,
                    }
                }).then(data => {
                    this.contractReceipt = data;
                });
            }
        }
    };
</script>
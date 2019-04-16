<style scoped>
    .ivu-collapse {
        border: 0;
    }
    .ivu-collapse >>> .ivu-collapse-header {
        padding-left: 5px;
    }
    .ivu-collapse >>> .ivu-collapse-header .ivu-icon.ivu-icon-arrow-right-b {
        display: none!important;
    }
    .ivu-collapse >>> .ivu-collapse-header span {
        font-size: 16px;
        color: #000;
        font-weight: 700;
    }
    .ivu-collapse >>> .ivu-collapse-header .collapse-icon {
        float: right;
        line-height: 38px;
        margin-right: 20px;
    }
    .ivu-collapse >>> .ivu-collapse-content {
        padding: 0;
    }
    .service-state {
        width: 0;
        height: 0;
        border-top: 40px solid #FFCC33;
        border-right: 40px solid transparent;
    }
    .service-state > span{
        position: relative;
        left: 5px;
        top: -38px;
        font-size: 14px;
        color: white;
    }
    .cancel-button{
        width: 80px;
        color: #59b399;
        background: white;
    }
    .save-button{
        width: 80px;
        color: white;
        background: #59b399;
    }
    .label-css{
        display: inline-block;
        width: 117px;
        color: #5d5d5d;
        font-weight: bold;
    }
    .state-button{
        font-size: 12px;
        height: 18px;
        padding: 0 5px 0 5px;
        border: 1px solid #59b399;
        border-radius: 5px;
        text-align: center;
        line-height: 18px;
        color: #59b399;
    }
    .state-button-green{
        font-size: 12px;
        height: 18px;
        padding: 0 5px 0 5px;
        border: 1px solid #59b399;
        border-radius: 5px;
        text-align: center;
        line-height: 18px;
        color: white;
        background-color: #59b399;
    }
    .state-button-margin{
        display: inline-block;
        margin-left: 30px;
    }
    .service-or-other-content{
        display: inline-block;
        color: #8c8c8c;
        width: 450px;
        word-break: break-all;
        word-wrap: break-word;
    }
    .info-css{
        display: inline-block;
        color: #8c8c8c;
    }
    .component-css >>> #gszcService .org-name {
        line-height: 33px;
        font-size: 14px;
        color: #8c8c8c;
        font-weight: normal;
    }
    .component-css >>> .ivu-form-item-label{
        color: #5d5d5d;
        font-weight: bold;
    }
    .customer-label{
        margin-top: 15px;
        padding-left: 25px;
    }
    .service-label{
        margin-top: 15px;
    }
    .invoice-form .ivu-form-item {
        margin-bottom: 15px;
    }
    .ivu-form-item-required >>> .ivu-form-item-error-tip {
        position: absolute;
        top: 100%;
        left: 0;
        line-height: 1;
        padding-top: 2px;
        color: #ed3f14;
    }
    .ivu-form-item-required >>> .ivu-select-dropdown{
        max-height: 130px;
    }
    .ivu-form-item-required >>> label{
        font-size: 14px;
        font-weight: 600;
    }
    .service-require >>> label{
        font-size: 14px;
        font-weight: 600;
    }
    .tab-button-bar {
        padding: 40px 0 0 0;
    }
    .tab-button {
        padding-top:5px;
        display: inline-block;
        width: 120px;
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
        width: 120px;
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
    .no-label{
        display: inline-block;
    }
    .no-label >>> .ivu-form-item-content{
        margin-left: 0px !important;
    }
    .service-icon{
        display: inline-block;
        font-size: 22px;
        position: relative;
        top: 5px;
    }
    .plus-icon{
        width: 33px;
        height: 33px;
        border: 1px solid #dddeee;
        position: relative;
        top: -3px;
        margin-left: 10px;
        display: inline-block;
        text-align: center;
        border-radius: 3px;
    }
    .plus-icon > i{
        font-size: 12px;
        font-weight: bold;
        position: relative;
        top: 5px;
    }
    .light-bulb >>> .ivu-select-selection{
        border-color: #59b399;
        box-shadow: 0 0 0 2px rgba(89, 179, 153, .2);
    }
    .order-or-refuse-form{
        font-size: 14px;
        padding: 10px 15px 10px 17px;
        color: #5d5d5d;
    }
    .no-label >>> .ivu-select-dropdown{
        max-height: 80px;
    }
    .no-label >>> .ivu-tooltip{
        width: 118px;
    }
</style>
<template>
    <div class="container" style="padding: 10px 15px 10px 15px">
        <div class="content">
            <Row>
                <Collapse v-model="activeCollapse">
                    <Panel name="1">
                        <div>
                            <span>客户相关信息</span>
                            <Icon class="collapse-icon" :type="collapseStyle"></Icon>
                        </div>
                        <div slot="content" style="font-size: 14px;margin-top: 5px;color: #5d5d5d">
                            <i-col span="24" style="padding-left: 25px">
                                <div class="label-css">
                                    <span>合约编号</span>
                                </div>
                                <div class="info-css">
                                    <span>{{serviceOrderInfo.contractCode}}</span>
                                </div>
                                <div class="state-button-margin">
                                    <div class="state-button">
                                        <span>{{serviceOrderInfo.serviceType}}</span>
                                    </div>
                                </div>
                            </i-col>
                            <i-col span="24" class="customer-label">
                                <div class="label-css">
                                    <span>客户名称</span>
                                </div>
                                <div class="info-css">
                                    <span>{{serviceOrderInfo.customerName}}</span>
                                </div>
                                <div class="state-button-margin">
                                    <div class="state-button">
                                        <span>{{serviceOrderInfo.customerType=="PERSON"?"自然人":"企业"}}</span>
                                    </div>
                                </div>
                            </i-col>
                            <i-col span="24" class="customer-label">
                                <div class="label-css">
                                    <span>证件号码</span>
                                </div>
                                <div class="info-css">
                                    <span>{{serviceOrderInfo.customerNumber}}</span>
                                </div>
                            </i-col>
                            <i-col span="24" class="customer-label">
                                <div class="label-css">
                                    <span>联系人</span>
                                </div>
                                <div class="info-css" style="width: 100px">
                                    <span>{{serviceOrderInfo.contactName}}</span>
                                </div>
                                <div style="display: inline-block;margin-left: 50px;font-weight: bold">
                                    <span>联系电话</span>
                                </div>
                                <div class="info-css" style="margin-left: 30px">
                                    <span>{{serviceOrderInfo.contactPhone}}</span>
                                </div>
                            </i-col>
                            <i-col span="24" class="customer-label">
                                <div class="label-css">
                                    <span>客户经理</span>
                                </div>
                                <div class="info-css" style="width: 100px" :title="serviceOrderInfo.managerUserName">
                                    <span>{{serviceOrderInfo.managerUserName | postNameLimit}}</span>
                                </div>
                                <div style="display: inline-block;margin-left: 50px;font-weight: bold">
                                    <span>联系电话</span>
                                </div>
                                <div class="info-css" style="margin-left: 30px">
                                    <span>{{serviceOrderInfo.managerUserPhone}}</span>
                                </div>
                            </i-col>
                        </div>
                    </Panel>
                </Collapse>
            </Row>
            <Row style="margin-top: 20px;margin-left: 5px">
                <div style="font-size: 16px;font-weight: bold;color: black;padding-bottom: 25px">服务单信息</div>
                <div style="font-size: 14px;padding: 0 15px 10px 17px;color: #5d5d5d">
                    <i-col span="24">
                        <div class="label-css">
                            <span>服务单编号</span>
                        </div>
                        <div class="info-css">
                            <span>{{serviceOrderInfo.code}}</span>
                        </div>
                        <div class="state-button-margin">
                            <div class="state-button-green">
                                <span>{{serviceOrderInfo.billDefName}}</span>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="24" class="service-label">
                        <div class="label-css">
                            <span>服务结算价</span>
                        </div>
                        <div class="info-css">
                            <span>￥{{serviceOrderInfo.settlementPrice}}</span>
                        </div>
                        <div class="state-button-margin">
                            <div class="state-button">
                                <span>{{serviceOrderInfo.serviceFrequency=='PERIODIC'?"周期性":"一次性"}}</span>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="24" class="service-label">
                        <div class="label-css">
                            <span>派单方</span>
                        </div>
                        <div class="info-css">
                            <span>{{serviceOrderInfo.saleOrgName}}</span>
                        </div>
                        <div class="state-button-margin">
                            <div class="state-button">
                                <span>{{serviceOrderInfo.dispatchType=='EPIBOLY'?"外包服务":"自有服务"}}</span>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="24" class="service-label">
                        <div class="label-css">
                            <span>派单人</span>
                        </div>
                        <div class="info-css">
                            <span>{{serviceOrderInfo.dispatcherName}}</span>
                        </div>
                        <div style="display: inline-block;margin-left: 55px;font-weight: bold">
                            <span>联系电话</span>
                        </div>
                        <div style="display: inline-block;color: #8c8c8c;margin-left: 50px">
                            <span>{{serviceOrderInfo.dispatcherPhone}}</span>
                        </div>
                    </i-col>
                    <i-col span="24" class="service-label component-css">
                        <component v-if="this.serviceInfo" is="ServiceBuilder" :serviceType="this.serviceType" :isEdit="false" :serviceInfo="this.serviceInfo" :signedDate="this.serviceOrderInfo.tsSigned"></component>
                    </i-col>
                </div>
            </Row>
            <Row style="margin-top: 20px;margin-left: 5px">
                <i-col span="24">
                    <Collapse v-model="activeFileCollapse">
                        <Panel name="1">
                            <div>
                                <span>资料清单</span>
                                <Icon class="collapse-icon" :type="fileCollapseStyle"></Icon>
                            </div>
                            <i-col span="24" slot="content">
                                <SDFileList :billId="this.serviceOrderId"></SDFileList>
                            </i-col>
                        </Panel>
                    </Collapse>
                </i-col>
            </Row>
            <Row style="margin-top: 20px;margin-left: 5px">
                <div style="font-size: 16px;font-weight: bold;padding-bottom: 25px">服务单处理</div>
                <Form class="invoice-form" ref="form" :model="serviceForm" label-position="left" :label-width="120" :rules="ruleValidate">
                    <div class="order-or-refuse-form">
                        <i-col v-if="this.serviceOrderInfo.statusRecordList && this.serviceOrderInfo.statusRecordList.length>0" span="24">
                            <div style="width: 100%;height: 60px;background-color: #f2f2f2">
                                <div class="service-state">
                                    <span>退</span>
                                </div>
                                <div style="position: absolute;left: 60px;top: 10px;color: #999999">
                                    <span>{{this.serviceOrderInfo.statusRecordList[0].operatorUserName}}</span>
                                </div>
                                <div style="position: absolute;left: 60px;top: 35px;color: #999999" :title="this.serviceOrderInfo.statusRecordList[0].remark">
                                    <span>{{this.serviceOrderInfo.statusRecordList[0].remark | wordLengthLimit}}</span>
                                </div>
                            </div>
                        </i-col>
                        <i-col span="24" style="margin-top: 10px">
                            <div>
                                <RadioGroup v-model="serviceForm.operatorType" @on-change="refreshForm">
                                    <Radio label="SERVER_RECEIVE" style="font-size: 14px;">接单</Radio>
                                    <Radio label="SERVER_BACK" style="font-size: 14px;">退单</Radio>
                                </RadioGroup>
                            </div>
                        </i-col>
                        <div v-if="this.serviceForm.operatorType == 'SERVER_RECEIVE'">
                            <div class="tab-button-bar">
                                <div :class="serviceForm.receiveOperatorType == 'SERVER_RECEIVE_PRINCIPAL' ? 'tab-button active' : 'tab-button'" @click="checkTab('SERVER_RECEIVE_PRINCIPAL')">
                                    <span style="font-size: 12px">接单至服务负责人</span>
                                </div>
                                <div :class="serviceForm.receiveOperatorType == 'SERVER_RECEIVE_STAFF' ? 'tab-button active' : 'tab-button'" @click="checkTab('SERVER_RECEIVE_STAFF')">
                                    <span style="font-size: 12px">接单至服务人员</span>
                                </div>
                            </div>
                            <!-- 接单至服务负责人 -->
                            <div v-if="serviceForm.receiveOperatorType== 'SERVER_RECEIVE_PRINCIPAL'" style="margin-top: 10px">
                                <FormItem class="s-price ivu-form-item-required" label="服务负责人" prop="serveLeaderId">
                                    <Select filterable v-model="serviceForm.serveLeaderId" @on-change="changeServiceHeader" style="width: 200px" placeholder="服务负责人">
                                        <Option v-for="serviceHeaderInfo in serviceHeaderList" :value="serviceHeaderInfo.serveLeaderId" :key="serviceHeaderInfo.serveLeaderId">{{serviceHeaderInfo.serveLeaderName}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem class="s-price ivu-form-item-required" label="联系电话" prop="serveLeaderPhone">
                                    <Input v-model="serviceForm.serveLeaderPhone" style="width: 200px;" placeholder="xxx-xxxxxxxx/xxxx-xxxxxxx/手机号" :maxlength="50"></Input>
                                </FormItem>
                                <FormItem class="s-price service-require" label="服务要求">
                                    <div class="service-or-other-content">
                                        <Input v-model="serviceForm.divideRemark" type="textarea" :rows="4" placeholder="请输入服务单的具体指派说明" :maxlength="500"></Input>
                                    </div>
                                </FormItem>
                            </div>
                            <!-- 接单至服务人员 -->
                            <div v-if="serviceForm.receiveOperatorType== 'SERVER_RECEIVE_STAFF'" style="margin-top: 10px">
                                <FormItem class="s-price ivu-form-item-required" label="服务负责人" prop="serveLeaderId">
                                    <Select filterable v-model="serviceForm.serveLeaderId" @on-change="changeServiceHeader" style="width: 200px" placeholder="服务负责人">
                                        <Option v-for="serviceHeaderInfo in serviceHeaderList" :value="serviceHeaderInfo.serveLeaderId" :key="serviceHeaderInfo.serveLeaderId">{{serviceHeaderInfo.serveLeaderName}}</Option>
                                    </Select>
                                </FormItem>
                                <component ref="serviceForm" is="SendToServicePerson" :serviceUsers="serviceOrderInfo.serveUserVoList" :serviceTypeList="serviceTypeList"></component>
                            </div>
                        </div>
                        <div v-if="this.serviceForm.operatorType == 'SERVER_BACK'">
                            <i-col span="24" style="margin-top: 20px">
                                <FormItem class="s-price ivu-form-item-required" label="退单原因" prop="divideRemark">
                                    <div class="service-or-other-content">
                                        <Input v-model="serviceForm.divideRemark" type="textarea" :rows="4" placeholder="请输入退单原因" :maxlength="500"></Input>
                                    </div>
                                </FormItem>
                            </i-col>
                        </div>
                    </div>
                </Form>
            </Row>
            <Row style="margin-top: 20px;margin-left: 5px">
                <div style="text-align: center">
                    <Button class="cancel-button" type="primary" @click="cancel">取消</Button>
                    <Button class="save-button" type="primary" @click="save">确认</Button>
                </div>
            </Row>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";
    import ServiceBuilder from '../service/serviceBuilder.vue';
    import SDFileList from "../serviceDispatch/SDFileList.vue";
    import SendToServicePerson from "../sendToServicePerson.vue"
    export default {
        components: {
            ICol,
            ServiceBuilder,
            SDFileList,
            SendToServicePerson
        },
        props: {
            serviceOrderId: null,
        },
        computed: {
            collapseStyle() {
                if (Array.isEmpty(this.activeCollapse)) {
                    return 'chevron-right';
                }else {
                    return 'chevron-down';
                }
            },
            fileCollapseStyle() {
                if (Array.isEmpty(this.activeFileCollapse)) {
                    return 'chevron-right';
                }else {
                    return 'chevron-down';
                }
            },
        },
        created: function () {
            this.initContent();
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 35){
                    return value.substring(0,35) + "..." ;
                }
                return value;
            },
            postNameLimit : function (value) {
                if(value && value.length > 6){
                    return value.substring(0,6) + "..." ;
                }
                return value;
            },
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy年MM月');
            },
        },
        data () {
            return {
                activeCollapse: ['1'],
                activeFileCollapse: ['1'],
                serviceOrderInfo: {
                    serveUserVoList: []
                },
                serviceHeaderList: [],
                serviceType: null,
                serviceInfo: null,
                serviceForm: {
                    billIds:[],
                    operatorType: "SERVER_RECEIVE",//接单/拒单
                    receiveOperatorType: "SERVER_RECEIVE_PRINCIPAL",//SERVER_RECEIVE_PRINCIPAL 服务负责人    SERVER_RECEIVE_STAFF 服务人员
                    serveLeaderId: null,//服务负责人
                    serveLeaderName:null,//服务负责人名字
                    serveLeaderPhone:null,//服务负责人电话
                    divideRemark: "",//服务要求/拒单原因
                },
                tempServicePersonInfo: [],
                serviceTypeList: [],
                ruleValidate: {
                    serveLeaderId: [
                        {required: true, message: '服务负责人不能为空'}
                    ],
                    serveLeaderPhone: [
                        {required: true, message: "请输入联系电话", trigger: 'blur'},
                        { pattern:  /^((\d{3}-\d{8}|\d{4}-\{7,8})|(1[2-9]\d{9}))$/ ,message:'请输入有效的联系电话'}
                    ],
                    divideRemark: [
                        {required: true, message: '退单原因不能为空', trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            initContent () {
                var vm = this;
                this.request({
                    url: "/serviceCloud/orderOrRefuse/getServiceInfoById.do",
                    param: {
                        serviceOrderId: this.serviceOrderId
                    }
                },{
                    url: '/serviceCloud/serviceDispatch/SDInfo.do',
                    param: {
                        id: this.serviceOrderId
                    }
                }).then((data,pram)=>{
                    vm.serviceOrderInfo = data;
                    vm.serviceInfo = Object.assign({}, pram);
                    vm.getOrgServePostList();
                    vm.getServiceHeaderList();
                    if (data.inputTemplateId) {
                        vm.serviceType = data.inputTemplateId;
                    }
                });
            },
            getServiceHeaderList() {
                var vm = this;
                this.request({
                    url: "/serviceCloud/orderOrRefuse/getServiceHeaderList.do",
                    data: {
                        billDefids: [vm.serviceInfo.billDefId]
                    }
                }).then((data)=>{
                    if(data && data.length>0){
                        vm.serviceHeaderList = data;
                        if(vm.serviceOrderInfo && vm.serviceOrderInfo.serveLeaderId){
                            vm.$set(vm.serviceForm,"serveLeaderId",vm.serviceOrderInfo.serveLeaderId);
                        }
                    }else{
                        vm.serviceHeaderList = [];
                    }
                });
            },
            changeServiceHeader (selectedServiceHeader) {
                this.serviceForm.serveLeaderId = selectedServiceHeader;
                for(var i=0;i<this.serviceHeaderList.length;i++){
                    if(this.serviceHeaderList[i].serveLeaderId == selectedServiceHeader){
                        this.$set(this.serviceForm,"serveLeaderPhone",this.serviceHeaderList[i].serveLeaderPhone);
                        this.$set(this.serviceForm,"serveLeaderName",this.serviceHeaderList[i].serveLeaderName);
                    }
                }
            },
            refreshForm (param) {
                this.serviceForm.operatorType = param;
                this.serviceForm.divideRemark = "";
                this.$refs['form'].resetFields();
            },
            cancel () {
                this.close();
            },
            save () {
                var vm = this;
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        var sendData = Object.assign({}, vm.serviceForm);
                        sendData.billIds = [this.serviceOrderId];
                        if(this.serviceForm.operatorType == "SERVER_RECEIVE"){//接单
                            if(this.serviceForm.receiveOperatorType == "SERVER_RECEIVE_STAFF" && this.$refs['serviceForm'].childComponentCheck()){
                                sendData.billServeUserVos = vm.$refs['serviceForm'].serviceForm.serverList;
                            }
                            this.request({
                                url: "/serviceCloud/orderOrRefuse/save.do",
                                data: sendData,
                            }).then(()=>{
                                vm.$Message.info("接单成功！");
                                vm.cancel();
                                vm.callback();
                            });
                        }else if(this.serviceForm.operatorType == "SERVER_BACK"){//拒单
                            this.request({
                                url: "/serviceCloud/orderOrRefuse/save.do",
                                data: sendData
                            }).then(()=>{
                                vm.$Message.info("退单成功！");
                                vm.cancel();
                                vm.callback();
                            });
                        }
                    }
                });
            },
            checkTab (receiveOperatorType) {
                this.$refs['form'].resetFields();
                this.serviceForm.receiveOperatorType = receiveOperatorType;
                this.serviceForm.serveLeaderId = "";
                this.serviceForm.serveLeaderPhone = null;
                if(receiveOperatorType == "SERVER_RECEIVE_STAFF"){
                    this.getOrgServePostList();
                }
            },
            //获取服务岗位列表
            getOrgServePostList () {
                this.request({
                    url: "/serviceCloud/orderOrRefuse/getOrgServePostList.do",
                    param: {
                        billDefId: this.serviceInfo.billDefId
                    }
                }).then((data)=>{
                    this.serviceTypeList = data;
                })
            },
        },
    }
</script>